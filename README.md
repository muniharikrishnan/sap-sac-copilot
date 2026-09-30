# SAP SAC Copilot

An AI copilot for SAP Analytics Cloud, SAP Datasphere and SAP HANA, with four specialist assistants:
**SAC Assistant**, **Datasphere Assistant**, **HANA Assistant** and **Interview Prep**.

It is a Next.js front end on top of a [Dify](https://dify.ai) chat app. The model, prompts and knowledge live in Dify;
this repository only contains the UI plus a thin server-side proxy (`app/api/*`) that holds the Dify API key.

> Independent project. Not affiliated with or endorsed by SAP SE. "SAP", "SAP Analytics Cloud", "SAP Datasphere" and "SAP HANA" are trademarks of SAP SE.

## 1. Environment variables

Copy `.env.example` to `.env.local` (locally) or add these in **Vercel → Project → Settings → Environment Variables**:

| Variable | Secret? | Description |
|---|---|---|
| `NEXT_PUBLIC_APP_ID` | No | Dify app ID (from the app URL, e.g. `https://cloud.dify.ai/app/<APP_ID>/...`) |
| `APP_KEY` | **Yes** | Dify app API key (app → *API Access* → *API Key*) |
| `API_URL` | No | Dify API base URL, e.g. `https://api.dify.ai/v1` |

⚠️ Never name the key `NEXT_PUBLIC_APP_KEY` in new setups. `NEXT_PUBLIC_*` variables are meant for the browser.
The key is read only in `config/server.ts` (server-only). The old `NEXT_PUBLIC_APP_KEY` / `NEXT_PUBLIC_API_URL`
names are still accepted server-side for backward compatibility, but prefer `APP_KEY` / `API_URL`.

## 2. Dify setup for the four assistants

The UI sends the selected assistant to Dify as the input variable **`assistant_mode`** when a conversation starts:

| Assistant | `assistant_mode` value |
|---|---|
| SAC Assistant | `sac` |
| Datasphere Assistant | `datasphere` |
| HANA Assistant | `hana` |
| Interview Prep | `interview_prep` |

To make each assistant behave differently:

1. In Dify Studio, open your chat app → **Orchestrate** → **Variables** → **Add** → *Short text*.
2. Variable name: `assistant_mode`, label anything, **not required**.
3. Reference it in the system prompt, for example:

   ```text
   You are SAP SAC Copilot, an expert SAP analytics consultant.
   Current mode: {{assistant_mode}}
   - sac: SAP Analytics Cloud expert (stories, models, planning, data actions, scripting).
   - datasphere: SAP Datasphere expert (spaces, views, analytic models, data/replication flows).
   - hana: SAP HANA expert (SQL, SQLScript, calculation views, performance tuning).
   - interview_prep: act as an interviewer for SAP analytics roles. Ask one question at a time,
     wait for the answer, then give feedback and a score before the next question.
   If the mode is empty, answer as a general SAP analytics expert.
   ```
4. Publish the app.

The UI hides `assistant_mode` from the "conversation settings" form and fills it automatically.
Dify locks inputs when a conversation starts, so switching assistant always opens a new chat.
Without the variable, the assistants still work, but only as UI presets (same model behavior for all four).

Starter questions and descriptions for each assistant are in `config/assistants.ts`.

## 3. Develop

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm build      # production build
```

## 4. Deploy on Vercel

1. Import the repository in Vercel (framework preset: Next.js, package manager: pnpm).
2. Add the environment variables from section 1.
3. Deploy. `vercel.json` disables caching for `/api/*`.

> On the Vercel Hobby plan, serverless functions have a short execution limit, so very long streamed answers may be cut off.

## Project structure

| Path | Purpose |
|---|---|
| `config/index.ts` | App title, description, copyright |
| `config/assistants.ts` | The four assistants, their starter prompts and the `assistant_mode` variable name |
| `config/server.ts` | Server-only Dify credentials |
| `app/api/*` | Server-side proxy to the Dify API |
| `app/components/index.tsx` | Main page: state, Dify streaming, layout |
| `app/components/sidebar`, `header.tsx`, `dashboard` | Navigation, top bar, landing dashboard |
| `app/components/chat/*` | Messages and composer |
| `app/components/brand.tsx`, `public/brand/*`, `app/icon.svg` | Logo and favicon |
| `app/styles/globals.css`, `tailwind.config.js` | Colors (light/dark tokens) and theme |

## Docker

```bash
docker build . -t sap-sac-copilot:latest
docker run -p 3000:3000 -e APP_KEY=... -e API_URL=... sap-sac-copilot:latest
```

`NEXT_PUBLIC_APP_ID` is inlined at build time: put it in `.env.production` before building the image.
