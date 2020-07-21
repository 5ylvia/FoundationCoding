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
    initScreens();

    $.getJSON('/dist/json/locations.json', function(data) {
        locationsArray = data.locations;
        initMap(locationsArray);


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
        // if (validateLocation(field, errorSpan) === false) {
        //     return false;
        // }
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
            field.value = '';
            alert('Please type number only!');
            return false;
        }
        if ( field.id === "traveldays" && (field.value < 1 || field.value > 15) ) {
            field.value = '';
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please enter a 1-15 days";
            return false;
        }
        if ( field.id === "travelers" && (field.value < 1 || field.value > 6) ) {
            field.value = '';
            addErrorSpan(field, errorSpan);
            errorSpan.innerHTML = "Please enter a 1-6 people";
            return false;
        }
    }

    // function validateLocation (field, errorSpan) {
    //     if (form.id === "location-input" && isNumber(field.value)) {
    //         field.value = '';
    //         alert('Please type text only!');
    //         return false;
    //     }
    //     if ( form.id === "location-input" && !isLocation(field.value)) {
    //         addErrorSpan(field, errorSpan);
    //         errorSpan.innerHTML = "Please select one of the options";
    //         return false;
    //     }
    //     if ( form.id === "location-input" && form[0].value === form[1].value ) {
    //         addErrorSpan(field, errorSpan);
    //         errorSpan.innerHTML = "Please select a different option";
    //         return false;
    //     }
    // }

    // function isLocation (input) {
    //     const locations = locationsArray;
    //     for (let i = 0; i < locations.length; i++) {
    //         if (locations[i].title === input) {
    //             return true;
    //         }
    //     }
    // }

    function isNumber (input) {
        return /^[0-9]*$/.test(input);
    }

    function addErrorSpan (field, errorSpan) {
        field.classList.add('invalid'); 
        errorSpan.classList.add('danger');
    }

    function needsValidation(field) {
        return ['submit', 'reset', 'button', 'hidden', 'fieldset'].indexOf(field.type) === -1;
    }

    if (isError === false) {
        displayUserDetail();
    }
}


// INIT FILTER --------------------------------------------------------------- //

function initFilter() {
    $("#user-input").on('keyup select change', function(e) {
        e.preventDefault();
        let form = $(this)[0];
        $('.top__text').html('');
        initValidation(form);
        addFilterListener(form); 
    });
}

// DISPLAY ICON LIST --------------------------------------------------------- //

function displayIconList (vehicles) {
    const el_vehicleIcon = $('.top__icons');
    let iconHTML = '';

    $.each(vehicles, function (i, icon) {
        iconHTML += makeIconHTML(icon);
    });
    el_vehicleIcon.html(iconHTML);
    addIconClickListener();
}

