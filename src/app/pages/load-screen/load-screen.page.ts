import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
const { App } = Plugins;

@Component({
  selector: 'app-load-screen',
  templateUrl: './load-screen.page.html',
  styleUrls: ['./load-screen.page.scss'],
})
export class LoadScreenPage implements OnInit {
  backButtonSubscription; // for storing the returned subscription

  constructor(private platform: Platform, private router:Router) { }

  ngOnInit() {  }


  ngAfterViewInit() {
    // Timeout to load and go to main page
    setTimeout(() => {
      this.goToMainPage();
    }, 3000);

    // Backbutton event
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(1, () => {
      console.log("evento backButton load screen");
      App.exitApp();
    });
  }

  goToMainPage(){
    console.log("voy a pagina principal");
    this.router.navigate(['tabs/login']);
  }
}
