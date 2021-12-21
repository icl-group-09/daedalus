from flask import Flask
import flaskr.files as files

def create_app(test_config: str = None):
    # create and configure the app
    flask_app = Flask(
        __name__,
        instance_relative_config=True,
        static_url_path="",
        static_folder="web/build",
        template_folder="web/build",
    )

    if test_config is None:
        # load the instance config, if it exists, when not testing
        flask_app.config.from_pyfile("config.py", silent=True)
    else:
        # load the test config if passed in
        flask_app.config.from_pyfile(test_config)

    # apply the blueprints to the app

    flask_app.register_blueprint(files.bp)

    return flask_app

