const SESSION_HINT_KEY = "tweetx:has-session";

export const hasSessionHint = () =>
  window.localStorage.getItem(SESSION_HINT_KEY) === "true";

export const setSessionHint = () => {
  window.localStorage.setItem(SESSION_HINT_KEY, "true");
};

export const clearSessionHint = () => {
  window.localStorage.removeItem(SESSION_HINT_KEY);
};
