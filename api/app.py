from typing import Dict

from flask.wrappers import Response
from flask import Flask, send_file
from . import config

import os
from azure.storage.blob import BlobServiceClient


app = Flask(__name__)

@app.route("/idle", methods=["GET"])
def get_state() -> Dict[str, str]:
    return {"state": "active"}

# For now just download a file
@app.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:
    download_file_path = os.path.join(config.PCD_RELATIVE_DIRECTORY + filename)
    try:
        # Connect to blob and return the needed file
        if not os.path.exists(download_file_path):
            connect_str = config.AZURE_STORAGE_CONNECTION_STRING
            blob_client = BlobServiceClient.from_connection_string(connect_str)
            blob_client = blob_client.get_blob_client(container=config.BLOB_CONTAINER, blob=filename)
            with open(download_file_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())

       
        return send_file(download_file_path, as_attachment=True, attachment_filename=filename)
    except FileNotFoundError as err:
        return Response(str(err), status=404)

