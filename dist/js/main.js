var vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

function init () {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
        displayVehicles(vehiclesArray);
    });
};



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
    $('.icon').on('click hover', function() {
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
