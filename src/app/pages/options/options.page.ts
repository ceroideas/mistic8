import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from "src/app/services/auth.service";
import { Router } from '@angular/router';
import { ProfileService } from '../profile/services/profile.service';
import { User, UserData } from 'src/app/shared/user.interface';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import * as firebase from 'firebase';
import { Legal } from 'src/app/shared/Legal';

import { EventsService } from '../../services/events.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-options',
  templateUrl: './options.page.html',
  styleUrls: ['./options.page.scss'],
})
export class OptionsPage implements OnInit {
  
  user$: Observable<User> = this.authService.afAuth.user;
  nombreUser: string;
  misticId: string="";
  uid: string;

  avatar:string;

  language = {name:"Español", iso: "es"};

  constructor(
    private router:Router,
    private profileService: ProfileService,
    private authService: AuthService,
    public alertController: AlertController,
    private translate: TranslateService,
    private events: EventsService,
    private action: ActionSheetController
    ) {
      if(sessionStorage.getItem(StorageKeys.currentUser) == null || sessionStorage.getItem(StorageKeys.currentUser)== ''){
      this.router.navigate(['login']);
      } 
      this.uid = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid;

      this.createMisticId();

      if (localStorage.getItem('language')) {
        this.language = JSON.parse(localStorage.getItem('language'));
      }else{
        localStorage.setItem('language',JSON.stringify(this.language));
      }
    }

    async selectLanguage()
    {
      let a = await this.action.create({
        header: this.translate.instant("OPTIONS.option_6"),
        buttons: [{
          text: "Español",
          handler: ()=> {
            this.language = {name:"Español", iso: "es"};
            localStorage.setItem('language',JSON.stringify(this.language));
            this.events.publish('changeLanguage','es');
          }
        },{
          text: "English",
          handler: ()=> {
            this.language = {name:"English", iso: "en"};
            localStorage.setItem('language',JSON.stringify(this.language));
            this.events.publish('changeLanguage','en');
          }
        }]
      }).then(a=>a.present());
    }

    ngOnInit() {
      this.putUserData();
    }
  
    async putUserData() {
      this.authService.getUserData<UserData>(this.uid).subscribe((res) => {
        console.log(res);
        this.nombreUser=res.name;
      });
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

  logout(){
    firebase.default.auth().signOut().then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
    });
    this.authService.logout();
    sessionStorage.clear();
    this.router.navigate(['load-sceen']);
  }

  delete(){
    firebase.default.auth().currentUser.delete();
    this.authService.deleteUser();
    this.authService.logout();
    sessionStorage.clear();
    this.router.navigate(['load-sceen']);
  }
  async presentAlertMultipleButtons() {
    const alert = await this.alertController.create({
      cssClass: 'eraseAccount',
      header: this.translate.instant("OPTIONS.alert_1"),
      subHeader: this.translate.instant("OPTIONS.alert_2"),
      message: this.translate.instant("OPTIONS.alert_3"),
      buttons: [
        {
          text: this.translate.instant("OPTIONS.alert_4"),
          role: 'cancel',
          handler: () => {
            
          }
        }, {
          cssClass: 'borrarCuenta',
          text: this.translate.instant("OPTIONS.alert_5"),
          handler: () => {
            this.delete();
          }
        }
      ]
    });
    
    await alert.present();
  }

  openPrivacyPolicy(): void {
    this.alertController.create({
      cssClass: "policyAlert",
      header: this.translate.instant("OPTIONS.alert_6"),
      subHeader: '',
      message: Legal.privacyPolicy,
      buttons: [this.translate.instant("OPTIONS.alert_7")]
    }).then(res => {
      res.present();
    });
  }

}
 