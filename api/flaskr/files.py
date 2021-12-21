import os

from flask import Blueprint, send_file, request
from flask.wrappers import Response
import config
import services.AzureService as AzureService
import services.CloudStorageService as CloudStorageService
from pathlib import Path
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

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


UPLOAD_DIR: Path = Path(__file__).parent / 'uploads'
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def is_valid_upload(upload: FileStorage) -> bool:
    # some validation logic
    if upload.filename is None:
        return False
    return Path(upload.filename).suffix.lower() in ['.jpg', '.jpeg', '.png', '.tif']

@bp.route("/uploadTerrainData", methods=["POST"])
def upload_terrain_data() -> Response:
    uploaded_files = request.files.getlist('images')
    if not uploaded_files or not uploaded_files[0].filename:
        print("No uploaded files")
        print(str(request.files.getlist('images')))
        return Response("No file(s) uploaded", status=400)

    valid_uploads = list(filter(is_valid_upload, uploaded_files))
    if not valid_uploads:
        print("No valid uploads")
        return Response('invalid image(s)', 400)

    for upload in valid_uploads:
        if upload.filename is None:
            # Should never fall into this case because we filter out None files
            return Response('invalid image(s)', 400)
        filename = secure_filename(upload.filename)
        save_path = str(UPLOAD_DIR / filename)

        upload.save(save_path)

    return Response(status=200)
