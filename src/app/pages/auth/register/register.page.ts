import { Component, NgModule, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterService, SMSStatus } from 'src/app/services/register.service';
import * as firebase from 'firebase/app'
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PhoneValidator } from 'src/app/utils/PhoneValidator';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { App } from '@capacitor/core';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  // Form related clases
  public registerForm:FormGroup = new FormGroup({});

  // Checks wether any error happened and the corresponding message. If empty, no error is present
  public formError:boolean = false;
  public formErrorMessage:string = "";

  constructor(
    private formBuilder: FormBuilder, 
    private registerSvc: RegisterService, 
    private router: Router,
    private translate: TranslateService
  ) {
    // Set up form controls with validators
    this.registerForm = this.formBuilder.group({
      phone: ['', [Validators.required,PhoneValidator.validCountryPhone('ES')]],
    });
  }

  ngOnInit() {
    // Create and register captcha verifier
    const recaptchaVerifier = new firebase.default.auth.RecaptchaVerifier('register-button', {
      'size': 'invisible',
      'data-theme': 'dark'
    });
    this.registerSvc.registerCaptchaVerifier(recaptchaVerifier);
  }

  sendConfirmationSMS(){
    // Check whether all data is correct
    if (this.registerForm.valid !== true)
    {
      this.showErrors();
      return;
    }

    // Send the confirmation SMS with the value in the phone form control
    this.registerSvc.sendConfirmationSMS( this.parsePhoneNumber( this.registerForm.controls["phone"].value ) ).then((smsStatus) => {
      switch(smsStatus)
      {
        case SMSStatus.Sent:
          this.savePhone(this.registerForm.controls["phone"].value);
          this.redirectUser();
          break;
        case SMSStatus.WrongParameter:
          this.numberBadlyFormatted();
          break;
        case SMSStatus.WrongPhoneNumber:
          this.wrongPhoneNumber();
          break;
        case SMSStatus.Errored:
          this.errored();
          break;
      }
    });
  }

  private savePhone(phone:string): void {
    sessionStorage.setItem(StorageKeys.phoneFutureUser, phone);
  }

  // Adds phone localization code to the number if it is not present
  // TODO: Currently it only does it for spanish numbers. Must be get the codes from the server in an initial
  // information request.
  private parsePhoneNumber(phone:string): string {
    if (!phone.startsWith('+'))
    {
      phone = "+34 " + phone;
    }

    return phone;
  }

  private showErrors(): void {
    // Clean previous form error
    this.formError = false;
    this.formErrorMessage = "";

    // Check each form control
    if ( this.registerForm.controls["phone"].valid != true ) {
      this.formError = true;
      // TODO: Show different message based on country and language
      this.formErrorMessage += this.translate.instant("AUTH.FORGOT.error_1");
    }
  }

  // Redirect user to the page if SMS has been received
  private redirectUser(): void {
    this.router.navigate(['sms-verification']);
  }

  // Manage badly formatted number sent through the petition
  private numberBadlyFormatted(): void
  {
    throw Error("Badly formatted number by the programmer.");
  }

  // Manage badly formatted number sent through the petition
  private wrongPhoneNumber(): void
  {
    this.formError = true;
    this.formErrorMessage = this.translate.instant("AUTH.FORGOT.error_2");
  }

  // Function for general errors in the SMS sending
  private errored(): void
  {
    console.log("Ha ocurrido un error inesperado.");
  }

  // Exit the application
  private exitApp(): void
  {
    App.exitApp();
  }
}
