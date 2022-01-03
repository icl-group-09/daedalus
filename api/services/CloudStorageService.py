from abc import ABC, abstractmethod


class CloudStorageService(ABC):

    @abstractmethod
    def get_file(self, filename: str, download_file_path: str):
        pass

    @abstractmethod
    def list_file_names(self, container_name:str):
        pass
    @abstractmethod
    def upload_file(self, filename: str, upload_file_path: str):
        pass
