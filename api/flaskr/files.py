
import os
from flask import Blueprint, send_file, request, json, jsonify
from flask.wrappers import Response
import secrets
from pcd_generator.pointcloud import generate_pcd
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


@bp.route("/get_gltf/<string:token>.gltf", methods=["GET"])
def get_gltf(token: str) -> Response:
    path = f"{os.getcwd()}/gltfs/{token}.gltf"
    if os.path.exists(path):
        res = send_file(path)
        res.headers.add("Access-Control-Allow-Origin", "*")
        return res
    else:
        return Response(f"Cannot find {token}.gltf", status=404)


@bp.route("/upload_parsed", methods=["POST"])
def generate_url_for_gltf() -> Response:
    content = request.json
    token = secrets.token_urlsafe(16)

    with open(f"{os.getcwd()}/gltfs/{token}.gltf", "w") as f:
        assert content is not None
        f.write(content["rawGLTF"])

    return jsonify({"path": token})

@bp.route("/delete_gltf", methods=["POST"])
def delete_gltf_file() -> Response:
    content = request.json

    assert content is not None
    name = content["name"]
    os.remove(f"{os.getcwd()}/gltfs/{name}.gltf")

    return jsonify({})


UPLOAD_DIR: Path = Path(__file__).parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def is_valid_upload(upload: FileStorage) -> bool:
    # some validation logic
    if upload.filename is None:
        return False
    return Path(upload.filename).suffix.lower() in [".jpg", ".jpeg", ".png", ".tif"]


@bp.route("/uploadTerrainData", methods=["POST"])
def upload_terrain_data() -> Response:
    uploaded_files = request.files.getlist("images")
    if not uploaded_files or not uploaded_files[0].filename:
        print("No uploaded files")
        print(str(request.files.getlist("images")))
        return Response("No file(s) uploaded", status=400)

    valid_uploads = list(filter(is_valid_upload, uploaded_files))
    if not valid_uploads or len(valid_uploads) != 2:
        print("No valid uploads")
        return Response("invalid image(s)", 400)

    paths = []
    pcdname = ""
    for i, upload in enumerate(valid_uploads):
        if upload.filename is None:
            # Should never fall into this case because we filter out None files
            return Response("invalid image(s)", 400)
        filename = secure_filename(upload.filename)
        save_path = str(UPLOAD_DIR / filename)
        paths.append(save_path)
        if i == 0:
            pcdname = upload.filename

        upload.save(save_path)

    pcdname = pcdname[:pcdname.rfind('.')] + ".pcd"

    pcd_path = generate_pcd(paths[0], paths[1], pcdname)

    cloud_storage_service: CloudStorageService.CloudStorageService = (
        AzureService.AzureService()
    )

    cloud_storage_service.upload_file(pcdname, pcd_path)

    return Response(status=200)



@bp.route("/getFileNames", methods=["GET"])
def get_file_names() -> Response:
    cloud_storage_service: CloudStorageService.CloudStorageService = (
        AzureService.AzureService()
    )
    file_names = cloud_storage_service.list_file_names()
    str_file_names = {"body" : ",".join(file_names)}

    return Response(response = json.dumps(str_file_names),
     status = 200, mimetype='application/json')
