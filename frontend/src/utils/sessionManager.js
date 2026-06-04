const SESSION_KEY = 'passport_session';
const HISTORY_KEY = 'passport_history';

export const saveSession = (data) => {
  try {
    // localUrl is a blob: URL — valid only in the current page lifecycle.
    // Strip it before persisting so a stale blob string never causes a broken
    // image preview when the session is restored after a page reload.
    const { localUrl, ...persistable } = data;
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({
        ...persistable,
        updatedAt: Date.now(),
      })
    );
  } catch (error) {
    console.error('Failed to save session:', error);
  }
};

export const getSession = () => {
  try {
    const data = localStorage.getItem(SESSION_KEY);

    if (!data) return null;

    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load session:', error);
    return null;
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Failed to clear session:', error);
  }
};

export const saveSessionToHistory = (session) => {
  try {
    const history = getSessionHistory();
    // Strip localUrl — blob: URLs are ephemeral and invalid after page reload.
    const { localUrl, ...persistable } = session;
    const newSession = {
      ...persistable,
      id: Date.now().toString(),
      savedAt: Date.now(),
      status: session.status || 'draft',
      photoSizePreset: session.photoSizePreset || session.sizePreset || '35x45',
      outputStatus: session.outputStatus || 'pending',
      hasOutput: session.hasOutput || false,
    };
    history.unshift(newSession);
    const limitedHistory = history.slice(0, 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
  } catch (error) {
    console.error('Failed to save session to history:', error);
  }
};

export const getSessionHistory = () => {
  try {
    const data = localStorage.getItem(HISTORY_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to load session history:', error);
    return [];
  }
};

export const deleteSessionFromHistory = (sessionId) => {
  try {
    const history = getSessionHistory();
    const filteredHistory = history.filter(
      (session) => session.id !== sessionId
    );
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory));
  } catch (error) {
    console.error('Failed to delete session from history:', error);
  }
};

export const clearSessionHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error('Failed to clear session history:', error);
  }
};
