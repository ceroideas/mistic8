import { Injectable } from '@angular/core';
import { User, UserData } from '../shared/user.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { StorageKeys } from '../shared/StorageKeys';

@Injectable ({
    providedIn: 'root'
})

export class AuthService {
  public user$: Observable<User>;

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  //no tested
  async deleteUser(){
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).delete();
        }
        return of(null);
      })
    );
  }
  async resetPassword(email: string): Promise<void> {
    try {
      return this.afAuth.sendPasswordResetEmail(email);
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  async register(email: string, password: string): Promise<User> {
    try {
      const { user } = await this.afAuth.createUserWithEmailAndPassword(email, password);
      // TODO: not needed since we are using "phone"
      //await this.sendVerificationEmail();
      sessionStorage.setItem(StorageKeys.currentUser, JSON.stringify(user));
      return user;
    } catch (error) {
      throw error;
    }
  }

  async login(email: string, password: string): Promise<User> {
    const { user } = await this.afAuth.signInWithEmailAndPassword(email, password);
    //this.updateUserData(user);
    sessionStorage.setItem(StorageKeys.currentUser, JSON.stringify(user));
    return user;
  }

  async sendVerificationEmail(): Promise<void> { 
    try {
      return (await this.afAuth.currentUser).sendEmailVerification();
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  isEmailVerified(user:User): boolean{
    return user.emailVerified === true ? true : false;
  }

  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  public updateUserData(user:UserData) {
    const userRef: AngularFirestoreDocument<UserData> = this.afs.doc(`users/${user.uid}`);
    return userRef.set(user, { merge: true });
  }

  public async updatePassword(code:string, newPass: string) {
    try {
      return await this.afAuth.confirmPasswordReset(code, newPass);
    } catch (error) {
      console.log('Error: ', error);
    } 
  }

  public getUser () {
      return this.afAuth.currentUser;
  }

  getUserData<UserData>(uid: string){
    return this.afs.doc<UserData>(`users/${uid}`).valueChanges();
  }
}