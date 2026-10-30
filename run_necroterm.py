"""
NecroTerm Universal Launcher
Launches the FastAPI backend (port 8000) and the Vite frontend (port 5173).
"""

import subprocess
import sys
import time
import os
import webbrowser

def main():
    print("=" * 60)
    print("  🕯️  NECROTERM: ETHEREAL SÉANCE WITH COMPUTING'S PAST  👻  ")
    print("   Hacktoberfest 2026 - Ghost in the Machine Challenge      ")
    print("=" * 60)
    print("\n[+] Starting FastAPI backend on http://127.0.0.1:8000...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=os.path.join(os.path.dirname(__file__), "backend")
    )

    time.sleep(2)

    print("[+] Starting Vite frontend on http://localhost:5173...")
    frontend_proc = subprocess.Popen(
        "npm run dev",
        shell=True,
        cwd=os.path.join(os.path.dirname(__file__), "frontend")
    )

    time.sleep(2)
    url = "http://localhost:5173"
    print(f"\n[★] NecroTerm is manifesting at: {url}")
    print("[★] Opening in browser... (Press Ctrl+C to close séance)\n")
    try:
        webbrowser.open(url)
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\n[*] Severing ethereal connection...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("[*] The spirits have departed. Goodbye.")

if __name__ == "__main__":
    main()
