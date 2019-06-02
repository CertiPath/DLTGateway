import React, { Component, Fragment } from "react";

import { Link } from "react-router-dom";
import { Alert, TabContent, TabPane, NavLink, Row, Col, Button, Form, Input, FormGroup, Card, CardHeader, CardBody, CardFooter, Table } from "reactstrap";
import { AlertTriangle, Lock, X, LogOut, Info } from "react-feather";

import { CurrentUserConsumer, CurrentUserProvider } from "../../utility/context/currentUserContext";

class MyProfile extends Component {
    
    render() {

        let notificationRows =
            <CurrentUserConsumer>
                {context => (

                    context.Details.Notifications.map(notification => {
                        return (

                            <tr>
                                <td>
                                    <span className={"bg-" + notification.Type.toString().toLowerCase() + " rounded-circle width-35 height-35 d-block"}>
                                        {
                                            notification.Type.toUpperCase() == 'WARNING' ?
                                                <AlertTriangle size={30} className="p-1 white margin-left-3" /> :
                                                <Info size={30} className="p-1 white margin-left-3" />
                                        }
                                    </span>
                                </td>
                                <td>{notification.Title}</td>
                                <td>{notification.Text}</td>
                                <td>{notification.DateTime}</td>
                            </tr>
                        );
                    })
                )}
            </CurrentUserConsumer>

        return (

            <CurrentUserConsumer>
                {user => (
                    <Fragment>
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <CardHeader>
                                        <h5>Personal Information</h5>
                                    </CardHeader>
                                    <CardBody>
                                        <Row>
                                            <Col xs="12" md="6" lg="4">
                                                <ul className="no-list-style">
                                                    <li className="mb-2">
                                                        <span className="text-bold-500 primary">
                                                            <Link to="/pages/useer-profile">First Name:</Link>
                                                        </span>
                                                        <span className="display-block overflow-hidden">{user.Details.FirstName}</span>
                                                    </li>
                                                </ul>
                                            </Col>
                                            <Col xs="12" md="6" lg="4">
                                                <ul className="no-list-style">
                                                    <li className="mb-2">
                                                        <span className="text-bold-500 primary">
                                                            <Link to="/pages/useer-profile">Last Name:</Link>
                                                        </span>
                                                        <span className="display-block overflow-hidden">{user.Details.LastName}</span>
                                                    </li>
                                                </ul>
                                            </Col>
                                            <Col xs="12" md="6" lg="4">
                                                <ul className="no-list-style">
                                                    <li className="mb-2">
                                                        <span className="text-bold-500 primary">
                                                            <Link to="/pages/useer-profile">Email:</Link>
                                                        </span>
                                                        <span className="display-block overflow-hidden">{user.Details.Email}</span>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm="12">
                                <Card>
                                    <CardHeader>
                                        <h5>Notifications</h5>
                                    </CardHeader>
                                    <CardBody>
                                        {
                                            user.Details.Notifications.length == 0 ?
                                                (
                                                    <Alert color="dark">
                                                        There are currently no system notifications.
                                                    </Alert>
                                                )
                                                :
                                                (
                                                    <Table striped responsive>
                                                        <thead>
                                                            <tr>
                                                                <th></th>
                                                                <th>Title</th>
                                                                <th>Text</th>
                                                                <th>Date/Time</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {notificationRows}
                                                        </tbody>
                                                    </Table>
                                                )
                                        }
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Fragment>
                )}
            </CurrentUserConsumer>
        );
    }
}

export default MyProfile;