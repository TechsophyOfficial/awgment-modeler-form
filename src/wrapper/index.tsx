import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Spinner from 'components/common/spinner';
import Notification from 'tsf_notification/dist/components/notification';
import NotificationContext from 'contexts/notificationContext/notification-context';
import ConfirmDialog from 'tsf_confirm_dialog/dist/components/confirmDialog';
import ConfirmationContext from 'contexts/confirmationContext/confirmation-context';

const useStyles = makeStyles({
    appMain: {
        width: '100%',
        height: '100%',
    },
});

const Wrapper: React.FC = ({ children }) => {
    const classes = useStyles();
    const { notification, pushNotification } = useContext(NotificationContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);

    const closeNotification = () => {
        pushNotification({
            ...notification,
            isOpen: false,
        });
    };

    const closeConfirmation = () => {
        showConfirmation({
            ...confirmation,
            isOpen: false,
        });
    };

    return (
        <div className={classes.appMain}>
            {children}
            <Notification
                isOpen={notification.isOpen}
                type={notification.type}
                message={notification.message}
                handleClose={closeNotification}
            />
            <Spinner />
            <ConfirmDialog
                title={confirmation.title}
                subTitle={confirmation.subTitle}
                confirmButtonLabel={confirmation.confirmButtonLabel}
                isOpen={confirmation.isOpen}
                onConfirm={confirmation.onConfirm}
                onHide={closeConfirmation}
            />
        </div>
    );
};

export default Wrapper;
