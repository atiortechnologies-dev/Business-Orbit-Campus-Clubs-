import json
import os
import re
from pathlib import Path

# Load codebase_map if it exists, else we need to parse it or just parse routes manually
# Wait, let's just parse backend routes by finding express routes or similar
def find_backend_routes():
    backend_dir = Path("Backend")
    routes = []
    # Regex to find router.get, app.post, etc.
    route_pattern = re.compile(r'(router|app)\.(get|post|put|delete|patch)\s*\(\s*[\'"]([^\'"]+)[\'"]')
    for root, dirs, files in os.walk(backend_dir):
        for file in files:
            if file.endswith('.js') or file.endswith('.ts'):
                file_path = Path(root) / file
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        content = f.read()
                        matches = route_pattern.findall(content)
                        for match in matches:
                            method = match[1].upper()
                            path = match[2]
                            routes.append({"method": method, "path": path, "file": str(file_path)})
                    except Exception:
                        pass
    return routes

def find_frontend_api_calls():
    frontend_dir = Path("Frontend/src")
    api_calls = []
    # Find axios, fetch, or generic api strings
    call_pattern = re.compile(r'[\'"](/api/[^\'"]+)[\'"]|[\'"](http[s]?://[^\'"]+)[\'"]')
    axios_pattern = re.compile(r'(axios|fetch|api)\.(get|post|put|delete|patch|request)\s*\((.*?)\)')
    
    for root, dirs, files in os.walk(frontend_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = Path(root) / file
                with open(file_path, 'r', encoding='utf-8') as f:
                    try:
                        content = f.read()
                        
                        # Find literal strings that look like API endpoints
                        str_matches = call_pattern.findall(content)
                        for match in str_matches:
                            val = match[0] or match[1]
                            api_calls.append({"type": "string", "value": val, "file": str(file_path)})
                            
                        # Find axios/fetch calls
                        for i, line in enumerate(content.splitlines()):
                            if 'axios' in line or 'fetch' in line or 'api' in line:
                                api_calls.append({"type": "call", "value": line.strip(), "file": str(file_path), "line": i+1})
                                
                    except Exception:
                        pass
    return api_calls

def main():
    routes = find_backend_routes()
    # But wait, there is already a codebase_map.json which has routes. Let's see if it has more.
    if os.path.exists("codebase_map.json"):
        with open("codebase_map.json", "r", encoding="utf-8") as f:
            map_data = json.load(f)
            if "routes" in map_data:
                # Let's trust the codebase_map routes if they exist and are populated
                if len(map_data["routes"]) > len(routes):
                    routes = map_data["routes"]
                    
    frontend_calls = find_frontend_api_calls()
    
    report = {
        "backend_routes": routes,
        "frontend_calls": frontend_calls
    }
    
    with open("detailed_map.json", "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2)

if __name__ == "__main__":
    main()
