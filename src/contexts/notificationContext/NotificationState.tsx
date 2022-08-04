import React, { useReducer } from 'react';
import { PUSH_NOTIFICATION } from 'constants/actions';
import NotificationContext from './notification-context';
import notificationReducer from './notification-reducer';

const NotificationState = ({ children }) => {
    const [notificationState, dispatch] = useReducer(notificationReducer, { isOpen: false, message: '', type: '' });

    const pushNotification = (data) => {
        dispatch({ type: PUSH_NOTIFICATION, payload: data });
    };

    return (
        <NotificationContext.Provider value={{ notification: notificationState, pushNotification: pushNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationState;
