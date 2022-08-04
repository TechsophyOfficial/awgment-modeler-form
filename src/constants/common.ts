// Height and Width
export const HEADER_HEIGHT = 60;
export const FOOTER_HEIGHT = 0;
export const TOPBAR_HEIGHT = 37;
export const DRAWER_WIDTH = 275;
export const ACTION_EDIT = 'edit';
export const ACTION_DELETE = 'delete';
export const ACTION_PUBLISH = 'publish';

// Component Forms
export const ADD_COMPONENT_FORM_ID = '870183028850884608';
export const EDIT_COMPONENT_FORM_ID = '870188635431567360';
export const DEPLOY_COMPONENT_FORM_ID = '874618068361134080';

// table headers
export const COMPONENT_TABLE_HEADERS = [
    // { id: 'id', label: 'Id' },
    { id: 'name', label: 'Name' },
    { id: 'version', label: 'Version' },
    { id: 'actions', label: 'Actions', cellWidth: '30%' },
];

export const FORM_TABLE_HEADERS = [
    { id: 'id', label: '', disableSorting: true },
    { id: 'name', label: 'Name', disableSorting: true },
    { id: 'version', label: 'Version', disableSorting: true },
    { id: 'createdByName', label: 'Created By', disableSorting: true },
    { id: 'createdOn', label: 'Created On', disableSorting: false },
    { id: 'updatedByName', label: 'Modified By', disableSorting: true },
    { id: 'updatedOn', label: 'Modified On', disableSorting: false },
    { id: 'actions', label: 'Actions', disableSorting: true },
];
