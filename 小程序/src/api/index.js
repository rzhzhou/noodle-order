// API base URL - configurable via environment variable
// For local dev: Vite proxy handles /api -> localhost:8080
// For production: set VITE_API_BASE to your backend URL (e.g. https://your-api.com)
const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(url, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data && method === "POST") {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(API_BASE + url, options);
  const result = await response.json();
  if (result.code === 200) {
    return result.data;
  }
  throw new Error(result.message || "请求失败");
}

export const get = (url) => request(url);
export const post = (url, data) => request(url, "POST", data);