from flask import render_template
from typing import Any
from flaskr import create_app
import os
import shutil

gltfs_path = os.path.join(os.getcwd(), "gltfs")
try:
    shutil.rmtree(gltfs_path)
    os.mkdir(gltfs_path)
except OSError as error:
    print(error)
    print("Something went wrong while trying to refresh the gltfs dir")

app = create_app()

@app.route("/", methods=["GET"])
def default() -> Any:
    return render_template("index.html")
