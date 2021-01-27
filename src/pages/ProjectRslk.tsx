import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import links from "../res/links";

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
                            <p className={"main-text"}>

                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ProjectRslk;
