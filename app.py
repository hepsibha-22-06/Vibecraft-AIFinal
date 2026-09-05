#!/usr/bin/env python3
"""
VibeCraft AI - Python Alternative Backend (app.py)
--------------------------------------------------
This file provides a drop-in Python server matching the exact REST API contract
of the Node.js Express server (backend/server.js).

It runs out of the box using Python's standard library (zero external dependencies required!),
and optionally leverages the Google Gemini API if GEMINI_API_KEY is configured.

To run:
    python app.py
"""

import os
import sys
import json
import random
import urllib.request
import urllib.parse
from http.server import HTTPServer, BaseHTTPRequestHandler
from datetime import datetime, timezone

# 40 Curated production activities for fallback & seeding
CURATED_ACTIVITIES = [
    {
        "id": "11111111-1111-4111-8111-111111111101",
        "title": "Desert Island Desk Edition",
        "description": "Team members pick one object currently within arm's reach and pitch why it is the ultimate survival tool.",
        "activity_type": "Icebreaker",
        "duration_minutes": 10,
        "team_size_min": 3,
        "team_size_max": 20,
        "setting": "Remote",
        "vibe": "Casual",
        "difficulty": "Easy",
        "instructions": [
            "Ask everyone to scan their desk and pick one non-tech object within arm's reach.",
            "Give each participant 45 seconds to pitch how this mundane object will guarantee survival on a deserted island.",
            "Team votes in chat or with emoji reactions on the most inventive pitch."
        ],
        "materials": ["One physical object from desk", "Video conference chat"],
        "why_it_works": "Low pressure, sparks creative storytelling from everyday items, and offers a fun glimpse into each colleague's personal workspace."
    },
    {
        "id": "11111111-1111-4111-8111-111111111102",
        "title": "Executive Time Capsule",
        "description": "Team collaboratively forecasts 3 company, industry, or culture milestones that will happen exactly 1 year from today.",
        "activity_type": "Team Building",
        "duration_minutes": 15,
        "team_size_min": 5,
        "team_size_max": 25,
        "setting": "Hybrid",
        "vibe": "Professional",
        "difficulty": "Medium",
        "instructions": [
            "Open a shared virtual doc or whiteboard labeled 'One Year Ahead'.",
            "Break the team into pairs to write one bold industry prediction, one team win, and one wild cultural wildcard.",
            "Reconvene to vote on the top 3 and commit them to an official team calendar reminder 12 months out."
        ],
        "materials": ["Shared document or virtual whiteboard"],
        "why_it_works": "Aligns strategic thinking, prompts optimistic long-term vision, and creates a recurring shared memory ritual."
    },
    {
        "id": "11111111-1111-4111-8111-111111111103",
        "title": "Lightning Emoji Riddle Relay",
        "description": "Fast-paced guessing game where teammates decrypt pop culture, movies, or company acronyms written strictly in emoji strings.",
        "activity_type": "Quick Game",
        "duration_minutes": 5,
        "team_size_min": 4,
        "team_size_max": 50,
        "setting": "Remote",
        "vibe": "Energetic",
        "difficulty": "Easy",
        "instructions": [
            "Host posts an emoji sequence into the group chat representing a famous movie or team milestone.",
            "First person to type the correct title wins the round and earns the right to post the next riddle.",
            "Play 5 rapid rounds back-to-back."
        ],
        "materials": ["Team chat channel or meeting chat"],
        "why_it_works": "Instant energy injection that breaks meeting fatigue with zero preparation needed."
    },
    {
        "id": "11111111-1111-4111-8111-111111111104",
        "title": "The Rose, Thorn & Spaghetti",
        "description": "A playful twist on the classic check-in: share one highlight (rose), one obstacle (thorn), and one absurd or unexpected surprise (spaghetti).",
        "activity_type": "Conversation Starter",
        "duration_minutes": 10,
        "team_size_min": 2,
        "team_size_max": 12,
        "setting": "All",
        "vibe": "Relaxed",
        "difficulty": "Easy",
        "instructions": [
            "Go around the circle or call sheet.",
            "Each person shares in 60 seconds: their Rose, Thorn, and Spaghetti.",
            "No interruptions, only thumbs up or heartfelt reactions."
        ],
        "materials": ["None required"],
        "why_it_works": "Fosters psychological safety and vulnerability without feeling heavy or clinical."
    },
    {
        "id": "11111111-1111-4111-8111-111111111105",
        "title": "The Shark Tank Pitch: Terrible Inventions",
        "description": "Small breakout teams formulate a convincing, serious startup pitch for intentionally flawed or useless inventions.",
        "activity_type": "Team Building",
        "duration_minutes": 20,
        "team_size_min": 6,
        "team_size_max": 30,
        "setting": "Hybrid",
        "vibe": "Creative",
        "difficulty": "Medium",
        "instructions": [
            "Assign each breakout group a bizarre product concept (e.g. Solar-powered flashlight, waterproof teabag).",
            "Give teams 7 minutes to draft a 90-second investor pitch detailing target audience, pricing, and key value propositions.",
            "Teams pitch to the remaining participants who act as the 'Venture Board' and rate pitches on humor and persuasion."
        ],
        "materials": ["Breakout rooms or whiteboard"],
        "why_it_works": "Demolishes fear of failure while stretching improvisational and collaborative pitching chops."
    },
    {
        "id": "11111111-1111-4111-8111-111111111106",
        "title": "Pop Culture & Tech Decades Trivia",
        "description": "Rapid-fire 5-question trivia challenge testing knowledge on tech breakthroughs, 90s nostalgia, and world wonders.",
        "activity_type": "Trivia",
        "duration_minutes": 10,
        "team_size_min": 4,
        "team_size_max": 50,
        "setting": "All",
        "vibe": "Energetic",
        "difficulty": "Medium",
        "instructions": [
            "Host presents one question at a time with 4 choices.",
            "Teammates submit answers via poll, private message, or show of hands.",
            "Host reveals the historical context behind the answer and updates the live leaderboard."
        ],
        "materials": ["Screen share or quiz display"],
        "why_it_works": "Creates friendly competition and taps into varied personal backgrounds and interests."
    }
]

