import { query, getRequestEvent } from '$app/server';
import { createCache } from '$lib/cache';

export interface YoutubeProfileData {
    id: string;
    title: string;
    avatar: string;
    subscriberCountText: string;
    handle: string;
    url: string;
}

export const fetchYoutubeProfile = query('unchecked', async (channelUrl: string): Promise<YoutubeProfileData | undefined> => {
    const { platform } = getRequestEvent();
    const cache = createCache(platform);

    const cached = await cache?.get('youtube', channelUrl);
    if (cached) return JSON.parse(cached);

    try {
        const response = await fetch(channelUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) return undefined;

        const html = await response.text();

        // Try to find ytInitialData
        const jsonMatch = html.match(/var ytInitialData = ({.*?});<\/script>/);
        if (!jsonMatch) return undefined;

        const data = JSON.parse(jsonMatch[1]);

        const header = data.header?.pageHeaderRenderer || data.header?.c4TabbedHeaderRenderer;
        if (!header) return undefined;

        const profile: YoutubeProfileData = {
            id: data.responseContext?.serviceTrackingParams?.[0]?.params?.find((p: any) => p.key === 'browse_id')?.value || '',
            title: header.title?.simpleText || header.title?.runs?.[0]?.text || '',
            avatar: header?.content?.pageHeaderProcessor?.profilePicRenderer?.image?.thumbnails?.[0]?.url ||
                header.avatar?.thumbnails?.[0]?.url || '',
            subscriberCountText: header.subscriberCountText?.simpleText ||
                header.metadata?.contentMetadataRenderer?.metadata?.[1]?.metadata?.contentMetadataRenderer?.metadata?.[0]?.simpleText ||
                '0 subscribers',
            handle: header.metadata?.contentMetadataRenderer?.metadata?.[0]?.metadata?.contentMetadataRenderer?.metadata?.[0]?.simpleText || '',
            url: channelUrl
        };

        if (!profile.title && !profile.id) return undefined;

        await cache?.put('youtube', channelUrl, JSON.stringify(profile), 60 * 60 * 24); // Cache for 24 hours
        return profile;
    } catch (error) {
        console.error('Failed to fetch YouTube profile:', error);
        return undefined;
    }
});
