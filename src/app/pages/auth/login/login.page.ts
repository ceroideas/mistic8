import { Component, NgModule, OnInit,} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PhoneValidator } from 'src/app/utils/PhoneValidator';
import { Pattern } from 'src/app/shared/Pattern';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{
  // Form related clases
  public loginForm:FormGroup = new FormGroup({});
  
  // Checks wether any error happened and the corresponding message. If empty, no error is present
  public formError:boolean = false;
  public formErrorMessage:string = "";

  constructor(
    private authSvc: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translate: TranslateService
  ) 
  {
    // Set up form controls with validators
    this.loginForm = this.formBuilder.group({
      phone: ['', [Validators.required,PhoneValidator.validCountryPhone('ES')]],
      password: ['', [Validators.required, Validators.pattern(Pattern.password)]],
    });
  }

  ngOnInit(){
    // Logout just in case the user hasn't done it
    this.authSvc.logout();
  };

  //jesus:
  async onLogin() {
    // If it is not valid, show errors
    if (this.loginForm.valid !== true)
    {
      this.invalidFormatError();
      return;
    }

    console.log("Teléfono: " + this.loginForm.controls["phone"].value);
    console.log("Contraseña: " + this.loginForm.controls["password"].value);
    // Format phone to be an e-mail
    let phoneFormatted:string = this.parsePhoneNumber(this.loginForm.controls["phone"].value).replace(/\s/g,'');
    console.log("Telefono formateado: " + phoneFormatted);
    let phoneParsedToEmail:string = this.parsePhoneToEmail(phoneFormatted);
    console.log("Telefono formateado a correo: " + phoneParsedToEmail);

    // Try to login
    try {
      const user = await this.authSvc.login(phoneParsedToEmail, this.loginForm.controls["password"].value);
      if (user) {
        this.redirectUser();
      }
    } catch (error) {
      // If user is not found, show it
      if(error.code == "auth/user-not-found")
      {
        this.userNotFound();
        return;
      }
      
      // Show password error
      if(error.code == "auth/wrong-password")
      {
        this.invalidPasswordError();
        return;
      }

      // Show default error
      this.defaultError();
    }
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

  private redirectUser(): void {
    this.router.navigate(['tabs/profile']);
  }

  private invalidFormatError():void {
    this.formError = true;
    this.formErrorMessage = this.translate.instant('AUTH.LOGIN.error1');
  }

  private invalidPasswordError():void {
    this.formError = true;
    this.formErrorMessage = this.translate.instant('AUTH.LOGIN.error2');
  }

  private userNotFound():void {
    this.formError = true;
    this.formErrorMessage = this.translate.instant('AUTH.LOGIN.error3');
  }

  private defaultError():void {
    this.formError = true;
    this.formErrorMessage = this.translate.instant('AUTH.LOGIN.error4');
  }
}
