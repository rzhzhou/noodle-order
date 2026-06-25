const API_BASE = import.meta.env.VITE_API_BASE || "/api/admin";

async function req(url, method = "GET", data = null) {
  const opts = { method, headers: { "Content-Type": "application/json" } };
  if (data && method !== "GET") opts.body = JSON.stringify(data);
  const res = await fetch(API_BASE + url, opts);
  const json = await res.json();
  if (json.code === 200) return json.data;
  throw new Error(json.message || "请求失败");
}

export const get = (url) => req(url);
export const post = (url, data) => req(url, "POST", data);
export const put = (url, data) => req(url, "PUT", data);
export const del = (url) => req(url, "DELETE");