const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

/* ---------------- HELPER ---------------- */

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse(res: Response) {
  const data = await res.json();

  if (!res.ok) {
    if (res.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    throw new Error(data.detail || "Request failed");
  }

  return data;
}

/* ---------------- AUTH ---------------- */

export async function registerUser(name: string, email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  return handleResponse(res);
}

export async function googleLogin(token: string) {
  const res = await fetch(`${API_URL}/auth/google`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ code: token }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.detail || "Google login failed");
  }

  localStorage.setItem("token", data.access_token);
  try {
    const variants = [0,1,2,3,4];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem("greeting_variant", String(pick));
    localStorage.setItem("greeting_ts", String(Date.now()));
  } catch {}

  return data;
}

export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  localStorage.setItem("token", data.access_token);
  try {
    const variants = [0,1,2,3,4];
    const pick = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem("greeting_variant", String(pick));
    localStorage.setItem("greeting_ts", String(Date.now()));
  } catch {}

  return data;
}

/* ---------------- USER ---------------- */

export async function getCurrentUser() {
  const res = await fetch(`${API_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/* ---------------- TASKS ---------------- */

export async function fetchTasks(projectId: number) {
  const res = await fetch(`${API_URL}/tasks/`, {
    headers: getAuthHeaders(),
  });

  const data = await handleResponse(res);

  return data.filter((t: any) => t.project_id === projectId);
}

export async function createTask(title: string, projectId: number, status: string = "TODO") {
  const res = await fetch(`${API_URL}/tasks/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({
      title,
      status,
      project_id: projectId,
    }),
  });

  return handleResponse(res);
}

export async function moveTask(taskId: number, status: string) {
  const res = await fetch(`${API_URL}/tasks/${taskId}/move?status=${status}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function deleteTask(taskId: number) {
  const res = await fetch(`${API_URL}/tasks/${taskId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function reorderTasks(taskIds: number[]) {
  const res = await fetch(`${API_URL}/tasks/reorder`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify({ task_ids: taskIds }),
  });
  return handleResponse(res);
}

export async function renameTask(taskId: number, title: string) {
  const res = await fetch(`${API_URL}/tasks/${taskId}?title=${encodeURIComponent(title)}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

/* ---------------- PROJECTS ---------------- */

export async function createProject(title: string, teamId?: number) {
  const res = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title, team_id: teamId ?? null }),
  });

  return handleResponse(res);
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects/`, {
    headers: getAuthHeaders(),
  });

  return handleResponse(res);
}

export async function renameProject(projectId: number, title: string) {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteProject(projectId: number) {
  const res = await fetch(`${API_URL}/projects/${projectId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

/* ---------------- TEAMS ---------------- */

export async function createTeam(name: string) {
  const res = await fetch(`${API_URL}/teams/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ name }),
  });
  return handleResponse(res);
}

export async function joinTeam(teamCode: string) {
  const res = await fetch(`${API_URL}/teams/join`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ team_code: teamCode }),
  });
  return handleResponse(res);
}

export async function fetchTeams() {
  const res = await fetch(`${API_URL}/teams/`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}

export async function fetchTeamProjects(teamId: number) {
  const res = await fetch(`${API_URL}/teams/${teamId}/projects`, {
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
}
