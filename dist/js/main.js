let vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

$(function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayIconList(vehiclesArray);
    });
    initScreens();
});

// FILTERING BY INPUT -------------------------------------------------------- //

$('#user-input').on('keyup', function() {
    $('.landing__info').html('');
    let form = $(this)[0];
    initValidation(form);
    addSearchListeners(form);
});

// DISPLAY INPUT ------------------------------------------------------------- //


$('#user-input').on('submit', function() {
    
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
    let iconHTML = '';

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
        let id = $(this).data('id');
        viewVehicleInfo(id);
    });
}

// FILTER BY INPUT ----------------------------------------------------------- //

function addSearchListeners() {
    let day = ($('input[name=traveldays]').val()) * 1;
    let traveler = ($('input[name=travelers]').val()) * 1;

    let matches = [];
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
    nextToScreen(el_screens);
    backToScreen(el_screens);
    el_screens.slice(1).hide();    
}

function nextToScreen(el_screens) {
    $(':submit').off().on('click', function(event){
        event.preventDefault();
        el_screens.hide();
        const currentIndex = $(this).data('next');
        const nextIndex = currentIndex + 1;
        $(el_screens[nextIndex]).show();
    });
}

function backToScreen(el_screens) {
    $(':button').off().on('click', function(event){
        event.preventDefault();
        el_screens.hide();
        const currentIndex = $(this).data('back');
        const backIndex = currentIndex - 1;
        $(el_screens[backIndex]).show();
    });
}

// DISPLAY VEHICLES ---------------------------------------------------------- //
function displayVehicles (vehicles) {

    const el_vehicleList = $('.content');
    let vehicleHTML = '';

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
        <div>NZD ${vehicle.cost}/day ${vehicle.feul}/100km</div>
        <input data-next="1" type="submit" value="Select it">
    </div>
    `
}
