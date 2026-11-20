// Who is signed in, shared with every page.
// The token is kept in localStorage so a refresh doesn't sign you out.
// There is no logout endpoint: signing out just forgets the token.
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ApiError, getMe, login, type LoginInput, type User } from "./api";

const TOKEN_KEY = "carona.token";

function readToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function writeToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // Storage blocked (private window): the session lasts until the tab closes.
  }
}

/** "checking": a saved token is being verified with GET /users/me. */
type Status = "checking" | "signed-in" | "signed-out";

type AuthValue = {
  user: User | null;
  token: string | null;
  status: Status;
  /** POST /users/login, then GET /users/me. Throws ApiError on failure. */
  signIn: (input: LoginInput) => Promise<User>;
  signOut: () => void;
  /** Fetch GET /users/me again, for example after editing the profile. Throws ApiError on failure. */
  refreshUser: () => Promise<User>;
};

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<Status>(token ? "checking" : "signed-out");

  const signOut = useCallback(() => {
    writeToken(null);
    setToken(null);
    setUser(null);
    setStatus("signed-out");
  }, []);

  // On first load, check that a saved token still works.
  useEffect(() => {
    const saved = readToken();
    if (!saved) return;
    let cancelled = false;
    getMe(saved)
      .then((me) => {
        if (cancelled) return;
        setUser(me);
        setStatus("signed-in");
      })
      .catch((err) => {
        if (cancelled) return;
        // 401: the token expired or is invalid. Anything else (API down): stay signed out for now.
        if (err instanceof ApiError && err.status === 401) writeToken(null);
        setToken(null);
        setStatus("signed-out");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (input: LoginInput) => {
    const newToken = await login(input);
    const me = await getMe(newToken);
    writeToken(newToken);
    setToken(newToken);
    setUser(me);
    setStatus("signed-in");
    return me;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) throw new ApiError(401, null);
    const me = await getMe(token);
    setUser(me);
    return me;
  }, [token]);

  const value = useMemo(
    () => ({ user, token, status, signIn, signOut, refreshUser }),
    [user, token, status, signIn, signOut, refreshUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside <AuthProvider>");
  return value;
}
