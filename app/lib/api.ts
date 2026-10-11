const TOKEN_KEY = "vac_auth_token";
const API_BASE = "https://vac-server.vercel.app";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: "student" | "faculty" | "admin";
  facultyType: string | null;
  createdAt: string;
};

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

function apiUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401 && !path.includes("/api/auth/")) {
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.assign("/login");
    }
  }

  if (!response.ok) {
    throw new ApiError(
      typeof data?.message === "string" ? data.message : "Request failed",
      response.status
    );
  }

  return data as T;
}

export type RegisterPayload = {
  fullName: string;
  email: string;
  password: string;
  role: "student" | "faculty" | "admin";
  facultyType?: "internal" | "external" | null;
};

export async function checkHealth() {
  return apiRequest<{ status: string }>("/health");
}

export async function loginRequest(email: string, password: string) {
  return apiRequest<{ message: string; user: AuthUser; token: string }>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest(payload: RegisterPayload) {
  return apiRequest<{ message: string; user: AuthUser; token: string }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getCurrentUser() {
  const data = await apiRequest<{ user: AuthUser }>("/api/auth/me");
  return data.user;
}
