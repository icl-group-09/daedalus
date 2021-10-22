from flask import Flask, send_file, request, Response
from os.path import exists
import config

import os
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient, __version__


app = Flask(__name__)

@app.route("/idle", methods=["GET"])
def get_state():
    return {"state": "active"}

# For now just download a file
@app.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:
    try:

        # Connect to blob and return the needed file
        connect_str = config.AZURE_STORAGE_CONNECTION_STRING
        blob_service_client = BlobServiceClient.from_connection_string(connect_str)
        blob_client = blob_service_client.get_blob_client(container=config.BLOB_CONTAINER, blob=filename)
        download_file_path = os.path.join(config.PCD_RELATIVE_DIRECTORY + filename)

        with open(download_file_path, "wb") as download_file:
            download_file.write(blob_client.download_blob().readall())

        return send_file(download_file_path, as_attachment=True, attachment_filename=filename)

    except Exception as e:
        return Response(str(e), status=404)

    finally:
        # Remove file after sending attachment
        try:
            os.remove(download_file_path)
        except FileNotFoundError:
            pass
