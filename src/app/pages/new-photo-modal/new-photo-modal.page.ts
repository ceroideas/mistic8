import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastController } from '@ionic/angular';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';

import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { User } from 'src/app/shared/user.interface';
import { Photo, Voto } from 'src/app/shared/photo.interface';
import { PhotoService } from 'src/app/services/photo.service';
import { PhotoStorageService } from 'src/app/services/photoStorage.service';
import { AuthService } from 'src/app/services/auth.service';
import { DatabaseRoute } from 'src/app/shared/DatabaseRoute';
import { StorageKeys } from 'src/app/shared/StorageKeys';

import { TranslateService } from '@ngx-translate/core';

const { App } = Plugins;

export interface imgFile {
  name: string;
  filepath: string;
  size: number;
}

const undefinedPhotoURL = "assets/img/undefined.png";
//https://geekyminds.co.in/exit-app-on-back-press-ionic-4/
@Component({
  selector: 'app-new-photo-modal',
  templateUrl: './new-photo-modal.page.html',
  styleUrls: ['./new-photo-modal.page.scss'],
})
export class NewPhotoModalPage implements OnInit {
  newVoto: Voto ={
    author: '',
    score: null,
  }

  newPhoto: Photo = {
    title: '',
    descripcion: '',
    isSelected: false,
    file: "",
    nota: null,
    id: this.photoService.getId(),
    date: new Date(),
    views: null,
    size: null,
    photoName: '',
    owner: JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid,
    totalVotes:null,
    votos: null,
  };

  private path = DatabaseRoute.photos;

  newImage:any;

  newFile:any;

  loading: any;

  selected;
  openModal = 0;

  public photo: SafeResourceUrl;
  public hiddeActionButtons: boolean;
  backButtonSubscription; // for storing the returned subscription

  // File upload task 
  fileUploadTask: AngularFireUploadTask;

  // Upload progress
  percentageVal: Observable<number>;

  // Track file uploading with snapshot
  trackSnapshot: Observable<any>;

  // Uploaded File URL
  UploadedImageURL: Observable<string>;

  // Uploaded image collection
  files: Observable<imgFile[]>;

  // Image specifications
  imgName: string;
  imgSize: number;

  // File uploading status
  isFileUploading: boolean;
  isFileUploaded: boolean;

  private filesCollection: AngularFirestoreCollection<imgFile>;

  // When there are incomplete fields in this form
  public formIncomplete: boolean = false;

  constructor(
    private authService: AuthService,
    public loadingController: LoadingController,
    public photoService: PhotoService,
    private router: Router,
    private translate: TranslateService,
    public  photoStorageService: PhotoStorageService,
    private afs: AngularFirestore,
    private afStorage: AngularFireStorage, private modalCtrl: ModalController, private camera: Camera, public toastCtrl: ToastController, private sanitizer: DomSanitizer, private platform: Platform) {
    // TODO: do session storage properly
    if (sessionStorage.getItem(StorageKeys.currentUser) == null || sessionStorage.getItem(StorageKeys.currentUser) == '') {
      this.router.navigate(['login']);
    }
    this.isFileUploading = false;
    this.isFileUploaded = false;

    // Define uploaded files collection
    this.filesCollection = afs.collection<imgFile>('imagesCollection');
    this.files = this.filesCollection.valueChanges();
  }

  animateModal(i)
  {
    if (i == 1) {
      document.getElementById('container-modal').style.opacity = '0';
      document.getElementById('container-modal').style.visibility = 'visible';
    }else{
      setTimeout(()=>{
        document.getElementById('container-modal').style.visibility = 'hidden';
      },200)
    }
    this.openModal = i;
  }

