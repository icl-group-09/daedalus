from flask import Flask, send_file, request, Response
from os.path import exists

app = Flask(__name__)

@app.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:
    path = f"data/{filename}"
    if exists(path):
        try:
            return send_file(path, as_attachment=True, attachment_filename=filename)
        except Exception as e:
            return Response(str(e))
    else:
        return Response(status=404)