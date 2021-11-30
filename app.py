import os
from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    print(os.environ.get("FLASK_APP"))
    print("------------------------------------------------------------------------")
    print("PUSHED!______-----____----")
    return "Hello, World!"
