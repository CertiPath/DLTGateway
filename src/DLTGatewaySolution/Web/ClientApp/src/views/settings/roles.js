import { Card, CardBody, Col, Row } from "reactstrap";
import React, { Component, Fragment } from "react";

import RoleTableCard from "../../components/role/list/TableCard";

class RoleListPage extends Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <RoleTableCard />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default RoleListPage;