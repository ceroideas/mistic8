import { Injectable } from '@angular/core';
import { Photo } from '../shared/photo.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app'

import { Query , AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { collectExternalReferences } from '@angular/compiler';

@Injectable({
    providedIn: 'root'
})

export class PhotoService {

    photosCollection: AngularFirestoreCollection;

    public photo$: Observable<Photo>;


    constructor(private afs: AngularFirestore) {
    }

    getPhotosUser<tipo>(path: string, userCode:string){
        
        const collection = this.afs.collection<tipo>(path, ref => ref.where('owner', '==', userCode));
     
        return collection.valueChanges();
    }

    getPhotosForVoteLastNumber<tipo>(path: string, userCode:string, cantPhotos:number, startAt:any){
        //pedir las ultimas 20(mas menos) fotos y comprobar que el usuario no ha votado en ellas
        //una vez que se hayan comprobado todas, recargar para ver si hay mas

        //limitToLast, startAt

        const collection = this.afs.collection<tipo>(path, ref => ref.
            where('isSelected', '==', true).
            orderBy('date',"desc").
            limit(cantPhotos)
            .startAfter(startAt));

        return collection.valueChanges();
    }

    createDoc(data: any, path: string, id: string){
        const collection = this.afs.collection(path);
        return collection.doc(id).set(data);
    }

    getDoc(path: string, id: string){
        const collection = this.afs.collection(path);
        return collection.doc(id).valueChanges();
    }

    deleteDoc(path: string, id: string){
        const collection = this.afs.collection(path);
        return collection.doc(id).delete();
    }

    updateDoc(data: any, path: string, id: string){
        const collection = this.afs.collection(path);
        return collection.doc(id).update(data);
    }

    getId(){
        return this.afs.createId();
    }

    getCollection<tipo>(path: string){
        const collection = this.afs.collection<tipo>(path);
        return collection.valueChanges();
    }

     
    async uploadPhoto(nombre: string): Promise<Photo> {
        try {
            return;
        } catch (error) {
            console.log('Error: ', error);
        }
    }

    getPhotos() {
        return this.photosCollection.valueChanges();
    }

    async loadPhoto() {
        var storageRef = firebase.default.storage().ref();


        var currentDate = Date.now();
        const prueba = await this.afs.collection('imagesCollection').add({
            lastUpdate: firebase.default.firestore.FieldValue.serverTimestamp()
        });
        console.log('prueba: ', prueba);

    }
    /*
    openImagePicker() {
        this.imagePicker.hasReadPermission().then(
            (result) => {
                if (result == false) {
                    // no callbacks required as this opens a popup which returns async
                    this.imagePicker.requestReadPermission();
                }
                else if (result == true) {
                    this.imagePicker.getPictures({
                        maximumImagesCount: 1
                    }).then(
                        (results) => {
                            for (var i = 0; i < results.length; i++) {
                                this.uploadImageToFirebase(results[i]);
                            }
                        }, (err) => console.log(err)
                    );
                }
            }, (err) => {
                console.log(err);
            });
    }
    
    uploadImageToFirebase(image){
        image = normalizeURL(image);
      
        //uploads img to firebase storage
        this.firebaseService.uploadImage(image)
        .then(photoURL => {
      
          let toast = this.toastCtrl.create({
            message: 'Image was updated successfully',
            duration: 3000
          });
          toast.present();
          })
        }
      */
}
