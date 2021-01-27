import React from "react";
import {Col, Container, Row} from "react-bootstrap";
// import links from "../res/links";

class ProjectRslk extends React.Component {
    render () {
        return (
            <div>
                <Container className={"pt-4"}>
                    <Row className={"pl-4"}>
                        <h3 className={"title-text"}>
                            TI-RSLK Path Follower
                        </h3>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <h6 className={"title-text"}>
                                ECE 3 Final Project
                            </h6>
                        </Col>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <p className={"main-text"}>
                                The goal of this project was to develop a path-following car based on the TI-RSLK car
                                system.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ProjectRslk;
