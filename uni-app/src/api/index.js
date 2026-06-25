const API_BASE = "https://lighthearted-sprite-d4785b.netlify.app/api";

async function request(url, method, data) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE + url,
      method: method || "GET",
      header: { "Content-Type": "application/json" },
      data: data && method === "POST" ? JSON.stringify(data) : undefined,
      success: (res) => {
        const r = res.data;
        if (r && r.code === 200) resolve(r.data);
        else reject(new Error((r && r.message) || "请求失败"));
      },
      fail: () => reject(new Error("网络请求失败")),
    });
  });
}

export const get = (url) => request(url, "GET");
export const post = (url, data) => request(url, "POST", data);
