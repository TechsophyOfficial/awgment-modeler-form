import { UPDATE_FORM_TABLE } from 'constants/actions';

const formReducer = (state, action) => {
    switch (action.type) {
        case UPDATE_FORM_TABLE:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default formReducer;
