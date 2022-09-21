import React from 'react';
import { Route, BrowserRouter } from 'react-router-dom';
import { FORMS, COMPONENTS } from './constants/routes';
import Components from './components/components';
import Wrapper from './wrapper';
import Layout from 'components/layout';

const PrivateRoute = ({ component: Component, ...restProps }): React.ReactElement => {
    return (
        <Route
            {...restProps}
            render={(props): React.ReactElement => (
                <Wrapper>
                    <Component {...props} />
                </Wrapper>
            )}
        />
    );
};
const getBase = (currentLocation: string, config: any) => {
    // const container = `${process.env.REACT_APP_MFE_CONTAINER_BASENAME}`;
    const container = config.mfeFormContainerBaseName;
    if (container) {
        const url = currentLocation.includes(container) ? container : config.publicFormsUrl;
        return url;
    }
    return config.publicFormsUrl;
};

const Navigator = ({ config, history }): React.ReactElement => {
    const basename = getBase(window.location.href, config);
    return (
        <>
            <BrowserRouter basename={basename}>
                <PrivateRoute exact path={FORMS} component={Layout} />
                <PrivateRoute path={COMPONENTS} component={Components} />
            </BrowserRouter>
        </>
    );
};

export default Navigator;
