from flask import Flask

app = Flask(__name__)

@app.route("/hw", methods=['GET', 'POST'])
def hello_world():
    return {'hello': 'world'}
