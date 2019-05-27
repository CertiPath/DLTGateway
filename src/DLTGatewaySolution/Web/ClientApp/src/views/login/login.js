import * as Yup from "yup";

import { CurrentUserConsumer, CurrentUserProvider } from "../../utility/context/currentUserContext";
import { Button, Card, CardBody, CardHeader, Col, FormGroup, Row } from "reactstrap";
import { Field, Form, Formik } from "formik";
// import external modules
import React, { Component } from "react";
import qs from 'qs';
import { toastr } from 'react-redux-toastr';

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
            loginFailure: false,
            loginFailureReason: '',
            isLoading: false
        };

        sessionStorage.setItem('userAuth', JSON.stringify(
            {
                IsAuthenticated: false,
                Token: "",
                FirstName: "",
                LastName: "",
                Email: ""
            }));

    }

    loadCurrentUserInfo(context) {

        let user = JSON.parse(sessionStorage.getItem('userAuth'));
        if (user != null) {
            if (user.IsAuthenticated.toString().toUpperCase() == 'TRUE') {
                apiClient.defaults.headers.common['Authorization'] = 'Bearer ' + user.access_token;
            }
        }

        apiClient.get('User/GetDetails', {})
            .then(res => {
                sessionStorage.setItem('userDetails', JSON.stringify(res.data));
                context.setDetails(res.data);
                this.props.history.push('/Dashboard'); 
            });
    }

   render() {
      return (

          //<CurrentUserProvider>
              <CurrentUserConsumer>
                  {context => (
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
                                                  grant_type: "password",
                                                  Username: "",
                                                  Password: ""
                                              }}
                                              validationSchema={formSchema}
                                              onSubmit={values => {
                                                  var self = this
                                                  this.setState({ loginFailure: false, isLoading: true });
                                                  apiClient
                                                      .post('oauth2/token',
                                                          qs.stringify(values),
                                                          {
                                                              headers: {
                                                                  'Content-Type': 'application/x-www-form-urlencoded',
                                                                  'Accept': "*/*"
                                                              }
                                                          })
                                                      .then(res => {
                                                          this.setState({ isLoading: false });

                                                          if (res.data.error != null) {
                                                              this.setState({
                                                                  loginFailure: true,
                                                                  loginFailureReason: res.data.error
                                                              });
                                                          }
                                                          else {
                                                              if (res.data.IsAuthenticated.toUpperCase() == 'TRUE') {
                                                                  context.setAuth(res.data);
                                                                  sessionStorage.setItem('userAuth', JSON.stringify(res.data));
                                                                  this.loadCurrentUserInfo(context);
                                                              }
                                                              else {
                                                                  this.setState({
                                                                      loginFailure: true,
                                                                      loginFailureReason: 'Invalid username or password'
                                                                  });
                                                              }
                                                          }
                                                      })
                                                      .catch(function (error) {

                                                          self.setState({ isLoading: false });
                                                          if (error.request.response != undefined && error.request.response != null) {
                                                              toastr.warning('Authentication Failure', error.response.data.error, {
                                                                  position: 'top-left', width: '100%', 'align-items': 'center'
                                                              });
                                                          }
                                                          else {
                                                              toastr.warning('Authentication Failure', error.response.data.error, {
                                                                  position: 'top-left', width: '100%', 'align-items': 'center'
                                                              });
                                                          }
                                                      });
                                              }}
                                          >
                                              {({ errors, touched }) => (
                                                  <Form className="pt-2">
                                                      {this.state.loginFailure ?

                                                          <FormGroup >
                                                              <p className="white">{this.state.loginFailureReason}</p>
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
                  )}
              </CurrentUserConsumer>
        //  </CurrentUserProvider>
      );
   }
}

export default Login;
