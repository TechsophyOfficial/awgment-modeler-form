import React, { useCallback, useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import LayoutContext from 'contexts/layoutContext/layout-context';
import TabContext from 'contexts/tabContext/tab-context';
import { BACKGROUND_COLOR, WHITE } from 'theme/colors';
import DataList from 'tsf_datalist/dist/components/dataList';
import BrowserTabs from 'components/browserTabs';
import { DRAWER_WIDTH, TOPBAR_HEIGHT } from 'constants/common';
import { getAllFormsOrComponents, getFormOrComponentDetails } from 'services/FormService';
import SpinnerContext from 'contexts/spinnerContext/spinner-context';
import NotificationContext from 'contexts/notificationContext/notification-context';
import getNewFormioForm from 'constants/newFoimioForm';
import EmptyCardLayout from 'tsf_empty_card/dist/components/emptyCardLayout';
import { FormioSchema } from 'components/formModeler/FormTypes';

import AppConfig from '../../../../appConfig.js';

const MinimizeView = () => {
    const {
        layout: { isHidden, isMinimized },
    } = useContext(LayoutContext);

    const useStyles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            height: `calc(100% - ${TOPBAR_HEIGHT}px)`,
            width: '100%',
            position: 'relative',
        },
        sidebar: {
            backgroundColor: WHITE,
            width: `${isMinimized ? `${DRAWER_WIDTH}px` : 0}`,
            display: `${isHidden ? 'none' : 'block'}`,
            minHeight: '100%',
            overflowX: 'hidden',
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
                width: '6px',
                display: 'block',
            },
            '&::-webkit-scrollbar-thumb': {
                backgroundColor: theme?.palette?.primary.main,
            },
        },
        content: {
            flexGrow: 1,
            marginTop: -TOPBAR_HEIGHT,
            marginLeft: `${isHidden ? `${TOPBAR_HEIGHT}px` : '0px'}`,
            width: `${isMinimized ? `calc(100% - ${DRAWER_WIDTH}px)` : '100%'}`,
            backgroundColor: BACKGROUND_COLOR,
        },
        emptyListWrapper: {
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            '& > div': {
                marginLeft: 'auto',
                marginRight: 'auto',
            },
        },
    }));

    const classes = useStyles();

    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const {
        addTab,
        tabsList: { tabs, activeTabIndex },
    } = useContext(TabContext);
    const [formTableData, updateFormTableData] = useState([]);
    const { pushNotification } = useContext(NotificationContext);
    const { formName, newFormioForm } = getNewFormioForm();

    const appData: any = useContext(AppConfig);
    const [apiGatewayUrl, setApiGatewayUrl] = useState(appData.apiGatewayUrl);

    const fetchAllForms = useCallback(async () => {
        openSpinner();
        const {
            success,
            data,
            message = '',
        } = await getAllFormsOrComponents({
            type: 'form',
            paginate: false,
            sortBy: 'updatedOn',
            apiGatewayUrl: apiGatewayUrl,
        });
        closeSpinner();
        if (success && data) {
            updateFormTableData(data);
        } else {
            pushNotification({
                isOpen: true,
                message: message,
                type: 'error',
            });
        }
    }, [openSpinner, closeSpinner, pushNotification]);

    useEffect(() => {
        fetchAllForms();
        // eslint-disable-next-line
    }, []);

    const fetchFormDetails = async (id: string): Promise<void> => {
        openSpinner();
        const { success, message, data } = await getFormOrComponentDetails({ id: id, apiGatewayUrl: apiGatewayUrl });
        if (success && data) {
            const { name, version, properties, elasticPush } = data;
            const components: FormioSchema = data.components as FormioSchema;
            closeSpinner();
            addTab({
                key: formName,
                id: id,
                name: name,
                elasticPush: elasticPush,
                version: version.toString(),
                content: components,
                properties: properties,
            });
        } else {
            closeSpinner();
            pushNotification({
                isOpen: true,
                message: message || 'Unable to fetch form',
                type: 'error',
            });
        }
    };

    const handleSearch = async (searchTerm: string): Promise<void> => {
        const { success, data } = await getAllFormsOrComponents({
            type: 'form',
            paginate: false,
            sortBy: 'updatedOn',
            searchTerm: searchTerm,
            apiGatewayUrl: apiGatewayUrl,
        });
        if (success && data) {
            updateFormTableData(data);
        }
    };

    return (
        <div className={classes.root}>
            <div className={classes.sidebar}>
                <DataList
                    data={{ records: formTableData }}
                    showCreateNewButton={true}
                    showSearchFeild={true}
                    activeTaskId={tabs[activeTabIndex]?.id}
                    handleCreateNew={() =>
                        addTab({
                            key: formName,
                            name: formName,
                            content: newFormioForm,
                        })
                    }
                    handleSearch={(event) => handleSearch(event?.target?.value)}
                    rowClicked={({ id }) => fetchFormDetails(id)}
                />
            </div>
            <div className={classes.content}>
                {tabs.length ? (
                    <BrowserTabs loadRecords={fetchAllForms} />
                ) : (
                    <div className={classes.emptyListWrapper}>
                        <EmptyCardLayout
                            title="Get started with Form Modeler"
                            description="Build a series of tasks & decisions that make up your business process"
                            handleCreateNew={() =>
                                addTab({
                                    key: formName,
                                    name: formName,
                                    content: newFormioForm,
                                })
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MinimizeView;
