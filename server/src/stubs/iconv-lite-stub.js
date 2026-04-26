// iconv-lite stub for Cloudflare Workers
// body-parser imports iconv-lite, but we bypass body-parser entirely in index.ts
// This stub prevents the Workers runtime from crashing on iconv-lite's stream dependency

export function decode(buffer, encoding) {
    // Workers environment uses UTF-8 natively; this path should never be hit
    // because our custom JSON middleware reads the body directly
    if (typeof buffer === 'string') return buffer;
    return new TextDecoder(encoding || 'utf-8').decode(buffer);
}

export function encode(string, encoding) {
    return new TextEncoder().encode(string);
}

export function encodingExists(encoding) {
    return encoding === 'utf-8' || encoding === 'utf8';
}

export function getEncoder(encoding) {
    return { write: (s) => encode(s, encoding), end: () => new Uint8Array() };
}

export function getDecoder(encoding) {
    return { write: (b) => decode(b, encoding), end: () => '' };
}

// CommonJS-style default export shape that body-parser expects
const iconvLite = { decode, encode, encodingExists, getEncoder, getDecoder };
export default iconvLite;