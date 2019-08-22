import { BrowserRouter, Switch } from "react-router-dom";
import React, { Component, Suspense, lazy } from "react";

import { CurrentUserConsumer, CurrentUserProvider } from "../utility/context/currentUserContext";
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
const LazyObjectDetails = lazy(() => import("../views/object/details"));
const LazySystemUsers = lazy(() => import("../views/users/users"));
const LazyMyProfile = lazy(() => import("../views/users/user"));
const LazyAccessDenied = lazy(() => import("../views/login/accessDenied"));

class Router extends Component {

    render() {
        return (

            <CurrentUserProvider>
                <CurrentUserConsumer>
                {context => (
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
                                    subTitle={strings.Dashboard.WelcomeMessage + ", " + (context.Details == null ? '' : context.Details.Username)}
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
                                title="Global Roles"
                                subTitle="System wide permissions"
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

                                path="/Object/Details/:id"
                                title={"Object Details"}
                                subTitle={""}
                                render={matchprops => (
                                    <Suspense fallback={<Spinner />}>
                                        <LazyObjectDetails {...matchprops} />
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
                                path="/User"
                                    title={"User: " + (context.Details == null ? '' : context.Details.Username)}
                                subTitle=""
                                render={matchprops => (
                                    <Suspense fallback={<Spinner />}>
                                        <LazyMyProfile {...matchprops} />
                                    </Suspense>
                                )}
                            />
                        </Switch>
                    </BrowserRouter>
                    )}
                </CurrentUserConsumer>
            </CurrentUserProvider>
      );
   }
}

export default Router;
