"use strict";

//watch video 234
///we are going to refactor this mapty Appp

//we are creating an app called MAPTY that  shows every exerscise we did in the map and the list

// prettier-ignore
const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputDistance = document.querySelector(".form__input--distance");
const inputElevation = document.querySelector(".form__input--elevation");

///////Managing Workout Data: Creating Classes

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);

  constructor(distance, duration, coords) {
    this.distance = distance; //km
    this.duration = duration; //min
    this.coords = coords; //[latitude longtiude]
  }
}
//create class running  and inherit from parent class Workout
class Running extends Workout {
  constructor(distance, duration, coords, Cadence) {
    super(distance, duration, coords);
    this.Cadence = Cadence;

    //so we can call the calPace() method from the constructor
    this.calcPace();
  }
  //create method clacPace
  calcPace() {
    this.pace = this.duration / this.distance; //min/km
    return this.pace;
  }
}

//create class Cycling and inherit from parent class Workout
class Cycling extends Workout {
  constructor(distance, duration, coords, elevationGain) {
    super(distance, duration, coords);
    this.elevationGain = elevationGain;
    //so we can call the calcSpeed() method from the constructor
    this.calcSpeed();
  }
  //create method CalcSpeed
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); //km/min
    return this.speed;
  }
}

//lets create objects now

const run1 = new Running(10, 60, [37, 120], 178);
const cycling1 = new Cycling(30, 60, [37, 120], 178);

console.log(run1); //Object { date: Date Sat Sep 11 2021 08:51:40 GMT-0700 (Pacific Daylight Time), id: "375500252 ", distance: 10, duration: 60, coords: (2) […], Cadence: 178, pace: 6 }
console.log(cycling1); //Object { date: Date Sat Sep 11 2021 08:52:15 GMT-0700 (Pacific Daylight Time), id: "375535436 ", distance: 30, duration: 60, coords: (2) […], elevationGain: 178, speed: 30 }

/////////////////////////////////APP Architecture
//lets create App class

class App {
  #map;
  #mapEvent;
  constructor() {
    this._getPosition();

    //then we will sumbmit the form

    form.addEventListener("submit", this._newWorkOut.bind(this));
    //this willchange element in the in the input  when one is displayed the other one hidden  in tis case the  cycling(cadance) and runing (elevetion gain)interchanching
    inputType.addEventListener("change", this._toggleElevationField);
  }

  _getPosition() {
    //<--!we added CDN link of liflet library and add differ manually--->  in the html file that the code we got from library
    ///////////229. Using the Geolocation API
    //to get the location   using navigator.Geolocation  which is the api
    if (navigator.geolocation)
      //if the browser have this geolocation then we implement the code below
      navigator.geolocation.getCurrentPosition(
        this._loadMap.bind(this),
        function () {
          alert("i coudn't get the location 😕");
        }
      );
  }

  _loadMap(position) {
    //console.log(postion); //GeolocationPosition { coords: GeolocationCoordinates, timestamp: 1631119154899 }
    //now lets get the alltitude and longtude since we get the cordinate from the browser
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    console.log(latitude, longitude);
    console.log(`https://www.google.com/maps/@${latitude},-${longitude}`); //our current location

    const coords = [latitude, longitude]; // we create array cord  which gives as our location

    //////230. Displaying a Map Using Leaflet Library
    //Leaflet Library is an open-source JavaScript libraryfor mobile-friendly interactive maps
    // and in this section we will include the  Using a Hosted Version of Leaflet   we will copy from the website and will put in the head of our html file

    this.#map = L.map("map").setView(coords, 13); //we change var with const const  and     [51.505, -0.09] with coords   and also 13 is like zoomin and zoom out we will change it and we will inspect on the map

    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);
    //we comment out the code below

    //L.marker(coords) //[51.505, -0.09] with coords
    // .addTo(map)
    // .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
    // .openPopup();
    ////////////231. Displaying a Map Marker
    //So in this video we're gonna display a marker  wherever we click on the map.

    //we rendered(displayed) the form  when we click the map
    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden"); //when we click on the map the form is rendered or opened in the left side  becouse it was hidden in the html and we remove it
    inputDistance.focus();
  }

  _getLocalStorage() {}

  _toggleElevationField() {
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkOut(e) {
    e.preventDefault();

    //clear input field

    inputCadence.value =
      inputDistance.value =
      inputDuration.value =
      inputElevation.value =
        "";

    //by using this we display all markers that we click

    //console.log(mapEvent); //we will get the cliked event in that particular location
    const { lat, lng } = this.#mapEvent.latlng; //we destracturing      lat and lang  stands for latitude and longutude
    //L.marker([lat, lng]).addTo(map).bindPopup("working out").openPopup(); //working out is displays with the marker
    L.marker([lat, lng])
      .addTo(this.#map) //map and mapEvent   are out of scope  we need to make the  global variable  to access every where
      .bindPopup(
        L.popup({
          //get this from liflet
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "running-popup",
        })
      )
      .setPopupContent("working out") //this method is from lieflet
      .openPopup();
  }
}

//we create app object from the class
const app = new App();
