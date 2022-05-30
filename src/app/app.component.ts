import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase';

import { EventsService } from './services/events.service';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  providers: []
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private screenOrientation: ScreenOrientation,
    private authSvc: AuthService,
    public events: EventsService,
    private translate: TranslateService
  ) {
    this.initializeApp();

    this.translate.setDefaultLang('es');
    this.translate.addLangs(['en', 'es']);

    if (localStorage.getItem('language')) {
      let lang = JSON.parse(localStorage.getItem('language'));
      this.translate.use(lang.iso);
    }else{
      this.translate.use('es');
    }

    this.events.destroy('changeLanguage');
    this.events.subscribe('changeLanguage',(l)=>{
      console.log(l);
      this.translate.use(l);
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {

      this.statusBar.styleLightContent();
      this.splashScreen.hide();
      // set to vertical
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);

      // set authentication language to spanish
      // TODO: Get user language if we have different ones
      firebase.default.auth().languageCode = "es";
    });
  }
}
