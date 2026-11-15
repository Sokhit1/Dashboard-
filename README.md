# Repsort Analytics — NetVision Network Monitoring Dashboard

A responsive, full-featured network monitoring and analytics SaaS dashboard built with React, TypeScript, Tailwind CSS, Recharts, Motion, React Router, and Supabase integration.

> **Demo Data Notice:** When Supabase environment variables are not configured, the application automatically runs in **Demo Data** mode using a coherent synthetic telemetry simulation model. Synthetic demonstration metrics do not represent live packet capture or physical network discovery from a browser; production deployments should ingest actual network telemetry through a backend collector service into PostgreSQL/Supabase.

---

## Features

- **Executive Overview Dashboard**: Four interactive KPI summary cards (`Assets Discovered`, `Network Connections`, `Anomalies Detected`, `Network Errors`) inside the `#24538F` header band, time-range selector (`1h`, `4h`, `24h`, `7d`, `30d`), auto-refresh intervals (`Off`, `10s`, `30s`, `60s`), pause/resume simulation, manual refresh, and CSV/PDF report exports.
- **Network Traffic Distribution**: Concentric multi-ring flow visualization (`Unicast`, `Broadcast`, `Multicast`) paired with an animated Recharts trend area view, interactive category toggles, and CSV export.
- **Protocol Distribution**: Coherent OT (`PROFINET`, `PROFIBUS`, `Modbus TCP`), IT (`HTTPS`, `DNS`, `HTTP`, `NTP`, `SSH`), and Other (`ICMP`, `ARP`) breakdown with a clickable vertical bar chart (`TCP`, `UDP`, `HTTPS`, `HTTP`, `DNS`, `ICMP`, `Other`) and full protocol modal.
- **Network Health Indicators**: Animated circular gauges for **Network Availability**, **Network Reliability**, and **Network Security** with click-to-inspect diagnostics drawers.
- **Full Multi-Page Navigation**:
  - **Dashboard** (`/`)
  - **Network Assets** (`/assets`) — Searchable, sortable, paginated asset inventory with slide-over detail drawer.
  - **Network Baseline** (`/baseline`) — Historical baseline confidence envelope vs. observed traffic and deviation log.
  - **Network Graph** (`/graph`) — Interactive pan/zoom network topology map with status filters and node link inspector.
  - **Traffic Profile** (`/traffic`) — Hourly ingress/egress charts, OT vs. IT bandwidth split, top consumers, and downloadable reports.
  - **Alerts** (`/alerts`) — Filterable anomaly and security incident workflow with Acknowledge and Resolve actions.
- **Light & Dark Themes**: Full dual-theme support with class-based dark mode persistence.

---

## Local Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables** (optional — leave unset to use automatic Demo Data mode):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and provide your public Supabase values:
   ```env
   VITE_SUPABASE_URL="https://your-project-id.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-public-anon-key"
   ```
   > Never place `SUPABASE_SERVICE_ROLE_KEY` or private database secrets in frontend `VITE_*` variables.

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000`.

---

## Supabase PostgreSQL & Realtime Setup

1. Create a new project in [Supabase](https://supabase.com/).
2. Open the **SQL Editor** in your Supabase dashboard and execute `/supabase/schema.sql`. This creates:
   - `user_profiles`
   - `network_assets`
   - `network_connections`
   - `traffic_flows`
   - `protocol_statistics`
   - `network_metrics`
   - `network_alerts`
   along with primary/foreign keys, indexes, Row Level Security (RLS) policies, and sample seed rows.
3. To enable live database push updates, enable **Realtime** on `network_metrics`, `network_alerts`, and `traffic_flows` under **Database → Replication** (or run the commented `ALTER PUBLICATION` line in `/supabase/schema.sql`).
4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your `.env` file.

---

## Netlify Deployment

A pre-configured `/netlify.toml` is included for SPA routing (`/* -> /index.html`).

1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Netlify, select **Add new site → Import an existing project**.
3. Set build command to `npm run build` and publish directory to `dist` (auto-detected from `netlify.toml`).
4. (Optional) Under **Site configuration → Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy!
