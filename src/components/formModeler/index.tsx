import React, { useContext, useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import { Form as FormViewer, FormBuilder } from 'react-formio';
import ReactJson from 'react-json-view';
import { saveAs } from 'file-saver';
import TabContext, { Tab } from 'contexts/tabContext/tab-context';
import makeStyles from '@mui/styles/makeStyles';
import ActionButton from 'components/common/actionButton';
import ActionMenu from './ActionMenu';
import Popup from 'tsf_popup/dist/components/popup';
import {
    deleteFormOrComponent,
    deployFormOrComponent,
    getDocumentTypes,
    saveFormOrComponent,
    uploadDocument,
    deleteDocument,
    downloadDocument,
} from 'services/FormService';
import SpinnerContext from 'contexts/spinnerContext/spinner-context';
import NotificationContext from 'contexts/notificationContext/notification-context';
import ConfirmationContext from 'contexts/confirmationContext/confirmation-context';
import FileEdit from 'formiojs/components/file/editForm/File.edit.file';
import ApiEdit from 'formiojs/components/_classes/component/editForm/Component.edit.api';
import buttonEditDisplay from 'formiojs/components/button/editForm/Button.edit.display';
import {
    FormProps,
    SaveFormProps,
    ButtonAction,
    FormioSchema,
    ExportForm,
    FileEditItems,
    DocType,
    FormFieldProps,
    FormState,
    ImportForm,
    PropertiesSchema,
} from './FormTypes';
import ImageIcon from '@mui/icons-material/Image';

interface FormModelerProps {
    tab: Tab;
    loadRecords: () => void;
}

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        height: '100%',
        overflowY: 'auto',
    },
    formModeler: {
        width: '100%',
        height: '100%',
        padding: 20,
        '& .formio-component-label-hidden': {
            marginTop: 48,
        },
    },
    actionButtonsWrapper: {
        position: 'absolute',
        right: 20,
        zIndex: 10,
    },
    actionButton: {
        marginRight: 10,
    },
    formButton: {
        marginLeft: 10,
    },
    formField: {
        marginTop: 10,
        marginBottom: 15,
    },
    formActionButtonWrapper: {
        display: 'flex',
        justifyContent: 'flex-end',
    },
}));

// return new Promise((resolve, reject) => {
//     console.log(storage, file, fileName, dir, evt, url, options, fileKey);
//     const formJSON = {
//         [fileKey]: file,
//         name: fileName,
//         dir,
//     };
//     const fd = new FormData();

//     for (const key in formJSON) {
//         fd.append(key, formJSON[key]);
//     }
// });
// console.log(storage, file, fileName, dir, evt, url, options, fileKey);

class FileService {
    async uploadFile(storage, file, fileName, dir, evt, url, options, fileKey) {
        return new Promise(async (resolve, reject) => {
            console.log(storage, file, fileName, dir, evt, url, options, fileKey);

            const res = await uploadDocument(url, { file, documentPath: dir, name: file.name });

            if (res.success) {
                // this.loadImage({ name: file.name, url: '', data: res.data, file });
                return resolve({
                    storage: 'url',
                    name: file.name,
                    url: '',
                    size: file.size,
                    type: file.type,
                    file: file,
                    data: res.data,
                });
            } else {
                reject('Falied to upload');
            }
        });
    }
    async deleteFile(fileInfo) {
        console.log(fileInfo);
        deleteDocument(fileInfo.data.id);

        //do something
    }
    async downloadFile(fileInfo, options) {
        console.log(fileInfo);
        const response = await downloadDocument(fileInfo.data.id);

        // console.log(response.data);
        if (fileInfo.type.includes('image')) {
            return {
                url: 'https://cdn-icons-png.flaticon.com/512/6789/6789174.png',
                name: fileInfo.name,
            };
        } else if (fileInfo.type.includes('pdf')) {
            return {
                url: 'https://cdn.pixabay.com/photo/2017/03/08/21/20/pdf-2127829_960_720.png',
                name: fileInfo.name,
            };
        } else {
            return {
                url: 'https://cdn.pixabay.com/photo/2017/03/08/21/19/file-2127825_960_720.png',
                name: fileInfo.name,
            };
        }
    }

    async loadImage(fileInfo) {
        return this.downloadFile(fileInfo, {}).then((result: any) => ({
            src: fileInfo.file,
            name: fileInfo.name,
        }));
    }
}