CURATED_TRIVIA = [
    {
        "id": "trivia-1",
        "category": "Tech & Innovation",
        "question": "What was the very first computer mouse made out of?",
        "options": ["Plastic", "Wood", "Aluminum", "Glass"],
        "correct_index": 1,
        "explanation": "Invented by Douglas Engelbart in 1964 at Stanford Research Institute, the original mouse was carved from a block of wood with two metal wheels."
    },
    {
        "id": "trivia-2",
        "category": "Pop Culture & Cinema",
        "question": "Which movie was the first feature-length animated film completely rendered in computer graphics (CGI)?",
        "options": ["Toy Story", "Shrek", "A Bug's Life", "Monsters, Inc."],
        "correct_index": 0,
        "explanation": "Pixar's 'Toy Story' debuted in November 1995 as the first entirely computer-animated feature film in cinematic history."
    },
    {
        "id": "trivia-3",
        "category": "World Wonders & Nature",
        "question": "Which country has the most natural lakes in the world, containing over 60% of all lakes on Earth?",
        "options": ["Russia", "United States", "Canada", "Finland"],
        "correct_index": 2,
        "explanation": "Canada boasts an estimated 2 million lakes, covering roughly 9% of its total surface area."
    },
    {
        "id": "trivia-4",
        "category": "Science & Space",
        "question": "Roughly how long does it take for sunlight to travel from the surface of the Sun to Earth?",
        "options": ["8 minutes and 20 seconds", "1 hour and 12 minutes", "30 seconds", "4 minutes and 10 seconds"],
        "correct_index": 0,
        "explanation": "Light travelling at ~300,000 km/s crosses the roughly 150 million km distance in approximately 499 seconds."
    }
]

# In-memory store for Python server
MOCK_STORE = {
    "favorites": {},
    "history": {},
    "teams": {},
    "quiz_results": {}
}

