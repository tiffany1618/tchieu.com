import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import links from "../res/links";

class ProjectVulcanet extends React.Component {
    render () {
        return (
            <div>
                <Container className={"pt-4"}>
                    <Row className={"pl-4"}>
                        <h3 className={"title-text"}>
                            <a href={links.github_vulcanet} target={"_blank"} rel={"noreferrer"}>VulcaNet</a>: A Low-cost Wildfire Detection System
                        </h3>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <h6 className={"title-text"}>
                                Created by: Tiffany Chieu, Nashir Janmohamed, Justin Lin, and Ariel Young
                            </h6>
                            <h6 className={"title-text"}>
                                Awards: Best IoT that Incorporates Multiple Nodes, San Diego Hackathon 2019
                            </h6>
                        </Col>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <p className={"main-text"}>
                                The goal of this project is to provide a reliable, low-cost early detection system for
                                wildfires. VulcaNet is an extensible IoT mesh network that aggregates environmental
                                sensor data from various locations within a given area, such as ambient temperature,
                                humidity, barometric pressure, and carbon dioxide air content. Based on these parameters,
                                the system can predict the likeliness and detect the presence of wildfires in the area.
                            </p>
                            <p className={"main-text"}>
                                For more information, take a look at this project's
                                <a href={links.devpost_vulcanet} target={"_blank"} rel={"noreferrer"}> Devpost</a>.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ProjectVulcanet;
