import { Injectable } from "@angular/core";
import { AngularFireStorage } from "@angular/fire/storage";
import { finalize } from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})


export class PhotoStorageService {

    constructor(public storage:AngularFireStorage){

    }

    uploadImage(file: any, path:string, nombre: string): Promise<string>{
 
        return new Promise( resolve =>{
            
            const filePath = path + '/' + nombre;
            const ref = this.storage.ref(filePath);
            const task = ref.put(file, {
                contentType: 'image/png',
            });
            task.snapshotChanges().pipe(
                finalize( () => {
                   ref.getDownloadURL().subscribe(res =>{
                       const donwloadURL =res;
                       resolve(donwloadURL);
                       return;
                   });
                })
            )
            .subscribe();


        });
    }
}