import React, { useState, useCallback, useContext, useEffect } from 'react';
import { FilePicker } from 'react-file-picker';
import { IconButton, Menu, MenuItem, Button } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import GetAppIcon from '@mui/icons-material/GetApp';
import PublishIcon from '@mui/icons-material/Publish';
import Popup from 'tsf_popup/dist/components/popup';
import { Form } from 'react-formio';
import FormData from './custom.json';
import NotificationContext from 'contexts/notificationContext/notification-context';

interface ActionMenuProps {
    viewHandler: () => void;
    previewHandler: () => void;
    importHandler: (file) => void;
    exportHandler: () => void;
    setEndpointProperties: (value: any) => void;
    endpointProperties: any;
    elasticPush: string | undefined;
}

const ActionMenu: React.FC<ActionMenuProps> = ({
    viewHandler,
    previewHandler,
    importHandler,
    exportHandler,
    setEndpointProperties,
    endpointProperties,
    elasticPush,
}) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [showProperties, setShowProperties] = useState(false);

    const { pushNotification } = useContext(NotificationContext);
    const [propertyFromData, setPropertyFromData] = useState({});

    const useStyles = makeStyles((theme) => ({
        root: {
            backgroundColor: theme.palette.secondary.main,
            height: 36,
            width: 36,
            marginRight: 10,
            '&:hover': {
                backgroundColor: theme.palette.secondary.main,
                opacity: 0.8,
            },
        },
        menuIcon: {
            color: theme.palette.primary.main,
        },
        menuItemButton: {
            fontSize: 15,
            fontWeight: 500,
            color: theme.palette.primary.main,
            textTransform: 'none',
            '&:hover': {
                backgroundColor: 'transparent',
            },
        },
    }));
    const classes = useStyles();

    const handleAnchorElClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const onView = () => {
        setAnchorEl(null);
        viewHandler();
    };

    const onPreview = () => {
        setAnchorEl(null);
        previewHandler();
    };

    const onImport = (file) => {
        setAnchorEl(null);
        importHandler(file);
    };

    const onExport = () => {
        setAnchorEl(null);
        exportHandler();
    };

    const closePopup = useCallback(() => {
        setShowProperties(false);
        setAnchorEl(null);
    }, []);

    const handleSubmit = useCallback(
        (data) => {
            console.log({ data });

            setEndpointProperties(data);

            pushNotification({
                isOpen: true,
                message: 'Submitted Successfully',
                type: 'success',
            });

            setShowProperties(false);
            setAnchorEl(null);
        },
        [setEndpointProperties],
    );

    console.log({ endpointProperties });

    useEffect(() => {
        const data = { elasticPush, ...endpointProperties };
        setPropertyFromData(data);
    }, []);

    return (
        <>
            <IconButton
                id="form_actions_menu_button"
                className={classes.root}
                onClick={handleAnchorElClick}
                size="large">
                <DragIndicatorIcon className={classes.menuIcon} />
            </IconButton>
            <Menu id="menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem>
                    <Button
                        className={classes.menuItemButton}
                        onClick={() => setShowProperties((prevState) => !prevState)}
                        variant="text"
                        size="small"
                        startIcon={<AddIcon />}>
                        Properties
                    </Button>
                </MenuItem>
                <Popup title={'Choose properties'} onShow={showProperties} onClose={closePopup}>
                    <Form
                        submission={{ data: propertyFromData }}
                        form={FormData.components}
                        onSubmit={(submission) => handleSubmit(submission.data)}
                    />
                </Popup>
                <MenuItem onClick={onView}>
                    <Button
                        className={classes.menuItemButton}
                        variant="text"
                        size="small"
                        startIcon={<VisibilityIcon />}>
                        View JSON
                    </Button>
                </MenuItem>
                <MenuItem onClick={onPreview}>
                    <Button
                        className={classes.menuItemButton}
                        variant="text"
                        size="small"
                        startIcon={<VisibilityIcon />}>
                        Preview Form
                    </Button>
                </MenuItem>
                <MenuItem>
                    <Button className={classes.menuItemButton} variant="text" size="small" startIcon={<PublishIcon />}>
                        <FilePicker extensions={['json']} onChange={(file) => onImport(file)} onError={alert}>
                            <span>Import</span>
                        </FilePicker>
                    </Button>
                </MenuItem>
                <MenuItem onClick={onExport}>
                    <Button className={classes.menuItemButton} variant="text" size="small" startIcon={<GetAppIcon />}>
                        Export
                    </Button>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ActionMenu;
