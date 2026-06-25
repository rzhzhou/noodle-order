# 粉面下单系统

## 架构

| 项目 | 技术栈 | 部署位置 |
|---|---|---|
| 小程序端 | Vue 3 + Vite | Netlify |
| 管理后台 | Vue 3 + Vite | Netlify |
| 后端 API | Java 17 + Spring Boot | Render / 自托管 |

## 后端部署（Render）

1. Fork 或推送代码到 GitHub
2. 在 Render.com 创建 Web Service，选择该仓库
3. Build Command: `mvn clean package -DskipTests`
4. Start Command: `java -jar target/noodle-order-1.0.0.jar`
5. 部署后获得 URL，例如 `https://noodle-api.onrender.com`

## 前端部署

前端需要设置环境变量 `VITE_API_BASE` 指向后端 URL。