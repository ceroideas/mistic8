import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  backButtonSubscription; // for storing the returned subscription


  constructor(private platform: Platform, private router:Router) { }

  ngOnInit(): void {
  }


  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      console.log("evento backButton Welcome");
      this.exitApp();
    });
  }

  ngOnDestroy() {
    console.log("Se destruye la pagina Welcome");
    this.backButtonSubscription.unsubscribe();
  }

  exitApp() {
    App.exitApp();
  }

  goToPage(pageURL) {
    this.router.navigate([pageURL]);
  }

}
