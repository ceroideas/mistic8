import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-welcome2',
  templateUrl: './welcome2.page.html',
  styleUrls: ['./welcome2.page.scss'],
})
export class Welcome2Page implements OnInit {

  backButtonSubscription; // for storing the returned subscription

  constructor(private platform: Platform, private router:Router) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      console.log("evento backButton Welcome2");
      App.exitApp();
    });
  }

  ngOnDestroy() {
    console.log("Se destruye la pagina Welcome2");
    this.backButtonSubscription.unsubscribe();
  }


  goToPage(pageURL) {
    this.router.navigate([pageURL]);
  }
}
