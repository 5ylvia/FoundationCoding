let vehiclesArray = [];
let locationsArray = [];
let userDetail = {};

// INITIALISE ---------------------------------------------------------------- // 

$( function init () {
    $.getJSON( '/dist/json/vehicles.json', function ( data ) {
        vehiclesArray = data.vehicles;
    } );
    initFilter ();
    initScreens ();
    addIconClickListener ();

    $.getJSON( '/dist/json/locations.json', function ( data ) {
        locationsArray = data.locations;
        displayLocationOptions( locationsArray );
    } );
} );

// VALIDATE FORM ------------------------------------------------------------- //

function initValidation ( form ) {

    let isError = false;
    const inputs = form.elements;

    $.each( inputs, function ( i, field ) {
        if ( !isFieldValid( field ) ) {
            isError === true;
        }
    } );
    if ( isError === false ) {
        addFilterListener( form ); 
    }

    function isFieldValid ( field ) {
        if ( !needsValidation( field ) ) {
            return true;
        }
        let errorSpan = document.querySelector( '#' + field.id + '-error' );
        field.classList.remove( 'invalid' );
        errorSpan.classList.remove( 'danger' );
        errorSpan.innerHTML = '';

        if ( isFilled( field, errorSpan ) === false ) {
            return false;
        }
        if ( validateNumber( field, errorSpan ) === false ) {
            return false;
        }
        return true;
    };

    function isFilled ( field, errorSpan ) {
        if ( field.value.trim() === '' ) {
            addErrorSpan( field, errorSpan );
            errorSpan.innerHTML = "* This field is required";
            return false;
        }
    }
    function validateNumber ( field, errorSpan ) {
        if ( form.id === "user-input" && !isNumber( field.value ) ) {
            field.value = '';
            swal( "Oh noes!", 'Please type number only!', 'error' );
            return false;
        }
        if (  field.id === "traveldays" && ( field.value < 1 || field.value > 15 )  ) {
            addErrorSpan( field, errorSpan );
            errorSpan.innerHTML = "* Please enter a 1-15 days";
            return false;
        }
        if (  field.id === "travelers" && ( field.value < 1 || field.value > 6 )  ) {
            addErrorSpan( field, errorSpan );
            errorSpan.innerHTML = "* Please enter a 1-6 people";
            return false;
        }
    }

    function isNumber ( input ) {
        return /^[0-9]*$/.test( input );
    }

    function addErrorSpan ( field, errorSpan ) {
        field.value = '';
        field.classList.add( 'invalid' ); 
        errorSpan.classList.add( 'danger' );
    }

    function needsValidation ( field ) {
        return ['submit', 'reset', 'button', 'hidden', 'fieldset'].indexOf( field.type ) === -1;
    }

}


// INIT FILTER --------------------------------------------------------------- //

function initFilter () {
    $( "#user-input" ).on( 'keyup change', function( e ) {
        e.preventDefault();
        let form = $( this )[0];
        $( '.top__text' ).html( '' );
        initValidation( form );
    } );
}

// VIEW VEHICLES INFO -------------------------------------------------------- //

function addIconClickListener () {
    $( '.icon' ).on( 'click', function () {
        let id = $( this ).data( 'iconid' );
        viewVehicleInfo( id );
        $( '.top__text' ).fadeToggle();
    } );
}

function viewVehicleInfo ( id ) {
    $.each( vehiclesArray, function ( i, vehicle ) {
        if ( vehicle.id == id ) {
            let vehicle = vehiclesArray[i];
            makeInfoHTML( vehicle );
            viewVehiclePhoto ( vehicle );
        };
    } );
}

function makeInfoHTML ( vehicle ) {
    let maxTraveler = Math.max.apply( null, vehicle.traveler );
    let minTraveler = Math.min.apply( null, vehicle.traveler );

    let maxDay = Math.max.apply( null, vehicle.day );
    let minDay = Math.min.apply( null, vehicle.day );

    const text = $( '.top__text' )

    if ( maxTraveler == 1 ) {
        text.html( `<p>A person for ${minDay}-${maxDay} days</p>` );
    } else {
        text.html( `<p>${minTraveler}-${maxTraveler} people for ${minDay}-${maxDay} days</p>` );
    }
}


function viewVehiclePhoto ( vehicle ) {
    const imgSrc = "image/" + vehicle.id + ".png";
    $( '.hidden img' ).attr( {
        src: imgSrc,
        alt: vehicle.title,
    } );
}

// FILTER BY INPUT ----------------------------------------------------------- //

function addFilterListener () {
    let day = ( $( 'input[name=traveldays]' ).val() ) * 1;
    let traveler = ( $( 'input[name=travelers]' ).val() ) * 1;

    let matches = [];
    $.each( vehiclesArray, function( i, vehicle ) {
        if ( vehicle.day.includes( day ) && vehicle.traveler.includes( traveler )  ) {
            matches.push( vehiclesArray[i] );
        }
    } );
    getVehiclesByFiltering( matches );
    displayVehicles( matches );
    addSubmitEvent( matches );
}


