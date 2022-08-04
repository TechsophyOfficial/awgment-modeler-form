import { UPDATE_FORM_TABLE, TABLE_INITIAL_STATE } from 'constants/actions';
import React, { useReducer } from 'react';
import FormContext from './form-context';
import formReducer from './form-reducer';

const FormState = ({ children }) => {
    const [formState, dispatch] = useReducer(formReducer, TABLE_INITIAL_STATE);

    const updateFormTableData = (data) => {
        dispatch({ type: UPDATE_FORM_TABLE, payload: data });
    };

    return (
        <FormContext.Provider value={{ formTableData: formState, updateFormTableData: updateFormTableData }}>
            {children}
        </FormContext.Provider>
    );
};

export default FormState;
