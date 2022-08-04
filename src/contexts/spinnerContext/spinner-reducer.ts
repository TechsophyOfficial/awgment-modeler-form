import { OPEN_SPINNER, CLOSE_SPINNER } from 'constants/actions';

const spinnerReducer = (state, action) => {
    switch (action.type) {
        case OPEN_SPINNER:
            return true;
        case CLOSE_SPINNER:
            return false;
        default:
            return state;
    }
};

export default spinnerReducer;
