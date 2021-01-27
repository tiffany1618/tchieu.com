import React from "react";
import {Col, Container, Row} from "react-bootstrap";
import links from "../res/links";

class ProjectVeritas extends React.Component {
    render () {
        return (
            <div>
                <Container className={"pt-4"}>
                    <Row className={"pl-4"}>
                        <h3 className={"title-text"}>
                            <a href={links.github_veritas} target={"_blank"} rel={"noreferrer"}>Veritas</a>: Verifiable, Authentic Online News
                        </h3>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <h6 className={"title-text"}>
                                Created by: Tiffany Chieu, Justin Lin, Andy Shen, Yifan You, and Ariel Young
                            </h6>
                            <h6 className={"title-text"}>
                                Awards: Best Use of Taboola Trends API, Los Angeles Hackathon 2019
                            </h6>
                        </Col>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col xs={10}>
                            <p className={"main-text"}>
                                This project leverages blockchain technology and natural language processing to create
                                a permanent repository of verified online news sources. As fake news sources become
                                more and more common, it has become increasingly important to not only be able to
                                distinguish between fake and real news, but also to maintain access to authentic news
                                sources. Using sentiment analysis and the Taboola Trends API to filter news articles
                                into trend categories, Veritas produces a confidence score for each article that
                                corresponds to its calculated authenticity, and catalogues each article into a blockchain
                                repository, ensuring tamper-proof, permanent access to the original article.
                            </p>
                            <p className={"main-text"}>
                                For more information, take a look at this project's
                                <a href={links.devpost_veritas} target={"_blank"} rel={"noreferrer"}> Devpost</a>.
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default ProjectVeritas;
