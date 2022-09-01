import React from 'react';
import Navigator from 'Navigator';
import ContextProvider from 'ContextProvider';
import ThemeProvider from 'contexts/themeContext/ThemeState';
import createGenerateClassName from '@mui/styles/createGenerateClassName';
import StylesProvider from '@mui/styles/StylesProvider';
import { StyledEngineProvider } from '@mui/material';
import AppConfig from './appConfig.js';

const App = ({ config, history }): React.ReactElement => {
    const generateClassName = createGenerateClassName({
        // disableGlobal: true,
        // productionPrefix: 'prod_form_mfe-',
        seed: 'formMFE',
    });
    return (
        <StyledEngineProvider injectFirst>
            <StylesProvider generateClassName={generateClassName}>
                <AppConfig.Provider value={config}>
                    <ThemeProvider>
                        <ContextProvider>
                            <Navigator config={config} history={history} />
                        </ContextProvider>
                    </ThemeProvider>
                </AppConfig.Provider>
            </StylesProvider>
        </StyledEngineProvider>
    );
};

export default App;
