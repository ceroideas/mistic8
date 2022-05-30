import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserSettings } from 'src/app/shared/userSettings';
import { AlertController, IonSelect } from '@ionic/angular';
import { Pattern } from 'src/app/shared/Pattern';
import { AuthService } from 'src/app/services/auth.service';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { User, UserData } from 'src/app/shared/user.interface';
import { Animation, AnimationController } from '@ionic/angular';
import { Legal } from 'src/app/shared/Legal';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-fill-data',
  templateUrl: './fill-data.page.html',
  styleUrls: ['./fill-data.page.scss'],
})
export class FillDataPage implements OnInit {
  ngOnInit(){};

  // Option selectors
  @ViewChild('genderSelector', {static: false}) genderSelector: IonSelect;
  @ViewChild('countrySelector', {static: false}) countrySelector: IonSelect;
  @ViewChild('stateSelector', {static: false}) stateSelector: IonSelect;

  // Form related classes
  public fillDataForm:FormGroup = new FormGroup({});

  // Checks wether any error happened and the corresponding message. If empty, no error is present
  public formError:boolean = false;
  public formErrorMessage:string = "";

  // Related to error animation
  @ViewChild('formError', {read: ElementRef, static: true }) formErrorElement: ElementRef;
  public expandErrorAnimation:Animation;
  public errorSpeed:number = 350;
  public errorOneLineSize = "40px";
  public errorTwoLinesSize = "45px";

  // Data relevant to the options
  public genderOptions = UserSettings.genders;
  public countryOptions = UserSettings.countries;
  // TODO: The call to retrieve these options should be made from the server. The data must be fetched per country.
  // This is only a bypass for the Spanish jurisdiction.
  public stateOptions = UserSettings.states;

  // Custom interface properties for popovers
  popoverOptions: any = {
    translucent: true,
    cssClass: "select-fill-data",
  };

  // Custom interface properties for popovers
  actionSheetOptions: any = {
    translucent: true,
    cssClass: "action-sheet-fill-data",
  };

  constructor(
    private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private router: Router,
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private translate: TranslateService
  ) {
    // Set up form controls with validators
    this.fillDataForm = this.formBuilder.group({
      // Pattern is: Minimum eight characters, at least one letter and one number 
      password: ['', [Validators.required, Validators.pattern(Pattern.password)]],
      // Support for international names
      name: ['',  [Validators.required, Validators.minLength(2), Validators.pattern(Pattern.nameAndSurname)]],
      surname: ['',  [Validators.required, Validators.minLength(2), Validators.pattern(Pattern.nameAndSurname)]],
      email: ['',  [Validators.required, Validators.email]],
      gender: ['', [Validators.required,]],
      country: ['', [Validators.required,]],
      state: ['', [Validators.required,]],
      termsOfService: [false, [Validators.requiredTrue]],
      privacyPolitics: [false, [Validators.requiredTrue]],
    });
  }

  ngAfterViewInit()
  {
    // Create error animation without "fromTo". Apply fromTo height depending on error lines.
    this.expandErrorAnimation = this.animationCtrl.create()
      .addElement(this.formErrorElement.nativeElement)
      .duration(this.errorSpeed)
      .easing('ease-out')
      .iterations(1);
  }

  login(){
    // Check whether all data is correct
    if (this.fillDataForm.valid !== true)
    {
      this.showErrors();
      return;
    }

    // Register and Login with phone parsed as e-mail and password provided in form
    let phone:string = sessionStorage.getItem(StorageKeys.phoneFutureUser);
    let phoneFormatted:string = this.parsePhoneNumber(phone).replace(/\s/g,'');
    let phoneParsed:string = this.parsePhoneToEmail(phoneFormatted).replace(/\s/g,'');
    this.authSvc.register(phoneParsed, this.fillDataForm.controls["password"].value).then((user) => {
      if (user)
      {
        // Login user. If login satisfactory, send to profile
        this.authSvc.login(phoneParsed ,this.fillDataForm.controls["password"].value).then((user)=>{
          if (user)
          {
            // Update user data for the profile just created
            let userData:UserData = {
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              emailVerified: user.emailVerified,
              notificationEmail: this.fillDataForm.controls["email"].value,

              name: this.fillDataForm.controls["name"].value + " " +  this.fillDataForm.controls["surname"].value,
              gender: this.fillDataForm.controls["gender"].value,
              country: this.fillDataForm.controls["country"].value,
              state: this.fillDataForm.controls["state"].value,
              avatar: null
            };
            this.fillUserData(userData);
            
            this.redirectUser();
          }
        }).catch((error) => {
          this.formError = true;
          this.formErrorMessage = this.translate.instant('AUTH.FILL.from_err_1');
        });;
      }
    }).catch((error) => {
      this.formError = true;
      this.formErrorMessage = this.translate.instant('AUTH.FILL.from_err_2');
    });
  }

  private fillUserData(user:UserData): void {
    this.authSvc.updateUserData(user);
  }
  
  private parsePhoneNumber(phone:string): string {
    if (!phone.startsWith('+'))
    {
      phone = "+34" + phone;
    }

    return phone;
  }

  private parsePhoneToEmail(phone:string): string {
    return phone + "@mistic8.com";
  }

  private showErrors(): void {
    // Clean previous form error
    this.formError = false;
    this.formErrorMessage = "";

    // Check errors in inverse order
    if ( this.fillDataForm.controls["privacyPolitics"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_1'), this.errorTwoLinesSize);
    }

    if ( this.fillDataForm.controls["termsOfService"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_2'), this.errorTwoLinesSize);
    }

    if ( this.fillDataForm.controls["state"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_3'), this.errorOneLineSize);
    }

    if ( this.fillDataForm.controls["country"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_4'), this.errorOneLineSize);
    }

    if ( this.fillDataForm.controls["gender"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_5'), this.errorOneLineSize);
    }

    if ( this.fillDataForm.controls["email"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_6'), this.errorOneLineSize);
    }

    if ( this.fillDataForm.controls["name"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_7'), this.errorOneLineSize);
    }

    if ( this.fillDataForm.controls["password"].valid != true ) {
      this.setErrorTextAndBoxSize(this.translate.instant('AUTH.FILL.error_8'), this.errorTwoLinesSize);
    }

    // Play animation error
    this.expandErrorAnimation.play();
  }

  // Set current error message and error box size
  private setErrorTextAndBoxSize(message:string, sizeInPixels:string)
  {
    this.formError = true;
    this.formErrorMessage = message;
    this.expandErrorAnimation = this.expandErrorAnimation = this.animationCtrl.create()
      .addElement(this.formErrorElement.nativeElement)
      .duration(this.errorSpeed)
      .easing('ease-out')
      .iterations(1)
      .fromTo('height','0px',sizeInPixels);
  }

  // Redirect user to register since it wants to go back
  goBack(): void {
    this.router.navigate(['register']);
  }

  // Redirect user to the page if SMS has been received
  private redirectUser(): void {
    this.router.navigate(['tutorial']);
  }

  openTermsOfService(): void {
    this.alertCtrl.create({
      cssClass: "policyAlert",
      header: 'Mistic8 Términos de servicio',
      subHeader: '',
      message: Legal.termsOfService,
      buttons: ['Entiendo']
    }).then(res => {
      res.present();
    });
  }

  openPrivacyPolicy(): void {
    this.alertCtrl.create({
      cssClass: "policyAlert",
      header: 'Mistic8 Términos de servicio',
      subHeader: '',
      message: Legal.privacyPolicy,
      buttons: ['Entiendo']
    }).then(res => {
      res.present();
    });
  }
}