function getVehiclesByFiltering ( matches ) {
    $( 'div[data-iconId]' ).removeClass( 'highlight'  );

    for ( let i = 0; i < matches.length; i++ ) {
        let vehicle = matches[i];
        switch ( vehicle.id ) {
            case 1:
                $( 'div[data-iconId="1"]' ).addClass( 'highlight'  ).fadeIn(1000);
              break;
            case 2:
                $( 'div[data-iconId="2"]' ).addClass( 'highlight'  );
                break;
            case 3:
                $( 'div[data-iconId="3"]' ).addClass( 'highlight'  );
              break;
            case 4:
                $( 'div[data-iconId="4"]' ).addClass( 'highlight'  );
                break;
          }
    };
}


// DISPLAY INPUT BY SUMBITING ------------------------------------------------ //

function addSubmitEvent ( matches ) {
    $( '#submit-user' ).off().on( 'click', function( e ) {
        e.preventDefault();
        if ( matches.length === 0  ) {
            swal( 'No matches!','Try different number.','warning' );
        } else {
            displayUserDetail();
            let currentScreen = 1;
            $( '.header__container' ).css('background-color', 'DimGray');
            switchScreen( currentScreen );   
        }
    } );
}

function displayUserDetail () {
    getUserInput();
    $( '.top__traveldays' ).html( userDetail.traveldays + " days" );
    $( '.top__travelers' ).html( userDetail.travelers + " people" );
}

function getUserInput () {
    userDetail.traveldays = ( $( '#traveldays' ).val()  ) * 1;
    userDetail.travelers = ( $( '#travelers' ).val()  ) * 1;
}


// DISPLAY VEHICLES ---------------------------------------------------------- //

function displayVehicles ( vehicles ) {
    const el_vehicleList = $( '.page__contents' );
    let vehicleHTML = '';

    $.each( vehicles, function ( i, vehicle ) {
        vehicleHTML += makeVehicleHTML( vehicle );
    } );
    el_vehicleList.html( vehicleHTML );
    addVehicleClickEvent();
}

function makeVehicleHTML ( vehicle ) {
    return `
    <div class="vehicle">
        <img src="image/${vehicle.id}.png" alt="${vehicle.title}">
        <h3>${vehicle.title}</h3>
        <p>NZD ${vehicle.cost}/day  |  ${vehicle.feul}L/100km</p>
        <div class="form__group">
            <input class="vehicle-btn" data-id="${vehicle.id}" type="submit" value="Select it">
        </div>
    </div>
    `
}



// GET AND DISPLAY SELECTED VEHICLE ------------------------------------------ //

function addVehicleClickEvent () {
    const btn = $( '.vehicle-btn' );
    btn.on( 'click', function( e ) {
        e.preventDefault();
        getSelectedVehicle( e.target );
        let currentScreen = 2;
        switchScreen( currentScreen );
        initMap( locationsArray );
    } );
}

function getSelectedVehicle ( selected ) {
    const id = ( selected.dataset.id  ) * 1;
    userDetail.vehicleId = id;
    for ( let i = 0; i < vehiclesArray.length; i++ ) {
        if ( id === vehiclesArray[i].id ) {
            const selectedVehicle = vehiclesArray[i];
            displaySelectedVehicle( selectedVehicle );
        }
    }
}

function displaySelectedVehicle ( vehicle ) {
    const imgSrc = "image/icon" + vehicle.id + ".png";
    $( '.vehicle-icon' ).attr( {
        src: imgSrc,
        alt: vehicle.title,
    } );
    $( '.vehicle-icon' ).css('height', '$h4');
    $( '.vehicle-title').html( vehicle.title );
    addFinalSubmitEvent();
}



// DISPLAY MAP --------------------------------------------------------------- //

function initMap ( locations ) {
    const container = L.DomUtil.get( 'map' );
    if( container != null ){ // Before initializing map check for is the map is already initiated or not
        container._leaflet_id = null;
    }

    const geoPoint = locations[4].coordinates;
    const map = L.map( 'map', {scrollWheelZoom: false} ).setView( geoPoint, 6 ).invalidateSize();
    L.tileLayer( 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'pk.eyJ1IjoiNXYiLCJhIjoiY2tiaXhjNnFqMGhseTJ5azAycDlmZm05aCJ9.JYtaCI63YUbc0RzpP4GeXA'
    } ).addTo( map );
    addSelectClickEvent( map );
}


// DISPLAY LOCATION OPTIONS -------------------------------------------------- //

function displayLocationOptions ( locations ) {
    // $( 'select' ).empty(); // Clear all childnodes before appending them.
    $( 'select' ).prepend( '<option>Select city</option>' );
    $( 'select option:eq[0]' ).prop( 'disabled',true );

    $.each( locations, function( i, location ) {
        $( 'select' ).append( `<option value="${location.title}">${location.title}</option>` );
    } );
}

