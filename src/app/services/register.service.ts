import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app'

@Injectable ({
    providedIn: 'root'
})

export class RegisterService{
    private recaptchaVerifier:any;
    private phone:string;
    private smsConfirmed:firebase.default.auth.ConfirmationResult;
    private userCredential:firebase.default.auth.UserCredential;
    private tempCredential:firebase.default.auth.AuthCredential;

    constructor(){
    }

    // Recaptcha verifier must append a view component into it, so it must be passed from the TS of the page
    registerCaptchaVerifier(recaptchaVerifier:firebase.default.auth.RecaptchaVerifier){
        this.recaptchaVerifier = recaptchaVerifier;
    }

    // Sends a confirmation SMS and returns true/false if the e-mail has been or not sent.
    async sendConfirmationSMS(phoneNumber:string):Promise<SMSStatus>{
        try
        {
            // Check if a captcha verifier has been appended from the component view
            if (!this.recaptchaVerifier)
            {
                throw Error("You need to add a recaptcha verifier first");
            }

            // Save number just in case it is needed again
            this.phone = phoneNumber;

            // Send number verification
            this.smsConfirmed = await firebase.default.auth().signInWithPhoneNumber(phoneNumber, this.recaptchaVerifier);
            return SMSStatus.Sent;

        } catch (error) {
            return this.handleSMSError(error);
        }
    }

    private handleSMSError(error:any):SMSStatus{
        // Check through different error cases
        if(error.code === "auth/argument-error")
        {
            return SMSStatus.WrongParameter;
        }

        if(error.code === "auth/invalid-phone-number")
        {
            return SMSStatus.WrongPhoneNumber;
        }

        if(error.code === "auth/invalid-verification-code")
        {
            return SMSStatus.Invalid;
        }
        
        // Return default error if none was found
        return SMSStatus.Errored;
    }

    async checkConfirmationCode(code:string):Promise<SMSStatus>{
        try
        {
            // If user didn't set the phone number first, send it back to register
            if (this.phone == null)
            {
                return SMSStatus.PhoneNumberNotSet;
            }

            // Check SMS confirmation has been sent, if not, send it.
            if (this.smsConfirmed == null)
            {
                this.smsConfirmed = await firebase.default.auth()
                    .signInWithPhoneNumber(this.phone, this.recaptchaVerifier);
            }

            // if code is correct, let the user in
            var codeFormatted = new String(code);
            var credential = firebase.default.auth.PhoneAuthProvider
                .credential(this.smsConfirmed.verificationId, codeFormatted.toString());
            this.tempCredential=credential;
            
            // Sign in the user with the credential
            this.userCredential = await firebase.default.auth().signInWithCredential(credential);
            if (this.userCredential != null)
            {
                return SMSStatus.Valid;
            }
            firebase.default.auth().currentUser.updateProfile({})
        } catch (error) {
            return this.handleSMSError(error);
        }

        // If something happened, return error
        return SMSStatus.Errored;
    }
    
    public getUserCredential(){
        return this.tempCredential;
    }
}

// SMS Status to return for the different errors, so the UI knows how to handle it
export enum SMSStatus {
    Sent,
    Valid,
    Invalid,
    PhoneNumberNotSet,
    WrongParameter,
    WrongPhoneNumber,
    Errored
}