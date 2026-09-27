export const canonicalOrigin = 'https://rodrigovaldelvira.com';
export const canonicalUrl = (path: string) => new URL(path, canonicalOrigin).href;
