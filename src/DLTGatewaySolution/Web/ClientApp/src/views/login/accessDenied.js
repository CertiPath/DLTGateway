// import external modules

import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";

import { NavLink } from "react-router-dom";
import React from "react";

const Maintainance = () => {
   return (
      <div className="container-fluid gradient-ibiza-sunset">
         <Row className="full-height-vh">
            <Col xs="12" className="d-flex align-items-center justify-content-center">
               <Card className="border-grey border-lighten-3 px-1 py-1 box-shadow-3">                  
                  <CardHeader>
                  </CardHeader>
                  <CardBody className="text-center">
                     <h3>Access Denied</h3>
                     <p>
                        You do not have permissions to view this page or you need to login again.
                     </p>
                     <div className="mt-2">
                        <NavLink to="/">
                            Back to Login
                        </NavLink>
                     </div>
                  </CardBody>
               </Card>
            </Col>
         </Row>
      </div>
   );
};

export default Maintainance;
