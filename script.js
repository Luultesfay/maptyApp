"use strict";

//we are creating an app called MAPTY that  shows every exerscise we did in the map and the list

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputElevation = document.querySelector(".form__input--elevation");

//<--!we added CDN link of liflet library and add differ manually--->  in the html file that the code we got from library
///////////229. Using the Geolocation API
//to get the location   using navigator.Geolocation  which is the api
if (navigator.geolocation)
  //if the browser have this geolocation then we implement the code below
  navigator.geolocation.getCurrentPosition(
    function (position) {
      //console.log(postion); //GeolocationPosition { coords: GeolocationCoordinates, timestamp: 1631119154899 }
      //now lets get the alltitude and longtude since we get the cordinate from the browser
      const { latitude } = position.coords;
      const { longitude } = position.coords;
      console.log(latitude, longitude);
      console.log(`https://www.google.com/maps/@${latitude},-${longitude}`); //our current location

      const coords = [latitude, longitude]; // we create array cord

      const map = L.map("map").setView(coords, 13); //we change var with const const  and     [51.505, -0.09] with coords   and also 13 is like zoomin and zoom out we will change it and we will inspect on the map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker(coords) //[51.505, -0.09] with coords
        .addTo(map)
        .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
        .openPopup();
    },
    function () {
      alert("i coudnt get the location 😕");
    }
  );

//////230. Displaying a Map Using Leaflet Library
//Leaflet Library is an open-source JavaScript libraryfor mobile-friendly interactive maps
// and in this section we will include the  Using a Hosted Version of Leaflet   we will copy from the website and will put in the head of our html file
