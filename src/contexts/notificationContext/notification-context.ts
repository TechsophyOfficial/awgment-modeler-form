import { createContext } from 'react';
import { NotificationProps } from 'tsf_notification/dist/components/notification/type';

export interface NotificationContextProps {
    notification: NotificationProps;
    pushNotification: (data: NotificationProps) => void;
}

const NotificationContext = createContext({} as NotificationContextProps);

export default NotificationContext;
