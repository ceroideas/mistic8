# Mistic8
- Repositorio principal para el desarrollo de la aplicación Mistic8.
- Aplicación creada usando Ionic-Angular.
- Esta guía está probada y pensada para un entorno Windows, pero no debería de dar problemas en Ubuntu.

#### Requerimientos
Para poder compilar y ejecutar la APP en local necesitaremos tener instalado :
- NodeJS 
- NPM 
- Git

### Instalación
Una vez instalados los programas mencionados anteriormente podemos proceder con la instalación de las dependencias necesarias para que el proyecto compile y se ejecute correctamente.

Para ello debemos seguir los siguientes pasos :

   ##### 1. Clonar el repositorio :
---
```sh
$ git clone https://github.com/6Pi-Devs/mistic8.git
$ cd ./mistic8
```
  ##### 2. Instalar las dependencias :
---
```sh
$ npm i
```
  ##### 3. Ejecutar :
 ---
```sh
$ ionic serve
```
### Estructura de las ramas
En el proyecto se trabajará con dos ramas principales, **Master** y **Develop**, y con varias **ramas auxiliares** .
##### Master
Será la rama principal del proyecto, a esta rama solo se subirán versiones cerradas y funcionales al 100% de la aplicación. Todos los desarrollos deberán pasar y ser validados en **Develop** antes de incluirlos en esta rama.
##### Develop
Esta rama se usará para mergear todos los desarrollos que se llevarán a cabo en ramas auxiliares, de esta forma se corregirán todos los fallos y bugs que pueden darse de los procesos de integración.
#### Ramas auxiliares
En estas ramas es donde se llevará a cabo el desarrollo de funcionalidades especificas de la aplicación, estas ramas han de ser nombradas como "feature-xxxx"
de tal forma que si yo, por ejemplo, estoy trabajando en la funcionalidad de "subir foto", la rama auxiliar sobre la que trabajaré se llamará "feature-subir-foto".
Esto nos permitirá tener mas controlado el desarrollo para identificar posibles bugs, o errores en funcionalidades especificas.
