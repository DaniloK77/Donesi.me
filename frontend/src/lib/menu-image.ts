/**
 * Menu images can come from two places: files shipped with the app ("/images/…")
 * and URLs an administrator pastes into the panel. `next/image` only accepts
 * remote hosts that are whitelisted in next.config, and whitelisting arbitrary
 * hosts would turn the server into an open image proxy — so remote URLs are
 * rendered as plain <img> instead, and only local paths get optimised.
 */

export const isRemoteImage = (url: string) => /^https?:\/\//i.test(url.trim());

/** Accepts a local path or an http(s) URL; anything else is rejected. */
export const isUsableImageUrl = (url: string) => {
  const value = url.trim();

  if (!value) {
    return false;
  }

  return value.startsWith("/") || isRemoteImage(value);
};
