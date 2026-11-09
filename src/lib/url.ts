/** Prefix a root-relative path with the site's base, so links work under a subpath. */
export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;
