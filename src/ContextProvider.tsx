import React, { useContext, useEffect } from 'react';
import ThemeContext from 'contexts/themeContext/theme-context';
import ConfirmationState from 'contexts/confirmationContext/ConfirmationState';
import NotificationState from 'contexts/notificationContext/NotificationState';
import SpinnerState from 'contexts/spinnerContext/SpinnerState';
import LayoutState from 'contexts/layoutContext/LayoutState';
import { getSelectedTheme, ThemeProps } from 'services/ThemeService';
import FormState from 'contexts/formContext/FormState';
import TabState from 'contexts/tabContext/TabState';
import { ThemeProvider, Theme, StyledEngineProvider } from '@mui/material';
import { StylesProvider } from '@mui/styles';

declare module '@mui/styles/defaultTheme' {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface DefaultTheme extends Theme {}
}

const ContextProvider: React.FC = ({ children }) => {
    const { theme, updateTheme } = useContext(ThemeContext);

    useEffect(() => {
        const setTheme = async () => {
            const selectedThemeRes = await getSelectedTheme();
            if (selectedThemeRes.success) {
                const selectedTheme = selectedThemeRes.data as ThemeProps;
                updateTheme(selectedTheme);
            }
        };
        setTheme();
        // eslint-disable-next-line
    }, []);

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <SpinnerState>
                    <ConfirmationState>
                        <NotificationState>
                            <LayoutState>
                                <FormState>
                                    <TabState>{children}</TabState>
                                </FormState>
                            </LayoutState>
                        </NotificationState>
                    </ConfirmationState>
                </SpinnerState>
            </ThemeProvider>
        </StyledEngineProvider>
    );
};

export default ContextProvider;
