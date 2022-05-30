import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Animation, AnimationController } from '@ionic/angular';
import { RegisterService, SMSStatus } from 'src/app/services/register.service';
import * as firebase from 'firebase/app'

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sms-verification',
  templateUrl: './sms-verification.page.html',
  styleUrls: ['./sms-verification.page.scss'],
})
export class SmsVerificationPage implements OnInit {
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
      code: ['', [Validators.required, Validators.maxLength(6), Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // If the user is authenticated for some reason before hand, let's move directly to fill-data
    firebase.default.auth().onAuthStateChanged((user) => {
        if (user) {
          this.redirectTo('fill-data');
        }
    });
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
        this.redirectTo('fill-data');
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
