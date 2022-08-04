import React from 'react';
import { createBrowserHistory } from 'history';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './keycloak';
import AppWrapper from './AppWrapper';

const defaultHistory = createBrowserHistory();

const KeycloakWrapper = ({ history = defaultHistory }) => {
    const setTokens = (): void => {
        const { token, refreshToken, idTokenParsed } = keycloak;
        if (token && refreshToken && idTokenParsed) {
            sessionStorage.setItem('react-token', token);
            localStorage.setItem('token', token);
            localStorage.setItem('currentUser', idTokenParsed.preferred_username);
        }
    };

    const refreshAccessToken = (): void => {
        keycloak
            .updateToken(50)
            .success((refreshed: boolean) => {
                if (refreshed) {
                    setTokens();
                }
            })
            .error(() => {
                sessionStorage.clear();
                keycloak.logout();
            });
    };

    const handleEvent = (event: string): void => {
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
            <AppWrapper history={history} />
        </ReactKeycloakProvider>
    );
};

export default KeycloakWrapper;
