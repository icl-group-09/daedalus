from flask import Flask
from flask import send_file

app = Flask(__name__)

@app.route("/getRandomPcd", methods=['GET'])
def hello_world():
    try:
        return send_file("data/personFront.pcd", as_attachment=True, attachment_filename="person.pcd")
    except Exception as e:
        return str(e)
