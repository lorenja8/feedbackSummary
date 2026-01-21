export interface DecodedJWT {
  sub: string;   // uid
  role: string;
  exp: number;   // expiration timestamp (seconds)
}

export function decodeJWT(token: string): any {
  try {
    const base64 = token.split(".")[1];
    const payload = atob(base64);
    return JSON.parse(payload); // { sub, role, exp }
  } catch (e) {
    console.error("Failed to decode JWT:", e);
    return null;
  }
}
