<script lang="ts" context="module">
	export type DragInfo = {
		pos: { x: number; y: number };
	};
</script>

<script lang="ts">
	export let onDragStart: (el: HTMLDivElement, info: DragInfo) => void = () => {};
	export let onDragEnd: (el: HTMLDivElement, info: DragInfo) => void = () => {};

	export let dragging = false;
	export let el: HTMLDivElement = null as any;
	export let absolute = false;

	let initialMouse = { x: 0, y: 0 };
	let objOffset = { x: 0, y: 0 };
	let mouseOffset = { x: 0, y: 0 };
	let identifier = 0;

	function startDrag(e: MouseEvent | TouchEvent) {
		if (dragging) return;
		if (e instanceof MouseEvent && e.button != 0) return;
		e.preventDefault();
		e.stopPropagation();
		dragging = true;
		const rect = el.getBoundingClientRect();

		objOffset = { x: el.offsetLeft, y: el.offsetTop };
		if (e instanceof MouseEvent) {
			initialMouse = { x: e.clientX, y: e.clientY };
		} else {
			identifier = e.changedTouches[0].identifier;
			initialMouse = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
		}
		mouseOffset = { x: initialMouse.x - rect.left, y: initialMouse.y - rect.top };

		window.addEventListener('mousemove', moving);
		window.addEventListener('touchmove', moving);
		window.addEventListener('mouseup', endDrag);
		window.addEventListener('touchend', endDrag);
		el.classList.add('dragging');

		if (onDragStart) onDragStart(el, { pos: initialMouse });
		moving(e);
	}

	function moving(e: MouseEvent | TouchEvent) {
		if (dragging) {
			const pos = getPos(e);
			let dx = 0;
			let dy = 0;
			if (absolute) {
				dx = pos.x - initialMouse.x;
				dy = pos.y - initialMouse.y;
			} else {
				dx = pos.x - mouseOffset.x - objOffset.x;
				dy = pos.y - mouseOffset.y - objOffset.y;
			}
			el.style.transform = `translate(${dx}px, ${dy}px)`;
		}
	}

	function endDrag(e: MouseEvent | TouchEvent) {
		if (!dragging) return;
		if (e instanceof MouseEvent && e.button != 0) return;
		if (e instanceof TouchEvent && e.changedTouches[0].identifier != identifier) return;
		e.preventDefault();
		e.stopPropagation();

		dragging = false;
		window.removeEventListener('mousemove', moving);
		window.removeEventListener('touchmove', moving);
		window.removeEventListener('mouseup', endDrag);
		window.removeEventListener('touchend', endDrag);
		el.classList.remove('dragging');
		el.style.transform = '';

		if (onDragEnd) onDragEnd(el, { pos: getPos(e) });
	}

	function getPos(e: MouseEvent | TouchEvent) {
		if (e instanceof MouseEvent) {
			return { x: e.clientX, y: e.clientY };
		} else {
			const touch = Array.from(e.changedTouches).find((t) => t.identifier == identifier);
			if (!touch) return { x: 0, y: 0 };
			return { x: touch.clientX, y: touch.clientY };
		}
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="draggable"
	class:absolute
	bind:this={el}
	on:mousedown={startDrag}
	on:touchstart={startDrag}
	on:touchcancel={endDrag}
>
	<slot />
</div>

<style lang="scss">
	.draggable {
		cursor: grab;
		position: relative;
		transition: transform 0.5s ease;
		display: inline-block;

		&.absolute {
			position: absolute;
			top: 0;
			left: 0;
		}

		&:global(.dragging) {
			cursor: grabbing;
			transition: none;
		}
	}
</style>
