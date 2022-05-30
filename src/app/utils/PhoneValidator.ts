import { Injectable } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { PhoneNumberUtil } from 'google-libphonenumber';

@Injectable ({
    providedIn: 'root'
})
export class PhoneValidator {
    static validCountryPhone = (countryRegion: string): ValidatorFn => {

    return (phoneControl: AbstractControl): {[key: string]: boolean} => {
        // Check phone is not empty
        if(phoneControl.value === ""){
            return null;
        }

        try{
            const phoneUtil = PhoneNumberUtil.getInstance();
            let phoneNumber = "" + phoneControl.value + "",
                number = phoneUtil.parse(phoneNumber, countryRegion),
                isValidNumber = phoneUtil.isValidNumber(number);

            if(isValidNumber){
                return null;
            }
        }catch(e){
            return {
                validCountryPhone: true
            };
        }
        return {
            validCountryPhone: true
        };
    };
  };
}