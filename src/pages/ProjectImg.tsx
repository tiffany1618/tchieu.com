import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import links from "../res/links";

class ProjectImg extends React.Component {
    render () {
        return (
            <div>
                <Container className={"pt-4"}>
                    <Row className={"pl-4"}>
                        <h3 className={"title-text"}>
                            <a href={links.github_imgproc} target={"_blank"}>imgproc-rs</a>: A Rust Image Processing Library
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

export default ProjectImg;