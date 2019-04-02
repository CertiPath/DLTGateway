import { Card, CardBody, Col, Row } from "reactstrap";
import React, { Component, Fragment } from "react";

import DataStoreTableCard from "../../components/datastore/list/TableCard";

class DataStoreListPage extends Component {
    render() {
        return (
            <Fragment>
                <Row>
                    <Col sm="12">
                        <Card>
                            <CardBody>
                                <DataStoreTableCard />
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Fragment>
        );
    }
}

export default DataStoreListPage;


