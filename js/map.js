var map, activeLayer;
var region_global, red_global;
var regiones = {
    "Región de Tarapacá": "R01",	
    "Región de Antofagasta": "R02",	
    "Región de Atacama": "R03",	
    "Región de Coquimbo": "R04",	
    "Región de Valparaíso": "R05",
    "Región del Libertador General Bernardo OHiggins": "R06",
    "Región del Maule": "R07",
    "Región del Biobío": "R08",
    "Región de la Araucanía": "R09",
    "Región de Los Lagos": "R10",
    "Región Aysén del General Carlos Ibáñez del Campo": "R11",
    "Región de Magallanes y de la Antártica Chilena": "R12",
    "Región Metropolitana de Santiago": "R13", 
    "Región de Los Ríos": "R14",
    "Región de Arica y Parinacota": "R15",
    "Región de Ñuble": "R16"
};
var regiones_en = {
    "Tarapacá Region": "R01",	
    "Antofagasta Region": "R02",	
    "Atacama Region": "R03",	
    "Coquimbo Region": "R04",	
    "Valparaíso Region": "R05",
    "O'Higgins Region": "R06",
    "Maule Region": "R07",
    "Biobío Region": "R08",
    "Araucanía Region": "R09",
    "Los Lagos Region": "R10",
    "Aysén Region": "R11",
    "Magallanes Region": "R12",
    "XII Region of Magallanes and Chilean Antarctica": "R12",
    "Santiago Metropolitan Region": "R13",
    "Los Ríos Region": "R14",
    "Arica y Parinacota Region": "R15",
    "Ñuble Region": "R16" 
};

function fetchKML(kmlFile, lat, lng) {
    $("#spinner").css("visibility","visible");
	fetch( kmlFile )
	.then(res => res.text())
	.then(kmltext => {
		const parser = new DOMParser();
		const kml = parser.parseFromString(kmltext, 'text/xml');
		activeLayer = new L.KML(kml);
		map.addLayer(activeLayer);
	})
    .then( () => {
        $("#spinner").css("visibility","hidden");
    })
    .then( () => {
        if( lat && lng ) {
            map.setZoom( 13 );
            map.panTo( new L.LatLng(lat, lng) );
            var marker = L.marker( [lat, lng] ).addTo(map);
        } else {
            const bounds = activeLayer.getBounds();
            map.fitBounds(bounds);
        }
    });	
}

function getNetwork() {
    var red;
        
    if ( $("#4G").is(":checked") ) {
        red = "4G";
    } else if ( $("#3G").is(":checked") ) {
        red = "3G";
    } else if ( $("#2G").is(":checked") ) {
        red = "2G";
    } else {
        red = null;
    }
    
    return red;    
}

function load_map_for_region( region, lat, lng ) {
	var red, kmlFile;

    region_global = region ? region : "Región Metropolitana de Santiago";
    
    red	= getNetwork() ? getNetwork() : "4G"; 
    
    var nro_region = regiones[region_global] ? regiones[region_global] : regiones_en[region_global]; 
	kmlFile =  nro_region ? "kml/".concat( red, "/", nro_region, ".kml") : "kml/".concat( red, "/", "R13", ".kml");
	
	fetchKML( kmlFile, lat, lng );

}


function load_map() {

    map = L.map('map').setView([-33.4900, -70.6506], 13);

    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
            '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11'
    }).addTo(map);
	
}

function choosenAddr (lat, lng, osm_type, lugar) {
    var r, region;
    
    if ( activeLayer ) map.removeLayer( activeLayer );

    var l = lugar.split(",");
    for ( var i=0; i<l.length; i++) {
        r = l[i].match(/Regi(o|ó)n/g);
        if (r) break;
    }
    if ( r ) region_global = region = l[i].trim();
	load_map_for_region(region, lat, lng);
	
    document.getElementById("results").style.visibility = "hidden";
    document.getElementById("results").style.display = "none";
	
}

function choosenRegion( region ) {

    $("#region").attr('placeholder', region);
    document.getElementById("regiones").style.visibility = "hidden";
    document.getElementById("regiones").style.display = "none";    
    if ( activeLayer ) map.removeLayer( activeLayer );
    region_global = region;
    load_map_for_region(region);
    
}

function showRegiones() {
    var items = []; 

    document.getElementById("regiones").style.display = "block";
    $('#regiones').empty();
    $.each( regiones, function( key, val ) {
        items.push("<li class='lista'><i class='ico-searchubication'></i><p onclick='choosenRegion(\"" + key + "\"); return false;'>" + key + "</p></li>");
    })
    $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
    }).appendTo('#regiones');
    document.getElementById("regiones").style.visibility = "inherit";
}

function addr_search() {
    var inp = document.getElementById("addr");
	
    document.getElementById("results").style.display = "block";
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&countrycodes=CL&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            latitud = val.lat;
			longitud = val.lon;
			descripcion = val.display_name.replace("'","");
		    nombre = val.display_name.split(",");
            items.push("<li class='lista'><i class='ico-searchubication'></i><p onclick='choosenAddr(" + latitud + "," + longitud  +", \"" + val.osm_type + "\", \"" + descripcion + "\");return false;'><span>" + nombre[0] + "</span>, ");
            for (var i = 1; i < nombre.length; i++) {
                if (nombre[i].selected == "chile") {
                    break;
                }
                items.push(nombre[i] + ", ");
            }
            items.push(" </p></li>");
        });

        $('#results').empty();
        if (items.length != 0) {
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { class: 'no-results', html: "No se han encontrado resultados" }).appendTo('#results');
        }
    });
    document.getElementById("results").style.visibility = "inherit";
	
}

function addr_filter(e) {
    var cb = {
        "2G": "#2G",
        "3G": "#3G",
        "4G": "#4G"
    };
    
    if( e.value === red_global ) {
        if ( $(cb[e.value]).is(":checked") ) {
            if ( activeLayer ) map.addLayer( activeLayer );
        } else {
            if ( activeLayer ) map.removeLayer( activeLayer ); 
        }
    } else {
        if ( $(cb[e.value]).is(":checked") ) {
            $(cb[red_global]).prop("checked", false);
            if ( activeLayer ) map.removeLayer( activeLayer ); 
            red_global = e.value;
            load_map_for_region( region_global );
        }
    }
}

$("#my_location").click(function() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(map);
            map.panTo(new L.LatLng(position.coords.latitude, position.coords.longitude));
            map.setZoom( 13 );
        });
    } else {}
});

$("#addr").on("keyup", function (event) {
if (event.which === 13 || event.keyCode === 13) {
    event.preventDefault();
    addr_search();
}
});

$(getNetwork());
$(load_map);
red_global="4G";
$($("#4G").click());
$(load_map_for_region());

