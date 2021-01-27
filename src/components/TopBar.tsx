import React from "react";
import {Nav, Navbar, NavDropdown} from "react-bootstrap";
import links from "../res/links";
import github_logo from "../res/images/github_logo.png";
import linkedin_logo from "../res/images/linkedin_logo.png";
// @ts-ignore
import resume from "../res/resume.pdf";

class TopBar extends React.Component {
    render() {
        return (
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">Tiffany C. Chieu</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <NavDropdown title="Projects" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/projects/imgproc">imgproc-rs</NavDropdown.Item>
                            <NavDropdown.Item href="/projects/rslk">TI-RSLK Path Follower</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="/projects/vulcanet">VulcaNet</NavDropdown.Item>
                            <NavDropdown.Item href="/projects/veritas">Veritas</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href={resume} target="_blank">Resume</Nav.Link>
                    </Nav>
                    <Navbar.Brand href={links.github} target={"_blank"}>
                        <img
                            src={github_logo}
                            width="40"
                            height="40"
                            alt="Github logo"
                        />
                    </Navbar.Brand>
                    <Navbar.Brand href={links.linkedin} target="_blank">
                        <img
                            src={linkedin_logo}
                            width="50"
                            height="32"
                            alt="Linkedin logo"
                        />
                    </Navbar.Brand>
                </Navbar.Collapse>
            </Navbar>
        )
    }
}

export default TopBar;