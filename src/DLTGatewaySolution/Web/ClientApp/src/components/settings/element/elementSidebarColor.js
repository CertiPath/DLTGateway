import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Globe, Trash2, CheckSquare, Upload } from 'react-feather';
import { Button, Card, CardBody, Col, Form, FormGroup, Input, Label, Row, Table, CustomInput } from "reactstrap";
import { Alert } from "reactstrap";

const circleStyle = {
    width: "20px",
    height: "20px"
};

export default class ElementSidebarColor extends React.Component {

    constructor(props) {
        super();

        //this.handleUploadFinished = this.handleUploadFinished.bind(this);
        //this.handleFileDeleted = this.handleFileDeleted.bind(this);


        this.state = {
            Data: null
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.Data != nextProps.Data) {
    /*        this.setState({
                Data: nextProps.Data
            })
            */
        }
    }


    render() {

        return (
            <FormGroup row>
                <Label sm={2}>{this.props.Label}:</Label>
                <Col sm={5}>
                    <div>
                        <div className="cz-bg-color">
                            <div className="row p-1">
                                <div className="col">
                                    <span
                                        className="gradient-pomegranate d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("pomegranate")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-king-yna d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("king-yna")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-ibiza-sunset d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("ibiza-sunset")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-flickr d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("flickr")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-purple-bliss d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("purple-bliss")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-man-of-steel d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("man-of-steel")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="gradient-purple-love d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("purple-love")}
                                    />
                                </div>
                            </div>
                            <div className="row p-1">
                                <div className="col">
                                    <span
                                        className="bg-black d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("black")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-grey d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("white")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-blue d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("blue")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-purple d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("purple")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-red d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("red")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-orange d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("orange")}
                                    />
                                </div>
                                <div className="col">
                                    <span
                                        className="bg-indigo d-block rounded-circle"
                                        style={circleStyle}
                                        onClick={() => this.props.sidebarBgColor("navy-blue")}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </FormGroup>
        );
    }
}