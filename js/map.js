////////////////////////////////////////////////////////////////////////////////////////////////
// Para optimizar la precisión de los archivos KML y reducir su tamaño:
// Ejecutar python3 reduceKML.py <kml-file>
// 
// Implementado según lo descrito en: 
// https://www.gearthblog.com/blog/archives/2016/03/making-kml-files-smaller-reducing-precision.html
// 
// Cualquier duda, preguntame: gabriel at gasparolo.com
////////////////////////////////////////////////////////////////////////////////////////////////

const RED_ENCENDIDA = 0
const RED_PLANIFICADA = 1
const activeLayer = [];
var map;
var region_global, red_global;

const regiones = {
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

const regiones_en = {
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

const regiones_bounds = {
    "Región de Tarapacá": [-19.9708,-68.6234,-20.9063, -69.9870],	
    "Región de Antofagasta": [-23.1189, -69.4817, -24.0339, -70.8453],	
    "Región de Atacama": [-26.8547, -69.6094, -27.7419, -70.9731],	
    "Región de Coquimbo": [-29.6916, -70.9394, -30.1243, -71.6212],	
    "Región de Valparaíso": [-32.7376, -71.0733, -33.1565, -71.7551],
    "Región del Libertador General Bernardo OHiggins": [-33.9103, -70.1408, -34.7348, -71.5045],
    "Región del Maule": [-34.7574, -70.6778, -35.5736, -72.0415],
    "Región del Biobío": [-36.3007, -71.9289, -37.1012, -73.2925],
    "Región de la Araucanía": [-38.6448, -72.0332, -39.0336, -72.7151],
    "Región de Los Lagos": [-41.1661, -72.4871, -41.5410, -73.1689],
    "Región Aysén del General Carlos Ibáñez del Campo": [-44.6315, -72.2131, -46.0351, -74.9405],
    "Región de Magallanes y de la Antártica Chilena": [-52.8708, -70.1724, -53.4692, -71.5361],
    "Región Metropolitana de Santiago": [-33.3529,-70.4910,-33.5611, -70.8319], 
    "Región de Los Ríos": [-39.6094, -72.9760, -39.9929, -73.6573],
    "Región de Arica y Parinacota": [-18.3330, -69.7192, -18.8062, -70.4011],
    "Región de Ñuble": [-36.5574, -72.0138, -36.6575, -72.1843]
};

function hideLayers() {
    for( let l in activeLayer ) map.removeLayer( activeLayer[l] ); 
}

function showLayers() {
    for ( let l in activeLayer ) map.addLayer( activeLayer[l] );
}

function deleteLayers() {
    hideLayers();
    activeLayer.length = 0; 
}

function centerOnLayers() {
    let box, corner1, corner2;
    let minLat, minLong;
    let maxLat, maxLong;

    for ( let l in activeLayer ) {

        box = activeLayer[l].getBounds();
        corner1 = box.getNorthEast();
        corner2 = box.getSouthWest();

        if( corner1 && corner2 ) {
            if( !minLat || corner1.lat < minLat ) minLat = corner1.lat; 
            if( !maxLat || corner2.lat > maxLat ) maxLat = corner2.lat; 
            if( !minLong || corner1.lng < minLong ) minLong = corner1.lng; 
            if( !maxLong || corner2.lng > maxLong ) maxLong = corner2.lng; 
        }

    }

    if( !minLat || !maxLat || !minLong || !maxLong ) {
        let coords = regiones_bounds[region_global];
        let c1 = L.latLng(coords[0], coords[1]);
        let c2 = L.latLng(coords[2], coords[3]);
        box = L.latLngBounds(c1, c2);
    } else {
        let c1 = L.latLng(minLat, minLong);
        let c2 = L.latLng(maxLat, maxLong);
        box = L.latLngBounds(c1, c2);
    }

    map.fitBounds(box);

}

function fetchKML( layer, kmlFile, lat, lng) {
    $("#spinner").css("visibility","visible");
	fetch( kmlFile )
	.then(res => res.text())
	.then(kmltext => {
		const parser = new DOMParser();
		const kml = parser.parseFromString(kmltext, 'text/xml');
		activeLayer[layer] = new L.KML(kml);
		map.addLayer(activeLayer[layer]);
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
            centerOnLayers();
        }
    });	
}

function getNetworkId() {
    var red;
        
    if ( $("#5G").is(":checked") ) {
        red = "5G";
    } else if ( $("#4G").is(":checked") ) {
        red = "4G";
    } else if ( $("#3G").is(":checked") ) {
        red = "3G";
    } else if ( $("#2G").is(":checked") ) {
        red = "2G";
    } else {
        red = "4G";
    }
    
    return red;    
}

function getRegionId( regionName ) {
    let regionId;

    region_global = regionName ? regionName : "Región Metropolitana de Santiago";

    let opciones = [ regiones[region_global], regiones_en[region_global], "R13" ]; 

    for ( let o in opciones ) {
        regionId = opciones[o];
        if ( regionId ) break;
    }

    return regionId;
}

function load_map_for_region( region, lat, lng ) {
	var red, nro_region, kmlFile;

    red	= getNetworkId(); 
    nro_region = getRegionId( region );
    kmlFile =  "kml/".concat( red, "/", nro_region, ".kml");
	fetchKML( RED_ENCENDIDA, kmlFile, lat, lng );
	
    // Para la red 5G, mostraremos también los sitios planificados
    if( red === "5G" ) {
        kmlFile =  "kml/".concat( red, "/", nro_region, "-planificado.kml");
        fetchKML( RED_ENCENDIDA, kmlFile, lat, lng );    
    }


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
    region_global = region;
    deleteLayers();
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
        "4G": "#4G",
        "5G": "#5G"
    };
    
    if( e.value === red_global ) {
        if ( $(cb[e.value]).is(":checked") ) {
            showLayers();
        } else {
            hideLayers();
        }
    } else {
        if ( $(cb[e.value]).is(":checked") ) {
            $(cb[red_global]).prop("checked", false);
            red_global = e.value;
            deleteLayers(); 
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

$(getNetworkId());
$(load_map);
red_global="4G";
$($("#4G").click());
$(load_map_for_region());