  ngOnInit() {
    console.log(sessionStorage.getItem(StorageKeys.currentUser));
    let vm = this;

    vm.photo = undefinedPhotoURL;
    vm.hiddeActionButtons = true;
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      console.log("evento backButton new Photo");
      this.closeModal();
    });
  }

  ngOnDestroy() {
    console.log("Se destruye la pagina new Photo");
    this.backButtonSubscription.unsubscribe();
  }

  async closeModal() {
    await this.modalCtrl.dismiss();
  }
  async closeModalWithImage() {
    await this.modalCtrl.dismiss(this.photo);
  }


  async takePicture() {
    let vm = this;

    // Options for the image
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum:true,
      sourceType:1
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      let base64Image = 'data:image/jpeg;base64,' + imageData;
      const imageFromDevice = Capacitor.convertFileSrc(imageData);
      vm.photo = this.sanitizer.bypassSecurityTrustUrl(imageFromDevice);


      this.newFile = this.base64ToImage(base64Image);
      this.newImage = base64Image;

      vm.hiddeActionButtons = true;

    }, (err) => {
      // Handle error
      vm.photo = undefinedPhotoURL;
      vm.presentErrorToast(err);
      vm.hiddeActionButtons = true;
    });
  }


  base64ToImage(dataURI) {
    const fileDate = dataURI.split(',');
    // const mime = fileDate[0].match(/:(.*?);/)[1];
    const byteString = atob(fileDate[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([arrayBuffer], { type: 'image/png' });
    return blob;
  }

  
  getPictureFromGallery() {
    let vm = this;

    // Options for the image
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      //let base64Image = 'data:image/jpeg;base64,' + imageData;
      const imageFromDevice = Capacitor.convertFileSrc(imageData);
      vm.photo = this.sanitizer.bypassSecurityTrustUrl(imageFromDevice);
      vm.hiddeActionButtons = false;

    }, (err) => {
      // Handle error
      vm.photo = undefinedPhotoURL;
      vm.presentErrorToast(err);
      vm.hiddeActionButtons = true;
    });
  }


  // For the Toast when error occurred
  async presentErrorToast(error) {
    const toast = await this.toastCtrl.create({
      message: error,
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

  /*
  uploadImage(event: FileList) {

    const file = event.item(0)

    // Image validation
    if (file.type.split('/')[0] !== 'image') {
      console.log('File type is not supported!')
      return;
    }

    this.isFileUploading = true;
    this.isFileUploaded = false;

    this.imgName = file.name;

    // Storage path
    const fileStoragePath = `filesStorage/${new Date().getTime()}_${file.name}`;

    // Image reference
    const imageRef = this.afStorage.ref(fileStoragePath);

    // File upload task
    this.fileUploadTask = this.afStorage.upload(fileStoragePath, file);


    // Show uploading progress
    this.percentageVal = this.fileUploadTask.percentageChanges();
    this.trackSnapshot = this.fileUploadTask.snapshotChanges().pipe(

      finalize(() => {
        // Retreive uploaded image storage path
        this.UploadedImageURL = imageRef.getDownloadURL();

        this.UploadedImageURL.subscribe(resp => {
          this.storeFilesFirebase({
            name: file.name,
            filepath: resp,
            size: this.imgSize
          });
          this.isFileUploading = false;
          this.isFileUploaded = true;
        }, error => {
          console.log(error);
        })
      }),
      tap(snap => {
        this.imgSize = snap.totalBytes;
      })
    )
  }


  storeFilesFirebase(image: imgFile) {
    const fileId = this.afs.createId();

    this.filesCollection.doc(fileId).set(image).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
  }

  */
  async guardarPhoto() {
    console.log(this.newPhoto)
    if(this.newPhoto.title == null || this.newPhoto.title == "" || this.newPhoto.descripcion == null || this.newPhoto.descripcion == "" || this.newImage == null){
      this.formIncomplete = true;
    }
    else{
      this.formIncomplete = false;

      this.presentLoading();

      const path ='Fotos';
      const name = this.newPhoto.title;
      const res= await this.photoStorageService.uploadImage(this.newFile, path, name);
      this.newPhoto.file = res;

      this.photoService.createDoc(this.newPhoto, this.path, this.newPhoto.id).then(res => {
        this.loading.dismiss();
        this.presentToast(this.translate.instant("NEW_PHOTO_MODAL.photo_13"));
        //this.closeModal();
        this.clearNewPhotoData();

        this.newImage = null;

        this.router.navigate(['tabs/profile']);
      }).catch(error => {
        this.presentToast(this.translate.instant("NEW_PHOTO_MODAL.photo_14"));
        });
    }
  }

  async presentLoading() {
    this.loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      message: 'Please wait...',
      //duration: 2000
    });
    await this.loading.present();
    //await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
   toast.present();
    //await loading.onDidDismiss();
    //console.log('Loading dismissed!');
  }

  async newImageUpload(event: any){
    console.log(event);
    if(event.target.files && event.target.files[0]){
      this.newFile=event.target.files[0];
      const reader = new FileReader();
      reader.onload= ((image) => {
        this.newImage = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
  }


  private clearNewPhotoData(){
    this.newPhoto = {
      title: '',
      descripcion: '',
      isSelected: false,
      file: "",
      nota: null,
      id: this.photoService.getId(),
      date: new Date(),
      views: null,
      size: null,
      photoName: '',
      owner: JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid,
      totalVotes:null,
      votos: null,
    };
  }

  doAction()
  {
    if (this.selected == "take") {
      this.takePicture();
      this.animateModal(0);
    }
    if (this.selected == "gallery") {
      document.getElementById('file-upload').click();
      this.animateModal(0);
    }

  }
}