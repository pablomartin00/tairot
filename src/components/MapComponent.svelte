<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';

  // Coordenadas y nivel de zoom predeterminados
  export let zoom = 10;
  export let center = [-34.632158, -58.525342]; // Buenos Aires, Argentina

  let map;
  let marker;
  const dispatch = createEventDispatcher();

  onMount(async () => {
    try {
      // Verificar si el contenedor del mapa existe
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        throw new Error('Map container not found.');
      }

      // Cargar Leaflet de forma dinámica
      const L = await import('leaflet');

      // Inicializar el mapa en el contenedor con las coordenadas y el nivel de zoom
      map = L.map('map').setView(center, zoom);

      // Añadir la capa del mapa de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      // Añadir un marcador en las coordenadas iniciales (center)
      marker = L.marker(center).addTo(map);

      // Manejar el evento de clic en el mapa
      map.on('click', handleMapClick);
    } catch (error) {
      console.error('Error in onMount:', error);
    }

    return () => {
      // Remover el mapa al destruir el componente
      if (map) {
        map.remove();
      }
    };
  });

  function handleMapClick(e) {
    const { lat, lng } = e.latlng;

    // Si ya hay un marcador, actualizar su posición
    if (marker) {
      marker.setLatLng([lat, lng]);
    } else {
      // Si no hay marcador, crearlo
      marker = L.marker([lat, lng]).addTo(map);
    }

    // Despachar evento con las coordenadas del clic
    dispatch('click', {
      latLng: { lat, lng }
    });
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
</svelte:head>

<div id="map" style="height: 400px; width: 100%;"></div>
