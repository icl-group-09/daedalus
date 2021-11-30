
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    print("PUSHED!______-----____----")
    return "Hello, World!"