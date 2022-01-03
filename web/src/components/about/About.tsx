import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from 'react-bootstrap/Button'

type AboutProps = {
  show: boolean;
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>;
}

export function About({show, setShowAbout}: AboutProps) {

    return(
      <Modal show={show} onHide={() => setShowAbout(false)}>
        <Modal.Header> 
          <h3> About </h3>
        </Modal.Header>
        <Modal.Body>
          TODO: WRITE ABOUT PAGE
        </Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={() => setShowAbout(false)}>
					Close
				</Button>
			</Modal.Footer>
			
     </Modal>
       );
    }

export default About