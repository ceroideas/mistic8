import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import * as firebase from 'firebase';
import { RegisterService, SMSStatus } from 'src/app/services/register.service';
import { Pattern } from 'src/app/shared/Pattern';
import { StorageKeys } from 'src/app/shared/StorageKeys';
import {AuthCredential} from '@firebase/auth-types';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-verification-forgot-password',
  templateUrl: './sms-verification-forgot-password.page.html',
  styleUrls: ['./sms-verification-forgot-password.page.scss'],
})

export class SmsVerificationForgotPasswordPage implements OnInit {
  public smsVerificationForm:FormGroup = new FormGroup({});

  // Error related variables
  public formError:boolean;
  public formErrorMessage:string;

  // Animation error related
  @ViewChild('formError', {read: ElementRef, static: true }) formErrorElement: ElementRef;
  @ViewChild('sendButton', {read: ElementRef, static: true }) sendButtonElement: ElementRef;
  public formErrorAnimation:Animation;
  public sendButtonAnimation:Animation;
  public errorSpeed:number = 350;

  constructor(
    private formBuilder: FormBuilder, 
    private registerSvc: RegisterService, 
    private router: Router,
    private animationCtrl: AnimationController,
    private translate: TranslateService
  ) {
    // Set up form controls with validators
    this.smsVerificationForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.pattern(Pattern.password)]]
    });
  }

  ngOnInit() {
  }

  ngAfterViewInit()
  {
    // Create error animation
    this.formErrorAnimation = this.animationCtrl.create()
      .addElement(this.formErrorElement.nativeElement)
      .duration(this.errorSpeed)
      .easing('ease-out')
      .iterations(1)
      .fromTo('transform', 'translateY(-100%)', 'translateY(0%)');

    // Create button animation
    this.sendButtonAnimation = this.animationCtrl.create()
      .addElement(this.sendButtonElement.nativeElement)
      .duration(this.errorSpeed)
      .easing('ease-out')
      .iterations(1)
      .fromTo('transform', 'translateY(-20%)', 'translateY(0%)');
  }

  verifyCode(): void
  {
    // Check if empty
    if (this.smsVerificationForm.controls['code'].value === "")
    {
      this.emptyCode();
      return;
    }

    this.registerSvc.checkConfirmationCode(this.smsVerificationForm.controls['code'].value).then((smsStatus) => {
      this.manageSMSStatus(smsStatus);
    });
  }

  private manageSMSStatus(status:SMSStatus): void
  {
    
    switch(status)
    {
      case SMSStatus.Valid:
        
      const phoneNumber=sessionStorage.getItem(StorageKeys.phoneFutureUser);
        const pruebauser = firebase.default.auth().currentUser;
        this.registerSvc.registerCaptchaVerifier;
        
        pruebauser.reauthenticateWithCredential(this.registerSvc.getUserCredential()).then(() => {
          // User re-authenticated.
        }).catch((error) => {
        console.log(error);
          // ...
        });
        pruebauser.updatePassword(this.smsVerificationForm.controls["password"].value).then(() => {
          // Update successful.
          console.log("funciona");
        }).catch((error) => {
          // An error ocurred
          // ...
        });
        this.redirectTo('login');

        break;
      case SMSStatus.Invalid:
        this.invalidCode();
        break;
      case SMSStatus.PhoneNumberNotSet:
        // TODO: show message of error when going back, an alert/pop-up that says that number needs to be re-set correctly.
        // SUGGESTION: directly use a guard that only activates when register was passed correctly, 
        //   and if somehow arrives here just resend to register.
        this.redirectTo('register');
        break;
      case SMSStatus.Errored:
        this.errored();
        break;
    }
  }

  // Redirect user to the profile page
  private redirectTo(route:string): void
  {
    this.router.navigate([route]);
  }

  private errored(): void
  {
    this.formErrorMessage = this.translate.instant("AUTH.SMS.error_1");
    this.showError();
  }

  private emptyCode(): void
  {
    this.formErrorMessage = this.translate.instant("AUTH.SMS.error_2");
    this.showError();
  }

  private invalidCode(): void
  {
    this.formErrorMessage = this.translate.instant("AUTH.SMS.error_3");
    this.showError();
  }

  private showError(): void
  {
    this.formError = true;
    this.formErrorAnimation.play();
    this.sendButtonAnimation.play();
  }

}