function makeIconHTML (icon) {
    return `
    <div class="icon" data-iconid="${icon.id}">
        <img src="image/icon${icon.id}.png" alt="${icon.title}">
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
        text.html(maxTraveler + " person | " + minDay + " ~ " + maxDay + " days"); 
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
    if ( matches.length == 0 && (!!day && !!traveler) ) {
        alert('No matches! Try different number.');
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
    addVehicleClickEvent();
}

function makeVehicleHTML (vehicle) {
    return `
    <div class="vehicle">
        <img src="image/icon${vehicle.id}.png" alt="${vehicle.title}">
        <h3>${vehicle.title}</h3>
        <div>NZD ${vehicle.cost}/day  |  ${vehicle.feul}L/100km</div>
        <div class="form__group">
            <input class="vehicle-btn" data-id="${vehicle.id}" type="submit" value="Select it">
        </div>
    </div>
    `
}


// DISPLAY INPUT BY SUMBITING ------------------------------------------------ //

function displayUserDetail () {
    addSubmitEvent();
    getUserInput();
    $('.top__traveldays').html(userDetail.traveldays + " days");
    $('.top__travelers').html(userDetail.travelers + " people");
}

function addSubmitEvent() {
    $('#submit-user').on('click', function(e) {
        e.preventDefault();
        let currentScreen = 1;
        switchScreen(currentScreen);
    });
}

function getUserInput() {
    userDetail.traveldays = ( $('#traveldays').val() ) * 1;
    userDetail.travelers = ( $('#travelers').val() ) * 1;
}


// GET AND DISPLAY SELECTED VEHICLE ------------------------------------------ //

function addVehicleClickEvent() {
    const btn = $('.vehicle-btn');
    btn.on('click', function(e) {
        e.preventDefault();
        getSelectedVehicle(e.target);
        let currentScreen = 2;
        switchScreen(currentScreen);
    });
}

function getSelectedVehicle(selected) {
    const id = ( selected.dataset.id ) * 1;
    userDetail.vehicleId = id;
    for (let i = 0; i < vehiclesArray.length; i++) {
        if (id === vehiclesArray[i].id) {
            const selectedVehicle = vehiclesArray[i];
            displaySelectedVehicle(selectedVehicle);
        }
    }
}

function displaySelectedVehicle(vehicle) {
    const imgSrc = "image/icon" + vehicle.id + ".png";
    $('.vehicle-icon').attr('src', imgSrc);
    $('.vehicle-title').html(vehicle.title);
    addFinalSubmitEvent();
}

// DISPLAY SELECT OPTIONS ---------------------------------------------------- //

function displayLocationOptions(locations) {
    $.each(locations, function(i, location) {
        $('select').append('<option data-location="' + location.id + '" value="' + location.title + '">' + location.title + '</option>');
    })
}

// DISPLAY MAP --------------------------------------------------------------- //

function initMap(locations) {
    displayLocationOptions(locations);

    const geoPoint = locations[0].coordinates;
    const mymap = L.map('map').setView(geoPoint, 9);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiNXYiLCJhIjoiY2tiaXhjNnFqMGhseTJ5azAycDlmZm05aCJ9.JYtaCI63YUbc0RzpP4GeXA'
    }).addTo(mymap);
    addSelectClickEvent();
}


// var marker = L.marker(geo, {
//     opacity:0.5
// }).addTo(mymap);

// marker.bindPopup('<h1>Header</h1>');

// distance(L.latLng(point), L.latLng(point))
// var a = map.distance(L.latLng(-36.85984517196145, 174.79248046875), L.latLng(-42.593532625649935, 172.3095703125));
// console.log(a);

// function getGeojson(locations) {
//     $.each(locations, function (i, location) {
//         getLocationInput();
//         if (userDetail.startpoint === location.title) {
//             let b = location.coordinates;
//             console.log(b);
//         };
//     });
// }
// function initCreateMaker() {
//     // $('#startpoint').on('click', function() {
//     //     console.log('click');
//     //     $.each(locations, function (i, location) {
//     //         getLocationInput();
//     //         if (userDetail.startpoint === location.title) {
//     //             let b = location.coordinates;
//     //             console.log(b);
//     //         };
//     //     });
//     // });

//     $('select').on('click', function() {
//         const point = $(this);
//         const selectedValue = point.val();
//         console.log(point);
//         console.log(point.id);
//         console.log(selectedValue);
//     })
// }


// GET LOCATION INPUT -------------------------------------------------------- //

function addSelectClickEvent() {
    $('select').on('click', function() {
        const select = $(this);
        getLocationInput(select);
        console.log(select.val());
        initCreateMaker(select.val());
    })
}

function getLocationInput(select) {
    const inputId = select.attr('id');
    userDetail[inputId] = select.val();
}

// CREATE MAKER -------------------------------------------------------------- //

// function initCreateMaker() {
//     $.each()
// }



// GET CONFIRMATION ---------------------------------------------------------- //

function addFinalSubmitEvent() {
    const btn = $('#submit-location');
    btn.on('click', function(e) {
        e.preventDefault();
        let currentScreen = 3;
        switchScreen(currentScreen);
        // displayConfirmation();
    });
}

// function displayConfirmation() {

// }


// SWICH SCREEN -------------------------------------------------------------- //

function initScreens () {
    const el_screens = $('.screen');
    el_screens.slice(1).hide();
    backToScreen(el_screens);
    addLogoClickListener();
}

function switchScreen(screen) {
    const el_screens = $('.screen');
    const nextScreen = screen + 1;
    el_screens.hide();
    el_screens.slice(screen,nextScreen).show();
}

function backToScreen(el_screens) {
    $('.back').off().on('click', function(event){
        event.preventDefault();
        el_screens.hide();
        const currentIndex = $(this).data('back');
        const backIndex = currentIndex - 1;
        $(el_screens[backIndex]).show();
    });
}

function addLogoClickListener () {
    const el_screens = $('.screen');
    $('.header__logo').click(function() {
        el_screens.slice(0,1).show();
    });
}



