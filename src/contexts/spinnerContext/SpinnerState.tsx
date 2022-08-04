import React, { useReducer } from 'react';
import { OPEN_SPINNER, CLOSE_SPINNER } from 'constants/actions';
import SpinnerContext from './spinner-context';
import spinnerReducer from './spinner-reducer';

const SpinnerState = ({ children }) => {
    const [spinnerState, dispatch] = useReducer(spinnerReducer, false);

    const openSpinner = () => {
        dispatch({ type: OPEN_SPINNER });
    };

    const closeSpinner = () => {
        dispatch({ type: CLOSE_SPINNER });
    };

    return (
        <SpinnerContext.Provider
            value={{ spinner: spinnerState, openSpinner: openSpinner, closeSpinner: closeSpinner }}>
            {children}
        </SpinnerContext.Provider>
    );
};

export default SpinnerState;
