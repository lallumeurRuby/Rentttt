# Rentttt — 一起找房子

三人共用的找租屋紀錄平台：記錄房屋物件、依分租權重試算每人租金（標示超出預算）、匿名投票決定是否列入考慮，並追蹤房東與看房進度。

| 部分 | 技術                                            | 位置                                    |
| ---- | ----------------------------------------------- | --------------------------------------- |
| 後端 | FastAPI + SQLAlchemy + Alembic + PostgreSQL     | `backend/`                            |
| 前端 | Next.js 14 + MSW + Zod                          | `frontend/`                           |
| 規格 | Activity、feature（Gherkin）、erm.dbml、api.yml | `specs/`、`backend/tests/features/` |

## 需要先安裝

- **Python 3.11+**
- **Node.js 20+**
- **Docker Desktop**：本機資料庫和後端測試都會用到

## 連接埠

| 服務       | 埠             | 說明                             |
| ---------- | -------------- | -------------------------------- |
| PostgreSQL | **5434** | 本機 5432、5433 已被其他專案使用 |
| 後端 API   | 8000           |                                  |
| 前端       | **3100** | 3000 已被其他專案使用            |

---

## 第一次設定

```bash
# 後端
cd backend
python -m venv .venv
.venv/Scripts/python.exe -m pip install -r requirements.txt   # macOS / Linux：.venv/bin/...

# 前端
cd ../frontend
npm install
```

## 啟動（前端 + 真實後端）

需要開三個終端機，每個指令都從專案根目錄開始。

**1. 資料庫**

```bash
cd backend
docker compose up -d                              # 啟動 rentttt-postgres（5434）
.venv/Scripts/python.exe -m alembic upgrade head  # 建表，並寫入 ruby / joyce / cya
```

**2. 後端**

```bash
cd backend
.venv/Scripts/uvicorn.exe app.main:app --port 8000
```

健康檢查：`curl http://localhost:8000/health` 應回傳 `{"status":"ok"}`。

**3. 前端**

```bash
cd frontend
npm run dev -- -p 3100
```

打開 http://localhost:3100，點選自己的名字登入。

前端會把 `/api/*` 轉發（proxy）到 `BACKEND_URL`，預設是 `http://localhost:8000`。

## 只跑前端（mock 模式，不需要後端）

前端內建 MSW mock，資料存在瀏覽器記憶體裡，重新整理就會重設：

- 刪掉 `frontend/.env.development.local`，或把裡面的 `NEXT_PUBLIC_MOCK_API` 改成 `true`。
- 然後執行 `npm run dev -- -p 3100`。

| 檔案                                | 用途                                                                   |
| ----------------------------------- | ---------------------------------------------------------------------- |
| `frontend/.env.development`       | 預設設定（mock 模式），會被 git 追蹤                                   |
| `frontend/.env.development.local` | 本機覆寫（`NEXT_PUBLIC_MOCK_API=false` = 連真實後端），已被 git 忽略 |

## 測試

後端 BDD E2E 測試會用 Testcontainers 自動啟動暫時的 PostgreSQL，不會碰到開發用的資料庫，但需要 Docker Desktop 正在執行。

```bash
cd backend
PYTHONUTF8=1 .venv/Scripts/behave.exe tests/features/ --tags=~@ignore   # 預期 86 scenarios passed
.venv/Scripts/python.exe -m mypy app --ignore-missing-imports
```

前端型別檢查：

```bash
cd frontend
npm run typecheck
```

## 停止

- 前端、後端：在各自的終端機按 `Ctrl+C`。
- 資料庫：`cd backend && docker compose stop`。資料保留在具名資料卷 `rentttt_postgres_data`。

## 環境變數（後端）

| 變數             | 預設值                                                                | 說明                                             |
| ---------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| `DATABASE_URL` | `postgresql+psycopg://postgres:postgres@localhost:5434/rentttt_dev` | 資料庫連線                                       |
| `JWT_SECRET`   | 開發用預設值                                                          | **正式環境務必改成至少 32 字元的隨機字串** |
| `CORS_ORIGINS` | `*`                                                                   | 逗號分隔的允許來源（正式環境填前端網址）         |

