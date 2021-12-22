from services.CloudStorageService import CloudStorageService
import config
import os

from azure.storage.blob import BlobServiceClient, __version__
from azure.core.exceptions import ResourceNotFoundError


class AzureService(CloudStorageService):
    connect_str = config.AZURE_STORAGE_CONNECTION_STRING
    blob_service_client = BlobServiceClient.from_connection_string(connect_str)

    # Download the file of name filename to the download_file_path
    def get_file(self, filename: str, download_file_path: str) -> None:

        try:
            blob_client = self.blob_service_client.get_blob_client(
                container=config.BLOB_CONTAINER, blob=filename)
            os.makedirs(os.path.dirname(download_file_path), exist_ok=True)

            with open(download_file_path, "wb") as download_file:
                download_file.write(blob_client.download_blob().readall())
        except ResourceNotFoundError as err:
            raise FileNotFoundError from err

    def upload_file(self, filename: str, upload_file_path: str) -> None:
        blob_client = self.blob_service_client.get_blob_client(
            container=config.BLOB_CONTAINER, blob=filename)
        with open(upload_file_path, "rb") as upload_file:
            blob_client.upload_blob(upload_file, overwrite=True)
 
