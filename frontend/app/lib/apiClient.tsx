import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  withCredentials: true,
});

api.interceptors.request.use(cfg => {
  const accessToken = Cookies.get("access-token");
  const client      = Cookies.get("client");
  const uid         = Cookies.get("uid");
  if (accessToken && client && uid) {
    cfg.headers["access-token"] = accessToken;
    cfg.headers["client"]       = client;
    cfg.headers["uid"]          = uid;
  }
  return cfg;
});

export const signUp = (payload: {
  email: string;
  password: string;
  passwordConfirmation: string;
}) => api.post("/auth", {
  email: payload.email,
  password: payload.password,
  password_confirmation: payload.passwordConfirmation,
});

export const signIn = (payload: { email: string; password: string }) =>
  api.post("/auth/sign_in", payload);

export const signOut = () => api.delete("/auth/sign_out");

export const fetchCurrentUser = () => api.get("/auth/validate_token");