可以寫在 `backend/.env` 裡（範本見 `backend/.env.example`，`.env` 已被 git 忽略）。

## 部署（免費方案）

```
瀏覽器 → Vercel（前端）→ /api/* 轉發 → Render（FastAPI）→ Supabase（PostgreSQL）
```

| 部分   | 平台                            | 設定來源                      |
| ------ | ------------------------------- | ----------------------------- |
| 資料庫 | Supabase                        | Dashboard 的連線字串          |
| 後端   | Render（Free Web Service）      | 專案根目錄的 `render.yaml`    |
| 前端   | Vercel（Hobby）                 | Vercel Dashboard 的環境變數   |

### 1. Supabase（資料庫）

1. Dashboard → **Connect** → 選 **Session pooler**（port 5432，支援 IPv4），複製連線字串。
2. 把開頭改成 `postgresql+psycopg://`，結尾加上 `?sslmode=require`。密碼若含特殊字元，要先 URL-encode。
3. 不需要手動建表：後端每次部署都會自動執行 `alembic upgrade head`。這會建表、寫入三位成員的初始資料，並開啟 RLS，擋住 Supabase 自動開放的 Data API。

### 2. Render（後端）

1. 用 GitHub 登入 Render → **New → Blueprint** → 選這個 repo。Render 會讀取 `render.yaml`，建立 `rentttt-api` 服務。
2. 填入環境變數：
   - `DATABASE_URL`：Supabase 的連線字串
   - `CORS_ORIGINS`：Vercel 的前端網址
   - `JWT_SECRET`：Render 會自動產生，不用填
3. 部署完成後，確認 `https://<服務名>.onrender.com/health` 回傳 `{"status":"ok"}`。

### 3. Vercel（前端）

1. 用 GitHub 登入 Vercel → **Add New → Project** → Import 這個 repo。
2. **Root Directory** 設成 `frontend`，框架會自動偵測為 Next.js。
3. 設定 Environment Variables：

   | 變數                       | 值                                  |
   | -------------------------- | ----------------------------------- |
   | `NEXT_PUBLIC_MOCK_API`     | `false`                             |
   | `NEXT_PUBLIC_API_BASE_URL` | `/api`                              |
   | `BACKEND_URL`              | `https://<服務名>.onrender.com`     |

4. 部署完成後，回到 Render 把 `CORS_ORIGINS` 設成 Vercel 的網址。

### 之後怎麼更新

`git push` 到 `main` 後，Render 和 Vercel 都會自動重新部署。後端每次部署都會套用新的 migration。

### 免費方案的限制

- **Render 會休眠：** 閒置 15 分鐘後休眠，下一次開啟要等約 30–60 秒，之後就恢復正常速度。
- **Supabase 會暫停：** 連續 7 天沒有任何請求，專案會暫停，要到 Dashboard 手動恢復。
- **登入沒有密碼：** 依需求只要點名字就能登入，所以任何知道網址的人都能登入。請只把網址分享給成員。

## 常見問題

- **後端測試輸出亂碼，或出現 `UnicodeDecodeError`**：設定 `PYTHONUTF8=1` 再執行（Windows 預設編碼是 cp950）。
- **`docker compose up` 衝突**：`docker-compose.yml` 已設定 `name: rentttt`，不會和其他放在 `backend/` 資料夾的 compose 專案撞名。請不要移除這一行。
- **切換成員**：上方列的「切換成員」會回到登入頁。系統依需求不提供登出功能。

## 專案文件

- 需求與釐清紀錄：`specs/clarify/`
- 工程計畫與各 Phase 卡片：`plans/house-hunting-tracker/`
- API 契約：`specs/api.yml`；資料模型：`specs/erm.dbml`
- 行為規格：`backend/tests/features/**/*.feature`
