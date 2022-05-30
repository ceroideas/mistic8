import { Injectable } from '@angular/core';
import { IProfilePhoto } from '../IProfilePhoto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public averagePunct: number;
  public profilePhotos: IProfilePhoto[] = [];
  public maxSelectedPhotos: number = 6;

  constructor() {
    this.ngOnInit()
   }

   ngOnInit() {
    let vm = this;

    vm.rellenaphotos();
    vm.calculateAveragePunctuation();
    vm.reorderBySelected();
  }

  /**
  * @ngdoc method
  * @methodOf ProfileService
  * @name rellenaphotos
  * @description 
  * Inicializa el array de profilePhotos.
  * 
  */
  rellenaphotos() {
    let vm = this;

    vm.profilePhotos =   [  {
          url: 'assets/img/image0.jpg',
          punctuation: 2,
          selected: true
      },
      {
        url: 'assets/img/image1.jpg',
        punctuation: 1,
        selected: true
      },
      {
        url: 'assets/img/image2.jpg',
        punctuation: 10,
        selected: false
      },
      {
        url: 'assets/img/image3.jpg',
        punctuation: 7,
        selected: true
      },
      {
        url: 'assets/img/image4.jpg',
        punctuation: 3,
        selected: true
      },
      {
        url: 'assets/img/image5.jpg',
        punctuation: 6.6,
        selected: false
      },
      {
        url: 'assets/img/image2.jpg',
        punctuation: 8.5,
        selected: false
      }      
    ]
  }

  /**
  * @ngdoc method
  * @methodOf ProfileService
  * @name calculateAveragePunctuation
  * @description 
  * Calcula la puntuación media de las fotos seleccionadas y la guarda en averagePunct.
  * 
  */
  calculateAveragePunctuation() {
    let vm = this;
    let totalPunct = 0;
    let selectedPhotos = 0;

    vm.profilePhotos.forEach(photo =>{
      if(photo.selected){
        totalPunct += photo.punctuation;
        ++selectedPhotos;
      }
    });

    if(selectedPhotos > 0) {
      vm.averagePunct = totalPunct/selectedPhotos;
    } 
    else {
      vm.averagePunct = 0;
    }

    //Now round the result
    vm.averagePunct = this.round(vm.averagePunct, 1);
  }

  /**
  * @ngdoc method
  * @methodOf ProfileService
  * @name round
  * @description 
  * Redondea los decimales de un number con la precisión que le indiquemos.
  *
  * @param value number que se va a redondear
  * @param precision número de decimales que queremos en el resultado
  * 
  * @example ProfileService.round(10.24124124, 2);
  * 
  */
  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  /**
  * @ngdoc method
  * @methodOf ProfileService
  * @name countSelectedPhotos
  * @description 
  * Devuelve el número de fotos que hay seleccionadas.
  * 
  */
  countSelectedPhotos() {
    let vm = this;
    let selectedPhotos = 0;

    vm.profilePhotos.forEach(photo =>{
      if(photo.selected){
        ++selectedPhotos;
      }
    });

    return selectedPhotos;
  }

  /**
  * @ngdoc method
  * @methodOf ProfileService
  * @name selectPhoto
  * @description 
  * Selecciona o deselecciona la foto pasada por parámetro dependiendo del valor boleano que le pasemos
  * y llama a calcular la nueva nota media.
  * Si se ha llegado al límite de fotos seleccionadas, no modifica la foto en cuestión y devuelve false.
  *
  * @param value boleano que indica si se selecciona o no
  * @param photo IProfilePhoto a la que se va a modificar el valor de selected
  * 
  */
  selectPhoto(value, photo){
    let vm = this;

    photo.selected = value;

    if(value == true && this.countSelectedPhotos() > vm.maxSelectedPhotos ) {
      photo.selected = false;
      value = false;
      return false; // return false if can't add a new selected photo
    }

    vm.calculateAveragePunctuation();
    vm.reorderBySelected();

    return true;
  }

  addPhoto(photoURL){
    let vm = this;

    vm.profilePhotos.push({
      url: photoURL,
      punctuation: 0,
      selected: false
    });
  }

  deletePhoto(photo){
    let vm = this;

    const index: number = vm.profilePhotos.indexOf(photo);
    if (index !== -1) {
        vm.profilePhotos.splice(index, 1);
    } 
  }


  reorderBySelected() {
    let vm = this;
    let selectedAux: IProfilePhoto[] = [];
    let noSelectedAux: IProfilePhoto[] = [];

    // add photos to each auxiliar array
    vm.profilePhotos.forEach(photo =>{
      if(photo.selected){
        selectedAux.push(photo);
      }
      else{
        noSelectedAux.push(photo)
      }
    });

    // Join the two arrays
    vm.profilePhotos = selectedAux.concat(noSelectedAux);
  }
}
