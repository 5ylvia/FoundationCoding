let vehiclesArray = [];
let locationsArray = [];

let userDetail = {};

// INITIALISE ---------------------------------------------------------------- // 

$(function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayIconList(vehiclesArray);
    });
    initFilter();

    // initScreens();
    // addLogoClickListener();

    $.getJSON('/dist/json/locations.json', function(data) {
        locationsArray = data.locations;
    });

});


// VALIDATE FORM ------------------------------------------------------------- //

function initValidation (form) {

    let isError = false;
    const inputs = form.elements;

    $.each(inputs, function (i, field) {
        if (!isFieldValid(field)) {
            isError === true;
        };
    });

    function isFieldValid(field) {
        if (!needsValidation(field)) {
            return true;
        }
        let errorSpan = document.querySelector('#' + field.id + '-error');
        field.classList.remove('invalid');
        errorSpan.classList.remove('danger');
        errorSpan.innerHTML = '';

        if (isFilled(field, errorSpan) === false) {
            return false;
        }
        if (validateNumber(field, errorSpan) === false) {
            return false;
        }
        if (validateLocation(field, errorSpan) === false) {
            return false;
        }
        return true;
    };

    function isFilled(field, errorSpan) {
        if (field.value.trim() === '') {
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "This field is required";
            return false;
        }
    }
    function validateNumber (field, errorSpan) {
        if (form.id === "user-input" && !isNumber(field.value)) {
            alert('Please type number only!');
            field.value = '';
            return false;
        }
        if ( field.id === "traveldays" && (field.value < 1 || field.value > 15) ) {
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please enter a 1-15 days";
            return false;
        }
        if ( field.id === "travelers" && (field.value < 1 || field.value > 6) ) {
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please enter a 1-6 people";
            return false;
        }
    }

    function validateLocation (field, errorSpan) {
        if (form.id === "location-input" && isNumber(field.value)) {
            alert('Please type text only!');
            return false;
        }
        if ( form.id === "location-input" && !isLocation(field.value)) {
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please select one of the options";
            return false;
        }
        if ( form.id === "location-input" && form[0].value === form[1].value ) {
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please select a different option";
            return false;
        }
    }

    function isLocation (input) {
        const locations = locationsArray;
        for (let i = 0; i < locations.length; i++) {
            if (locations[i].title === input) {
                return true;
            }
        }
    }

    function isNumber (input) {
        return /^[0-9]*$/.test(input);
    }

    function addErrorSpan (field, errorSpan) {
        field.value = '';
        field.classList.add('invalid'); 
        errorSpan.classList.add('danger');
    }

    function needsValidation(field) {
        return ['submit', 'reset', 'button', 'hidden', 'fieldset'].indexOf(field.type) === -1;
    }

    // if (isError === false) {
    //     displayUserDetail();
    // }
}


// FILTERING BY INPUT -------------------------------------------------------- //

function initFilter() {
    $('form').on('keyup click', function(e) {
        e.preventDefault();
        $('.top__text').html('');
        let form = $(this)[0];
        initValidation(form);
        addFilterListener(form);
    });
    $('#user-input').on('submit', function(e) {
        e.preventDefault();

        // addSearchListeners(form);
    });
}

// DISPLAY ICON LIST --------------------------------------------------------- //

function displayIconList (vehicles) {
    const el_vehicleIcon = $('.top__icons');
    let iconHTML = '';

    $.each(vehicles, function (i, vehicle) {
        iconHTML += makeIconHTML(vehicle);
    });
    el_vehicleIcon.html(iconHTML);
    addIconClickListener();
}

function makeIconHTML (vehicle) {
    return `
    <div class="icon" data-iconid="${vehicle.id}">
        <img src="/dist/image/icon${vehicle.id}.png" alt="${vehicle.title}">
        <p></p>
    </div>
    `
}

function addIconClickListener () {
    $('.icon').on('click', function() {
        let id = $(this).data('iconid');
        viewVehicleInfo(id);
    });
}

// VIEW VEHICLES INFO -------------------------------------------------------- //

function viewVehicleInfo (id) {
    $.each(vehiclesArray, function(i, vehicle) {
        if (vehicle.id == id) {
            let vehicle = vehiclesArray[i];
            makeInfoHTML(vehicle);
        };
    });
}

function makeInfoHTML (vehicle) {
    let maxTraveler = Math.max.apply(null, vehicle.traveler);
    let minTraveler = Math.min.apply(null, vehicle.traveler);

    let maxDay = Math.max.apply(null, vehicle.day);
    let minDay = Math.min.apply(null, vehicle.day);

    const text = $('.top__text')

    if (maxTraveler == 1) {
        text.html(maxTraveler + " person | " + minDay + " ~ " + maxDay + "days"); 
    } else {
        text.html(minTraveler + " ~ " + maxTraveler + " people | " + minDay + " ~ " + maxDay + "days");
    }
}
// FILTER BY INPUT ----------------------------------------------------------- //

