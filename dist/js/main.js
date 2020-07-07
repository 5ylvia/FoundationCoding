var vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayVehicles(vehiclesArray);
    });

    initValidation();
};

// VALIDATE FORM ------------------------------------------------------------- //

function initValidation () {

    const el_form = $('#form--user');
    el_form.on('keyup', function() {

        var isError = false;
        var elements = el_form[0].elements;
        
        $.each(elements, function (i, field) {
            if (!isFieldValid(field)) {
                isError = true;
            };
        });
    });

    function isFieldValid(field) {
        if (!needsValidation(field)) {
            return true;
        }
        var errorSpan = document.querySelector('#' + field.id + '-error');
        field.classList.remove('invalid');
        errorSpan.classList.remove('danger');
        errorSpan.innerHTML = '';
    
        if (validateNumber(field, errorSpan) === false) {
            return false;
        }
        return true;
    };
    
    function validateNumber (field, errorSpan) {
        if (!isNumber(field.value)) {
            alert('Please type number only!');
            return false;
        }
        if (field.id === "traveldays" && field.value > 15) {
            field.classList.add('invalid'); 
            var errorSpan = document.querySelector('#' + field.id + '-error');
            errorSpan.classList.add('danger');
            errorSpan.innerHTML = "Please enter a 1-15 days";
            return false;
        }
        if (field.id === "travlers" && field.value > 6) {
            field.classList.add('invalid'); 
            var errorSpan = document.querySelector('#' + field.id + '-error');
            errorSpan.classList.add('danger');
            errorSpan.innerHTML = "It only available for a 1-6 people";
            return false;
        }
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
    let el_vehicleList = $('.landing__icons');
    var html = '';
    $.each(vehicles, function (i, vehicle) {
        html += makeListHTML(vehicle);
    });
    el_vehicleList.html(html);
    addIconClickListener();
}

function makeListHTML (vehicle) {
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

// VIEW VEHICLES ------------------------------------------------------------- //


function viewVehicleInfo (id) {
    $.each(vehiclesArray, function(i, vehicle) {
        if (vehicle.id == id) {
            let vehicle = vehiclesArray[i];
            $('.landing__info').html(vehicle.mintraveler + " ~ " + vehicle.maxtraveler + " people");
        }
    })
}



// RUN ----------------------------------------------------------------------- // 
init();
