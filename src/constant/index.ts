// export const API_URL = "http://localhost:8787";
// export const WS_URL = "ws://localhost:8787";
const TUNNEL_URL = process.env.NEXT_PUBLIC_TUNNEL_URL;

const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
const wsProtocol = process.env.NODE_ENV === "development" ? "ws" : "wss";

export const API_URL = `${protocol}://${TUNNEL_URL}`;

export const WS_URL = `${wsProtocol}://${TUNNEL_URL}`;
