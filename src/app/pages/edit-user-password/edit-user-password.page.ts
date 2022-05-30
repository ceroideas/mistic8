import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
import { RegisterService } from 'src/app/services/register.service';
import { Pattern } from 'src/app/shared/Pattern';
import { User, UserData } from 'src/app/shared/user.interface';
import { StorageKeys } from 'src/app/shared/StorageKeys';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-edit-user-password',
  templateUrl: './edit-user-password.page.html',
  styleUrls: ['./edit-user-password.page.scss'],
})
export class EditUserPasswordPage implements OnInit {

  public fillDataForm:FormGroup = new FormGroup({});

  // Checks wether any error happened and the corresponding message. If empty, no error is present
  public formError:boolean = false;
  public formErrorMessage:string = "";

  uid: string;
  codetoSms: string;

  nombreUser:string;
  misticId: string="";

  avatar:string;

  constructor( 
    private router: Router,
    private registerSvc: RegisterService, 
    private authSvc: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder) {
      // Set up form controls with validators
      this.fillDataForm = this.formBuilder.group({
        password1: ['', [Validators.required, Validators.pattern(Pattern.password)]],
        password2: ['', [Validators.required, Validators.pattern(Pattern.password)]],
        password3: ['', [Validators.required, Validators.pattern(Pattern.password)]],}); 

        this.uid = JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).uid;  

        this.createMisticId();
    }

  ngOnInit() {
  }

  createMisticId(){
    this.authSvc.getUserData<UserData>(this.uid).subscribe((res) => {
      this.nombreUser=res.name;
      this.avatar=res.avatar;
      this.misticId=res.country.substring(0,3).toUpperCase();
      this.misticId+=res.state.substring(0,2).toUpperCase();
      this.misticId+=(JSON.parse(sessionStorage.getItem(StorageKeys.currentUser)).email).substring(5,9);
    });
    
  }

  changePassword(){
    this.showErrors();

    const user = this.authSvc.getUser;
    
    const pruebauser = firebase.default.auth().currentUser;
    
    var credential = firebase.default.auth.EmailAuthProvider.credential(firebase.default.auth().currentUser.email, this.fillDataForm.controls["password1"].value);

    pruebauser.reauthenticateWithCredential(credential).then(() => {
      // Update password, since here the user has authenticated okay
      pruebauser.updatePassword(this.fillDataForm.controls["password2"].value).then(() => {
        // Update successful.
        this.router.navigate(['tabs/options']);
      }).catch((error) => {
        console.log(error);
        // An error ocurred
        // ...
      });
    }).catch((error) => {
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_1");
    });
  }

  private showErrors(): void {
    // Clean previous form error
    this.formError = false;
    this.formErrorMessage = "";

    if ( this.fillDataForm.controls["password1"].valid != true ) {
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_2");
    }
    
    if ( this.fillDataForm.controls["password2"].valid != true ) {
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_3");
    }
    
    if ( this.fillDataForm.controls["password2"].valid != true ) {
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_4");
    }
    
    
    if (this.fillDataForm.controls["password1"].value == this.fillDataForm.controls["password2"].value)
    { 
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_5");
    }

    if (this.fillDataForm.controls["password2"].value != this.fillDataForm.controls["password3"].value)
    { 
      this.formError = true;
      this.formErrorMessage = this.translate.instant("EDIT_USER_PASSWORD.alert_6");
    }
  }
}
