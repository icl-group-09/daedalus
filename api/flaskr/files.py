import os

from flask import Blueprint, send_file
from flask.wrappers import Response
import config

import services.AzureService as AzureService
import services.CloudStorageService as CloudStorageService

bp = Blueprint("files", __name__, url_prefix="")


@bp.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:

    cloud_storage_service: CloudStorageService.CloudStorageService = (
        AzureService.AzureService()
    )
    download_file_path = os.path.join(
        bp.root_path, config.PCD_RELATIVE_DIRECTORY, filename
    )

    try:
        # Retrieve the file from the cloud service and serve it as the response
        cloud_storage_service.get_file(filename, download_file_path)
        return send_file(download_file_path, as_attachment=True, download_name=filename)

    except FileNotFoundError as err:
        return Response(str(err), status=404)

    finally:
        # Remove file after sending attachment
        try:
            os.remove(download_file_path)
        except FileNotFoundError:
            pass

