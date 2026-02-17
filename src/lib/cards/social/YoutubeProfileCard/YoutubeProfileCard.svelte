```
<script lang="ts">
	import type { ContentComponentProps } from '../../types';
	import type { YoutubeProfileData } from './api.server';
	import { getAdditionalUserData } from '$lib/website/context';
	import type { CreationModalComponentProps } from '$lib/website/components/creation-modal/types';

	let { item, oncreate, oncancel }: CreationModalComponentProps = $props();

	// svelte-ignore state_referenced_locally
	let url = $state(item.cardData.url || '');

	const additionalData = getAdditionalUserData() as any;
	const profile = $derived(additionalData[item.cardType]?.[item.cardData.url] || null);
</script>

<a
	href={item.cardData.url}
	target="_blank"
	rel="noopener noreferrer"
	class="group flex h-full w-full flex-col items-center justify-center gap-2 rounded-xl p-4 transition-all duration-300"
>
	{#if profile}
		<div class="relative">
			<img
				src={profile.avatar}
				alt={profile.title}
				class="aspect-square size-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
			/>
			<div class="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-sm">
				<svg viewBox="0 0 24 24" class="size-4" fill="currentColor">
					<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
				</svg>
			</div>
		</div>
		<div class="flex flex-col items-center text-center">
			<h3 class="line-clamp-1 text-lg font-bold leading-tight">
				{profile.title}
			</h3>
			<p class="text-base-500 dark:text-base-400 text-xs font-medium">
				{profile.handle || profile.id}
			</p>
			<div class="mt-2 flex items-center gap-1.5 rounded-full bg-[#FF0000]/10 px-3 py-1 text-[#FF0000] dark:bg-[#FF0000]/20">
				<span class="text-xs font-bold">{profile.subscriberCountText}</span>
			</div>
		</div>
	{:else}
		<div class="flex flex-col items-center gap-3">
			<div class="aspect-square size-20 animate-pulse rounded-full bg-base-200 dark:bg-base-800"></div>
			<div class="h-4 w-24 animate-pulse rounded bg-base-200 dark:bg-base-800"></div>
			<div class="h-6 w-32 animate-pulse rounded-full bg-base-200 dark:bg-base-800"></div>
		</div>
	{/if}
</a>
