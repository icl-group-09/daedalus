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
       <p> 
         Daedalus is a drone data visualisation tool aimed at simplifying how users can interact with the data they collect. Users simply upload the image of the terrain they are surveying and a corresponding height map and a 3D model will be visualised for their use. They will be able to see in detail how the terrain is shaped and be able to manipulate the model, for example by zooming into the smallest details. Drone data is much more intuitive and useful when viewed like this and prevents having to trawl through raw 2D images. 
          <br/> <br/>
          Daedalus offers a variety of tools: a height map visualisation layer, changing the resolution of the model to spot intricate details and the ability to visualise the terrain in Augmented Reality to gain a better insight into how the data reflects the real world. With a modern and portable design, Daedalus works anywhere, all that's needed is a browser. The mobile interface makes working with Daedalus in the field even easier
        </p>
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