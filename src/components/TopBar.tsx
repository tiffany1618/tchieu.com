import React from "react";
import {Button, Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
import links from "../res/links";
import github_logo from "../res/images/github_logo.png";
import linkedin_logo from "../res/images/linkedin_logo.png";
// @ts-ignore
import resume from "../res/resume.pdf";

class TopBar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="#home">Tiffany C. Chieu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Projects" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#projects/imgproc-rs">Image Processing Library</NavDropdown.Item>
                            <NavDropdown.Item href="#projects/path-follower">TI-RSLK Path Follower</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#projects/veritas">Veritas</NavDropdown.Item>
                            <NavDropdown.Item href="#projects/vulcanet">VulcaNet</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href={resume} target="_blank">Resume</Nav.Link>
                    </Nav>
                    <Navbar.Brand href={links.github}>
                        <img
                            src={github_logo}
                            width="40"
                            height="40"
                            alt="Github logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Brand href={links.linkedin}>
                        <img
                            src={linkedin_logo}
                            width="50"
                            height="32"
                            alt="Linkedin logo"
                        />
                    </Navbar.Brand>
                    {/*<Form inline>*/}
                    {/*    <FormControl type="text" placeholder="Search" className="mr-sm-2" />*/}
                    {/*    <Button variant="outline-success">Search</Button>*/}
                    {/*</Form>*/}
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopBar;