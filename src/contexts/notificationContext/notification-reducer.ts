import { PUSH_NOTIFICATION } from 'constants/actions';

const notificationReducer = (state, action) => {
    switch (action.type) {
        case PUSH_NOTIFICATION:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default notificationReducer;
