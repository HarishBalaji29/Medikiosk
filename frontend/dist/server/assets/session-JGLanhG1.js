const KEY = "medikiosk:session";
function setSession(s) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
  }
}
function getSession() {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return null;
    return parsed;
  } catch {
    return null;
  }
}
function clearSession() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
  }
}
export {
  clearSession as c,
  getSession as g,
  setSession as s
};
