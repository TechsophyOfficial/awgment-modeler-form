import React, { useContext, useEffect, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { BACKGROUND_COLOR, BACKGROUND_COLOR_2 } from 'theme/colors';
import DataList from 'tsf_datalist/dist/components/dataList';
import { DeleteOutlined, EditOutlined } from '@mui/icons-material';
import VersionPopup from 'components/version';
import Popup from 'tsf_popup/dist/components/popup';
import LayoutContext from 'contexts/layoutContext/layout-context';
import { TOPBAR_HEIGHT, ACTION_DELETE, ACTION_EDIT, FORM_TABLE_HEADERS } from 'constants/common';
import ConfirmationContext from 'contexts/confirmationContext/confirmation-context';
import NotificationContext from 'contexts/notificationContext/notification-context';
import SpinnerContext from 'contexts/spinnerContext/spinner-context';
import TabContext from 'contexts/tabContext/tab-context';
import getNewFormioForm from 'constants/newFoimioForm';
import { getFormOrComponentDetails, deleteFormOrComponent, getAllFormsOrComponents } from 'services/FormService';
import { FormioSchema } from 'components/formModeler/FormTypes';
import FormContext from 'contexts/formContext/form-context';

const actions = [
    {
        actionId: ACTION_EDIT,
        actionName: 'Edit',
        actionIcon: EditOutlined,
    },
    {
        actionId: ACTION_DELETE,
        actionName: 'Delete',
        actionIcon: DeleteOutlined,
    },
];

const MaximizeView = () => {
    const [versionOpen, setVersionOpen] = useState(false);
    const { minimizeLayout } = useContext(LayoutContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);
    const { pushNotification } = useContext(NotificationContext);
    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const {
        tabsList: { tabs },
        addTab,
        closeTab,
    } = useContext(TabContext);
    const { formTableData, updateFormTableData } = useContext(FormContext);
    const { formName, newFormioForm } = getNewFormioForm();
    const { rowsPerPage, sortBy, sortDirection, page } = formTableData;

    useEffect(() => {
        fetchAllForms(rowsPerPage, page);
        // eslint-disable-next-line
    }, []);

    const useStyles = makeStyles(() => ({
        root: {
            backgroundColor: BACKGROUND_COLOR,
            minHeight: `calc(100% - ${TOPBAR_HEIGHT}px)`,
        },
        versionPopup: {
            '& .MuiDialog-paper': {
                backgroundColor: BACKGROUND_COLOR_2,
            },
        },
    }));

    const classes = useStyles();

    const fetchAllForms = async (noOfRows, pageNo, orderBy = sortBy, orderDirection = sortDirection) => {
        openSpinner();
        const {
            success,
            data,
            message = '',
        } = await getAllFormsOrComponents({
            type: 'form',
            paginate: true,
            rowsPerPage: noOfRows,
            page: pageNo,
            sortBy: orderBy,
            sortDirection: orderDirection,
        });
        closeSpinner();
        if (success && data) {
            const { totalElements, size, page: currentPage, content } = data;

            const updateData = {
                recordsCount: totalElements,
                page: currentPage,
                rowsPerPage: size,
                records: content,
                sortBy: orderBy,
                sortDirection: orderDirection,
            };
            updateFormTableData({
                ...formTableData,
                ...updateData,
            });
        } else {
            pushNotification({
                isOpen: true,
                message: message,
                type: 'error',
            });
        }
    };

    const handleVersionClicked = (e: string) => {
        setVersionOpen(false);
        minimizeLayout();
    };

    const fetchFormDetails = async (id: string): Promise<void> => {
        openSpinner();
        const { success, message, data } = await getFormOrComponentDetails(id);
        if (success && data) {
            const { name, version, properties } = data;
            const components: FormioSchema = data.components as FormioSchema;
            closeSpinner();
            minimizeLayout();
            addTab({
                key: formName,
                id: id,
                name: name,
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

    const deleteFormOrComponentItem = async (id: string) => {
        openSpinner();
        const { success, message } = await deleteFormOrComponent(id);
        if (success) {
            showConfirmation({
                ...confirmation,
                isOpen: false,
            });
            await fetchAllForms(rowsPerPage, page);
            const foundIndex = tabs.findIndex((x) => x.id === id);
            closeTab(foundIndex);
            pushNotification({
                isOpen: true,
                message: message ? message : '',
                type: 'success',
            });
            closeSpinner();
        } else {
            closeSpinner();
            pushNotification({
                isOpen: true,
                message: message ? message : '',
                type: 'error',
            });
        }
    };

    const actionClicked = (e: string, id: string) => {
        if (e === ACTION_EDIT) {
            fetchFormDetails(id);
        } else if (e === ACTION_DELETE) {
            showConfirmation({
                ...confirmation,
                isOpen: true,
                title: 'Are you sure,Do you want to delete?',
                subTitle: 'Please confirm if you want to delete this particular form',
                confirmButtonLabel: 'Delete',
                onConfirm: () => deleteFormOrComponentItem(id),
            });
        }
    };

    const handleChangePage = (e, newPage) => {
        fetchAllForms(rowsPerPage, newPage + 1);
    };

    const handleChangeRowsPerPage = async (event) => {
        const selectedRowPerPage = parseInt(event.target.value, 10);
        await fetchAllForms(selectedRowPerPage, 1);
    };

    const handleSortRequest = async (cellId) => {
        const isAsc = sortBy === cellId && sortDirection === 'asc' ? 'desc' : 'asc';
        await fetchAllForms(rowsPerPage, 1, cellId, isAsc);
    };

    // TODO: CHECK THIS WITH paginate: true
    const handleSearch = async (searchTerm: string): Promise<void> => {
        const { success, data } = await getAllFormsOrComponents({
            type: 'form',
            paginate: false,
            searchTerm: searchTerm,
        });
        if (success && data) {
            const updateData = { records: data };
            updateFormTableData({
                ...formTableData,
                ...updateData,
            });
        }
    };

    return (
        <div className={classes.root}>
            <DataList
                data={formTableData}
                columns={FORM_TABLE_HEADERS}
                maxView={true}
                title="List of Forms"
                showCreateNewButton={true}
                showSearchFeild={true}
                actions={actions}
                actionClicked={(e, id) => actionClicked(e, id)}
                rowClicked={({ id }) => fetchFormDetails(id)}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleSortRequest={handleSortRequest}
                handleSearch={(event) => handleSearch(event?.target?.value)}
                handleCreateNew={() => {
                    minimizeLayout();
                    addTab({
                        key: formName,
                        name: formName,
                        content: newFormioForm,
                    });
                }}
            />
            <Popup size="xs" title={'Recommended Versions'} onShow={versionOpen} onClose={() => setVersionOpen(false)}>
                <VersionPopup id={'1'} onVersionClicked={handleVersionClicked} />
            </Popup>
        </div>
    );
};

export default MaximizeView;
