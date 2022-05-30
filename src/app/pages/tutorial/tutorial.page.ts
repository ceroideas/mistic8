import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ProfileService } from "../profile/services/profile.service";
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { GestureController } from '@ionic/angular';
import { PhotoService } from "src/app/services/photo.service";
import { Photo, Voto } from "src/app/shared/photo.interface";
import { DatabaseRoute } from 'src/app/shared/DatabaseRoute';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { Animation, AnimationController } from '@ionic/angular';
import { App } from '@capacitor/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage {
  // Alert related variables
  private firstTutorialAlert:HTMLIonAlertElement;
  private secondTutorialAlert:HTMLIonAlertElement;
  private endTutorialAlert:HTMLIonAlertElement;

  public isSecondTutorialClosed:boolean = false;
  public isFingerHorizontalGifDisplayed:boolean = false;
  public isFingerUpGifDisplayed:boolean = false;

  //--------------------------------------------------------------
  public voteHeight:number = 50;
  valueRange = document.getElementsByTagName("ion-range");

  backButtonSubscription; // for storing the returned subscription
  private white: string = "#FFF";

  public score: number = 0;
  public punctuationColor = this.white;
  public displayPunctuation: string = 'none';
  public displayPunctuationBar: string = 'block';
  
  private lastPuctuation: number = 0;
  private getPhotosButtonAnim: Animation;

  private numFotosPeticion: number = 20;
  @ViewChild('indexContent', { read: ElementRef }) box: ElementRef;
  @ViewChild('getPhotosIcon', { read: ElementRef }) getPhotosIcon: ElementRef;

  uid: string ="";
  photos: Photo[] = [];

  fechaFoto:any;

  private path = DatabaseRoute.photos;

  
  @ViewChild(IonSlides) slides: IonSlides;
  showIt = false;
  //se comprueba siempre que el item 'user' de sesion storage está, en cualquier otro caso 
  //redirecciona a /login
  constructor(
    private router:Router,
    private profileService: ProfileService,
    public alertController: AlertController,
    private platform: Platform,
    private gestureCtrl: GestureController,
    private photoService: PhotoService,
    public toastCtrl: ToastController,
    private animationCtrl: AnimationController,
    ) {
    this.fechaFoto=new Date;
    
    this.getPhotos();
  }

  ngOnInit() {
    // if user is not logged in (recently registered), get out
    if (
      sessionStorage.getItem(StorageKeys.currentUser) == null ||
      sessionStorage.getItem(StorageKeys.currentUser) == ""
    ) {
      this.goToPage('login');
    }
  }

  ngAfterViewInit() {
    // Return to the login if the user "goes back" from the tutorial
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/tutorial"){
        this.router.navigate(['login']);
      }
    });

    this.setupGesture();
    this.setupButtonAnimation();


    // Create tutorial alerts and show first one
    this.createNowGoUpwardsAlert();
    this.createEndTutorialAlert();
    this.createFirstGreetingAlert().then(()=> {this.firstTutorialAlert.present()});
  }

  async createFirstGreetingAlert():Promise<void> {
    this.firstTutorialAlert = await this.alertController.create({
      cssClass: "tutorialAlert",
      header: 'Tutorial: ¿Cómo votar?',
      subHeader: '',
      message: '¡Hola! Vamos a enseñarte a <a>votar las fotos.</a> ' +
        'Primero, tienes que elegir la puntuación que quieras darle a la foto. ' +
        'Para ello, presiona en cualquier zona y mueve el dedo de <a>derecha a izquierda y viceversa</a>.',
      buttons: [{
        text: 'Entendido',
        handler: () => {
          this.isFingerHorizontalGifDisplayed = true;
        }
      }]
    });
  }

  async createNowGoUpwardsAlert():Promise<void> {
    this.secondTutorialAlert = await this.alertController.create({
      cssClass: "tutorialAlert",
      header: 'Segunda parte',
      subHeader: '',
      message: 'Ahora que ya sabes elegir la puntuación, <a>para realizar la votación ' +
      'arrastra el dedo hacia arriba</a> para enviar tu puntuación. ¡Y ya lo tienes! Prueba con la siguiente foto.',
      buttons: [{
        text: 'Ok',
        role: 'closeSecondAlert',
        handler: () => {
          this.isSecondTutorialClosed = true;
          this.isFingerUpGifDisplayed = true;
        }
      }]
    });
  }

  async createEndTutorialAlert():Promise<void> {
    this.endTutorialAlert = await this.alertController.create({
      cssClass: "tutorialAlert",
      header: 'Fin del tutorial',
      subHeader: '',
      message: '¡Perfecto! <a>Ya sabes votar fotos</a>. ' + 
      'Todo lo que te queda es entrar en tu perfil... ¡<a>Y subir las tuyas</a> para que los demás puedan votarlas!',
      buttons: ['Ok']
    });
  }

  filtroFotos(res:Photo[]){
    for (let i = 0; i < res.length; i++) {
      // If photo is selected and photo is not from the user
      if(res[i].isSelected 
          && sessionStorage.getItem(StorageKeys.currentUser) != null
          && res[i].owner!=JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid)
        {
        
        // Can vote if there are no votes already or you have not voted yet
        let hasNotVotedYet:boolean = true;
        if (res[i].votos != null)
        {
          for(let j = 0; j < res[i].votos.length; j++)
          {
            if(res[i].votos[j].author == JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid){
              hasNotVotedYet = false;
            }
          }
        }

        if(hasNotVotedYet)
        {
          this.photos.push(res[i]);
        }
      }
    }
  }

  public askForPhotos(){
    this.getPhotosButtonAnim.play();
    this.getPhotos();
  }

  getPhotos(){
    this.photoService.getPhotosForVoteLastNumber<Photo>(this.path, this.uid, this.numFotosPeticion, this.fechaFoto).subscribe((res) => {
      this.photos = [];
      this.filtroFotos(res);
      if(res.length==0){
        this.fechaFoto=Date();
        this.displayPunctuationBar = "none";
        this.getPhotosButtonAnim.stop();
      }
      else{
        if (this.photos.length == 0) {
          this.fechaFoto = res[res.length - 1].date;
          this.displayPunctuationBar = "none";
          this.getPhotosButtonAnim.stop();
        }
        else {
          this.fechaFoto = this.photos[this.photos.length - 1].date;
          this.displayPunctuationBar = "block";
        }
      }
    });

    if(this.photos.length==0){
      this.fechaFoto=Date();
      this.displayPunctuationBar = "none";
    }
    else{
      this.fechaFoto=this.photos[this.photos.length-1].date;
      this.displayPunctuationBar = "block";
    }
  }

  next(index) {
    this.slides.slideTo(index+1);
  }

  public goToPage(pageURL) {
    this.router.navigate([pageURL]);
  }

  showAlert() {
    this.alertController.create({
      header: 'Ups',
      subHeader: '',
      message: 'No tienes mas fotos para puntuar, vuelve en un rato',
      buttons: ['OK']
    }).then(res => {
      res.present();
    });
  }

  resetPunctuation(){
    this.displayPunctuation = "none";
    this.score = 0;
    this.punctuationColor = this.white;
    this.valueRange[0].value = 0;
    this.lastPuctuation = 0;
  }

  // ------------- GESTURE HANDLER ---------------
  setupGesture() {
    const moveGesture = this.gestureCtrl.create({
      el: this.box.nativeElement,
      threshold: 0,
      gestureName: 'voteGesture',
      disableScroll: true,
      blurOnStart: true,
      onMove: ev => this.onMoveVoteHandler(ev),
      onEnd: ev => this.onEndVoteHandler(ev),
      onStart: ev => this.onStartVoteHandler(ev)
    }, true);

    // Don't forget to enable!
    moveGesture.enable(true);
  }

  onStartVoteHandler(ev){
    this.lastPuctuation = this.score;
  }

  private secondAlertLaunched:boolean = false;
  onMoveVoteHandler(ev) {
    // Launch second alert after 2 seconds of moving the cursor
    if (!this.secondAlertLaunched) {
        setTimeout(() => {
          this.secondTutorialAlert.present();
          this.secondAlertLaunched = true;
          this.isFingerHorizontalGifDisplayed = false;
          console.log("Segundo alert lanzado");
      }, 2000);
    }

    if(this.photos.length > 0){
      this.displayPunctuation = "block";
      const thresholdY: number = 50;
      let movedY: number = Math.abs(ev.currentY - ev.startY);

      if(movedY < thresholdY) {   // Checks if we have moved too much in Y, the puntuation is fixed  
        let movedX: number = ev.currentX - ev.startX;

        //Do the calculation of the punctuation
        const screenMaxPercentage = 0.80; // The percentage of screen widt tha the user has to move to get the 10


      this.score = ((ev.currentX-(this.platform.width()*0.1)) * 10.0)/(screenMaxPercentage * this.platform.width()) ;

      // Clamp the number between 0 and 10
      const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
      this.score = clamp(this.score, 0, 10.0);
      this.score = this.profileService.round(this.score, 1);

      this.punctuationColor = this.white;
      this.valueRange[0].value=this.score;
      }
      else{
        this.punctuationColor = this.white;
        if(movedY > this.voteHeight){
          this.punctuationColor = "#0f0";

        }
      }
    }
  }

  onEndVoteHandler(ev) {
    if(!this.isSecondTutorialClosed)
    {
      return;
    }

    if(this.photos.length > 0){
      const thresholdY: number = 50;
      let movedY: number = Math.abs(ev.currentY - ev.startY);

      if(movedY > thresholdY) {
        this.presentToast('votacion hecha con exito');
        this.slides.slideTo(0);

        // If the user has voted one time, put the end tutorial

        if(this.endTutorialAlert != null )
        {
          setTimeout(() => {
            this.endTutorialAlert?.present().then(() => {
              console.log("Último alert lanzado");
              this.endTutorialAlert = null;
              this.isFingerUpGifDisplayed = false;
            })
        }, 1500);
        }
      }
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }

  
  private shuffle(array) {
    var currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

  // ---------------- Animation --------------------
  private setupButtonAnimation(){
    // Set animation of the load photos button
    this.getPhotosButtonAnim = this.animationCtrl.create()
    .addElement(this.getPhotosIcon.nativeElement)
    .duration(1500)
    .iterations(Infinity)
    .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)')
  }
}
