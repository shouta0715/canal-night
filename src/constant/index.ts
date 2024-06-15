// export const API_URL = "http://localhost:8787";
// export const WS_URL = "ws://localhost:8787";
const TUNNEL_URL = process.env.NEXT_PUBLIC_TUNNEL_URL;
export const API_URL = `https://${TUNNEL_URL}`;

export const WS_URL = `wss://${TUNNEL_URL}`;
