# app.py

from flask import Flask
from flask_cors import CORS
from routes import all_routes

app = Flask(__name__)
CORS(app)

# Register all route blueprints
for route in all_routes:
    print(f"Registering route: {route.name}")
    app.register_blueprint(route,url_prefix="")

@app.route("/")
def home():
    return "🌾 AgriAid ML Backend is running!"

if __name__ == "__main__":
    print("Registered routes:")
    for rule in app.url_map.iter_rules():
        print(rule)

    app.run(debug=True,port=5001)
