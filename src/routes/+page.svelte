<script lang="ts">
    import { onMount } from 'svelte';
    import MapComponent from '../components/MapComponent.svelte';

    let showForm = true;
    let messages = [];
    let userMessage = '';
    let userName = '';
    let birthDate = '';
    
    // Coordenadas por defecto para Buenos Aires
    let coordinates = { lat: -34.632158, lng: -58.525342 };

	function setCoordinates(event) {
		coordinates = { lat: event.detail.latLng.lat, lng: event.detail.latLng.lng };
	}

	function validateForm() {
		if (!userName.trim() || !birthDate.trim() || coordinates.lat === null || coordinates.lng === null) {
			alert('Por favor, completa todos los campos: nombre, fecha de nacimiento y coordenadas.');
			return false;
		}
		return true;
	}

	async function startChat() {
		if (!validateForm()) return;

		try {
			const response = await fetch('/api/get_birthchart', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user: userName,
					birthDate,
					coordinates,
					token: 'mysecrettoken'
				})
			});

			if (response.ok) {
				const responseData = await response.json();
				messages = [
					{ role: 'assistant', content: 'Bienvenido a tu consulta astrológica. He analizado tu carta natal.' },
					{ role: 'assistant', content: responseData.report }
				];
				showForm = false;
			} else {
				const errorData = await response.json();
				console.error('Error fetching data:', errorData.error);
				alert('Hubo un error al procesar tus datos: ' + errorData.error);
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			alert('Hubo un error al conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente.');
		}
	}

	async function sendMessage() {
		if (!userMessage.trim()) return;

		messages = [...messages, { role: 'user', content: userMessage }];

		try {
			const response = await fetch('/api/verify', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					user: userName,
					question: userMessage,
					token: 'mysecrettoken',
					history: messages,
					birthDate,
					coordinates
				})
			});

			if (response.ok) {
				const responseData = await response.json();
				messages = [...messages, { role: 'assistant', content: responseData.message }];
			} else {
				const errorData = await response.json();
				console.error('Error fetching data:', errorData.error);
				messages = [...messages, { role: 'assistant', content: 'Lo siento, hubo un error al procesar tu mensaje: ' + errorData.error }];
			}
		} catch (error) {
			console.error('Error fetching data:', error);
			messages = [...messages, { role: 'assistant', content: 'Lo siento, hubo un error de conexión. Por favor, verifica tu conexión e intenta nuevamente.' }];
		}

		userMessage = '';
	}

	function handleKeyPress(event: KeyboardEvent) {
		if (event.key === 'Enter' && !showForm) {
			sendMessage();
		}
	}

	onMount(() => {
		document.addEventListener('keypress', handleKeyPress);
		return () => {
			document.removeEventListener('keypress', handleKeyPress);
		};
	});
</script>

<svelte:head>
	<title>Astrología Virtual con el Gran Tairot</title>
	<meta name="description" content="Consulta astrológica virtual con El Gran Tairot" />
</svelte:head>

<section>
	<h1>Astrología Virtual con el Gran Tairot</h1>

	
	{#if showForm}
		<div class="form-container">
			<div class="input-row">
				<div class="input-container">
					<label for="userName">Nombre:</label>
					<input type="text" id="userName" bind:value={userName} placeholder="Tu nombre" />
				</div>
				<div class="input-container">
					<label for="birthDate">Fecha de nacimiento:</label>
					<input type="date" id="birthDate" bind:value={birthDate} />
				</div>
			</div>
			<div class="input-container">
				<label>Indica tu lugar de nacimiento clickeando en el mapa:</label>
				<MapComponent on:click={setCoordinates} center={coordinates} zoom={10} style="width: 100%; height: 300px;" />
			</div>
			<button on:click={startChat}>Comenzar consulta</button>
		</div>
	{:else}
		<div class="chat-container">
			<div class="messages">
				{#each messages as message}
					<div class={message.role === 'assistant' ? 'assistant-message' : 'user-message'}>
						{message.role === 'assistant' ? 'El Gran Tairot: ' : 'Tú: '}{message.content}
					</div>
				{/each}
			</div>

			<div class="input-container input-row">
				<input type="text" bind:value={userMessage} placeholder="Escribe tu mensaje aquí..." />
				<button on:click={sendMessage}>Enviar</button>
			</div>
		</div>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
		background: url('$lib/images/tairot.webp') no-repeat center center;
		background-size: cover;
		padding: 20px;
	}

	/* Estilos para el título */
	h1 {
		margin-bottom: 20px;  /* Mantiene el margen actual */
		font-family: 'Poppins', sans-serif;  /* Nueva fuente */
		color: white;  /* Color blanco para el texto */
		font-size: 2.5rem;  /* Tamaño de fuente */
		font-weight: 600;  /* Peso de la fuente */
		text-align: center;  /* Centrar el texto */
	}
	.form-container, .chat-container {
		width: 100%;
		max-width: 600px;
		background: rgba(255, 255, 255, 0.9);
		padding: 20px;
		border-radius: 10px;
	}

	.messages {
		width: 100%;
		height: 300px;
		margin-bottom: 20px;
		padding: 10px;
		overflow-y: auto;
		border: 1px solid #ccc;
		background: #fff;
	}

	.assistant-message {
		color: blue;
		margin-bottom: 10px;
	}

	.user-message {
		color: green;
		margin-bottom: 10px;
		text-align: right;
	}

	.input-row {
		display: flex;
		width: 100%;
		justify-content: space-between;
	}

	.input-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 10px;
	}

	label {
		margin-bottom: 5px;
	}

	input {
		flex: 1;
		padding: 10px;
		margin-bottom: 10px;
	}

	button {
		padding: 10px;
		background-color: #4CAF50;
		color: white;
		border: none;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	button:hover {
		background-color: #45a049;
	}
</style>