function addSelectClickEvent ( map ) {
    $( 'select' ).on( 'change', function( e ) {
        e.preventDefault();
        const el_select = this;
        getLocationInput( map, el_select );
    } )
}

// GET LOCATION INPUT -------------------------------------------------------- //

function getLocationInput ( map, el_select ) {
    const selectId = $( el_select ).attr( 'id' ); // get the select Id
    userDetail[selectId] = el_select.value; // get and put the value to the userDetail array. 

    const result = locationsArray.find( location => location.title === el_select.value );
    const selectedGeo = result.coordinates;

    userDetail[selectId+'Geo'] = selectedGeo;
    createMakers( map, el_select, selectedGeo );
}


// CREATE MAKER -------------------------------------------------------------- //

function createMakers ( map, el_select, selectedGeo ) {
    marker = L.marker( selectedGeo ).addTo( map );
    const selectCity = el_select.value;

    map.flyTo( selectedGeo, 10 );
    marker.bindPopup( '<h4>' + selectCity + '</h4>' ).openPopup();
    calculateDistance( map, el_select );
}

function calculateDistance ( map, el_select ) {
    const startGeo = userDetail.startpointGeo;
    const endGeo = userDetail.endpointGeo;

    if ( startGeo == null || endGeo == null ) {
        userDetail.distance = 0;
    }
    else if ( startGeo === endGeo ) {
        userDetail.distance = 0;
        el_select.value = '';
        swal ( 'Please select a different location');
    }
    else {
        const distance = map.distance( L.latLng( startGeo ), L.latLng( endGeo ) );
        userDetail.distance = Math.round( distance/1000 ); // get the distance between two location ( km )
    }
}


// GET CONFIRMATION ---------------------------------------------------------- //

function addFinalSubmitEvent () {
    const btn = $( '#submit-location' );
    btn.on( 'click', function( e ) {
        e.preventDefault();
        if ( !userDetail.distance ) {
            swal ( "Oh noes", 'Please select locations.' , 'error' )
        }
        else {
            let currentScreen = 3;
            switchScreen( currentScreen );
            getTotalcost();    
        }
    } );
}

function getTotalcost () {
    const result = vehiclesArray.find( vehicle => vehicle.id === userDetail.vehicleId );
    const rentCost = userDetail.traveldays * result.cost;
    const feul = (( result.feul / 100  ) * userDetail.distance).toFixed( 1 )
    const feulCost = feul * 1.77;
    $( '.column--last' ).children('p:first').html( 'Rental cost $' + rentCost );
    $( '.column--last' ).children('p:eq(1)').html( 'Fuel consumption ' + feul + 'L' );

    const totalCost = ( rentCost + feulCost ).toFixed(1);
    displayConfirmation( totalCost );
}


function displayConfirmation ( totalCost ) {
    $( '#select-day' ).html( userDetail.traveldays );
    $( '#select-people' ).html( userDetail.travelers );
    $( '#select-location' ).html( userDetail.startpoint + " to " + userDetail.endpoint);
    $( '#select-location' ).after("<p>( " + userDetail.distance + " km)</p>")
    $( '#select-cost' ).html( "$ " + totalCost );

}

// SWICH SCREEN -------------------------------------------------------------- //

function initScreens () {
    const el_screens = $( '.screen' );
    el_screens.slice( 1 ).hide();
    backToScreen( el_screens );
    addLogoClickListener();
}

function switchScreen ( screen ) {
    const el_screens = $( '.screen' );
    const nextScreen = screen + 1;
    el_screens.hide();
    el_screens.slice( screen,nextScreen ).show( 1000 );

    const el_bar = $( '#color-bar' );
    el_bar.width( el_bar.width() + ( $(window).width() / 3 ) );
}

function backToScreen ( el_screens ) {
    $( '.back' ).off().on( 'click', function( event ){
        event.preventDefault();
        const currentIndex = $( this ).data( 'back' );
        const backIndex = currentIndex - 1;

        if ( currentIndex === 1 ) {
            $( '.header__container' ).css('background-color', 'black');
        }

        el_screens.hide();
        $( el_screens[backIndex] ).show( 1000 );
        const el_bar = $( '#color-bar' );
        el_bar.width( backIndex * ( $(window).width() / 3 ) );
        
    } );
}

function addLogoClickListener () {
    const el_screens = $( '.screen' );
    $( '.header__logo' ).click( function(e) {
        e.preventDefault();
        el_screens.hide();
        el_screens.slice( 0,1 ).show( 1000 );
        $( '.header__container' ).css('background-color', 'black');
        $( '#color-bar' ).width('0');
    } );
}

function initprocessBar () {
    const el_bar = $( '#color-bar' );
    el_bar.width( el_bar.width() + ( $(window).width() / 3 ) );
}

