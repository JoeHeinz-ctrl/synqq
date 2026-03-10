const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function handleResponse(res: Response) {
  const data = await res.json();              // ✅ read ONCE

  if (!res.ok) {
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);                 // ✅ never parse twice
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  // ✅ CRITICAL LINE — STORE TOKEN
  localStorage.setItem("token", data.access_token);

  // Pick a per-login greeting variant so each login can feel fresh
  try {
    const variants = [0, 1, 2, 3, 4];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem("greeting_variant", String(pick));
    localStorage.setItem("greeting_ts", String(Date.now()));
  } catch {}

  return data;
}