const myOptions = {
    fileService: new FileService(),
    // builder: {
    //     customAdvanced: {
    //         title: 'Advanced',
    //         default: false,
    //         weight: 0,
    //         components: {
    //             inputcamera: {
    //                 schema: {
    //                     label: 'camera',
    //                     type: 'file',
    //                     key: 'inputcamera',
    //                     image: true,
    //                     url: 'https://api-gateway.techsophy.com/api/dms/v1/documents?documentTypeId=920997426618875904',
    //                     options: JSON.stringify({
    //                         withCredentials: true,
    //                         Authorization: `Bearer ${localStorage.getItem('token')}`,
    //                     }),
    //                 },
    //             },
    //         },
    //     },
    // },
};

const FormModeler: React.FC<FormModelerProps> = ({ tab, loadRecords }) => {
    const classes = useStyles();
    const { content } = tab;
    const {
        tabsList: { tabs },
        updateTab,
        closeTab,
    } = useContext(TabContext);
    const { pushNotification } = useContext(NotificationContext);
    const { openSpinner, closeSpinner } = useContext(SpinnerContext);
    const { confirmation, showConfirmation } = useContext(ConfirmationContext);

    const [formComponent, setFormComponent] = useState<FormioSchema>(content);
    const [currentFormJSON, setCurrentFormJSON] = useState<FormioSchema>({});
    const [openFormModal, setOpenFormModal] = useState<boolean>(false);
    const [isViewJSON, setIsViewJSON] = useState<boolean>(false);
    const [isPreviewForm, setIsPreviewForm] = useState<boolean>(false);
    const [isDeploy, setIsDeploy] = useState<boolean>(false);
    const [formState, setFormState] = useState<FormState>({
        name: '',
        version: '',
        deploymentName: '',
    });
    const [importedForm, setImportedForm] = useState<ImportForm | null>(null);
    const [endpointProperties, setEndpointProperties] = useState<PropertiesSchema | null>(
        tab.hasOwnProperty('properties') ? tab.properties : null,
    );

    const fetchDocuments = async (): Promise<{ label: string; value: string }[] | null> => {
        const { success, data } = await getDocumentTypes();
        if (success && data) {
            return data?.map((doc: DocType) => ({
                label: doc.name,
                value: doc.id,
            }));
        }
        return null;
    };

    useEffect(() => {}, []);

    // useEffect(() => {
    //     fetchDocuments().then((docs) => {
    //         if (docs) {
    //             const docTypeObj = {
    //                 type: 'select',
    //                 label: 'Document Type',
    //                 data: {
    //                     values: docs,
    //                 },
    //                 tooltip: 'Select type of document from the list',
    //                 validate: {
    //                     required: true,
    //                 },
    //                 key: 'documentType',
    //                 input: true,
    //                 defaultValue: docs.length ? docs[0].value : '',
    //             };

    //             const docTypeArr = FileEdit.filter((item: FileEditItems) => {
    //                 return item.key === 'documentType';
    //             });

    //             if (docTypeArr.length === 0) {
    //                 FileEdit.splice(1, 0, docTypeObj);
    //             }

    //             for (const [index, value] of FileEdit.entries()) {
    //                 if (value.key === 'storage') {
    //                     FileEdit[index] = {
    //                         type: 'select',
    //                         input: true,
    //                         key: 'storage',
    //                         defaultValue: 'url',
    //                         label: 'Storage',
    //                         placeholder: 'Select your file storage provider',
    //                         tooltip: 'Which storage to save the files in',
    //                         validate: {
    //                             required: true,
    //                         },
    //                         data: {
    //                             values: [
    //                                 {
    //                                     label: 'URL',
    //                                     value: 'url',
    //                                 },
    //                             ],
    //                         },
    //                     };
    //                 }
    //                 if (value.key === 'url') {
    //                     FileEdit[index] = {
    //                         type: 'textfield',
    //                         input: true,
    //                         key: 'documentPath',
    //                         label: 'Document Path',
    //                         weight: 10,
    //                         placeholder: 'Enter document path',
    //                         tooltip: 'If given file will be saved to this path',
    //                         conditional: {
    //                             json: {
    //                                 '===': [
    //                                     {
    //                                         var: 'data.storage',
    //                                     },
    //                                     'url',
    //                                 ],
    //                             },
    //                         },
    //                     };
    //                 }

    //                 if (value.key === 'documentType') {
    //                     FileEdit[index] = docTypeObj;
    //                     console.log(docTypeObj);
    //                 }
    //             }
    //         }
    //     });
    // }, []);

    useEffect(() => {
        const isButtonActionAvailable = (action: string) => {
            return buttonEditDisplay[3].data.values.some((item: ButtonAction) => item.value === action);
        };

        const addNewButtonAction = (actionObj) => {
            buttonEditDisplay[3].data.values = [...buttonEditDisplay[3].data.values, actionObj];
        };

        if (!isButtonActionAvailable('restAPI')) {
            addNewButtonAction({
                label: 'REST API',
                value: 'restAPI',
            });
        }
        if (!isButtonActionAvailable('saveAndSubmit')) {
            addNewButtonAction({
                label: 'Save And Submit',
                value: 'saveAndSubmit',
            });
        }
        if (!isButtonActionAvailable('lookup')) {
            addNewButtonAction({
                label: 'Lookup',
                value: 'lookup',
            });
        }
    }, []);

    useEffect(() => {
        const restApiRequiredFields = [
            {
                type: 'textfield',
                key: 'endpoint',
                input: true,
                weight: 120,
                label: 'Endpoint',
                tooltip: 'The Endpoint where the request will be sent.',
                placeholder: '/endpoint',
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        or: [
                            {
                                '===': [
                                    {
                                        var: 'data.action',
                                    },
                                    'restAPI',
                                ],
                            },
                            {
                                '===': [
                                    {
                                        var: 'data.action',
                                    },
                                    'lookup',
                                ],
                            },
                        ],
                    },
                },
            },
            {
                type: 'datagrid',
                key: 'queryParameters',
                input: true,
                weight: 120,
                initEmpty: true,
                label: 'Query Parameters',
                addAnother: 'Add Query Parameter',
                tooltip: 'Query Parameters and Values for your request',
                components: [
                    {
                        key: 'queryParameter',
                        label: 'Query Parameter',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                    {
                        key: 'value',
                        label: 'Value',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                ],
                conditional: {
                    json: {
                        or: [
                            {
                                '===': [
                                    {
                                        var: 'data.action',
                                    },
                                    'restAPI',
                                ],
                            },
                            {
                                '===': [
                                    {
                                        var: 'data.action',
                                    },
                                    'lookup',
                                ],
                            },
                        ],
                    },
                },
            },
            {
                type: 'select',
                key: 'requestType',
                label: 'Request Type',
                input: true,
                dataSrc: 'values',
                weight: 120,
                data: {
                    values: [
                        {
                            label: 'GET',
                            value: 'get',
                        },
                        {
                            label: 'POST',
                            value: 'post',
                        },
                        {
                            label: 'PUT',
                            value: 'put',
                        },
                        {
                            label: 'DELETE',
                            value: 'delete',
                        },
                    ],
                },
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.action',
                            },
                            'restAPI',
                        ],
                    },
                },
            },
            // {
            //   type: "textarea",
            //   key: "requestHeader",
            //   label: "Request Header",
            //   tooltip: "Enter valid Javascript Object",
            //   rows: 3,
            //   defaultValue: "{}",
            //   editor: "ace",
            //   input: true,
            //   weight: 120,
            //   conditional: {
            //     json: {
            //       "===": [
            //         {
            //           var: "data.action",
            //         },
            //         "restAPI",
            //       ],
            //     },
            //   },
            // },
            {
                type: 'checkbox',
                input: true,
                inputType: 'checkbox',
                key: 'isSubmissionDataRequestBody',
                label: 'Form Submission Data as Request Body',
                weight: 120,
                tooltip: 'Check this box to make form submission data as request body.',
                conditional: {
                    json: {
                        or: [
                            {
                                '===': [
                                    {
                                        var: 'data.requestType',
                                    },
                                    'post',
                                ],
                            },
                            {
                                '===': [
                                    {
                                        var: 'data.requestType',
                                    },
                                    'put',
                                ],
                            },
                        ],
                    },
                },
            },
            {
                type: 'textarea',
                key: 'requestBody',
                label: 'Request Body',
                tooltip: 'Enter valid JSON',
                rows: 4,
                defaultValue: {},
                editor: 'ace',
                as: 'json',
                input: true,
                weight: 120,
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.isSubmissionDataRequestBody',
                            },
                            false,
                        ],
                    },
                },
            },
            {
                type: 'checkbox',
                input: true,
                inputType: 'checkbox',
                key: 'isDisplayResponseMessage',
                label: 'Display Toast Message',
                weight: 120,
                tooltip: 'Check this box to display API response in a toast message.',
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.action',
                            },
                            'restAPI',
                        ],
                    },
                },
            },
            {
                label: 'Display Message Type',
                optionsLabelPosition: 'right',
                inline: true,
                tableView: false,
                weight: 120,
                defaultValue: 'apiResponseMessage',
                values: [
                    {
                        label: 'API Response Message',
                        value: 'apiResponseMessage',
                        shortcut: '',
                    },
                    {
                        label: 'Custom Message',
                        value: 'customMessage',
                        shortcut: '',
                    },
                ],
                validate: {
                    required: true,
                },
                key: 'displayMessageType',
                type: 'radio',
                input: true,
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.isDisplayResponseMessage',
                            },
                            true,
                        ],
                    },
                },
            },
            {
                type: 'textfield',
                key: 'customMessage',
                input: true,
                weight: 120,
                label: 'Custom Message',
                tooltip: 'This custom message will be displayed in the toast message',
                placeholder: 'Success Message',
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.displayMessageType',
                            },
                            'customMessage',
                        ],
                    },
                },
            },
            {
                type: 'checkbox',
                input: true,
                inputType: 'checkbox',
                key: 'mapResponseKey',
                label: 'Map Response Key',
                weight: 120,
                tooltip: 'Check this box to map response key with form field.',
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.action',
                            },
                            'restAPI',
                        ],
                    },
                },
            },
            {
                type: 'datagrid',
                key: 'mapResponseKeyWithFieldId',
                label: 'Map Response Key With Field Id',
                input: true,
                weight: 120,
                validate: {
                    required: true,
                },
                addAnother: 'Add New Entry',
                components: [
                    {
                        key: 'responseKey',
                        label: 'Response Key',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                    {
                        key: 'fieldId',
                        label: 'Field Id',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                ],
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.mapResponseKey',
                            },
                            true,
                        ],
                    },
                },
            },
        ];
        buttonEditDisplay.push(...restApiRequiredFields);
    }, []);

    useEffect(() => {
        const lookupActionRequiredFields = [
            {
                type: 'select',
                key: 'lookupType',
                label: 'Lookup Type',
                input: true,
                dataSrc: 'values',
                weight: 119,
                data: {
                    values: [
                        {
                            label: 'Table',
                            value: 'table',
                        },
                    ],
                },
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.action',
                            },
                            'lookup',
                        ],
                    },
                },
            },
            {
                type: 'textfield',
                key: 'tableLabel',
                input: true,
                weight: 119,
                label: 'Table Label',
                tooltip: 'Label of the table',
                placeholder: 'Ex- Users',
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.lookupType',
                            },
                            'table',
                        ],
                    },
                },
            },
            {
                type: 'datagrid',
                key: 'tableHeaders',
                input: true,
                weight: 119,
                initEmpty: true,
                label: 'Table Columns',
                addAnother: 'Add Column',
                tooltip: 'Column labels and keys for Table',
                components: [
                    {
                        key: 'label',
                        label: 'Label',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                    {
                        key: 'key',
                        label: 'Key',
                        input: true,
                        type: 'textfield',
                        validate: {
                            required: true,
                        },
                    },
                ],
                validate: {
                    required: true,
                },
                conditional: {
                    json: {
                        '===': [
                            {
                                var: 'data.lookupType',
                            },
                            'table',
                        ],
                    },
                },
            },
        ];
        buttonEditDisplay.push(...lookupActionRequiredFields);
    }, []);

    const onFormSchemaChange = (schema) => {
        setCurrentFormJSON(schema);
    };

    const getProperties = (): PropertiesSchema | null => {
        if (endpointProperties) {
            const { submit, ...properties } = endpointProperties;
            return properties;
        } else return null;
    };

    const onSaveForm = async (): Promise<void> => {
        const { id } = tab;
        const { name } = formState;
        let saveData: SaveFormProps | FormProps;
        const myProperties = getProperties();
        if (myProperties) {
            const { submit, ...properties } = myProperties;
            saveData = {
                name: name,
                components: currentFormJSON,
                properties: properties,
            };
        } else {
            saveData = {
                name: name,
                components: currentFormJSON,
            };
        }

        if (id) {
            saveData = {
                ...saveData,
                id: id,
            };
        }

        if (importedForm) {
            const { id: importedFormId } = importedForm;
            saveData = {
                ...saveData,
                id: importedFormId,
            };
        }

        openSpinner();
        const { success, data, message } = await saveFormOrComponent('form', saveData);
        setImportedForm(null);
        if (success && data) {
            const { id: newId, version } = data;
            setOpenFormModal(false);
            updateTab({ ...tab, id: newId, version: version.toString(), name });
            closeSpinner();
            pushNotification({
                isOpen: true,
                message: message || 'Form saved successfully',
                type: 'success',
            });
            loadRecords();
        } else {
            closeSpinner();
            pushNotification({
                isOpen: true,
                message: message || 'Unable to save form',
                type: 'error',
            });
        }
    };

    const onDeployForm = async (): Promise<void> => {
        if (tab.id && tab.version) {
            const { id, name, version } = tab;
            const { deploymentName } = formState;
            let postData;
            const myProperties = getProperties();
            if (myProperties) {
                const { submit, ...properties } = myProperties;
                postData = {
                    id,
                    name,
                    version,
                    deploymentName,
                    components: currentFormJSON,
                    properties: properties,
                };
            } else {
                postData = {
                    id,
                    name,
                    version,
                    deploymentName,
                    components: currentFormJSON,
                };
            }
            openSpinner();
            const { success } = await deployFormOrComponent('form', postData);
            closeSpinner();
            setOpenFormModal(false);
            if (success) {
                pushNotification({
                    isOpen: true,
                    message: 'Form deployed successfully',
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

    const handleSubmit = (event: React.FormEvent<HTMLElement>): void => {
        event.preventDefault();
        updateTab({ ...tab, content: currentFormJSON });
        isDeploy ? onDeployForm() : onSaveForm();
    };

    const onDeleteForm = async (): Promise<void> => {
        if (tab.id) {
            openSpinner();
            const { success = false, message } = await deleteFormOrComponent(tab.id);
            if (success) {
                showConfirmation({
                    ...confirmation,
                    isOpen: false,
                });
                closeSpinner();
                const foundIndex = tabs.findIndex((x) => x.key === tab.key);
                closeTab(foundIndex);
                pushNotification({
                    isOpen: true,
                    message: message || 'Form deleted successfully',
                    type: 'success',
                });
                loadRecords();
            } else {
                closeSpinner();
                pushNotification({
                    isOpen: true,
                    message: message || 'We are facing an internal issue, Please try again later',
                    type: 'error',
                });
            }
        }
    };

    const importHandler = async (file): Promise<void> => {
        const form: ExportForm = JSON.parse(await file.text());
        const { id, name, version = '', properties, components } = form;
        if (components) {
            setFormComponent(components);
            setEndpointProperties(properties);
            updateTab({ ...tab, content: components });
            if (id && name && version) {
                setImportedForm({ id, name, version });
                updateTab({ ...tab, id, name, version });
            }
        }
    };

    const prepareExportJSON = (): ExportForm => {
        const myProperties = getProperties();
        if (tab.id) {
            return {
                id: tab.id,
                name: tab.name,
                version: tab.version,
                components: currentFormJSON,
                properties: myProperties,
            };
        }
        return { components: currentFormJSON, properties: myProperties };
    };

    const exportHandler = (): void => {
        const fileToSave = new Blob([JSON.stringify(prepareExportJSON(), null, 2)]);
        saveAs(fileToSave, `${tab.name}.json`);
    };

    const closeGenericModal = () => {
        setIsViewJSON(false);
        setIsPreviewForm(false);
    };

    const handleSaveOrDeploy = async (deployState = false) => {
        setIsDeploy(deployState);
        setFormState({
            ...formState,
            name: importedForm?.name || tab.name,
            version: importedForm?.version || tab.version || '',
            deploymentName: '',
        });
        setOpenFormModal(true);
    };

    const renderFormModeler = (): React.ReactElement => {
        return (
            <div className={classes.formModeler}>
                <div className={classes.actionButtonsWrapper}>
                    <ActionButton
                        variant="primary"
                        buttonProps={{ id: 'form_save_button', className: classes.actionButton }}
                        onClick={() => handleSaveOrDeploy()}>
                        Save
                    </ActionButton>
                    {tab.id && (
                        <>
                            <ActionButton
                                variant="secondary"
                                buttonProps={{ id: 'form_deploy_button', className: classes.actionButton }}
                                onClick={() => handleSaveOrDeploy(true)}>
                                Deploy
                            </ActionButton>
                            <ActionButton
                                variant="secondary"
                                buttonProps={{ id: 'form_delete_button', className: classes.actionButton }}
                                onClick={() =>
                                    showConfirmation({
                                        ...confirmation,
                                        isOpen: true,
                                        title: 'Are you sure,Do you want to delete?',
                                        subTitle: 'Please confirm if you want to delete this particular form',
                                        confirmButtonLabel: 'Delete',
                                        onConfirm: () => onDeleteForm(),
                                    })
                                }>
                                Delete
                            </ActionButton>
                        </>
                    )}
                    <ActionMenu
                        viewHandler={() => setIsViewJSON(true)}
                        previewHandler={() => setIsPreviewForm(true)}
                        importHandler={importHandler}
                        exportHandler={exportHandler}
                        setEndpointProperties={setEndpointProperties}
                        endpointProperties={endpointProperties}
                    />
                </div>
                <FormBuilder
                    form={formComponent}
                    onChange={(schema) => onFormSchemaChange(schema)}
                    options={myOptions}
                />
            </div>
        );
    };

    const renderPopup = (): React.ReactElement => {
        return (
            <Popup
                title={isPreviewForm ? 'Preview Form' : 'View JSON'}
                size="lg"
                onShow={isViewJSON || isPreviewForm}
                onClose={closeGenericModal}>
                {currentFormJSON && (
                    <>
                        {isViewJSON && <ReactJson name={false} src={currentFormJSON} />}
                        {isPreviewForm && (
                            <FormViewer
                                form={currentFormJSON}
                                onSubmit={({ data: { submit, ...others } }) =>
                                    console.log(JSON.stringify(others, null, 2))
                                }
                            />
                        )}
                    </>
                )}
            </Popup>
        );
    };

    const onInputChange = (statename: string, event): void => {
        const { value } = event.target;
        setFormState({
            ...formState,
            [statename]: value,
        });
    };

    const renderFormDetails = ({
        label,
        name,
        required = false,
        disabled = false,
    }: FormFieldProps): React.ReactElement => {
        return (
            <TextField
                className={classes.formField}
                id="form_popup_textfield"
                label={label}
                name={name}
                size="small"
                variant="outlined"
                required={required}
                disabled={disabled}
                fullWidth
                value={formState[name]}
                onChange={(event): void => onInputChange(name, event)}
            />
        );
    };

    const renderFormModal = (): React.ReactElement => {
        return (
            <Popup
                title={isDeploy ? 'Deploy Form' : 'Save Form'}
                onShow={openFormModal}
                size="xs"
                onClose={() => setOpenFormModal(false)}>
                <form autoComplete="off" onSubmit={handleSubmit}>
                    {!isDeploy &&
                        renderFormDetails({
                            label: 'Name',
                            name: 'name',
                            required: true,
                        })}
                    {!isDeploy &&
                        tab.id &&
                        renderFormDetails({
                            label: 'Version',
                            name: 'version',
                            disabled: true,
                        })}
                    {isDeploy &&
                        renderFormDetails({
                            label: 'Deployment Name',
                            name: 'deploymentName',
                            required: true,
                        })}
                    <div className={classes.formActionButtonWrapper}>
                        <ActionButton
                            variant="secondary"
                            buttonProps={{ id: 'form_popup_cancel_button', className: classes.formButton }}
                            onClick={(): void => setOpenFormModal(false)}>
                            Cancel
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            buttonProps={{
                                id: `form_popup_${isDeploy ? 'deploy' : 'save'}_button`,
                                className: classes.formButton,
                                type: 'submit',
                            }}>
                            {isDeploy ? 'Deploy' : 'Save'}
                        </ActionButton>
                    </div>
                </form>
            </Popup>
        );
    };

    return (
        <div className={classes.root}>
            {renderFormModeler()}
            {renderPopup()}
            {renderFormModal()}
        </div>
    );
};

export default FormModeler;
