import unittest
from unittest.mock import patch

from flaskr import create_app

from services.CloudStorageService import CloudStorageService


class TestPCDFileRequests(unittest.TestCase):
    @patch('flaskr.files.AzureService')
    def test_get_pcd(self, mock_service: CloudStorageService):
        app = create_app()
        mock_service.get_file.sideEffect = lambda: print("HELLO")
        response = app.test_client().get("/getPcd/online.pcd")
        self.assertTrue(response.status_code, 200)


if __name__ == '__main__':
    unittest.main()