function addFilterListener() {
    let day = ($('input[name=traveldays]').val()) * 1;
    let traveler = ($('input[name=travelers]').val()) * 1;


    let matches = [];
    $.each(vehiclesArray, function(i, vehicle) {
        if ( vehicle.day.includes(day) && vehicle.traveler.includes(traveler) ) {
            matches.push(vehiclesArray[i]);
        }
    });
    if (matches.length == 0) {
        alert ('No matches! Try different number.');
    }
    getVehiclesByFiltering(matches);
    displayVehicles(matches);
}

function getVehiclesByFiltering(matches) {
    $('div[data-iconId]').removeClass( 'highlight' );

    for (let i = 0; i < matches.length; i++) {
        let vehicle = matches[i];
        switch (vehicle.id) {
            case 1:
                $('div[data-iconId="1"]').addClass( 'highlight' );
              break;
            case 2:
                $('div[data-iconId="2"]').addClass( 'highlight' );
                break;
            case 3:
                $('div[data-iconId="3"]').addClass( 'highlight' );
              break;
            case 4:
                $('div[data-iconId="4"]').addClass( 'highlight' );
                break;
          }
    };
}



// DISPLAY VEHICLES ---------------------------------------------------------- //

function displayVehicles (vehicles) {
    const el_vehicleList = $('.page__contents');
    let vehicleHTML = '';

    $.each(vehicles, function (i, vehicle) {
        vehicleHTML += makeVehicleHTML(vehicle);
    });
    el_vehicleList.html(vehicleHTML);
    // initScreens();
}

function makeVehicleHTML (vehicle) {
    return `
    <div class="vehicle">
        <img src="/dist/image/icon${vehicle.id}.png" alt="${vehicle.title}">
        <h3>${vehicle.title}</h3>
        <div>NZD ${vehicle.cost}/day ${vehicle.feul}/100km</div>
        <div class="form__group">
            <input data-next="1" data-id="${vehicle.id}" type="submit" value="Select it">
        </div>
    </div>
    `
}




// function getVehiclesInput () {

// }

// function 

// // DISPLAY INPUT ------------------------------------------------------------- //

// function displayUserDetail () {
//     getUserDetail();
//     $('.top__traveldays').html(userDetail.travelDay + "days");
//     $('.top__travelers').html(userDetail.travelers + "people");    
// }

// function getUserDetail () {
//     userDetail.travelDay = $('#traveldays').val();
//     userDetail.travelers = $('#travelers').val();
// }





// SWICH SCREEN -------------------------------------------------------------- //

// function initScreens () {
//     const el_screens = $('.screen');
//     nextToScreen(el_screens);
//     backToScreen(el_screens);
//     el_screens.slice(1).hide();
// }

// function nextToScreen(el_screens) {
//     $(':submit').off().on('click', function(event){
//         event.preventDefault();
//         el_screens.hide();
//         const currentIndex = $(this).data('next');
//         const nextIndex = currentIndex + 1;
//         $(el_screens[nextIndex]).show();
//         getUserDetail();
//     });
// }


// function backToScreen(el_screens) {
//     $('.back').off().on('click', function(event){
//         event.preventDefault();
//         el_screens.hide();
//         const currentIndex = $(this).data('back');
//         const backIndex = currentIndex - 1;
//         $(el_screens[backIndex]).show();
//     });
// }

// function addLogoClickListener () {
//     const el_screens = $('.screen');
//     $('.header__logo').click(function() {
//         el_screens.slice(0,1).show();
//     })
// }

// DISPLAY MAP --------------------------------------------------------------- //

// var mymap = L.map('map').setView([51.505, -0.09], 5);

// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: 'pk.eyJ1IjoiNXYiLCJhIjoiY2tiaXhjNnFqMGhseTJ5azAycDlmZm05aCJ9.JYtaCI63YUbc0RzpP4GeXA'
// }).addTo(mymap);



// displayMap();

// function displayMap() {
//     mapboxgl.accessToken = 'pk.eyJ1IjoiNXYiLCJhIjoiY2tiaXhjNnFqMGhseTJ5azAycDlmZm05aCJ9.JYtaCI63YUbc0RzpP4GeXA';
//     var map = new mapboxgl.Map({
//     container: 'map',
//     style: 'mapbox://styles/mapbox/streets-v11', // stylesheet location
//     center: [174.792, -36.859], // starting position [lng, lat]
//     zoom: 9 // starting zoom
//     });    
// }