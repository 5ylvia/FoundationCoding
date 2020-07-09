var vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayVehicles(vehiclesArray);
    });
    addSearchListeners();
};

// KEYUP EVENT FOR FILTERING ------------------------------------------------- //


$('#user-input').on('keyup', function() {

    initValidation($(this)[0]);
    addSearchListeners($(this)[0]);
});

// VALIDATE FORM ------------------------------------------------------------- //

function initValidation (form) {

    let isError = false;
    const elements = form.elements;

    $.each(elements, function (i, field) {
        // let field = elements[i];
        
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
        if ( field.id === "traveler" && (field.value < 1 || field.value > 6) ) {
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

// DISPLAY VEHICLES ---------------------------------------------------------- //

function displayVehicles (vehicles) {
    const el_vehicleIcon = $('.landing__icons');
    var iconHTML = '';

    // const el_vehicleList = $('.');
    // var listHTML = '';

    $.each(vehicles, function (i, vehicle) {
        iconHTML += makeIconHTML(vehicle);
        // listHTML += makeListHTML(vehicle);
    });
    el_vehicleIcon.html(iconHTML);
    // el_vehicleList.html(listHTML);
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
    });
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
        }
    })
}


// RUN ----------------------------------------------------------------------- // 
init();
