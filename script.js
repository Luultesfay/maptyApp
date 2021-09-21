"use strict";
/*
//we are creating an app called MAPTY that  shows every exerscise we did in the map and the list

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDuration = document.querySelector(".form__input--duration");
const inputCadence = document.querySelector(".form__input--cadence");
const inputDistance = document.querySelector(".form__input--distance");
const inputElevation = document.querySelector(".form__input--elevation");

let map, mapEvent;

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

      const coords = [latitude, longitude]; // we create array cord  which gives as our location

      //////230. Displaying a Map Using Leaflet Library
      //Leaflet Library is an open-source JavaScript libraryfor mobile-friendly interactive maps
      // and in this section we will include the  Using a Hosted Version of Leaflet   we will copy from the website and will put in the head of our html file

      map = L.map("map").setView(coords, 13); //we change var with const const  and     [51.505, -0.09] with coords   and also 13 is like zoomin and zoom out we will change it and we will inspect on the map

      L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
      //we comment out the code below

      //L.marker(coords) //[51.505, -0.09] with coords
      // .addTo(map)
      // .bindPopup("A pretty CSS3 popup.<br> Easily customizable.")
      // .openPopup();
      ////////////231. Displaying a Map Marker
      //So in this video we're gonna display a marker  wherever we click on the map.

      //we rendered(displayed) the form  when we click the map
      map.on("click", function (mapE) {
        mapEvent = mapE;
        form.classList.remove("hidden"); //when we click on the map the form is rendered or opened in the left side  becouse it was hidden in the html and we remove it
        inputDistance.focus();
      });
    },
    function () {
      alert("i coudn't get the location 😕");
    }
  );

//then we will sumbmit the form

form.addEventListener("submit", function (e) {
  e.preventDefault();

  //clear input field

  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      "";

  //by using this we display all markers that we click

  //console.log(mapEvent); //we will get the cliked event in that particular location
  const { lat, lng } = mapEvent.latlng; //we destracturing      lat and lang  stands for latitude and longutude
  //L.marker([lat, lng]).addTo(map).bindPopup("working out").openPopup(); //working out is displays with the marker
  L.marker([lat, lng])
    .addTo(map) //map and mapEvent   are out of scope  we need to make the  global variable  to access every where
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
    .setPopupContent("working out") //this method is from lief let
    .openPopup();
});
//this willchange element in the in the input  when one is displayed the other one hidden  in tis case the  cycling(cadance) and runing (elevetion gain)interchanching
inputType.addEventListener("change", function () {
  inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
  inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
});
*/
///example of asyncreous  js
console.log(`1.order food`);
setTimeout(function () {
  console.log(`thank you for watiing here is your food`);
}, 2000);

console.log("wait for your food it will arrive shortly ");

///palindrom

const testPalendroom = function (str) {
  let strSplitRiverseJoin = str.split("").reverse().join("");
  console.log(strSplitRiverseJoin);

  if (str === strSplitRiverseJoin) {
    console.log(`${str} is palindrrom`);
  } else {
    console.log(`${str} is not palindrrom`);
  }
};

testPalendroom("lulul");
testPalendroom("luula");

//fubonacci code   01 1 2 3 5 8 ...
