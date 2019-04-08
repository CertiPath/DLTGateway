import "react-table/react-table.css";

import React from "react";
import { toastr } from 'react-redux-toastr';
import { FileText, Edit, Trash2, CheckSquare } from 'react-feather';
import Spinner from "../../components/spinner/spinner";
import { TabContent, TabPane, Nav, NavItem, NavLink, Card, Button, CardTitle, Row, Col, Form, CardBody, Table } from "reactstrap";
import classnames from "classnames";

import apiClient from "../../utility/apiClient";
import TabProperties from "../businessNetworkNamespace/tabProperties";

export default class TrackedObjectList extends React.Component {
    constructor(props) {
        super();

        this.onFinishedAddEdit = this.onFinishedAddEdit.bind(this);
        
        this.state = {
            activeTab: "1",
            ObjectDetails: null
        };
    }

    toggle = tab => {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            ObjectGUID: nextProps.SelectedObjectGUID
        });
        this.loadData(nextProps.SelectedObjectGUID);
    }

    onFinishedAddEdit() {
        this.loadData(this.state.ObjectGUID);
    }
    
    loadData(objGUID) {
        apiClient.get('BusinessNetworkObject/GetDetails?BusinessNetworkObjectGUID=' + objGUID, {})
            .then(res => {
                this.setState({
                    ObjectDetails: res.data
                });
            });
    }
    
    render() {

        let rows = this.state.ObjectDetails == null ? '<div></div>' : this.state.ObjectDetails.PropertyList.map(dataField => {
            return (
                <tr>
                    <td>{dataField.Name}</td>
                    <td>{dataField.Disabled}</td>
                    <td>{dataField.Visible}</td>
                    <td></td>
                    <td></td>
                </tr>
            )
        });

        return (
            this.state.ObjectDetails == null ? (<Spinner />) :
            (
            <div>
                <Card>
                    <CardBody>
                        <div className="px-3">
                            <Form className="form-horizontal">
                                <div className="form-body">
                                    <h4 className="form-section"><FileText size={20} color="#212529" /> {this.props.SelectedObjectName}</h4>
                                    <div>
                                        <Nav tabs className="nav-border-bottom">
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "1"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle("1");
                                                    }}
                                                >
                                                    Properties
                                            </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "2"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle("2");
                                                    }}
                                                >
                                                    Tab 2
                                            </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink
                                                    className={classnames({
                                                        active: this.state.activeTab === "3"
                                                    })}
                                                    onClick={() => {
                                                        this.toggle("3");
                                                    }}
                                                >
                                                    Tab 3
                                            </NavLink>
                                            </NavItem>
                                        </Nav>
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <TabProperties
                                                    ObjectDetails={this.state.ObjectDetails}
                                                    onFinishedAddEdit={this.onFinishedAddEdit}
                                                />
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <Row>
                                                    <Col sm="12">
                                                        <Card body>
                                                            <CardTitle>TODO</CardTitle>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <Row>
                                                    <Col sm="12">
                                                        <Card body>
                                                            <CardTitle>TODO</CardTitle>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </CardBody>
                </Card>
            </div>
            )
        );
    }
}