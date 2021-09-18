"use strict";

//watch video 234
///we are going to refactor this mapty Appp

//we are creating an app called MAPTY that  shows every exerscise we did in the map and the list

///////Managing workout Data: Creating Classes

class Workout {
  date = new Date();
  id = (Date.now() + " ").slice(-10);
  clicks = 0;

  constructor(coords, distance, duration) {
    this.distance = distance; //km
    this.duration = duration; //min
    this.coords = coords; //[latitude longtiude]
  }

  click() {
    //this is to show public Api  we can count the number of clicks
    this.clicks++;
  }
  _setDiscription() {
    // prettier-ignore
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${
      months[this.date.getMonth()]
    } ${this.date.getDate()}`;
  }
}

//create class running  and inherit from parent class workout
class Running extends Workout {
  type = "running";
  constructor(coords, distance, duration, Cadence) {
    super(coords, distance, duration);
    this.Cadence = Cadence;

    //so we can call the calPace() method from the constructor
    this.calcPace();
    this._setDiscription();
  }
  //create method clacPace
  calcPace() {
    this.pace = this.duration / this.distance; //min/km
    return this.pace;
  }
}

//create class Cycling and inherit from parent class workout
class Cycling extends Workout {
  type = "cycling";
  constructor(coords, distance, duration, elevationGain) {
    super(coords, distance, duration);
    this.elevationGain = elevationGain;
    //so we can call the calcSpeed() method from the constructor
    this.calcSpeed();
    this._setDiscription();
  }
  //create method CalcSpeed
  calcSpeed() {
    this.speed = this.distance / (this.duration / 60); //km/min
    return this.speed;
  }
}

//lets create objects now

//const run1 = new Running(10, 60, [37, 120], 178);
//const cycling1 = new Cycling(30, 60, [37, 120], 178);

//console.log(run1); //Object { date: Date Sat Sep 11 2021 08:51:40 GMT-0700 (Pacific Daylight Time), id: "375500252 ", distance: 10, duration: 60, coords: (2) […], Cadence: 178, pace: 6 }
//console.log(cycling1); //Object { date: Date Sat Sep 11 2021 08:52:15 GMT-0700 (Pacific Daylight Time), id: "375535436 ", distance: 30, duration: 60, coords: (2) […], elevationGain: 178, speed: 30 }

/////////////////////////////////APP Architecture
//lets create App class
const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputDistance = document.querySelector(".form__input--distance");
const inputElevation = document.querySelector(".form__input--elevation");

class App {
  #map;
  #mapEvent;
  #workouts = [];
  #zoom = 13;
  constructor() {
    //get postion
    this._getPosition();

    //get local storage
    this._getLocalStorage();

    /////attache event handlers
    //then we will sumbmit the form

    form.addEventListener("submit", this._newWorkOut.bind(this));

    //this will change element in  the input  when one is displayed the other one hidden  in tis case the  cycling(cadance) and runing (elevetion gain)interchanching
    inputType.addEventListener("change", this._toggleElevationField);

    //. Move  map to Marker On Click

    containerWorkouts.addEventListener("click", this._popeUpMove.bind(this));
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
    //console.log(`https://www.google.com/maps/@${latitude},-${longitude}`); //our current location

    const coords = [latitude, longitude]; // we create array cord  which gives as our location

    //////230. Displaying a Map Using Leaflet Library
    //Leaflet Library is an open-source JavaScript libraryfor mobile-friendly interactive maps
    // and in this section we will include the  Using a Hosted Version of Leaflet   we will copy from the website and will put in the head of our html file

    this.#map = L.map("map").setView(coords, this.#zoom); //we change var with const const  and     [51.505, -0.09] with coords   and also 13 is like zoomin and zoom out we will change it and we will inspect on the map

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

    //this display the marker workout  to the map
    this.#workouts.forEach((work) => this._renderWorkOutMarker(work));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden"); //when we click on the map the form is rendered or opened in the left side  becouse it was hidden in the html and we remove it
    inputDistance.focus();
  }

