"use client";

import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, FeatureGroup, ZoomControl, useMap } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import geoblaze from 'geoblaze';
import { getColorForBNI, getColorForDHI, getColorForGHI, getColorForPVPROD, getColorForSLOPE, getColorForSRTM, getColorForTEMPERATURE, getColorForWS10m } from "./colorMappings";
import { useRouter } from 'next/navigation';
import * as turf from '@turf/turf';
import Chart from 'chart.js/auto';
import L from 'leaflet';
import { FaInfoCircle } from 'react-icons/fa';
import { Navbar } from "@/components/navbar/Navbar";

const LayerSelector = ({ layerData, activeLayers, toggleLayer, isVisible, toggleVisibility, activateCategory, sidebarContent }) => {
  const categories = {
    "ENERGIE SOLAIRE": { id: "solar", layers: ["GHI", "DHI", "BNI", "PT PV"] },
    "ENERGIE EOLIENNE": { id: "wind", layers: ["WS10m"] },
    "DONNEES DOA": { id: "dakhla", layers: ["SLOPE", "SRTM", "TEMPERATURE"] },
    "GEOSPATIAL DATA": { id: "geospatial", layers: ["Régions du Maroc", "Lignes électrique", "Routes", "Villes", "Rivières", "Zone d'eau"] },
  };

  const layerAbbreviations = {
    "GHI": "Global Horizontal Irradiance",
    "DHI": "Diffuse Horizontal Irradiance",
    "BNI": "Beam Normal Irradiance",
    "PT PV": "Photovoltaic Production",
    "WS10m": "Wind Speed at 10m",
    "SLOPE": "Slope",
    "SRTM": "Shuttle Radar Topography Mission",
    "TEMPERATURE": "Temperature",
    "Régions du Maroc": "Region Maroc",
    "Lignes électrique": "Electric Line",
    "Routes": "Route",
    "Villes": "Ville",
    "Rivières": "Waterway",
    "Zone d'eau": "Water Area",
  };

  return (
    <div className={`absolute top-0 left-0 h-full bg-white text-black z-[1] transition-all duration-300 ease-in-out ${isVisible ? 'w-72' : 'w-8'}`}>
      <button
        className="absolute top-1/2 right-[-24px] transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-2 rounded-r transition-transform duration-300 ease-in-out"
        onClick={toggleVisibility}
        style={{ transform: isVisible ? 'rotate(180deg)' : 'rotate(0deg)' }}
      >
        &lt;
      </button>
      {isVisible && (
        <div className="p-4">
          <div id="sidebar" className="mb-4">
            {sidebarContent}
          </div>
          {Object.entries(categories).map(([category, { id, layers }]) => (
            <div key={category} className="mb-6">
              <h3 className="text-yellow-500 font-semibold mb-2 cursor-pointer" onClick={() => activateCategory(id)}>
                {category}
              </h3>
              {layers.map((layerName) => (
                <div key={layerName} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={layerName}
                    checked={activeLayers.includes(layerName)}
                    onChange={() => toggleLayer(layerName)}
                    className="mr-2 form-checkbox h-4 w-4 text-yellow-500 transition duration-150 ease-in-out"
                  />
                  <label htmlFor={layerName} className="text-sm mr-2">
                    {layerName}
                  </label>
                  <FaInfoCircle
                    className="text-gray-500 cursor-pointer tooltip-trigger"
                    title={layerAbbreviations[layerName]}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// Legend Component
const Legend = ({ activeLayers, layerData }) => {
  if (activeLayers.length === 0) return null;

  const activeLayer = activeLayers.slice().reverse().find(layerName => {
    const layerInfo = layerData.find(l => l.layerName === layerName);
    return layerInfo && layerInfo.category !== "geospatial";
  });

  if (!activeLayer) return null;

  const { colorFn, min, max, layerName, unit } = layerData.find(l => l.layerName === activeLayer);

  const gradientStops = 100;
  const legendHeight = 200;
  const legendWidth = 40;

  const gradientStyle = {
    background: `linear-gradient(to top, ${Array.from({ length: gradientStops }, (_, i) => {
      const value = min + (i / (gradientStops - 1)) * (max - min);
      return colorFn(value);
    }).join(', ')})`,
    width: `${legendWidth}px`,
    height: `${legendHeight}px`,
  };

  const labelCount = 5;
  const labels = Array.from({ length: labelCount }, (_, i) => {
    const value = min + (i / (labelCount - 1)) * (max - min);
    return {
      value: Math.round(value),
      position: `${(i / (labelCount - 1)) * 100}%`
    };
  });

  return (
    <div className="absolute bottom-28 right-20 z-[1] border border-gray-300 text-white p-4 rounded-lg bg-opacity-80 bg-black pointer-events-auto" style={{ width: '140px' }}>
      <h3 className="text-sm font-semibold mb-2 text-center">{layerName}</h3>
      <p className="text-xs mb-2 text-center">{unit}</p>
      <div className="flex justify-center">
        <div style={gradientStyle}></div>
        <div className="ml-2 relative" style={{ height: `${legendHeight}px` }}>
          {labels.map(({ value, position }, index) => (
            <div key={index} className="absolute left-0" style={{ bottom: position, transform: 'translateY(50%)' }}>
              <span className="text-xs">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// MapComponent for adding layers
function MapComponent({ layerData, activeLayers }) {
  const map = useMap();

  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof L.GeoJSON || layer instanceof L.LayerGroup || layer instanceof GeoRasterLayer) {
        map.removeLayer(layer);
      }
    });

    const geoJSONLayers = {
      region_marocLayer: L.geoJSON(null, { style: { color: "#ff7800", weight: 2 } }),
      electric_lineLayer: L.geoJSON(null, { style: { color: "#0000FF", weight: 2 } }),
      routeLayer: L.geoJSON(null, { style: { color: "#00FF00", weight: 2 } }),
      villeLayer: L.layerGroup(),
      waterway_doaLayer: L.geoJSON(null, { style: { color: "#00FFFF", weight: 2 } }),
      waterarea_dakhlaLayer: L.geoJSON(null, { style: { color: "#FFA500", weight: 2 } }),
    };

    const fetchAndAddLayer = async (url, geoJsonLayer, layerName) => {
      if (activeLayers.includes(layerName)) {
        try {
          const response = await fetch(url);
          const data = await response.json();
          const geojson = {
            type: "FeatureCollection",
            features: data.map(feature => ({
              type: "Feature",
              geometry: feature.geom,
              properties: {},
            })),
          };
          geoJsonLayer.addData(geojson);
          geoJsonLayer.addTo(map);
        } catch (error) {
          console.error(`Error loading GeoJSON layer ${layerName}:`, error);
        }
      }
    };

    fetchAndAddLayer("http://127.0.0.1:8000/map/region_maroc/", geoJSONLayers.region_marocLayer, "Régions du Maroc");
    fetchAndAddLayer("http://127.0.0.1:8000/map/electric_line/", geoJSONLayers.electric_lineLayer, "Lignes électrique");
    fetchAndAddLayer("http://127.0.0.1:8000/map/route/", geoJSONLayers.routeLayer, "Routes");
    fetchAndAddLayer("http://127.0.0.1:8000/map/waterway_doa/", geoJSONLayers.waterway_doaLayer, "Rivières");
    fetchAndAddLayer("http://127.0.0.1:8000/map/waterarea_dakhla/", geoJSONLayers.waterarea_dakhlaLayer, "Zone d'eau");

    if (activeLayers.includes("Villes")) {
      fetch("http://127.0.0.1:8000/map/ville/")
        .then(response => response.json())
        .then(data => {
          data.forEach(function (item) {
            const coords = item.geom.coordinates;
            const name = item.name;

            const cityIcon = L.divIcon({
              html: '<div class="city-point"></div><div class="city-label">' + name + '</div>',
              className: '',
              iconSize: [50, 50],
              iconAnchor: [12, 12],
            });

            L.marker([coords[1], coords[0]], { icon: cityIcon }).addTo(geoJSONLayers.villeLayer);
          });
          geoJSONLayers.villeLayer.addTo(map);
        })
        .catch(error => console.error('Error loading villeLayer:', error));
    }

    const loadGeoRasterLayers = async () => {
      const rasterLayers = activeLayers.filter(layerName => layerData.some(l => l.layerName === layerName));
      for (const layerName of rasterLayers) {
        const layerInfo = layerData.find((l) => l.layerName === layerName);
        if (layerInfo) {
          const { url, colorFn } = layerInfo;
          try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const parsedGeoraster = await geoblaze.parse(arrayBuffer);

            const layer = new GeoRasterLayer({
              georaster: parsedGeoraster,
              opacity: 1,
              pixelValuesToColorFn: (values) => {
                if (values[0] === parsedGeoraster.noDataValue) return null;
                return colorFn(values[0]);
              },
              resolution: 256,
            });

            layer.addTo(map);
          } catch (error) {
            console.error(`Error loading raster layer ${layerName}:`, error);
          }
        } else {
          console.warn(`No data found for raster layer: ${layerName}`);
        }
      }
    };

    loadGeoRasterLayers();
  }, [map, activeLayers, layerData]);

  return null;
}


// DrawControl Component
const DrawControl = ({ setShowModal, setSelectedEnergyType, router }) => {
  const map = useMap();
  const [activeLayer, setActiveLayer] = useState(null);

  useEffect(() => {
    const customIcon = L.icon({
      iconUrl: '/location-pointer.png', // Make sure to add this image to your public folder
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const onDrawCreated = (e) => {
      if (activeLayer) {
        map.removeLayer(activeLayer);
      }

      const type = e.layerType;
      const layer = e.layer;
      
      // Apply custom icon if it's a marker
      if (type === 'marker') {
        layer.setIcon(customIcon);
      }

      const geojson = layer.toGeoJSON();
      const geometry = geojson.geometry;
      let area, length;

      if (geometry.type === 'Point') {
        area = null;
        length = null;

        // Zoom to specific coordinates when marker is clicked
        layer.on('click', () => {
          map.setView(layer.getLatLng(), 12);
        });
      } else {
        const polygon = turf.polygon(geometry.coordinates);
        length = turf.length(polygon, { units: 'kilometers' });
        area = turf.area(polygon);
      }


      fetch('http://127.0.0.1:8000/map/shapefiles/intersect/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': getCookie('csrftoken'),
        },
        body: JSON.stringify({ geometry: geojson.geometry }),
      })
        .then(response => response.json())
        .then(data => {
          const sidebar = document.getElementById('sidebar');
          sidebar.innerHTML = '';
          if (data && data.averages) {
            const averages = data.averages;
            const chartCanvas = document.createElement('canvas');
            chartCanvas.id = 'ghiChart';
            sidebar.appendChild(chartCanvas);

            const ctx = document.getElementById('ghiChart').getContext('2d');
            const chartData = {
              type: 'line',
              data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                  label: 'GHI',
                  data: [
                    averages.avg_mois1, averages.avg_mois2, averages.avg_mois3, averages.avg_mois4,
                    averages.avg_mois5, averages.avg_mois6, averages.avg_mois7, averages.avg_mois8,
                    averages.avg_mois9, averages.avg_mois10, averages.avg_mois11, averages.avg_mois12
                  ],
                  borderColor: 'orange',
                  backgroundColor: 'rgba(255, 165, 0, 0.2)',
                  fill: true,
                  tension: 0.1
                }]
              },
              options: {
                responsive: true,
                plugins: {
                  legend: { display: true, position: 'top' }
                },
                scales: { y: { beginAtZero: false } }
              }
            };
            const chart = new Chart(ctx, chartData);

            const div = document.createElement('div');
            div.innerHTML = `GHI: ${averages.avg_ghi?.toFixed(2) ?? "N/A"}<br>
                              DHI: ${averages.avg_dhi?.toFixed(2) ?? "N/A"}<br>
                              BNI: ${averages.avg_bni?.toFixed(2) ?? "N/A"}<br>
                              Temperature Avg: ${averages.avg_temp_avg?.toFixed(2) ?? "N/A"}<br>
                              SRTM: ${averages.avg_srtm?.toFixed(2) ?? "N/A"}<br>
                              WS 10m: ${averages.avg_ws_10m?.toFixed(2) ?? "N/A"}<br>`;

           

            sidebar.appendChild(div);

            localStorage.setItem('energyData', JSON.stringify({
              DHI: averages.avg_dhi,
              TEMP: averages.avg_temp_avg,
              bni: averages.avg_bni,
              w_s: averages.avg_ws_10m,
              ghi: averages.avg_ghi,
              shape_area: geometry.type !== 'Point' ? area / 1e6 : averages.avg_shape_area,
              geometry: geojson.geometry,
              chartData: chartData,
            }));

            const saveButton = document.createElement('button');
            saveButton.innerHTML = "Calculer l'énergie";
            saveButton.style.marginTop = '10px';
            saveButton.style.padding = '10px 20px';
            saveButton.style.backgroundColor = '#4CAF50';
            saveButton.style.color = 'white';
            saveButton.style.border = 'none';
            saveButton.style.borderRadius = '5px';
            saveButton.style.cursor = 'pointer';
            saveButton.style.fontSize = '16px';
            saveButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            saveButton.style.transition = 'background-color 0.3s ease';
            saveButton.onclick = () => {
              setShowModal(true);
            };
            sidebar.appendChild(saveButton);
          } else {
            const div = document.createElement('div');
            div.innerHTML = 'No intersecting data found';
            sidebar.appendChild(div);
          }
        })
        .catch(error => console.error('Error:', error));

      setActiveLayer(layer);

      // Ensure the drawn layer remains on the map
      map.addLayer(layer);
    };

    map.on('draw:created', onDrawCreated);

    return () => {
      map.off('draw:created', onDrawCreated);
    };
  }, [map, setShowModal, setSelectedEnergyType, router]);

  return null;
};

// getCookie function
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; cookies.length > i; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Main Map Component
function Map() {
  
  const mapboxAccessToken = 'pk.eyJ1IjoiYW1qaWYxMjMiLCJhIjoiY2x5OGtoMmFxMGRpYzJqc2J2M3cwamF0bCJ9.6UlNs44Af-rnxNXzJDkOkw';
  const [activeLayers, setActiveLayers] = useState(["GHI", "Régions du Maroc"]);
  const [isLayerSelectorVisible, setIsLayerSelectorVisible] = useState(true);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedEnergyType, setSelectedEnergyType] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const router = useRouter();

  const layerData = [
    { url: "./BNI_DOA.tif", colorFn: getColorForBNI, layerName: "BNI", min: 2130, max: 2457, unit: "kWh/m²/year", category: "solar" },
    { url: "./DHI_DOA.tif", colorFn: getColorForDHI, layerName: "DHI", min: 561, max: 646, unit: "kWh/m²/year", category: "solar" },
    { url: "./GHI_DOA.tif", colorFn: getColorForGHI, layerName: "GHI", min: 2177, max: 2292, unit: "kWh/m²/year", category: "solar" },
    { url: "./PV_PROD_DOA.tif", colorFn: getColorForPVPROD, layerName: "PT PV", min: 7220.0439389, max: 7597.1570926, unit: "kWh/kWp", category: "solar" },
    { url: "./SLOPE_DOA.tif", colorFn: getColorForSLOPE, layerName: "SLOPE", min: 0.0540772, max: 1.7180929, unit: "degrees", category: "dakhla" },
    { url: "./SRTM_DOA.tif", colorFn: getColorForSRTM, layerName: "SRTM", min: 13, max: 362, unit: "m", category: "dakhla" },
    { url: "./TEMPERATURE_DOA.tif", colorFn: getColorForTEMPERATURE, layerName: "TEMPERATURE", min: 21.3249876, max: 26.5749811, unit: "°C", category: "dakhla" },
    { url: "./WS10m_DOA.tif", colorFn: getColorForWS10m, layerName: "WS10m", min: 4.7567077, max: 6.9427237, unit: "m/s", category: "wind" },
  ];

  // Show popup on page load
  useEffect(() => {
    setPopupVisible(true);  // Show popup initially
  }, []);

  // Modified toggleLayer function
  const toggleLayer = useCallback((layerName) => {
    setActiveLayers(prev => {
      const isGHI = layerName === 'GHI';
      const isRegionMaroc = layerName === 'Régions du Maroc';
      // Always keep 'Régions du Maroc' checked
      const newActiveLayers = prev.includes(layerName)
        ? prev.filter(l => l !== layerName)
        : [...prev.filter(l => l === 'Régions du Maroc'), layerName];
        


      // Ensure 'Régions du Maroc' is always active
      if (!newActiveLayers.includes('Régions du Maroc')) {
        newActiveLayers.push('Régions du Maroc');
      } 
      // Ensure 'GHI' is unchecked when another layer is selected
      if (!isGHI && prev.includes('GHI')) {
        return newActiveLayers.filter(l => l !== 'GHI');
      }
      return newActiveLayers;
    });
  }, []);

  const toggleLayerSelectorVisibility = useCallback(() => {
    setIsLayerSelectorVisible(prev => !prev);
  }, []);

  const activateCategory = useCallback((categoryId) => {
    const categoryLayers = layerData
      .filter(layer => layer.category === categoryId)
      .map(layer => layer.layerName);
    setActiveLayers(categoryLayers);
    setIsLayerSelectorVisible(false);
    setIsSidebarVisible(true);
  }, [layerData]);

  const handleEnergyTypeChange = (e) => {
    setSelectedEnergyType(e.target.value);
  };

  const handleCalculate = () => {
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    if (selectedEnergyType === 'PV') {
      window.open('/map/PV', '_blank');
    } else if (selectedEnergyType === 'EL') {
      window.open('/map/EL', '_blank');
    }
  };

  return (
    <div className="relative w-full h-screen">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>
      <MapContainer
        center={[22.764658, -15.143608]}
        zoom={7}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          // attribution='&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a>'
          // url={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token=${mapboxAccessToken}`}
          url="https://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
        />
        <ZoomControl position="topright" />
        <FeatureGroup>
          <EditControl
            position="topright"
            draw={{
              rectangle: true,
              polygon: true,
              circle: false,
              circlemarker: false,
              marker: true,
              polyline: false,
            }}
          />
        </FeatureGroup>
        <MapComponent layerData={layerData} activeLayers={activeLayers} />
        <DrawControl setShowModal={setShowModal} setSelectedEnergyType={setSelectedEnergyType} router={router} />
      </MapContainer>

      <LayerSelector
        layerData={layerData}
        activeLayers={activeLayers}
        toggleLayer={toggleLayer}
        isVisible={isLayerSelectorVisible}
        toggleVisibility={toggleLayerSelectorVisibility}
        activateCategory={activateCategory}
        sidebarContent={isSidebarVisible && (
          <>
            {showModal && (
              <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-lg font-bold mb-4">Choisissez le type d'énergie que vous souhaitez calculer</h2>
                  <label className="block mb-2">
                    <input type="radio" value="PV" checked={selectedEnergyType === 'PV'} onChange={handleEnergyTypeChange} className="mr-2" />
                    énergie Photovoltaïque
                  </label>
                  <label className="block mb-2">
                    <input type="radio" value="EL" checked={selectedEnergyType === 'EL'} onChange={handleEnergyTypeChange} className="mr-2" />
                    énergie Éolienne
                  </label>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => setShowModal(false)} className="bg-gray-400 text-white py-2 px-4 rounded-lg mr-2 hover:bg-gray-500 transition-colors duration-300">Cancel</button>
                    <button onClick={handleModalConfirm} className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors duration-300">Confirm</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      />

      {/* Popup for guidance */}
      {popupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity duration-300 ease-in-out">
          <div className="bg-white max-w-md w-full p-8 rounded-2xl shadow-2xl transform transition-transform duration-300 ease-in-out">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">🚀 Bienvenue sur la page Carte</h2>
            <p className="text-gray-600 text-center leading-relaxed mb-4">
              Explorez les différentes couches énergétiques à l'aide de la carte. Utilisez la barre latérale pour activer les couches et commencer votre analyse.
            </p>
            
            {/* Section des fonctionnalités */}
            <div className="text-gray-700 mb-6">
              <p className="font-semibold mb-2">Sur cette page de carte, vous pouvez :</p>
              <ul className="list-disc list-inside">
                <li>Naviguer entre différentes couches énergétiques</li>
                <li>Zoomer sur une zone et dessiner un rectangle ou un polygone pour calculer les données énergétiques</li>
                <li>Cliquez sur le bouton "Calculer l'énergie", choisissez le type d'énergie à calculer et téléchargez le rapport</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setPopupVisible(false)}
                className="bg-yellow-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-yellow-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-300"
              >
                J'ai compris !
              </button>
            </div>
          </div>
        </div>
      )}



      <Legend activeLayers={activeLayers} layerData={layerData} />
    </div>
  );
}

export default Map;
