<script lang="ts">
	import { Button, Input, Modal } from '@foxui/core';
	import type { CreationModalComponentProps } from '../../types';

	let { item, oncreate, oncancel }: CreationModalComponentProps = $props();

	let url = $state(item.cardData.url || '');

	function handleCreate() {
		if (!url) return;
		item.cardData.url = url;
		oncreate();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			handleCreate();
		}
	}
</script>

<Modal open={true} onOpenChange={(open) => !open && oncancel()} title="Add YouTube Profile">
	<div class="flex flex-col gap-4 py-4">
		<div class="flex flex-col gap-2">
			<label for="url" class="text-base-600 dark:text-base-400 text-sm font-medium">
				YouTube Channel URL
			</label>
			<Input
				id="url"
				placeholder="https://www.youtube.com/@handle"
				bind:value={url}
				onkeydown={handleKeydown}
				autofocus
			/>
			<p class="text-base-500 text-xs">
				Paste a link to your channel, e.g. youtube.com/@yourname
			</p>
		</div>

		<div class="flex justify-end gap-3 pt-2">
			<Button variant="ghost" onclick={oncancel}>Cancel</Button>
			<Button disabled={!url} onclick={handleCreate}>Add Card</Button>
		</div>
	</div>
</Modal>
