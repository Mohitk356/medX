export function encodeURL(url: string) {
    return encodeURIComponent(url.toLowerCase().trim().replace(/ /g, '-'));
}

export function decodeURL(url: string) {
    return decodeURIComponent(url.replace(/-/g, ' '));
}