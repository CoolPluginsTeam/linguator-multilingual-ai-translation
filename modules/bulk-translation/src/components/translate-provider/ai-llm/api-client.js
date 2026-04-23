/**
 * Server-side LLM batch translation (Gemini via WordPress AI Client).
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
            throw createTranslationError(`Translation request failed: ${networkMessage}`);
        }

        let data = {};
        try {
            data = await res.json();
        } catch {
            data = {};
        }

        if (!res.ok) {
            if (isQuotaExceededResponse(data, res.status)) {
                throw createTranslationError(
                    'API quota exceeded (429). Please check your plan/billing and retry later.',
                    'LLM_QUOTA_EXCEEDED'
                );
            }

            if (isRetryableStatus(res.status) && attempt < maxRetries) {
                await wait(backoffMs(attempt, res.headers.get('Retry-After')));
                continue;
            }
            const errorMessage = resolveErrorMessage(data, res.status, res.statusText);
            throw createTranslationError(errorMessage);
        }

        return data.translations && typeof data.translations === 'object' ? data.translations : {};
    }

    throw new Error('Translation request failed');
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableStatus(status) {
    return status === 503 || status === 502;
}

function backoffMs(attempt, retryAfterHeader = '') {
    const retryAfter = Number.parseInt(retryAfterHeader, 10);
    if (Number.isFinite(retryAfter) && retryAfter > 0) {
        return retryAfter * 1000;
    }
    return Math.min(15000, 1500 * (2 ** attempt));
}

function resolveErrorMessage(data, status, statusText) {
    const messageFromBody = firstNonEmptyString(
        data?.message,
        data?.data,
        data?.data?.message,
        data?.data?.error
    );

    if (isQuotaExceededResponse(data, status)) {
        return 'API quota exceeded (429). Please check your plan/billing and retry later.';
    }

    if (messageFromBody) {
        return sanitizeErrorMessage(messageFromBody);
    }

    if (status === 401 || status === 403) {
        return 'You are not authorized to translate this content.';
    }

    if (status >= 500) {
        return 'AI translation service is temporarily unavailable (server returned 5xx). Please retry in a minute.';
    }

    return statusText || 'Translation request failed';
}

function createTranslationError(message, code = 'LLM_REQUEST_FAILED') {
    const error = new Error(message);
    error.code = code;
    return error;
}

function firstNonEmptyString(...values) {
    for (const value of values) {
        if (typeof value === 'string' && value.trim() !== '') {
            return value.trim();
        }
    }
    return '';
}

function sanitizeErrorMessage(message) {
    if (!message) {
        return 'Translation request failed';
    }

    // Keep only the primary line and remove verbose docs/traces.
    const firstLine = message
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)[0] || message;

    const compact = firstLine.replace(/\s+/g, ' ').trim();
    const trimmedAtDocs = compact.split(/\s+For more information/i)[0].trim();
    const trimmed = trimmedAtDocs || compact;

    return trimmed.length > 220 ? `${trimmed.slice(0, 217)}...` : trimmed;
}

function isQuotaExceededResponse(data, status) {
    if (status === 429) {
        return true;
    }

    const probe = [
        data?.message,
        data?.data,
        data?.data?.message,
        data?.data?.error,
    ]
        .filter((value) => typeof value === 'string')
        .join(' ')
        .toLowerCase();

    return (
        probe.includes('quota exceeded') ||
        probe.includes('too many requests') ||
        probe.includes('rate limit') ||
        probe.includes('free_tier')
    );
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
