import { BrowserRouter, Switch } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";

import FullPageLayout from "../layouts/routes/fullpageRoutes";
import MainLayoutRoutes from "../layouts/routes/mainRoutes";
import Spinner from "../components/spinner/spinner";
import strings from "../app/localizedStrings";

// Full Layout
const LazyLogin = lazy(() => import("../views/login/login"));

// Main Layout
const LazyDashboard = lazy(() => import("../views/dashboard/dashboard"));
const LazySettings = lazy(() => import("../views/settings/system"));
const LazyRoles = lazy(() => import("../views/settings/roles"));
const LazyBizNetworkList = lazy(() => import("../views/businessnetwork/list"));
const LazyBizNetworkDetails = lazy(() => import("../views/businessnetwork/details"));
const LazyBizNetworkNamespace = lazy(() => import("../views/businessnetwork/Namespace"));
const LazyDataStore = lazy(() => import("../views/datastore/list"));
const LazySystemUsers = lazy(() => import("../views/users/users"));
const LazyMyProfile = lazy(() => import("../views/users/myprofile"));
const LazyAccessDenied = lazy(() => import("../views/login/accessDenied"));

class Router extends Component {

    constructor() {
        super();
        let user = JSON.parse(sessionStorage.getItem('userAuth'));
        if (user === null) {
            user = {
                IsAuthenticated: false,
                FirstName: "",
                LastName: "",
                Email: ""
            }
        }
        this.state = {
            dashboardWelcomeMessage: strings.Dashboard.WelcomeMessage + ', ' + user.FirstName,
        };
    }

    render() {
        
        
        return (
         // Set the directory path if you are deplying in sub-folder
         <BrowserRouter basename="/">
            <Switch>
                  <FullPageLayout
                      exact
                      path="/"
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyLogin {...matchprops} />
                          </Suspense>
                      )}
                  />
                  <FullPageLayout
                      exact
                      path="/AccessDenied"
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyAccessDenied {...matchprops} />
                          </Suspense>
                      )}
                  />
                  <MainLayoutRoutes
                      exact
                      path="/Dashboard"
                      title={strings.Dashboard.Title}
                      subTitle={this.state.dashboardWelcomeMessage}
                    render={matchprops => (
                        <Suspense fallback={<Spinner />}>
                            <LazyDashboard {...matchprops} />
                        </Suspense>
                    )}
                  />
                  <MainLayoutRoutes
                      exact
                      path="/DataStore"
                      title={strings.DataStore.Title}
                      subTitle={strings.DataStore.SubTitle}
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyDataStore {...matchprops} />
                          </Suspense>
                      )}
                  />
                  <MainLayoutRoutes
                      exact
                      path="/Settings/System"
                      title="System Settings"
                      subTitle=""
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazySettings {...matchprops} />
                          </Suspense>
                      )}
                    />
                    <MainLayoutRoutes
                        exact
                        path="/Settings/Roles"
                        title="Roles"
                        subTitle="System Permissions"
                        render={matchprops => (
                            <Suspense fallback={<Spinner />}>
                                <LazyRoles {...matchprops} />
                            </Suspense>
                        )}
                    />
                  <MainLayoutRoutes
                      exact
                      path="/BusinessNetwork/List"
                      title={strings.BusinessNetworkList.Title}
                      subTitle={strings.BusinessNetworkList.SubTitle}
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyBizNetworkList {...matchprops} />
                          </Suspense>
                      )}
                  />
                  <MainLayoutRoutes
                     
                      path="/BusinessNetwork/Details/:id"
                      title={strings.BusinessNetwork.Title}
                      subTitle={strings.BusinessNetwork.SubTitle}
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyBizNetworkDetails {...matchprops} />
                          </Suspense>
                      )}
                    />
                    <MainLayoutRoutes

                        path="/BusinessNetwork/Namespace/:id"
                        title={strings.BusinessNetworkNamespace.Title}
                        subTitle={strings.BusinessNetworkNamespace.SubTitle}
                        render={matchprops => (
                            <Suspense fallback={<Spinner />}>
                                <LazyBizNetworkNamespace {...matchprops} />
                            </Suspense>
                        )}
                    />
                  <MainLayoutRoutes
                      exact
                      path="/Users"
                      title="System Users"
                      subTitle=""
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazySystemUsers {...matchprops} />
                          </Suspense>
                      )}
                  />
                  <MainLayoutRoutes
                      exact
                      path="/MyProfile"
                      title="My Profile"
                      subTitle=""
                      render={matchprops => (
                          <Suspense fallback={<Spinner />}>
                              <LazyMyProfile {...matchprops} />
                          </Suspense>
                      )}
                  />
            </Switch>
         </BrowserRouter>
      );
   }
}

export default Router;
