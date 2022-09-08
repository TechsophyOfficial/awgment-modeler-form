import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import App from './App';

const AppWrapper = ({ config, history }): React.ReactElement => {
    const { keycloak, initialized } = useKeycloak();
    return <>{initialized && keycloak.authenticated && <App config={config} history={history} />}</>;
};

export default AppWrapper;
