import React from "react";
import {Col, Container, Row, Image} from "react-bootstrap";
// @ts-ignore
import profile from "../res/images/profile.JPG";
import links from "../res/links";

class Home extends React.Component {
    render() {
        return (
            <div>
                <Container className={"pt-4"}>
                    <Row className={"pl-4"}>
                        <h3 className={"title-text"}>About</h3>
                    </Row>
                    <hr />
                    <Row className={"justify-content-md-center"}>
                        <Col md={"auto"}>
                            <Image src={profile} roundedCircle width={190} height={"auto"}/>
                        </Col>
                        <Col xs={7}>
                            <p className={"main-text"}>
                                Hi there! My name is Tiffany Chieu. Currently, I'm a student at UCLA majoring in
                                Computer Science and Engineering. My interests include computer vision and image
                                processing, embedded systems, and CubeSat software development. When I'm not programming,
                                you can find me hiking, reading, or playing the piano. Check out my projects above or
                                take a look at my <a href={links.github} target={"_blank"}>github</a> to see more!
                            </p>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default Home;