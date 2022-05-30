import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { App } from '@capacitor/core';
import * as firebase from 'firebase';
import { RegisterService, SMSStatus } from 'src/app/services/register.service';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import { PhoneValidator } from 'src/app/utils/PhoneValidator';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  public forgotPassForm:FormGroup = new FormGroup({});

    // Checks wether any error happened and the corresponding message. If empty, no error is present
    public formError:boolean = false;
    public formErrorMessage:string = "";

  constructor(
    private formBuilder: FormBuilder, 
    private registerSvc: RegisterService, 
    private router: Router,
    private translate: TranslateService) {
      // Set up form controls with validators
      this.forgotPassForm = this.formBuilder.group({
        phone: ['', [Validators.required,PhoneValidator.validCountryPhone('ES')]],
      }); }

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
    if (this.forgotPassForm.valid !== true)
    {
      this.showErrors();
      return;
    }

    //Send the confirmation SMS with the value in the phone form control
    this.registerSvc.sendConfirmationSMS( this.parsePhoneNumber( this.forgotPassForm.controls["phone"].value ) ).then((smsStatus) => {
      switch(smsStatus)
      {
        case SMSStatus.Sent:
          this.savePhone(this.forgotPassForm.controls["phone"].value);
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
  private showErrors(): void {
    // Clean previous form error
    this.formError = false;
    this.formErrorMessage = "";

    // Check each form control
    if ( this.forgotPassForm.controls["phone"].valid != true ) {
      this.formError = true;
      // TODO: Show different message based on country and language
      this.formErrorMessage += this.translate.instant("AUTH.FORGOT.error_1");
    }
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
  // Redirect user to the page if SMS has been received
  private redirectUser(): void {
    this.router.navigate(['sms-verification-forgot-password']);
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
