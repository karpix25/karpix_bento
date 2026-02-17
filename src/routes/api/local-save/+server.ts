import { json } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import fs from 'fs';
import path from 'path';

export async function POST({ request }) {
    if (env.PUBLIC_LOCAL_STORAGE !== 'true') {
        return json({ error: 'Local storage not enabled' }, { status: 403 });
    }

    const data = await request.json();
    const filePath = path.join(process.cwd(), 'src/lib/data.json');

    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, '\t'));
        return json({ success: true });
    } catch (error) {
        console.error('Failed to save local data', error);
        return json({ error: 'Failed to save data' }, { status: 500 });
    }
}
