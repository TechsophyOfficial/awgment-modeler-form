import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Form } from 'react-formio';
import { CheckOutlined, DeleteOutlined, EditOutlined } from '@mui/icons-material';
import {
    ACTION_DELETE,
    ACTION_EDIT,
    ACTION_PUBLISH,
    ADD_COMPONENT_FORM_ID,
    COMPONENT_TABLE_HEADERS,
    DEPLOY_COMPONENT_FORM_ID,
    EDIT_COMPONENT_FORM_ID,
} from '../../constants/common';
import {
    deleteFormOrComponent,
    deployFormOrComponent,
    getFormOrComponentDetails,
    fetchRuntimeFormDetails,
    getAllFormsOrComponents,
    saveFormOrComponent,
} from '../../services/FormService';
import ConfirmationContext from '../../contexts/confirmationContext/confirmation-context';
import DataList from 'tsf_datalist/dist/components/dataList';
import { DataTableProps } from 'tsf_datalist/dist/components/dataList/types';
import Popup from 'tsf_popup/dist/components/popup';
import { TABLE_INITIAL_STATE } from 'constants/actions';
import SpinnerContext from 'contexts/spinnerContext/spinner-context';
import NotificationContext from 'contexts/notificationContext/notification-context';
import { PropertiesSchema } from 'components/formModeler/FormTypes';

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
    {
        actionId: ACTION_PUBLISH,
        actionName: 'Deploy',
        actionIcon: CheckOutlined,
    },
];

interface ActionItems {
    label: string;
    url: string;
    type: string;
}

interface Component {
    actions: ActionItems[];
}

interface ComponentForm {
    id?: string;
    name: string;
    components: Component;
}

export interface ComponentFormResponse {
    id: string;
    name: string;
    version: string;
    components: Component;
    properties: PropertiesSchema;
}

interface ComponentProps {
    id: string;
    name: string;
    version: string;
    actions: ActionItems[];
}

interface FormioSubmissionForm extends Component {
    id?: string;
    name: string;
    submit: boolean;
}

export interface ComponentTable {
    searchBy: string;
    rowsPerPageOptions: number[];
    recordsCount: number;
    page: number;
    rowsPerPage: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    records: any[] | [];
}

