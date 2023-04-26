import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KeycloakWrapper from './KeycloakWrapper';

declare const window: any;

window.renderFormMFE = (containerId: any, history, config) => {
    console.log(config);
    // fetch('../model/forms/config.json')
    //     .then((r) => r.json())
    //     .then((config) => {
    ReactDOM.render(<App config={config} history={history} />, document.getElementById(containerId));
    serviceWorker.unregister();
    // });
};

window.unmountFormMFE = (containerId) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId) as HTMLElement);
};

if (!document.getElementById('FormMFE-container')) {
    fetch(`https://demo1691447.mockable.io/api/awgment/v1/tenants${window.location.pathname}`)
        .then((r) => r.json())
        .then((config) => {
            ReactDOM.render(<KeycloakWrapper config={config} />, document.getElementById('root'));
        });

    serviceWorker.unregister();
}
