import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { ActionSheetController } from "@ionic/angular";
import { ProfileService } from "../profile/services/profile.service";
import { AlertController } from "@ionic/angular";
import { ModalController } from "@ionic/angular";
import { NewPhotoModalPage } from "../new-photo-modal/new-photo-modal.page";
import { ToastController } from "@ionic/angular";
import { Platform } from "@ionic/angular";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Observable } from "rxjs";
import { User, UserData } from "src/app/shared/user.interface";
import { AuthService } from "src/app/services/auth.service";
import { AngularFirestore } from "@angular/fire/firestore";
import { PhotoService } from "src/app/services/photo.service";
import { Photo, Voto } from "src/app/shared/photo.interface";
import { ValueAccessor } from "@ionic/angular/directives/control-value-accessors/value-accessor";
import { CssSelector, unescapeIdentifier } from "@angular/compiler";
import { computeStackId } from "@ionic/angular/directives/navigation/stack-utils";
import { Injectable } from "@angular/core";
import { HammerGestureConfig } from "@angular/platform-browser";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { DatabaseRoute } from "src/app/shared/DatabaseRoute";
import { StorageKeys } from "src/app/shared/StorageKeys";
import * as firebase from "firebase";

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  user$: Observable<User> = this.authService.afAuth.user;
  owner: string;
  avatar: string;

  uid: string ="";
  photos: Photo[] = [];

  misticId: string="";
  nombreUser: string="";

  notaMediaFotos: number;
  totalViews: number;
  totalPhotos: number;

  timer:Observable<any>;

  newVoto: Voto = {
    author: '',
    score: null,
  }

  newPhoto: Photo = {
    title: '',
    descripcion: '',
    isSelected: false,
    file: '',
    nota: null,
    id: this.photoService.getId(),
    date: new Date(),
    views: null,
    size: null,
    photoName: "",
    owner: this.uid,
    totalVotes:null,
    votos: [this.newVoto],
  };

  private path = DatabaseRoute.photos;

  backButtonSubscription; // for storing the returned subscription
  private modalOpened: boolean;
  constructor(
    public photoService: PhotoService,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private alertCtrl: AlertController,
    public profileService: ProfileService,
    private router: Router,
    private modalCtrl: ModalController,
    public toastCtrl: ToastController,
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private translate: TranslateService
  ) {
    // TODO: do session storage properly
    if (
      sessionStorage.getItem(StorageKeys.currentUser) == null ||
      sessionStorage.getItem(StorageKeys.currentUser) == ""
    ) {
      this.router.navigate(["login"]);
    }
    this.notaMediaFotos=0;
    this.totalPhotos=0;
    this.totalViews=0;
    this.uid = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid;

    this.createMisticId();
  }
  ngOnInit() {
    this.getPhotos();
    console.log(this.photos);
    this.modalOpened = false;
    console.log("OnInit de tabs2");

  }

  createMisticId(){
    this.authService.getUserData<UserData>(this.uid).subscribe((res) => {
      this.nombreUser=res.name;
      this.avatar=res.avatar;
      this.misticId=res.country.substring(0,3).toUpperCase();
      this.misticId+=res.state.substring(0,2).toUpperCase();
      this.misticId+=(JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).email).substring(5,9);
    });
    
  }
  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      /*if (this.router.url == "/tabs/profile") {
          console.log("exit app");
          App.exitApp();
        }
        else {*/
      if (this.router.url != "/tabs/profile" && !this.modalOpened) {
        console.log("go previous page tab2");
        this.goToPage("tabs/profile");
      }
      //}
    });
  }

  goToPage(pageURL) {
    this.router.navigate([pageURL]);
  }
  /**
   * @ngdoc method
   * @methodOf Tab2Page
   * @name presentActionSheet
   * @description
   * Recibe un IProfilePhoto y dependiendo de si ya estaba selecciona a concurso
   * o no, llama a crear un action sheet u otro.
   *
   * @param photo IProfilePhoto sobre la que se va a mostrar el action sheet
   *
   */
  presentActionSheet(photo) {
    let vm = this;
    /*
    if (photo.isSelected) {
      vm.createUnselectionActionSheet(photo);
    } else {
      vm.createSelectionActionSheet(photo);
    }
    */

    //para cambiar el estado de la selecion al hacer tap en la imagen
    if (photo.isSelected) {
      vm.selectPhoto(false,photo);
    } else {
      vm.selectPhoto(true,photo);
    }

  }

  //pulsar durante varios segundos y no hacer click solo
  presentActionSheetPress(photo) {
    let vm = this;
    if (photo.isSelected) {
      vm.createUnselectionActionSheet(photo);
    } else {
      vm.createSelectionActionSheet(photo);
    }
    
  }

  /*addPhotoToGallery() {
    let vm = this;
    vm.photoService.addNewToGallery();
  }*/

  // ---------------------------------------------- For the photo Action Sheet
  /**
   * @ngdoc method
   * @methodOf Tab2Page
   * @name createUnselectionActionSheet
   * @description
   * Recibe un IProfilePhoto. Muestra un action sheet de ionic con el que podemos seleccionar
   * acciones que hacer con el IProfilePhoto en cuestión. Este puede elimiarla o deseleccionarla
   * de concurso.
   *
   * @param photo IProfilePhoto que se va a modificar
   *
   */
  async createUnselectionActionSheet(photo) {
    let vm = this;

    const actionSheet = await vm.actionSheetCtrl.create({
      header: this.translate.instant('PROFILE.text_1'),
      buttons: [
        {
          text: this.translate.instant('PROFILE.text_2'),
          role: "destructive",
          icon: "trash",
          cssClass: "rojo",
          handler: () => {
            vm.deletePhoto(photo);
            vm.presentToast(this.translate.instant('PROFILE.text_3'));
          },
        },
        {
          text: this.translate.instant('PROFILE.text_4'),
          icon: "assets/icon/trophy-cross.svg",
          handler: () => {
            vm.selectPhoto(false, photo);
            vm.presentToast(this.translate.instant('PROFILE.text_5'));
          },
        },
        {
          text: this.translate.instant('PROFILE.text_6'),
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ],
    });

    await actionSheet.present();
  }

  /**
   * @ngdoc method
   * @methodOf Tab2Page
   * @name createSelectionActionSheet
   * @description
   * Recibe un IProfilePhoto. Muestra un action sheet de ionic con el que podemos seleccionar
   * acciones que hacer con el IProfilePhoto en cuestión. Este puede elimiarla o seleccionarla
   * a concurso.
   *
   * @param photo IProfilePhoto que se va a modificar
   *
   */
  async createSelectionActionSheet(photo) {
    let vm = this;

    const actionSheet = await vm.actionSheetCtrl.create({
      header: this.translate.instant('PROFILE.text_7'),
      buttons: [
        {
          text: this.translate.instant('PROFILE.text_8'),
          role: "destructive",
          icon: "trash",
          cssClass: "rojo",
          handler: () => {
            vm.deletePhoto(photo);
            vm.presentToast(this.translate.instant('PROFILE.text_9'));
          },
        },
        {
          text: this.translate.instant('PROFILE.text_10'),
          icon: "trophy-outline",
          handler: () => {
            vm.selectPhoto(true, photo);
            vm.presentToast(this.translate.instant('PROFILE.text_11'));
          },
        },
        {
          text: this.translate.instant('PROFILE.text_12'),
          icon: "close",
          role: "cancel",
          handler: () => { },
        },
      ],
    });

    await actionSheet.present();
  }

  // ---------------------------------------------- For the Alert
  /**
   * @ngdoc method
   * @methodOf Tab2Page
   * @name presentAlert
   * @description
   * Muestra una alerta al usuario indicándole que ha llegado al límite de
   * fotos que puede seleccionar.
   *
   */
  async presentAlert() {
    let vm = this;

    const alert = await vm.alertCtrl.create({
      header: this.translate.instant('PROFILE.text_13'),
      message: this.translate.instant('PROFILE.text_14'),
      buttons: [this.translate.instant('PROFILE.text_15')],
    });

    await alert.present();
  }

  // ---------------------------------------------- For the New Photo Modal
  async openModal() {
    let vm = this;
    vm.modalOpened = true;

    const modal = await vm.modalCtrl.create({
      component: NewPhotoModalPage,
    });
    modal.onWillDismiss().then((dataReturned) => {
      vm.modalOpened = false;
      if (dataReturned.data != undefined) {
        //Meter nueva foto en el array de fotos de perfil
        vm.profileService.addPhoto(dataReturned.data);
      }
    });
    return await modal.present();
  }

  // For the Toast when deleted photo
  async presentToast(message) {
    const toast = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      color: "tertiary",
      buttons: [
        {
          side: 'end',
          icon: 'close',
          handler: () => {
            toast.dismiss()
          }
        }
      ]
    });
    toast.present();
  }

  async getPhotos() {
    this.photoService.getCollection<Photo>(this.path).subscribe((res) => {
    let cont=0;
    let sumaNota=0;
    this.photos=[];
    this.totalViews=0;
    this.totalPhotos=0;

      for (let i = 0; i < res.length; i++) {
        if(this.uid==res[i].owner){
          this.totalViews+=res[i].totalVotes;
          this.totalPhotos++;

          // Para prevenir que salgan campos vacios cuando no se ha votado una foto
          if(res[i].nota == null)
          {
            res[i].nota = 0;
            res[i].totalVotes = 0;
          }
          this.photos.push(res[i]);

          if(res[i].isSelected){
            sumaNota+=res[i].nota;
            cont++;
          }

        }
      }
      if(sumaNota!=0){
        this.notaMediaFotos=sumaNota/cont;
        this.notaMediaFotos=+(Math.round(this.notaMediaFotos * 100) / 100).toFixed(2);;
      }
      else{
        this.notaMediaFotos=0;
      }
    this.photos.sort(function(x, y) {
      // true values first
      return (x.isSelected === y.isSelected)? 0 : x.isSelected? -1 : 1;
      // false values first
      // return (x === y)? 0 : x? 1 : -1;
  });
    });
  }

  async deletePhoto(photo: Photo) {

    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: this.translate.instant('PROFILE.text_16'),
      message: this.translate.instant('PROFILE.text_17'),
      buttons: [
        {
          text: this.translate.instant('PROFILE.text_18'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Borrar',
          handler: () => {
            console.log('Confirmar');
            this.photoService.deleteDoc(this.path, photo.id).then(res => {
              this.presentToast(this.translate.instant('PROFILE.text_19'));
             }).catch(error => {
              this.presentToast(this.translate.instant('PROFILE.text_20'));
              });
          }
        }
      ]
    });

    await alert.present();
  }

  
  async selectPhoto(value, photo: Photo) { 
    photo.isSelected=value;
    console.log('Confirmar');
    this.photoService.updateDoc(photo, this.path, photo.id).then(res => {
      if(value==false)
      this.presentToast(this.translate.instant('PROFILE.text_21'));
      else{
        this.presentToast(this.translate.instant('PROFILE.text_22'));
      }
     }).catch(error => {
      this.presentToast(this.translate.instant('PROFILE.text_23'));
      });
    
      
    /*
    if (!this.profileService.selectPhoto(value, photo)) {
      this.presentAlert();
    }*/

  }
}
