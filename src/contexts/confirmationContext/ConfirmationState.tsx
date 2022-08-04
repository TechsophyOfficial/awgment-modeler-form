import React, { useReducer } from 'react';
import { SHOW_CONFIRMATION } from 'constants/actions';
import ConfirmationContext from './confirmation-context';
import confirmationReducer from './confirmation-reducer';

const ConfirmationState = ({ children }) => {
    const [confirmationState, dispatch] = useReducer(confirmationReducer, {
        isOpen: false,
        title: '',
        subTitle: '',
        showIcon: false,
        confirmButtonTheme: 'error',
        onConfirm: () => {},
    });

    const showConfirmation = (data) => {
        dispatch({ type: SHOW_CONFIRMATION, payload: data });
    };

    return (
        <ConfirmationContext.Provider value={{ confirmation: confirmationState, showConfirmation: showConfirmation }}>
            {children}
        </ConfirmationContext.Provider>
    );
};

export default ConfirmationState;