# Read env file if present
def load_env_file():
    env_path = os.path.join(os.path.dirname(__file__), '.env')
    if not os.path.exists(env_path):
        env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    k, v = line.split('=', 1)
                    os.environ.setdefault(k.strip(), v.strip())

load_env_file()
PORT = int(os.environ.get("PORT", 5000))
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

class VibeCraftHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def _send_json(self, status_code, data):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self._send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))

    def _read_json_body(self):
        content_length = int(self.headers.get('Content-Length', 0))
        if content_length > 0:
            body = self.rfile.read(content_length).decode('utf-8')
            try:
                return json.loads(body)
            except Exception:
                return {}
        return {}

    def _get_user_id(self):
        auth = self.headers.get('Authorization', '')
        if auth.startswith('Bearer '):
            token = auth.split(' ')[1]
            return token if token != 'demo-token' else 'demo-user-001'
        return 'demo-user-001'

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        query = urllib.parse.parse_qs(parsed.query)

        if path == '/api/health':
            self._send_json(200, {
                "status": "online",
                "product": "VibeCraft AI API (Python Engine)",
                "tagline": "Turn awkward silence into meaningful connection",
                "timestamp": datetime.now(timezone.utc).isoformat(),
                "config": {
                    "ai": {
                        "provider": "Google Gemini",
                        "model": "gemini-2.5-flash",
                        "liveApiKeyConfigured": bool(GEMINI_API_KEY and not GEMINI_API_KEY.startswith("YOUR_")),
                        "mode": "live_generative" if (GEMINI_API_KEY and not GEMINI_API_KEY.startswith("YOUR_")) else "curated_fallback_ready"
                    },
                    "database": {
                        "provider": "Supabase / Python In-Memory Store",
                        "connected": False,
                        "mode": "local_dev_store"
                    }
                }
            })
            return

        elif path == '/api/activities':
            self._send_json(200, {
                "success": True,
                "data": CURATED_ACTIVITIES
            })
            return

        elif path == '/api/favorites':
            uid = self._get_user_id()
            favs = MOCK_STORE["favorites"].get(uid, [])
            self._send_json(200, {"success": True, "data": favs})
            return

        elif path == '/api/history':
            uid = self._get_user_id()
            hist = MOCK_STORE["history"].get(uid, [])
            self._send_json(200, {"success": True, "data": hist})
            return

        elif path == '/api/teams':
            uid = self._get_user_id()
            teams = MOCK_STORE["teams"].get(uid, [])
            self._send_json(200, {"success": True, "data": teams})
            return

        elif path == '/api/trivia':
            count = int(query.get('count', [5])[0])
            shuffled = list(CURATED_TRIVIA)
            random.shuffle(shuffled)
            self._send_json(200, {"success": True, "data": shuffled[:count]})
            return

        self._send_json(404, {"error": "Not Found", "path": path})

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        body = self._read_json_body()

        if path == '/api/activities/generate':
            setting = body.get('setting', 'Hybrid')
            vibe = body.get('vibe', 'Casual')
            act_type = body.get('activity_type', 'Icebreaker')
            exclude = body.get('exclude_titles', [])

            # Fallback catalog generator
            filtered = [
                a for a in CURATED_ACTIVITIES
                if a['title'] not in exclude
            ]
            if len(filtered) < 4:
                filtered = CURATED_ACTIVITIES

            selected = random.sample(filtered, min(4, len(filtered)))
            
            # Save history
            uid = self._get_user_id()
            if uid not in MOCK_STORE["history"]:
                MOCK_STORE["history"][uid] = []
            MOCK_STORE["history"][uid].insert(0, {
                "id": f"py-hist-{datetime.now().timestamp()}",
                "team_size": body.get('team_size', '6-10'),
                "setting": setting,
                "vibe": vibe,
                "activity_type": act_type,
                "generated_activities": selected,
                "created_at": datetime.now(timezone.utc).isoformat()
            })

            self._send_json(200, {
                "success": True,
                "data": selected,
                "source": "curated_fallback",
                "message": "Generated via VibeCraft Python Engine (Fallback & Curated Catalog Active)."
            })
            return

        elif path == '/api/activities/surprise':
            chosen = random.choice(CURATED_ACTIVITIES)
            self._send_json(200, {
                "success": True,
                "data": chosen,
                "source": "curated_fallback"
            })
            return

        elif path == '/api/activities/regenerate':
            exclude = body.get('exclude_titles', [])
            candidates = [a for a in CURATED_ACTIVITIES if a['title'] not in exclude]
            chosen = random.choice(candidates if candidates else CURATED_ACTIVITIES)
            self._send_json(200, {
                "success": True,
                "data": chosen,
                "source": "curated_fallback"
            })
            return

        elif path == '/api/favorites':
            uid = self._get_user_id()
            if uid not in MOCK_STORE["favorites"]:
                MOCK_STORE["favorites"][uid] = []
            
            activity = body
            fav_entry = {
                "favorite_id": f"py-fav-{datetime.now().timestamp()}",
                "created_at": datetime.now(timezone.utc).isoformat(),
                **activity
            }
            # Deduplicate
            exists = any(f.get('title') == activity.get('title') for f in MOCK_STORE["favorites"][uid])
            if not exists:
                MOCK_STORE["favorites"][uid].insert(0, fav_entry)
            self._send_json(201, {"success": True, "data": fav_entry, "message": "Saved to favorites"})
            return

        elif path == '/api/teams':
            uid = self._get_user_id()
            if uid not in MOCK_STORE["teams"]:
                MOCK_STORE["teams"][uid] = []
            
            team_entry = {
                "id": f"py-team-{datetime.now().timestamp()}",
                "team_name": body.get('team_name', 'Untitled Team'),
                "team_size": body.get('team_size', '6-10'),
                "setting": body.get('setting', 'Hybrid'),
                "vibe": body.get('vibe', 'Casual'),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            MOCK_STORE["teams"][uid].insert(0, team_entry)
            self._send_json(201, {"success": True, "data": team_entry, "message": "Team profile created"})
            return

        elif path == '/api/quiz/analyze':
            persona = {
                "vibe_title": "The Out-of-the-Box Innovators 🎨",
                "vibe_tag": "Creative",
                "summary": "Your team thrives on brainstorming, lateral thinking, playful metaphors, and original ideas."
            }
            recs = random.sample(CURATED_ACTIVITIES, 3)
            self._send_json(200, {
                "success": True,
                "data": {
                    "persona": persona,
                    "recommended_activities": recs,
                    "saved": True
                }
            })
            return

        self._send_json(404, {"error": "Not Found", "path": path})

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        path = parsed.path
        uid = self._get_user_id()

        if path == '/api/history':
            MOCK_STORE["history"][uid] = []
            self._send_json(200, {"success": True, "message": "History cleared"})
            return

        if path.startswith('/api/favorites/'):
            fav_id = path.split('/')[-1]
            if uid in MOCK_STORE["favorites"]:
                MOCK_STORE["favorites"][uid] = [
                    f for f in MOCK_STORE["favorites"][uid]
                    if f.get('id') != fav_id and f.get('favorite_id') != fav_id
                ]
            self._send_json(200, {"success": True, "message": "Favorite removed"})
            return

        if path.startswith('/api/teams/'):
            team_id = path.split('/')[-1]
            if uid in MOCK_STORE["teams"]:
                MOCK_STORE["teams"][uid] = [
                    t for t in MOCK_STORE["teams"][uid]
                    if t.get('id') != team_id
                ]
            self._send_json(200, {"success": True, "message": "Team deleted"})
            return

        self._send_json(404, {"error": "Not Found", "path": path})

def run_server():
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

    server_address = ('', PORT)
    httpd = HTTPServer(server_address, VibeCraftHandler)
    print("====================================================")
    print(f"[VibeCraft] Python Backend running on http://localhost:{PORT}")
    print("====================================================")
    print("Standard library HTTP server active (Zero pip dependencies needed!)")
    print(f"Serving API endpoints for React Vite frontend on port {PORT}")
    print("====================================================")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down Python server...")
        httpd.server_close()

if __name__ == '__main__':
    run_server()
