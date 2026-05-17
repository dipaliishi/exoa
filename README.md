# EXOA — Indoor Emergency Evacuation Navigation System

EXOA is a premium, real-time indoor evacuation pathfinding and navigation system designed for modern buildings. By scanning localized QR codes placed on room doors, users immediately get the shortest, safest route to the nearest emergency exit, routing through multi-floor stairwells and corridor grids using an optimized Dijkstra engine.

---

## 🚀 Key Features

*   **Multi-floor Pathfinding:** Fully integrates **4 distinct floors** (Ground, 1st, 2nd, 3rd) linked by West and East staircases.
*   **Context-Aware Transitions:** Dynamically displays custom buttons (e.g., `🚶 Go to 2nd Floor Map [2F]`) in a banner when a user reaches a stairwell node, allowing seamless navigation transitions downward to the final Ground Floor exits.
*   **Beautiful Responsive UI:** Built with premium glassmorphism, smooth animations (Framer Motion), active state pulsing, and vivid color schemes (amber/orange/red emergency theme).
*   **Quick Demo Room Selector:** Built-in dropdown selectors on both the landing page (`/`) and header bar (`/nav`) allow users to test any of the 31 rooms on all floors on the fly.
*   **QR URL Dashboard (`test_links.html`):** An interactive standalone HTML control panel in the root directory that lets developers configure local/network IPs and trigger navigations for any specific QR node with a single click.

---

## 🛠️ Technology Stack

### Frontend
*   **Core:** React 18, TypeScript, TailwindCSS
*   **Animations:** Framer Motion (for pulsing emergency alerts, smooth banner entrances)
*   **Bundler:** Vite 6
*   **Routing:** React Router DOM

### Backend
*   **Core:** Python 3, FastAPI
*   **Web Server:** Uvicorn (standard)
*   **Validation:** Pydantic (data parsing)
*   **Real-time updates:** WebSockets (for live debris blocks / emergency triggers)

---

## 📂 Repository Structure

```text
EXOA/
├── backend/
│   └── app/
│       ├── __init__.py
│       ├── main.py          # FastAPI application & WebSocket endpoints
│       ├── models.py        # Pydantic schemas
│       └── navigation.py    # Dijkstra-based pathfinding calculations
├── frontend/
│   ├── public/              # High-fidelity SVG floor maps
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmergencyBanner.tsx  # Dynamic multi-floor prompts
│   │   │   └── FloorMap.tsx         # Responsive SVG paths & node renderer
│   │   ├── hooks/
│   │   │   └── useNavigation.ts     # Path state management
│   │   ├── data/
│   │   │   └── graphData.ts         # Multi-floor coordinates & edges
│   │   ├── pages/
│   │   │   ├── HomePage.tsx         # Landing page & quick demo selector
│   │   │   └── NavigationPage.tsx   # Map rendering and header room switcher
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── vite.config.ts       # Configured with host headers & port forwarding support
│   └── package.json
├── test_links.html          # Dynamic link generation dashboard
├── requirements.txt         # Python backend dependencies
├── update_graph.py          # Helper script to compile node locations
└── README.md                # Project documentation
```

---

## ⚡ Quick Start Guide

### 1. Run the Frontend (Vite)
1.  Navigate into the `frontend` folder:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  The frontend is now running at:
    *   Local: `http://localhost:5173`
    *   Network IP: `http://10.232.221.117:5173`

---

### 2. Run the Backend (FastAPI)
1.  Create and activate a virtual environment (optional):
    ```bash
    python -m venv venv
    venv\Scripts\activate  # Windows
    source venv/bin/activate  # macOS/Linux
    ```
2.  Install required dependencies from the root directory:
    ```bash
    pip install -r requirements.txt
    ```
3.  Start the Uvicorn server:
    ```bash
    uvicorn backend.app.main:app --reload --port 8000
    ```
4.  The interactive API docs will be active at `http://localhost:8000/docs`.

---

### 3. Interactive Testing Dashboard
*   Open the [test_links.html](file:///x:/TECH/Projects\Exoa/test_links.html) file directly in your browser.
*   Configure the Vite server address (e.g., your local machine's IP `10.232.221.117` or `localhost`).
*   Click on any of the room boxes to test target pathfinding on that exact node!


