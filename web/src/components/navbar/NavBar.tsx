import './NavBar.css'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from 'react-bootstrap/Container'
import PcdMenu from "../menu/PcdMenu";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

import React from "react";
import { useState } from "react";

type NavBarProps = {
  pcd: string;
  setPcd: React.Dispatch<React.SetStateAction<string>>;
};

function NavBar ({ pcd, setPcd }: NavBarProps) {

  // TODO: Take in state
  //const [pcd, setPcd] = useState("online");

  return (
    <Navbar bg="black" expand="lg">
          {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */} 
          <Row id="basic-navbar-nav" className="w-100">
            <Col className = "d-flex ms-4">
                <Navbar.Brand href="#home">Daedalus</Navbar.Brand>
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Upload</Nav.Link>
            </Col>
            <Col className="d-flex justify-content-center">
                <PcdMenu pcd={pcd} setPcd={setPcd}/>
            </Col>
            <Col className="d-flex justify-content-end">
               <Button variant="dark">
                 Switch to AR
               </Button>
            </Col>
          </Row>
    </Navbar>
  );
}

export default NavBar;