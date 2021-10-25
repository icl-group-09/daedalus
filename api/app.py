from flask.wrappers import Response
from flask import Flask, send_file
from . import config

import os
from azure.storage.blob import BlobServiceClient


app = Flask(__name__)

@app.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:
    download_file_path = os.path.join(config.PCD_RELATIVE_DIRECTORY + filename)

    try:
        # Connect to blob and return the needed file
        connect_str = config.AZURE_STORAGE_CONNECTION_STRING
        blob_client = BlobServiceClient.from_connection_string(connect_str)
        blob_client = blob_client.get_blob_client(container=config.BLOB_CONTAINER, blob=filename)

        with open(download_file_path, "wb") as download_file:
            download_file.write(blob_client.download_blob().readall())

        return send_file(download_file_path, as_attachment=True, attachment_filename=filename)
    except FileNotFoundError as err:
        return Response(str(err), status=404)
    finally:
        # Remove file after sending attachment
        try:
            os.remove(download_file_path)
        except FileNotFoundError:
            pass