const Components = () => {
    const { pushNotification } = useContext(NotificationContext);
    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);

    const [componentTableData, updateComponentTableData] = useState<DataTableProps>(TABLE_INITIAL_STATE);
    const { rowsPerPage, page, sortBy, sortDirection } = componentTableData as ComponentTable;
    const [addComponentForm, setAddComponentForm] = useState<any>({});
    const [editComponentForm, setEditComponentForm] = useState<any>({});
    const [deployComponentForm, setDeployComponentForm] = useState<any>({});
    const [editComponentData, setEditComponentData] = useState<ComponentProps | null>(null);
    const [deployComponentData, setDeployComponentData] = useState<ComponentFormResponse | null>(null);
    const [isAddComponentModal, setIsAddComponentModal] = useState<boolean>(false);
    const [isEditComponentModal, setIsEditComponentModal] = useState<boolean>(false);
    const [isDeployComponentModal, setIsDeployComponentModal] = useState<boolean>(false);

    useEffect(() => {
        fetchAllForms(rowsPerPage, page);
        // eslint-disable-next-line
    }, []);
    const fetchAllForms = async (noOfRows, pageNo, orderBy = sortBy, orderDirection = sortDirection): Promise<void> => {
        openSpinner();
        const { success = false, data } = await getAllFormsOrComponents({
            type: 'component',
            paginate: true,
            rowsPerPage: noOfRows,
            page: pageNo,
            sortBy,
            sortDirection,
        });
        closeSpinner();
        if (success && data) {
            const { totalElements, size, page: currentPage, content } = data;

            const updateData = { recordsCount: totalElements, page: currentPage, rowsPerPage: size, records: content };

            updateComponentTableData({ ...componentTableData, ...updateData });
            if (orderBy && orderDirection) {
                updateComponentTableData({
                    ...componentTableData,
                    ...updateData,
                    sortBy: orderBy,
                    sortDirection: orderDirection,
                });
            }
        }
    };

    const fetchAddComponentForm = useCallback(async (): Promise<void> => {
        const { success = false, data } = await fetchRuntimeFormDetails(ADD_COMPONENT_FORM_ID);
        if (success && data) {
            setAddComponentForm(data.components);
        }
    }, []);
    const fetchEditComponentForm = useCallback(async (): Promise<void> => {
        const { success = false, data } = await fetchRuntimeFormDetails(EDIT_COMPONENT_FORM_ID);
        if (success && data) {
            setEditComponentForm(data.components);
        }
    }, []);
    const fetchDeployComponentForm = useCallback(async (): Promise<void> => {
        const { success = false, data } = await fetchRuntimeFormDetails(DEPLOY_COMPONENT_FORM_ID);
        if (success && data) {
            setDeployComponentForm(data.components);
        }
    }, []);

    useEffect(() => {
        fetchAddComponentForm();
        fetchEditComponentForm();
        fetchDeployComponentForm();
    }, [fetchAddComponentForm, fetchEditComponentForm, fetchDeployComponentForm]);

    const closePopup = useCallback(() => {
        setIsAddComponentModal(false);
        setIsEditComponentModal(false);
        setIsDeployComponentModal(false);
        showConfirmation({
            ...confirmation,
            isOpen: false,
        });
    }, [confirmation, showConfirmation]);

    const handleEditComponentAction = async (id): Promise<void> => {
        openSpinner();
        const { success, data } = await getFormOrComponentDetails(id);
        closeSpinner();
        if (success && data) {
            const { name, version } = data;
            const components: Component = data.components as Component;
            const componentData: ComponentProps = {
                id: id,
                name: name,
                version: version,
                actions: components.actions,
            };
            setEditComponentData(componentData);
            setIsEditComponentModal(true);
        } else {
            setEditComponentData(null);
        }
    };

    const handleDeployComponentAction = async (id): Promise<void> => {
        const { success, data } = await getFormOrComponentDetails(id);
        if (success && data) {
            setIsDeployComponentModal(true);
            const componentData: ComponentFormResponse = data as ComponentFormResponse;
            setDeployComponentData(componentData);
        } else {
            setDeployComponentData(null);
        }
    };

    const handleSearch = async (searchTerm: string): Promise<void> => {
        const { success, data } = await getAllFormsOrComponents({
            type: 'component',
            paginate: true,
            rowsPerPage,
            page: 1,
            sortBy,
            sortDirection,
            searchTerm,
        });
        if (success && data) {
            const { totalElements, size, page: currentPage, content } = data;
            updateComponentTableData({
                ...componentTableData,
                searchBy: searchTerm,
                recordsCount: totalElements,
                page: currentPage,
                rowsPerPage: size,
                records: content,
            });
        }
    };

    const handleDeploy = async (): Promise<void> => {
        if (deployComponentData) {
            openSpinner();
            const { success } = await deployFormOrComponent('component', deployComponentData);
            closeSpinner();
            if (success) {
                closePopup();
                pushNotification({
                    isOpen: true,
                    message: 'Component deployed successfully',
                    type: 'success',
                });
            } else {
                pushNotification({
                    isOpen: true,
                    message: 'Failed to deploy',
                    type: 'error',
                });
            }
        }
    };

    const handleSaveComponent = async (saveData: ComponentForm): Promise<void> => {
        openSpinner();
        const { success, data, message } = await saveFormOrComponent('component', saveData);
        closeSpinner();
        if (success && data) {
            closePopup();
            pushNotification({
                isOpen: true,
                message: message || 'Component saved successfully',
                type: 'success',
            });
            fetchAllForms(rowsPerPage, page);
        }
    };

    const handleSubmit = async (submissionData: FormioSubmissionForm) => {
        const { name, actions: componentActions } = submissionData;
        const saveData: ComponentForm = {
            name: name,
            components: { actions: componentActions },
        };
        if (isAddComponentModal) {
            await handleSaveComponent(saveData);
        } else if (isEditComponentModal) {
            if (editComponentData) {
                await handleSaveComponent({ ...saveData, id: submissionData.id });
            }
        } else {
            await handleDeploy();
        }
    };

    const onDelete = async (id: string): Promise<void> => {
        openSpinner();
        const { success = false, message } = await deleteFormOrComponent(id);
        closeSpinner();
        if (success) {
            closePopup();
            fetchAllForms(rowsPerPage, page);
            pushNotification({
                isOpen: true,
                message: message || 'Component deleted successfully',
                type: 'success',
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

    const actionClicked = (e: any, id: string) => {
        if (e === ACTION_EDIT) {
            handleEditComponentAction(id);
        } else if (e === ACTION_DELETE) {
            showConfirmation({
                ...confirmation,
                isOpen: true,
                title: 'Are you sure,Do you want to delete?',
                subTitle: 'Please confirm if you want to delete this particular tenant',
                confirmButtonLabel: 'Delete',
                onConfirm: () => onDelete(id),
            });
        } else if (e === ACTION_PUBLISH) {
            handleDeployComponentAction(id);
        }
    };

    return (
        <>
            <DataList
                title={'Components'}
                data={componentTableData}
                columns={COMPONENT_TABLE_HEADERS}
                maxView={true}
                showCreateNewButton={true}
                showSearchFeild={true}
                actions={actions}
                actionClicked={(e, id) => actionClicked(e, id)}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleSortRequest={handleSortRequest}
                handleSearch={(event) => handleSearch(event?.target?.value)}
                handleCreateNew={() => {
                    setIsAddComponentModal(true);
                    setEditComponentData(null);
                }}></DataList>
            <Popup
                title={
                    isAddComponentModal ? 'Add Component' : isEditComponentModal ? 'Edit Component' : 'Deploy Component'
                }
                onShow={isAddComponentModal || isEditComponentModal || isDeployComponentModal}
                onClose={closePopup}>
                <Form
                    form={
                        isAddComponentModal
                            ? addComponentForm
                            : isEditComponentModal
                            ? editComponentForm
                            : deployComponentForm
                    }
                    submission={isEditComponentModal && { data: editComponentData }}
                    onSubmit={(submission) => handleSubmit(submission.data)}
                />
            </Popup>
        </>
    );
};

export default Components;
