import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KeycloakWrapper from './KeycloakWrapper';

declare const window: any;

console.log(window);

window.renderFormMFE = (containerId: any, history, config) => {
    console.log('i am called container MFE');
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
    console.log('i am called not a container MFE');
    fetch('../forms/config.json')
        .then((r) => r.json())
        .then((config) => {
            ReactDOM.render(
                <React.StrictMode>
                    <KeycloakWrapper config={config} />
                </React.StrictMode>,

                document.getElementById('root'),
            );
            serviceWorker.unregister();
        });
}
