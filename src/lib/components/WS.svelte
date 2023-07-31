<script lang="ts" context="module">
	export type EventMessage = {
		type: string;
		data: any;
	};

	const socket = io(`:${PUBLIC_WS_PORT}`);

	export function subscribeEvent(type: string, callback: (data: any) => void) {
		socket.on(type, callback);
	}
	export function sendEvent(type: string, data: any) {
		socket.emit(type, data);
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { io } from 'socket.io-client';
	import { PUBLIC_WS_PORT } from '$env/static/public';

	let message = '';

	onMount(() => {
		message = 'Connecting...';

		socket.on('connect', () => {
			message = 'Connected';
			setTimeout(() => {
				message = '';
			}, 1000);
		});

		socket.on('disconnect', () => {
			message = 'Disconnected';
		});
	});
</script>

{#if message}
	<div class="info" transition:fly={{ duration: 500, y: '-100%' }}>
		<div class="content">{message}</div>
	</div>
{/if}

<style lang="scss">
	.info {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		display: flex;
		justify-content: center;
		pointer-events: none;

		.content {
			background-color: #252525;
			border: 1px solid #333;
			border-top: 0;
			border-radius: 0 0 4px 4px;
			padding: 1em 1.5em;
		}
	}
</style>
