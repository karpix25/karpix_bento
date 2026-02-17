<script lang="ts">
	import type { SettingsComponentProps } from '../../types';
	import { Label } from '@foxui/core';

	let { item = $bindable() }: SettingsComponentProps = $props();

	const periodOptions = [
		{ value: '7day', label: '7 Days' },
		{ value: '1month', label: '1 Month' },
		{ value: '3month', label: '3 Months' },
		{ value: '6month', label: '6 Months' },
		{ value: '12month', label: '12 Months' },
		{ value: 'overall', label: 'All Time' }
	];

	let period = $derived(item.cardData.period ?? '7day');
</script>

<div class="flex flex-col gap-2">
	<Label>Time Period</Label>
	<div class="flex flex-wrap gap-2">
		{#each periodOptions as opt (opt.value)}
			<button
				class={[
					'rounded-xl border px-3 py-2 text-sm transition-colors',
					period === opt.value
						? 'bg-accent-500 border-accent-500 text-white'
						: 'bg-base-100 dark:bg-base-800 border-base-300 dark:border-base-700 text-base-900 dark:text-base-100 hover:border-accent-400'
				]}
				onclick={() => (item.cardData.period = opt.value)}
			>
				{opt.label}
			</button>
		{/each}
	</div>
</div>
