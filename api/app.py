import os

from flask import Flask, Blueprint, send_file, render_template
from flask.wrappers import Response
from api import config
from services.AzureService import AzureService
from typing import Any
from services.CloudStorageService import CloudStorageService

bp = Blueprint("files", __name__, url_prefix="")

@bp.route("/getPcd/<string:filename>", methods=["GET"])
def get_pcd(filename: str) -> Response:

    cloud_storage_service: CloudStorageService = AzureService()
    download_file_path = os.path.join(
        bp.root_path, config.PCD_RELATIVE_DIRECTORY, filename)

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


@bp.route("/", methods=["GET"])
def default() -> Any: # TODO fix

    print("APP")
    return render_template("index.html")


def create_app(test_config: str =None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True, static_url_path="", static_folder="web/build", template_folder="web/build")

    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_pyfile(test_config)

    # apply the blueprints to the app

    app.register_blueprint(bp)

    return app

app = create_app()

