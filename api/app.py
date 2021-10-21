from flask import Flask, request

app = Flask(__name__)

@app.route("/hw", methods=['GET', 'POST'])
def hello_world():
    return {'hello': 'world'}


@app.route("/files", methods=['GET'])
def retrieve_file():
   return request.json["file-name"]
    