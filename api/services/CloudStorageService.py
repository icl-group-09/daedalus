from abc import ABC, abstractmethod


class CloudStorageService(ABC):

    @abstractmethod
    def get_file(self, filename: str, download_file_path: str):
        pass


    @abstractmethod
    def list_file_names(self, filename: str, download_file_path: str):
        pass
