from flask import render_template
from typing import Any
from flaskr import create_app

app = create_app()

@app.route("/", methods=["GET"])
def default() -> Any:
    return render_template("index.html")
