import React, { useReducer } from 'react';
import ThemeContext from './theme-context';
import themeReducer from './theme-reducer';
import { colors, createTheme, adaptV4Theme } from '@mui/material';
import { INITIAL_THEME, UPDATE_THEME } from '../../constants/actions';

const ThemeState = ({ children }) => {
    const [themeState, dispatch] = useReducer(themeReducer, INITIAL_THEME);

    const updateTheme = (data) => {
        let newTheme = INITIAL_THEME;
        if (data) {
            newTheme = createTheme(
                adaptV4Theme({
                    typography: {
                        fontFamily: data.fonts.font,
                        fontSize: data.fonts.fontSize,
                    },
                    overrides: {
                        MuiButton: {
                            containedPrimary: {
                                color: colors.common.white,
                                backgroundColor: data.colors.textColor,
                            },
                        },
                        MuiDialogContent: {
                            root: {
                                '& button.btn-primary': {
                                    color: colors.common.white,
                                    backgroundColor: data.colors.textColor,
                                    borderRadius: '9px',
                                    borderColor: data.colors.textColor,
                                },
                            },
                        },
                    },
                    palette: {
                        mode: 'light',
                        primary: {
                            main: data.colors.textColor,
                            light: '#95CBF7',
                        },
                        secondary: {
                            main: data.colors.headerColor,
                        },
                        error: {
                            main: '#f65656',
                        },
                    },
                }),
            );
        }

        dispatch({ type: UPDATE_THEME, payload: newTheme });
    };

    return (
        <ThemeContext.Provider value={{ theme: themeState, updateTheme: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeState;
