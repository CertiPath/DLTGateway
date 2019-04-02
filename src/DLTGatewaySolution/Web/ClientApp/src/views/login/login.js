import * as Yup from "yup";

import { Button, Card, CardBody, CardHeader, Col, FormGroup, Row } from "reactstrap";
import { Field, Form, Formik } from "formik";
// import external modules
import React, { Component } from "react";

import Footer from "../../layouts/components/footer/footer";
import Spinner from "../../components/spinner/spinner";
import apiClient from '../../utility/apiClient';
import strings from "../../app/localizedStrings";

const formSchema = Yup.object().shape({
    Username: Yup.string()
        .required("Username is required")
        .email("Invalid email address"),
    Password: Yup.string()
        .required("Password is required")
});

class Login extends Component {

    constructor() {

        super();
        this.state = {
            invalidUsernameOrPassword: false,
            isLoading: false
        };

        // TODO: fix all of this
        // should not be here but for now each visit to login page will log us out.. I think that is ok
        sessionStorage.setItem('userAuth', JSON.stringify({ IsAuthenticated: false, FirstName: "", LastName: "", Email: "" }));

    }

   render() {
      return (

          <div className="container">
            <Row className="full-height-vh">
                <Col xs="12" className="d-flex align-items-center justify-content-center">
                      <Card className="gradient-indigo-purple text-center width-400">
                          <CardHeader>
                              
                          </CardHeader>
                        <CardBody>
                              <h2 className="white">{strings.App.Title}</h2>
                              <h4 className="white py-4">Login</h4>

                              <Formik
                                  initialValues={{
                                      Username: "",
                                      Password: ""
                                  }}
                                  validationSchema={formSchema}
                                  onSubmit={values => {

                                      this.setState({ invalidUsernameOrPassword: false, isLoading: true });
                                      apiClient
                                          .post('Authentication/Login', values)
                                          .then(res => {
                                             
                                              this.setState({ isLoading: false });
                                              if (res.data.IsAuthenticated) {
                                                  sessionStorage.setItem('userAuth', JSON.stringify(res.data));
                                                  //this.props.history.push('/Dashboard'); 
                                                  window.location = '/Dashboard';       //TODO: fix this, just so it can get new values for user until I figure it out
                                              }
                                              else {
                                                  this.setState({ invalidUsernameOrPassword: true });
                                              }
                                          })
                                          .catch(function (error) {
                                              alert(error);
                                          });
                                  }}
                              >
                                  {({ errors, touched }) => (
                                      <Form className="pt-2">
                                          {this.state.invalidUsernameOrPassword ? 

                                              <FormGroup >
                                                  <p className="white">Invalid username or password</p>
                                              </FormGroup>
                                              
                                              : null
                                          }
                                          
                                          <FormGroup>
                                              <Field type="email" name="Username" id="Username" placeholder="username" className={`form-control ${errors.Username && touched.Username && 'is-invalid'}`} />
                                              {errors.Username && touched.Username ? <div className="invalid-feedback">{errors.Username}</div> : null}
                                          </FormGroup>
                                          {this.state.isLoading ?

                                              <div><Spinner /></div>

                                              : null
                                          }
                                          <FormGroup>
                                              <Field type="password" name="Password" id="Password" placeholder="password" className={`form-control ${errors.Password && touched.Password && 'is-invalid'}`} />
                                              {errors.Password && touched.Password ? <div className="invalid-feedback">{errors.Password}</div> : null}
                                          </FormGroup>
                                          <FormGroup>
                                              <Col md="12">
                                                  <Button type="submit" color="danger" block className="btn-pink btn-raised" to="/Dashboard">
                                                      Login
				                                  </Button>
                                              </Col>
                                          </FormGroup>
                                      </Form>
                                  )}
                              </Formik>
                        </CardBody>
                    </Card>
                </Col>
                <Col xs="12" className="d-flex align-items-center justify-content-center">
                    <Footer />
                </Col>
            </Row>
        </div>
      );
   }
}

export default Login;
