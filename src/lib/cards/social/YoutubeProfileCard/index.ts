import type { CardDefinition } from '../../types';
import CreateYoutubeProfileCardModal from './CreateYoutubeProfileCardModal.svelte';
import YoutubeProfileCard from './YoutubeProfileCard.svelte';
import type { YoutubeProfileData } from './types';
import { fetchYoutubeProfile } from './api.remote';

export const YoutubeProfileCardDefinition = {
	type: 'youtubeProfile',
	contentComponent: YoutubeProfileCard,
	creationModalComponent: CreateYoutubeProfileCardModal,

	loadData: async (items) => {
		const youtubeData: Record<string, YoutubeProfileData> = {};
		for (const item of items) {
			const channelUrl = item.cardData.url;
			if (!channelUrl) continue;
			try {
				const data = await fetchYoutubeProfile(channelUrl);
				if (data) youtubeData[channelUrl] = data;
			} catch (error) {
				console.error('Failed to fetch YouTube profile data:', error);
			}
		}
		return youtubeData;
	},
	loadDataServer: async (items) => {
		const youtubeData: Record<string, YoutubeProfileData> = {};
		for (const item of items) {
			const channelUrl = item.cardData.url;
			if (!channelUrl) continue;
			try {
				const data = await fetchYoutubeProfile(channelUrl);
				if (data) youtubeData[channelUrl] = data;
			} catch (error) {
				console.error('Failed to fetch YouTube profile data:', error);
			}
		}
		return youtubeData;
	},

	onUrlHandler: (url, item) => {
		const normalizedUrl = normalizeYoutubeUrl(url);
		if (!normalizedUrl) return null;

		item.cardData.url = normalizedUrl;
		item.cardType = 'youtubeProfile';
		item.w = 4;
		item.h = 2;
		item.mobileW = 8;
		item.mobileH = 4;

		return item;
	},

	urlHandlerPriority: 5,

	name: 'YouTube Profile',
	keywords: ['youtube', 'channel', 'subscribers', 'content creator'],
	groups: ['Social'],
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 180" fill="currentColor" class="size-4"><path d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134" /></svg>`
} as CardDefinition & { type: 'youtubeProfile' };

function normalizeYoutubeUrl(url: string): string | null {
	if (!url) return null;
	const match = url.match(
		/(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:@|channel\/|c\/|user\/)[^/?#]+/i
	);
	if (match) {
		return match[0].startsWith('http') ? match[0] : `https://${match[0]}`;
	}
	return null;
}
