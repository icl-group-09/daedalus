import './NavBar.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import PcdMenu from "../menu/PcdMenu";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import React from "react";

type NavBarProps = {
  pcd: string;
  changePCD: (newPCD: string) => void;
  setShowUpload: React.Dispatch<React.SetStateAction<boolean>>;
  setShowAbout: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavBar ({ pcd, changePCD, setShowUpload, setShowAbout }: NavBarProps) {

  return (
    <Navbar bg="black" expand="lg">
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */} 
          <Row id="basic-navbar-nav" className="w-100">
            <Col md={4} sm={12} xs={12} className = "d-flex flex-nowrap ps-4">
                <Navbar.Brand href="#home">Daedalus</Navbar.Brand>
                <Nav.Link onClick={() => setShowAbout(true)}>About</Nav.Link>
                <Nav.Link onClick={() => setShowUpload(true)}>Upload</Nav.Link>
            </Col>
            <Col md={4} sm={6} xs={6} className="d-flex flex-nowrap justify-content-center">
                <PcdMenu className="navbar-button" pcd={pcd} changePCD={changePCD}/>
            </Col>
            <Col md={4} sm={6} xs={6} className="d-flex flex-nowrap justify-content-md-end justify-content-sm-center">
               <Button variant="dark" className = "navbar-button">
                 Switch to AR
               </Button>
            </Col>
          </Row>
    </Navbar>
  );
}

export default NavBar;