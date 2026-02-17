import { json } from '@sveltejs/kit';
import { getLinkPreview } from 'link-preview-js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const link = url.searchParams.get('link');
	if (!link) {
		return json({ error: 'No link provided' }, { status: 400 });
	}

	try {
		new URL(link);
	} catch {
		return json({ error: 'Link is not a valid url' }, { status: 400 });
	}

	try {
		const data = await getLinkPreview(link, {
			followRedirects: 'follow'
		});
		return json(data);
	} catch (error) {
		console.error('Error fetching link preview:', error);
		return json({ error: 'Failed to fetch link preview' }, { status: 500 });
	}
};
