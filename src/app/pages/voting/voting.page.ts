import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { IonSlides, ToastController } from '@ionic/angular';
import { ViewChild } from '@angular/core';
import { ProfileService } from "../profile/services/profile.service";
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Gesture, GestureController } from '@ionic/angular';
import { PhotoService } from "src/app/services/photo.service";
import { Photo, Voto } from "src/app/shared/photo.interface";
import { range } from 'rxjs';
import { GetDownloadURLPipe } from '@angular/fire/storage';
import { DatabaseRoute } from 'src/app/shared/DatabaseRoute';
import { VotingPageModule } from './voting.module';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { Animation, AnimationController } from '@ionic/angular';
const { App } = Plugins;

@Component({
  selector: 'app-voting',
  templateUrl: './voting.page.html',
  styleUrls: ['./voting.page.scss'],
})
export class VotingPage implements OnInit {
  public voteHeight:number = 20;
  valueRange = document.getElementsByTagName("ion-range");

  backButtonSubscription; // for storing the returned subscription
  private white: string = "#7B5D98";

  public score: number = 0;
  public punctuationColor = this.white;
  public displayPunctuation: string = 'none';
  public displayPunctuationBar: string = 'block';
  public currentPhoto: number = 0;
  
  private lastPuctuation: number = 0;
  private getPhotosButtonAnim: Animation;

  private numFotosPeticion: number = 20;
  @ViewChild('indexContent', { read: ElementRef }) box: ElementRef;
  @ViewChild('getPhotosIcon', { read: ElementRef }) getPhotosIcon: ElementRef;

  uid: string ="";
  photos: Photo[] = [];

  lastVoteDate: any;

  lastImageDate:any;

  fechaFoto:any;

  canVote:boolean =true;

  newVoto: Voto = {
    author: '',
    score: null,
  };

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
    totalVotes: null,
    votos: [this.newVoto],
  };
  
  loading: any;

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
    private animationCtrl: AnimationController
    ) {
    // TODO: Revisar esto para que detecte al usuario correctamente
    if(sessionStorage.getItem(StorageKeys.currentUser) == null || sessionStorage.getItem(StorageKeys.currentUser)== ''){
      //this.router.navigate(['login']);
    }
    this.fechaFoto=new Date;
    this.lastVoteDate=new Date;
    this.lastImageDate=new Date;
    
    this.getPhotos();
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribe(() => {
      if (this.router.url == "/tabs/profile"){
        console.log("exit app profile");
        App.exitApp();
      }
        /*
      else {
        console.log("go previous page");
        this.router.navigate(['tabs/profile']);
      }*/
    });
    this.setupGesture();

    this.setupButtonAnimation();
  }

  ngOnInit() {
    /* this.photoService.getCollection<Photo>(this.path).subscribe((res)=>{
      
      for (let i = 0; i < res.length; i++) {
        this.canVote=true;
        if(res[i].isSelected==true){
          if(res[i].owner!=JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid){
            if(res[i].votos!=null){
              if (res[i].votos[JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid] == null)
              {
                this.canVote = false;
              }
            }
            else{
              this.canVote=true;
            }
          }
          else{
            this.canVote=false;
          }
        }
        else{
          this.canVote=false;
        }
        if(this.canVote==true){
          this.photos.push(res[i]);
        }
      }
      console.log('my photos: ', this.photos);
    }); */
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
      console.log(res);
      console.log(this.photos);
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
    console.log(this.photos);
    if(this.photos.length==0){
      this.fechaFoto=Date();
      this.displayPunctuationBar = "none";
    }
    else{
      this.fechaFoto=this.photos[this.photos.length-1].date;
      this.displayPunctuationBar = "block";
    }
    console.log('my photos: ', this.photos);
    console.log('fechaUltima: ', this.fechaFoto);
  }

  next(index) {
    this.slides.slideTo(index+1);
  }

  goToPage(pageURL) {
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
    this.lastPuctuation = 0;
  }

  onMoveVoteHandler(ev) {
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
    if(this.photos.length > 0){
      const thresholdY: number = this.voteHeight;
      let movedY: number = Math.abs(ev.currentY - ev.startY);

      if(movedY > thresholdY) {
        let notaMedia=0;
        this.newVoto.author = JSON.parse(sessionStorage.getItem('user')).uid;
        this.newVoto.score=this.score;
        
        this.newPhoto=this.photos[0];
        console.log(this.photos);

        if(this.newPhoto.votos!=null || this.newPhoto.votos!=undefined){
          this.newPhoto.votos.push(this.newVoto);
        }
        else{
          this.newPhoto.votos=[this.newVoto];
        }
        this.newPhoto.totalVotes=this.newPhoto.votos.length;

        for (let i = 0; i < this.newPhoto.votos.length; i++) {
          console.log(notaMedia);
          notaMedia += this.newPhoto.votos[i].score;
        }
        this.newPhoto.nota=Math.round(((notaMedia/this.newPhoto.votos.length)+ Number.EPSILON) * 100) / 100;


        this.photoService.updateDoc(this.newPhoto,this.path,this.newPhoto.id).then(res => {
          //this.loading.dismiss();
          this.lastVoteDate=this.newPhoto.date;
          console.log(this.newPhoto);
          console.log(this.lastVoteDate);
          this.slides.slideTo(0);

          this.hideVotingElements();
        }).catch(error => {
          this.presentToast('no se pudo votar');
          });

          this.resetPunctuation();
      }
    }
  }

  async presentToast(msg: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      keyboardClose: true,
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



  private hideVotingElements(){
    this.displayPunctuation = "none";
    this.displayPunctuationBar = "none";
    this.getPhotosButtonAnim.stop();
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