  hideForm() {
    // Empty inputs
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        "";

    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => (form.style.display = "grid"), 1000);
  }

  _toggleElevationField() {
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  }

  _newWorkOut(e) {
    //helper function

    const isValidInput = (...inputs) =>
      inputs.every((inp) => Number.isFinite(inp));
    const isPostive = (...inputs) => inputs.every((inp) => inp > 0);

    e.preventDefault();

    //get input data from form

    const type = inputType.value; //  eather cycling or running
    const distance = +inputDistance.value; //we are input number    so  to change the string to number we add +    becouse wehen ever we input on the input field its a string
    const duration = +inputDuration.value; // + to make it number
    const { lat, lng } = this.#mapEvent.latlng;

    let workout;
    //if work out running create running object

    if (type === "running") {
      const cadence = +inputCadence.value;

      //test if the data is valid if not we will get the alert
      if (
        !isValidInput(distance, duration, cadence) ||
        !isPostive(distance, duration, cadence) //lets make a helper function  "isValid" that replace the commented code  in esier way
        //!Number.isFinite(distance) ||
        //!Number.isFinite(duration) ||
        //!Number.isFinite(cadence)
      )
        return alert("input should be  postive Number!");

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    //if work out running create running object
    if (type === "cycling") {
      const elevation = +inputElevation.value;
      if (
        !isValidInput(distance, duration, elevation) ||
        !isPostive(distance, duration) //we omit elevetion becouse elevetion could be  negative
      )
        //lets make a helper function  "isValid" that replace the commented code  in esier way

        return alert("input should be  postive Number!");

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    //add new object to workouts array
    this.#workouts.push(workout);

    //console.log(workout);
    this._renderWorkOutMarker(workout);

    //rendering(display) work out here
    this._renderWorkOut(workout);

    //clear input field
    this.hideForm();

    //storing the workouts
    this._setLocalStorage();
  }
  _renderWorkOutMarker(workout) {
    //by using this we display all markers that we click

    //console.log(mapEvent); //we will get the cliked event in that particular location
    //const { lat, lng } = this.#mapEvent.latlng; //we destracturing      lat and lang  stands for latitude and longutude
    //L.marker([lat, lng])renderWorkOutMarker(workout) {.addTo(map).bindPopup("working out").openPopup(); //working out is displays with the marker
    L.marker(workout.coords) //
      .addTo(this.#map) //map and mapEvent   are out of scope  we need to make the  global variable  to access every where
      .bindPopup(
        L.popup({
          //get this from liflet
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === "running" ? "🏃‍♂️" : "🚴"}${workout.description}`
      ) //this method is from lieflet
      .openPopup();
  }

  _renderWorkOut(workout) {
    let html = `<li class="workout workout--${workout.type}" data-id="${
      workout.id
    }">
    <h2 class="workout__title">${workout.description}</h2>
    <div class="workout__details">
      <span class="workout__icon">${
        workout.type === "running" ? "🏃‍♂️" : "🚴"
      }</span>
      <span class="workout__value">${workout.distance}</span>
      <span class="workout__unit">km</span>
    </div>
    <div class="workout__details">
      <span class="workout__icon">⏱</span>
      <span class="workout__value">${workout.duration}</span>
      <span class="workout__unit">min</span>
    </div>
    `;

    if (workout.type === "running")
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.pace.toFixed(1)}</span>
    <span class="workout__unit">min/km</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">👣</span>
    <span class="workout__value">${workout.cadence}</span>
    <span class="workout__unit">spm</span>
  </div>
</li>
`;

    if (workout.type === "cycling")
      html += `<div class="workout__details">
    <span class="workout__icon">⚡️</span>
    <span class="workout__value">${workout.speed.toFixed(1)}</span>
    <span class="workout__unit">km/h</span>
  </div>
  <div class="workout__details">
    <span class="workout__icon">⛰</span>
    <span class="workout__value">${workout.elevationGain}</span>
    <span class="workout__unit">m</span>
  </div>
</li>`;

    form.insertAdjacentHTML("afterend", html);
  }

  //when we click  at the workout then we get the map zoomed to the desiered  location
  _popeUpMove(e) {
    const workoutEl = e.target.closest(".workout");
    console.log(workoutEl);
    if (!workoutEl) return;

    const workout = this.#workouts.find(
      (work) => work.id == workoutEl.dataset.id
    );
    console.log(workout);

    this.#map.setView(workout.coords, this.#zoom, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
    workout.click();
  }

  _setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.#workouts)); //setItem(key: string, value: string): void      //stringify(this.#workouts)    changes objects or arrays to string
  }

  //this method  will (render)give us the stored  workout data  in the screen even if we refresh it
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("workouts")); //JSON.parse  will convert the string that stored in the local storage to  objects   //  like vise versa with the above    _setLocalStorage()  method
    console.log(data); //this will give as data in objects becouse we changed the string to objects by  JSON.parse()

    if (!data) return; //guard element       //if there is not data  return

    this.#workouts = data;
    // console.log(this.#workouts);//will give us the array of object that created
    this.#workouts.forEach((work) => this._renderWorkOut(work));
  }
}

//we create app object from the class
const app = new App();
