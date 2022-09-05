import React from 'react';
import { createBrowserHistory } from 'history';
import { ReactKeycloakProvider } from '@react-keycloak/web';
// import keycloak from './keycloak';
import AppWrapper from './AppWrapper';
import Keycloak from 'keycloak-js';

const defaultHistory = createBrowserHistory();

const KeycloakWrapper = ({ config, history = defaultHistory }) => {
    const keycloak = new Keycloak({
        realm: config.keyCloakRealm,
        url: `${config.keyCloakUrl}auth/`,
        clientId: config.keyCloakClientId,
    });

    const setTokens = () => {
        const { token, refreshToken, idTokenParsed } = keycloak;
        if (token && refreshToken && idTokenParsed) {
            sessionStorage.setItem('react-token', token);
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', idTokenParsed.preferred_username);
        }
    };

    const refreshAccessToken = () => {
        keycloak
            .updateToken(50)
            .success((refreshed) => {
                if (refreshed) {
                    setTokens();
                }
            })
            .error(() => {
                sessionStorage.clear();
                keycloak.logout();
            });
    };

    const handleEvent = (event) => {
        if (event === 'onAuthSuccess') {
            setTokens();
        }

        if (event === 'onTokenExpired') {
            refreshAccessToken();
        }

        if (event === 'onAuthLogout') {
            sessionStorage.clear();
        }
    };

    return (
        <ReactKeycloakProvider
            initOptions={{
                onLoad: 'login-required',
                checkLoginIframe: false,
            }}
            authClient={keycloak}
            onEvent={handleEvent}>
            <AppWrapper config={config} history={history} />
        </ReactKeycloakProvider>
    );
};

export default KeycloakWrapper;
