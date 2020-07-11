var vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

$(function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayIconList(vehiclesArray);
    });
});

// FILTERING BY INPUT -------------------------------------------------------- //

$('#user-input').on('keyup', function() {
    var form = $(this)[0];
    initValidation(form);
    addSearchListeners(form);
});

// VALIDATE FORM ------------------------------------------------------------- //

function initValidation (form) {

    let isError = false;
    const elements = form.elements;

    $.each(elements, function (i, field) {        
        if (!isFieldValid(field)) {
            isError === true;
        };
    });

    function isFieldValid(field) {
        if (!needsValidation(field)) {
            return true;
        }
        var errorSpan = document.querySelector('#' + field.id + '-error');
        field.classList.remove('invalid');
        errorSpan.classList.remove('danger');
        errorSpan.innerHTML = '';
    
        if (!validateNumber(field, errorSpan)) {
            return false;
        }
        return true;
    };
    
    function validateNumber (field, errorSpan) {
        if (!isNumber(field.value)) {
            alert('Please type number only!');
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

    function addErrorSpan(field, errorSpan) {
        field.classList.add('invalid'); 
        errorSpan.classList.add('danger');
    }
    
    function isNumber(input) {
        return /^[0-9]*$/.test(input);
    };

    function needsValidation(field) {
        return ['submit', 'reset', 'button', 'hidden', 'fieldset'].indexOf(field.type) === -1;
    };
}

// DISPLAY ICON LIST --------------------------------------------------------- //

function displayIconList (vehicles) {
    const el_vehicleIcon = $('.landing__icons');
    var iconHTML = '';

    $.each(vehicles, function (i, vehicle) {
        iconHTML += makeIconHTML(vehicle);
    });
    el_vehicleIcon.html(iconHTML);
    addIconClickListener();
}

function makeIconHTML (vehicle) {
    return `
    <div class="icon" data-id="${vehicle.id}">
        <img src="/dist/image/icon${vehicle.id}.png" alt="${vehicle.title}">
        <p></p>
    </div>
    `
}

function addIconClickListener () {
    $('.icon').on('click', function() {
        var id = $(this).data('id');
        viewVehicleInfo(id);
    });
}

// FILTER BY INPUT ----------------------------------------------------------- //

function addSearchListeners() {
    var day = ($('input[name=traveldays]').val()) * 1;
    var traveler = ($('input[name=travelers]').val()) * 1;

    var matches = [];
    $.each(vehiclesArray, function(i, vehicle) {
        if ( vehicle.day.includes(day) && vehicle.traveler.includes(traveler) ) {
            matches.push(vehiclesArray[i]);
        } 
        // else {alert('hi');}
    });
    displayIconList(matches);
    displayVehicles(matches);
}


// VIEW VEHICLES ------------------------------------------------------------- //

function viewVehicleInfo (id) {
    $.each(vehiclesArray, function(i, vehicle) {
        if (vehicle.id == id) {
            let vehicle = vehiclesArray[i].traveler;
            let maxTraveler = Math.max.apply(null, vehicle);
            let minTraveler = Math.min.apply(null, vehicle);

            $('.landing__info').html(minTraveler + " ~ " + maxTraveler + " people");
        };
    });
}

// SWICH SCREEN -------------------------------------------------------------- //


function initScreens () {
    const el_screens = $('.screen');
    nextToScreen(event, el_screens);
    backToScreen(event, el_screens)
    el_screens.slice(1).hide();    
}

function nextToScreen(event, el_screens) {
    let index = 0;
    $('input:submit').on('click', function(event){
        event.preventDefault();
        el_screens.hide();
        index++;
        $('.screen--'+index).show();
    });
}

function backToScreen(event, el_screens) {
    $('input:button').on('click', function(event){
        event.preventDefault();
        el_screens.hide();
        index--;
        $('.screen--'+index).show();
    });
}


// DISPLAY VEHICLES ---------------------------------------------------------- //
function displayVehicles (vehicles) {

    const el_vehicleList = $('.content');
    var vehicleHTML = '';

    $.each(vehicles, function (i, vehicle) {
        vehicleHTML += makevehicleHTML(vehicle);
    });
    el_vehicleList.html(vehicleHTML);
    initScreens();
}

function makevehicleHTML (vehicle) {
    return `
    <div class="content__box">
        <img src="/dist/image/icon${vehicle.id}.png" alt="${vehicle.title}">
        <h3>${vehicle.title}</h3>
        <div></div>
        <input type="submit" value="Select it">
    </div>
    `
}
