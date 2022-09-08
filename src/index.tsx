import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import KeycloakWrapper from './KeycloakWrapper';

declare const window: any;

window.renderFormMFE = (containerId: any, history) => {
    ReactDOM.render(<App history={history} />, document.getElementById(containerId));
    serviceWorker.unregister();
};

window.unmountFormMFE = (containerId) => {
    ReactDOM.unmountComponentAtNode(document.getElementById(containerId) as HTMLElement);
};

if (!document.getElementById('FormMFE-container')) {
    ReactDOM.render(
        <React.StrictMode>
            <KeycloakWrapper />
        </React.StrictMode>,

        document.getElementById('root'),
    );
    serviceWorker.unregister();
}
