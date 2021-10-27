var mapDefaultZoom = 5;

function iniciar_mapa(mapLat, mapLng) {
    map = new ol.Map({
        target: "map",
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM({
                    url: "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                })
            })
        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([mapLng, mapLat]),
            zoom: mapDefaultZoom
        })
    });
    map.updateSize();
}

function agregar_punto(lat, lng) {
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.transform([parseFloat(lng), parseFloat(lat)], 'EPSG:4326', 'EPSG:3857')),
            })]
        }),
        style: new ol.style.Style({
            image: new ol.style.Icon({
                anchor: [0.5, 0.5],
                anchorXUnits: "fraction",
                anchorYUnits: "fraction",
                src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
            })
        })
    });

    map.addLayer(vectorLayer);
}

function agregar_poligono() {

    var poligonos = [];
    var waypoints = [["-39.3530453", "-71.6804479"],
    ["-38.4747127", "-71.5774669"],
    ["-38.7432369", "-73.4132052"],
    ["-39.3530453", "-71.6804479"]];

    waypoints.forEach(logArrayElements);
    function logArrayElements(element, index, array) {
        poligonos.push(ol.proj.transform([parseFloat(element[1]), parseFloat(element[0])], 'EPSG:4326', 'EPSG:3857'));
    }
    var vectorLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [new ol.Feature({
                geometry: new ol.geom.Polygon([poligonos]),
            })]
        })
    });

    map.addLayer(vectorLayer);
}

function agregar_puntos() {

    var waypoints = [["-39.3530453", "-71.6804479"],
    ["-38.4747127", "-71.5774669"],
    ["-38.7432369", "-73.4132052"],
    ["-38.6357656", "-72.4532698"],
    ["-38.8670339", "-72.6129904"],
    ["-38.9065017", "-73.3168011"],
    ["-39.2347023", "-72.6729178"],
    ["-39.3602878", "-71.5854793"],
    ["-39.2760840", "-71.9537603"],
    ["-39.2914955", "-72.2293138"],
    ["-39.4866823", "-72.1553291"],
    ["-39.3679432", "-72.6182724"],
    ["-39.1788250", "-73.1627913"],
    ["-39.0898152", "-73.1796292"],
    ["-38.9958939", "-73.0897471"],
    ["-39.1080982", "-72.6774571"],
    ["-38.9847444", "-72.6367572"],
    ["-38.9547819", "-72.6216624"],
    ["-38.8131402", "-72.6252683"],
    ["-38.7666611", "-72.7574753"],
    ["-38.7499563", "-72.9441658"],
    ["-38.7879878", "-73.3963260"],
    ["-38.7114356", "-73.1626183"],
    ["-38.6035251", "-72.8450079"],
    ["-38.9339608", "-72.0252983"],
    ["-38.6736506", "-72.2244291"],
    ["-38.6842353", "-72.0042149"],
    ["-38.8401411", "-71.6825125"],
    ["-38.8192066", "-71.3011254"],
    ["-38.6865431", "-71.0824444"],
    ["-38.4526712", "-71.3713557"],
    ["-38.4146459", "-72.7813633"],
    ["-38.5369053", "-72.4316047"],
    ["-38.5373354", "-72.3820725"],
    ["-38.4219565", "-72.3779413"],
    ["-38.4412595", "-71.8866567"],
    ["-38.3694414", "-72.1667512"],
    ["-38.2531532", "-72.6699083"],
    ["-38.1934405", "-72.9908088"],
    ["-38.1669202", "-72.9066747"],
    ["-38.2332881", "-72.3426820"],
    ["-38.1328019", "-72.3181388"],
    ["-38.0624114", "-72.3751027"],
    ["-37.9554446", "-72.4339933"],
    ["-38.0346581", "-73.0716871"],
    ["-37.9800306", "-72.8404196"],
    ["-37.7978547", "-72.7092326"],
    ["-37.6744296", "-72.5861215"]];

    function logArrayElements(element, index, array) {
        var vectorLayer = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform([parseFloat(element[1]), parseFloat(element[0])], 'EPSG:4326', 'EPSG:3857')),
                })]
            }),
            style: new ol.style.Style({
                image: new ol.style.Icon({
                    anchor: [0.5, 0.5],
                    anchorXUnits: "fraction",
                    anchorYUnits: "fraction",
                    src: "https://upload.wikimedia.org/wikipedia/commons/e/ec/RedDot.svg"
                })
            })
        });

        map.addLayer(vectorLayer);
    }
    // Nótese que se evita el 2° índice ya que no hay ningún elemento en esa posición del array
    waypoints.forEach(logArrayElements);
}
var map;
var feature;

function load_map() {
	map = new L.Map('map', {zoomControl: true});

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});

	map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
}

function chooseAddr(lat1, lng1, lat2, lng2, osm_type) {
	var loc1 = new L.LatLng(lat1, lng1);
	var loc2 = new L.LatLng(lat2, lng2);
	var bounds = new L.LatLngBounds(loc1, loc2);

	if (feature) {
		map.removeLayer(feature);
	}
	if (osm_type == "node") {
		feature = L.circle( loc1, 25, {color: 'green', fill: false}).addTo(map);
		map.fitBounds(bounds);
		map.setZoom(18);
	} else {
		var loc3 = new L.LatLng(lat1, lng2);
		var loc4 = new L.LatLng(lat2, lng1);

		feature = L.polyline( [loc1, loc4, loc2, loc3, loc1], {color: 'red'}).addTo(map);
		map.fitBounds(bounds);
	}
}

function addr_search() {
    var inp = document.getElementById("addr");

    $.getJSON('http://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + inp.value, function(data) {
        var items = [];

        $.each(data, function(key, val) {
            bb = val.boundingbox;
            items.push("<li><a href='#' onclick='chooseAddr(" + bb[0] + ", " + bb[2] + ", " + bb[1] + ", " + bb[3]  + ", \"" + val.osm_type + "\");return false;'>" + val.display_name + '</a></li>');
        });

		$('#results').empty();
        if (items.length != 0) {
            $('<ul/>', {
                'class': 'my-new-list',
                html: items.join('')
            }).appendTo('#results');
        } else {
            $('<p>', { html: "No results found" }).appendTo('#results');
        }
    });
}

window.onload = load_map;
