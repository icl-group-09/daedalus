import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button'
import Alert from 'react-bootstrap/Alert'
import Form from 'react-bootstrap/Form'

type UploadProps = {
  show: boolean;
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  cb: () => void;
}

export function Upload({show, setShowUpload, cb}: UploadProps){

  const [terrainFile, setTerrainFile] = useState<File>();
  const [heightFile, setHeightFile] = useState<File>();
  const [status, setStatus] = useState(["", ""]);

	const terrainChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement> 
  ) => {
		setTerrainFile(event.target.files![0]);
	};

	const heightChangeHandler = (
    event: React.ChangeEvent<HTMLInputElement> 
  ) => {
		setHeightFile(event.target.files![0]);
	};

	const handleSubmission = () => {
    if (terrainFile === undefined && heightFile === undefined) {
      setStatus(["Upload both a terrain and height map", "warning"]);
      return;
    }
		const formData = new FormData();

		formData.append('images', terrainFile!);
		formData.append('images', heightFile!);

		fetch(
      `/uploadTerrainData`,
			{
				method: 'POST',
				body: formData,
			}
		)
    .then((response) => response.json())
	  .then((result) => {
	    console.log('Success:', result);
       setStatus(["Upload complete!", "success"]);
       cb();
		})
		.catch((error) => {
			console.error('Error:', error);
      setStatus(["There was an error with your upload, please try again later.", "danger"]);
		});
	};

    return(
      <Modal show={show} onHide={() => setShowUpload(false)}>
        <Modal.Header> 
          <h3> Choose your files! </h3>
        </Modal.Header>
        <Modal.Body>
	            <div>
                <Form.Group controlId="formFile" className="mb-3" onChange={terrainChangeHandler}>
                  <Form.Label>Upload Terrain Image:</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
                <Form.Group controlId="formFile" className="mb-3" onChange={heightChangeHandler}>
                  <Form.Label>Upload Height Map:</Form.Label>
                  <Form.Control type="file" />
                </Form.Group>
             </div>
			 <Alert variant={status[1]}>{status[0]}</Alert>
        </Modal.Body>
			<Modal.Footer>
        <Button variant = "primary" onClick={handleSubmission}>Upload</Button>
				<Button variant="secondary" onClick={() => setShowUpload(false)}>
					Close
				</Button>
			</Modal.Footer>
			
     </Modal>
         )
    }



export default Upload