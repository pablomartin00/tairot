<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  export let zoom = 13;
  export let center = [51.505, -0.09]; // Coordenadas por defecto (Londres)

  let map;
  let marker;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    try {
      console.log('Checking if #map element exists...');
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        throw new Error('Map container not found.');
      }
      console.log('#map element found:', mapElement);

      console.log('Attempting to import Leaflet...');
      const L = await import('leaflet');
      console.log('Leaflet imported successfully.');

      map = L.map('map').setView(center, zoom);
      console.log('Map initialized with center:', center, 'and zoom:', zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      map.invalidateSize(); // Forzar el redibujado del mapa

      map.on('click', handleMapClick);
      console.log('Click event handler added.');
    } catch (error) {
      console.error('Error in onMount:', error);
    }

    return () => {
      if (map) {
        console.log('Removing map...');
        map.remove();
      }
    };
  });

  function handleMapClick(e) {
    const { lat, lng } = e.latlng;
    console.log('Map clicked at:', lat, lng);

    if (marker) {
      console.log('Updating existing marker.');
      marker.setLatLng([lat, lng]);
    } else {
      console.log('Adding new marker.');
      marker = L.marker([lat, lng]).addTo(map);
    }

    dispatch('click', {
      latLng: { lat, lng }
    });
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</svelte:head>

<div id="map" style="height: 400px; width: 100%;"></div>
