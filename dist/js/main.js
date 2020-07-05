var vehiclesArray = [];

// INITIALISE ---------------------------------------------------------------- // 

function init() {
    $.getJSON('/dist/json/vehicles.json', function(data) {
        vehiclesArray = data.vehicles;
    });
    initValidation();
};



// VALIDATE FORM ------------------------------------------------------------- //

function initValidation() {
    
}


// RUN ----------------------------------------------------------------------- // 
init();
