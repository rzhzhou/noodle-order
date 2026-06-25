const BASE_URL = "/api";

async function request(url, method = "GET", data = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (data && method === "POST") {
    options.body = JSON.stringify(data);
  }
  const response = await fetch(BASE_URL + url, options);
  const result = await response.json();
  if (result.code === 200) {
    return result.data;
  }
  throw new Error(result.message || "请求失败");
}

export const get = (url) => request(url);
export const post = (url, data) => request(url, "POST", data);