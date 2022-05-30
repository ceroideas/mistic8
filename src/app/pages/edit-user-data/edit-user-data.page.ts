import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IonSelect } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { Pattern } from 'src/app/shared/Pattern';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { User, UserData } from 'src/app/shared/user.interface';
import { UserSettings } from 'src/app/shared/userSettings';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Capacitor } from '@capacitor/core';
import { TranslateService } from '@ngx-translate/core';
import { ToastController } from '@ionic/angular';
import { PhotoStorageService } from 'src/app/services/photoStorage.service';

const undefinedPhotoURL = "assets/img/undefined.png";

@Component({
  selector: 'app-edit-user-data',
  templateUrl: './edit-user-data.page.html',
  styleUrls: ['./edit-user-data.page.scss'],
})
export class EditUserDataPage implements OnInit {
  // Option selectors
  @ViewChild('genderSelector', {static: false}) genderSelector: IonSelect;
  @ViewChild('countrySelector', {static: false}) countrySelector: IonSelect;
  @ViewChild('stateSelector', {static: false}) stateSelector: IonSelect;

  // Form related clases
  public fillDataForm:FormGroup = new FormGroup({});

  // Checks wether any error happened and the corresponding message. If empty, no error is present
  public formError:boolean = false;
  public formErrorMessage:string = "";

  // Data relevant to the options
  public genderOptions = UserSettings.genders;
  public countryOptions = UserSettings.countries;
  // TODO: The call to retrieve these options should be made from the server. The data must be fetched per country.
  // This is only a bypass for the Spanish jurisdiction.
  public stateOptions = UserSettings.states;

  user$: Observable<User> = this.authSvc.afAuth.user;
  uid: string;
  email: string;
  notificationEmail: string;
  nombreUser:string;
  misticId: string="";
  gender:string;
  country:string;
  state:string;

  avatar:string;

  selected;
  openModal = 0;

  newImage:any;

  newFile:any;

  public photo: SafeResourceUrl;
  
  // Custom interface properties for popovers
  popoverOptions: any = {
    translucent: true,
    cssClass: "select-fill-data",
  };

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private sanitizer: DomSanitizer,
    public toastCtrl: ToastController,
    public  photoStorageService: PhotoStorageService,
    private camera: Camera
    ) {
      // Set up form controls with validators
      this.fillDataForm = this.formBuilder.group({
        // Support for international names
        name: ['',  [Validators.required, Validators.minLength(4), Validators.pattern(Pattern.nameAndSurname)]],
        notificationEmail: ['',  [Validators.required,Validators.email]],
        gender: ['', [Validators.required,]],
        country: ['', [Validators.required,]],
        state: ['', [Validators.required,]],
      });
    this.uid = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid;
    this.email = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).emailVerified;
    this.notificationEmail = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).notificationEmail;
    this.gender = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).gender;
    this.country = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).country;
    this.state = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).state;

    this.createMisticId();
    }

  ngOnInit() {
    this.putUserData();
  }

  createMisticId(){
    this.authSvc.getUserData<UserData>(this.uid).subscribe((res) => {
      this.nombreUser=res.name;
      this.avatar=res.avatar;
      this.misticId=res.country.substring(0,3).toUpperCase();
      this.misticId+=res.state.substring(0,2).toUpperCase();
      this.misticId+=(JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).email).substring(5,9);
    });
    
  }

  async putUserData() {
    this.authSvc.getUserData<UserData>(this.uid).subscribe((res) => {
      this.nombreUser=res.name;
      this.notificationEmail = res.notificationEmail;
      this.gender=res.gender;
      this.country=res.country;
      this.state=res.state;
      this.avatar=res.avatar;

      this.fillDataForm.patchValue({
        name: res.name,
        notificationEmail: res.notificationEmail,
        gender: res.gender,
        country: res.country,
        state: res.state,
        avatar: res.avatar
      })
    });
  }

  async update(){
    // Check whether all data is correct
    console.log(this.fillDataForm.valid);
    if (this.fillDataForm.valid !== true)
    {
      this.showErrors();
      return;
    }

    if (this.newFile) {
      const path ='Fotos';
      const name = this.notificationEmail;
      const res= await this.photoStorageService.uploadImage(this.newFile, path, name);
      this.avatar = res;
    }

    
    // Update user data for the profile just created
    let userData:UserData = {
      uid: this.uid,
      email: this.email,
      displayName: this.nombreUser,
      emailVerified: true,

      name: this.fillDataForm.controls["name"].value,
      notificationEmail: this.fillDataForm.controls["notificationEmail"].value,
      gender: this.fillDataForm.controls["gender"].value,
      country: this.fillDataForm.controls["country"].value,
      state: this.fillDataForm.controls["state"].value,

      avatar: this.avatar,
    };

    this.fillUserData(userData);
    
    this.redirectUser();
  }

  private fillUserData(user:UserData): void {
    this.authSvc.updateUserData(user);
  }

  private showErrors(): void {
    // Clean previous form error
    this.formError = false;
    this.formErrorMessage = "";

    if ( this.fillDataForm.controls["name"].valid != true ) {
      this.formError = true;
      this.formErrorMessage += this.translate.instant('EDIT_USER_DATA.error_1');
    }

    if ( this.fillDataForm.controls["notificationEmail"].valid != true ) {
      this.formError = true;
      this.formErrorMessage += this.translate.instant('EDIT_USER_DATA.error_2');
    }

    if ( this.fillDataForm.controls["gender"].valid != true ) {
      this.formError = true;
      this.formErrorMessage += this.translate.instant('EDIT_USER_DATA.error_3');
    }

    if ( this.fillDataForm.controls["country"].valid != true ) {
      this.formError = true;
      this.formErrorMessage += this.translate.instant('EDIT_USER_DATA.error_4');
    }

    if ( this.fillDataForm.controls["state"].valid != true ) {
      this.formError = true;
      this.formErrorMessage += this.translate.instant('EDIT_USER_DATA.error_5');
    }

    console.log(this.formErrorMessage);
  }

  // Redirect user to the page if SMS has been received
  private redirectUser(): void {
    this.router.navigate(['tabs/profile']);
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
      this.avatar = base64Image;

    }, (err) => {
      // Handle error
      vm.photo = undefinedPhotoURL;
      vm.presentErrorToast(err);
    });
  }

  async presentErrorToast(error) {
    const toast = await this.toastCtrl.create({
      message: error,
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }

  async newImageUpload(event: any){
    console.log(event);
    if(event.target.files && event.target.files[0]){
      this.newFile=event.target.files[0];
      const reader = new FileReader();
      reader.onload= ((image) => {
        this.avatar = image.target.result as string;

      });
      reader.readAsDataURL(event.target.files[0]);
    }
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
