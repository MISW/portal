const STATE_KEY = "auth_state";

export function saveState(continuePath: string): void {
  if (continuePath.startsWith("/")) {
    sessionStorage.setItem(STATE_KEY, continuePath);
  }
}

export function loadState(): string | null {
  const continuePath = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);
  return continuePath;
}
