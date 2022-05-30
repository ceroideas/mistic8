import { Component } from '@angular/core';
import { IonRouterOutlet, Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
const { App } = Plugins;
import { NewPhotoModalPage } from "../new-photo-modal/new-photo-modal.page";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  tabs: Tab[];
  private modalOpened:boolean = false;

  constructor(  ) {
    this.tabs = [
      {name: "voting",iconName: "voting", adjustedSize: false, isSelected: true},
      {name: "upload",iconName: "upload", adjustedSize: true, isSelected: false},
      {name: "profile",iconName: "profile", adjustedSize: true, isSelected: false},
      {name: "options",iconName: "md-options", adjustedSize: false, isSelected: false},];
  }

  changeTab(tab: string){
    this.tabs.forEach(element => {
      if(element.name === tab)
      {
        element.isSelected = true;
      } else {
        element.isSelected = false;
      }
    });
  }


  
}

export interface Tab{
  name:string;
  iconName:string;
  adjustedSize:boolean;
  isSelected:boolean;
}

