# J2dManuelGc

Author: Manuel García Criado

## Angular enviroment

[Angular README.md](./ANGULAR-README.md)

## Stack

* Framework:&ensp;&ensp;&ensp;&ensp;`Angular 16`
* Layout:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`Bootstrap classes`
* Controls:&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;`Angular Material`
* Infinite scroll:&ensp;&ensp;`ngx-infinite-scroll (directive)`

## Local deploiment (developing)

* You need an internet connection and to have installed [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node.js](https://nodejs.org/en) (with npm) inside your system.
* Create an empty folder for the sources.
* Open a terminal in the created directory.
* Clone the repository with the command line: `git clone https://github.com/manuelgarciacr/j2d-manuel-gc.git .` (Note the dot at the end of the sentence)
* Install the required node packages typing: `npm i`
* Execute the application with the start package JSON script: `npm start`

## Remote deploiment

The application is hosted in GitHub: [https://manuelgarciacr.github.io/j2d-manuel-gc/index](https://manuelgarciacr.github.io/j2d-manuel-gc/index)

## Application characteristics

### Header

![Alt text](src/assets/img/rick-and-morty-header-1.webp)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
![Alt text](<src/assets/img/Samsung_Galaxy_S8+_land.webp>)
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
 ![Alt text](<src/assets/img/Samsung_Galaxy_S8+.webp>)

 * It has counters with filtered and downloaded characters and the total number of characters on the server.
 * The selection control has a clear button.
 * Due to the content of the page, landscape orientation on a mobile device doesn't make much sense.
 * Subscribes an Observable from a service that emits the downloaded characters requested by the characters component.
 * Filters downloaded characters and emits them from an Observable within the service.
 * Reactively casts the height of the header to the root component (parent of the header and characters components)

