import { Card, CardBody, Col, Row } from "reactstrap";
import React, { Component, Fragment } from "react";

import UserTable from "../../components/user/userList";

class DataStoreListPage extends Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <UserTable />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default DataStoreListPage;
