import React from 'react';
import { useKeycloak } from '@react-keycloak/web';
import App from './App';

const AppWrapper = ({ history }): React.ReactElement => {
    const { keycloak, initialized } = useKeycloak();
    return <>{initialized && keycloak.authenticated && <App history={history} />}</>;
};

export default AppWrapper;
