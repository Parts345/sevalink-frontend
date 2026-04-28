const API_BASE_URL = import.meta.env.VITE_API_URL;

export async function loginUser(data) {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function getMatches(token) {
  const res = await fetch(`${API_BASE_URL}/api/tasks/matches/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function getTasks() {
  const res = await fetch(`${API_BASE_URL}/api/tasks`);
  return res.json();
}

export async function createTask(data, token) {
  const res = await fetch(`${API_BASE_URL}/api/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(data)
  });
  return res.json();
}

// --- ADMIN DASHBOARD STATS ---
export const getDashboardStats = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: "Navi Mumbai", needs: 120, volunteers: 45 },
        { name: "Thane", needs: 85, volunteers: 60 },
        { name: "Andheri", needs: 200, volunteers: 95 },
        { name: "Bandra", needs: 40, volunteers: 45 },
        { name: "Kalyan", needs: 150, volunteers: 30 }
      ]);
    }, 500);
  });
};