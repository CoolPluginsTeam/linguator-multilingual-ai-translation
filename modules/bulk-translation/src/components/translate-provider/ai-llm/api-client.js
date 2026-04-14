/**
 * Server-side LLM batch translation (OpenAI / Gemini / Anthropic via WordPress AI Client).
 *
 * @param {Object} opts
 * @param {string} opts.provider
 * @param {number|string} opts.postId
 * @param {string} [opts.objectType]
 * @param {string} opts.sourceLang
 * @param {string} opts.targetLang
 * @param {Record<string,string>} opts.strings
 * @param {string} [opts.model] Optional model id override
 * @param {string} opts.restUrl Full REST URL (…/bulk-translate/ai-translate-batch)
 * @param {string} opts.nonce wp_rest nonce
 * @returns {Promise<Record<string,string>>}
 */
export async function requestAiBatch({ provider, postId, objectType = 'post', sourceLang, targetLang, strings, model = '', restUrl, nonce }) {
    const maxRetries = 3;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        let res;
        try {
            res = await fetch(restUrl, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-Nonce': nonce,
                },
                body: JSON.stringify({
                    provider,
                    post_id: Number(postId),
                    object_type: objectType,
                    source_lang: sourceLang,
                    target_lang: targetLang,
                    model: model || '',
                    strings,
                }),
            });
        } catch (error) {
            const networkMessage = error?.message || 'Network request failed';
            if (attempt < maxRetries) {
                await wait(backoffMs(attempt));
                continue;
            }
            throw new Error(`Translation request failed: ${networkMessage}`);
        }

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (!res.ok) {
            if (isRetryableStatus(res.status) && attempt < maxRetries) {
                await wait(backoffMs(attempt, res.headers.get('Retry-After')));
                continue;
            }
            const errorMessage = resolveErrorMessage(data, res.status, res.statusText);
            throw new Error(errorMessage);
        }

        return data.translations && typeof data.translations === 'object' ? data.translations : {};
    }

    throw new Error('Translation request failed');
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
    return status === 429 || status === 503 || status === 502;
}

function backoffMs(attempt, retryAfterHeader = '') {
    const retryAfter = Number.parseInt(retryAfterHeader, 10);
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
        return retryAfter * 1000;
    }
    return Math.min(15000, 1500 * (2 ** attempt));
}

function resolveErrorMessage(data, status, statusText) {
    if (typeof data?.message === 'string' && data.message.trim() !== '') {
        return data.message;
    }

    if (typeof data?.data === 'string' && data.data.trim() !== '') {
        return data.data;
    }

    if (typeof data?.data?.message === 'string' && data.data.message.trim() !== '') {
        return data.data.message;
    }

    if (typeof data?.data?.error === 'string' && data.data.error.trim() !== '') {
        return data.data.error;
    }

    if (status === 401 || status === 403) {
        return 'You are not authorized to translate this content.';
    }

    if (status === 429) {
        return 'Rate limit/quota exceeded for Gemini. Please check billing and limits, then retry with smaller batches.';
    }

    if (status >= 500) {
        return 'AI translation service is temporarily unavailable (server returned 5xx). Please retry in a minute.';
    }

    return statusText || 'Translation request failed';
}

// Keep AI batch payload smaller to reduce server/gateway 5xx errors.
const CHUNK_KEYS = 20;
const CHUNK_CHARS = 6000;

/**
 * @param {Record<string,string>} map
 * @returns {Array<Record<string,string>>}
 */
export function chunkStringMap(map) {
    const chunks = [];
    let current = {};
    let charBudget = 0;
    const keys = Object.keys(map);

    for (const k of keys) {
        const v = map[k] ?? '';
        const entryCost = k.length + String(v).length;
        if (Object.keys(current).length >= CHUNK_KEYS || (charBudget + entryCost > CHUNK_CHARS && Object.keys(current).length > 0)) {
            chunks.push(current);
            current = {};
            charBudget = 0;
        }
        current[k] = v;
        charBudget += entryCost;
    }
    if (Object.keys(current).length > 0) {
        chunks.push(current);
    }
    return chunks.length ? chunks : [{}];
}
