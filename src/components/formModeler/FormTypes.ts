export interface DataValue {
    label: string;
    value: string;
}

interface DataWithShortcut extends DataValue {
    label: string;
    value: string;
    shortcut?: string;
}

export interface ValidationProps {
    customMessage?: string;
    pattern?: RegExp;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
}

export interface FormioComponent {
    defaultValue?: string | boolean | unknown[];
    description?: string;
    disableOnInvalid?: boolean;
    disabled?: boolean;
    input?: boolean;
    key?: string;
    label?: string;
    multiple?: boolean;
    placeholder?: string;
    type?:
        | 'textfield'
        | 'checkbox'
        | 'selectboxes'
        | 'number'
        | 'email'
        | 'phoneNumber'
        | 'datetime'
        | 'textarea'
        | 'button'
        | 'select'
        | 'radio'
        | 'panel'
        | 'url'
        | 'currency'
        | 'password'
        | 'file';
    validate?: ValidationProps;
    validateOn?: 'change' | 'blur';

    data?: {
        values: DataValue[];
    };
    widget?: unknown;
    inputMask?: string;
    action?: 'next' | 'save' | 'callback' | 'triggerProcess';
    enableTime?: boolean;
    variableValue?: unknown;
    values?: DataWithShortcut[];
    components?: FormioComponent[];
    mask?: boolean;
    currency?: string;
    spellcheck?: boolean;
    storage?: string;
    webcam?: boolean;
    fileTypes?: DataValue[];
}

export interface FormioSchema {
    display?: string;
    components?: FormioComponent | [];
}

export interface FormFieldProps {
    label: string;
    name: string;
    inputType?: string;
    required?: boolean;
    disabled?: boolean;
}

export interface ButtonAction {
    label: string;
    value: string;
}

export interface Id {
    id: string;
}
export interface InitialForm {
    name: string;
}
export interface SaveFormProps extends InitialForm {
    components: FormioSchema;
    properties?: PropertiesSchema;
}
export interface SaveFormResponse extends Id {
    version: string;
    elasticPush?: string;
}

export interface ActiveForm extends InitialForm, SaveFormResponse {
    deploymentName: string;
}

export interface FormProps extends SaveFormProps, SaveFormResponse {}

export interface FormDeployProps extends ActiveForm {
    components: FormioSchema;
    properties: PropertiesSchema;
}

export interface ExportForm {
    id?: string;
    name?: string;
    version?: string;
    elasticPush?: string;
    components: FormioSchema;
    properties: PropertiesSchema | null;
}

export interface ImportForm {
    id: string;
    name: string;
    version: string;
    elasticPush?: string;
}

export interface FileEditItems {
    input?: boolean;
    key?: string;
    label?: string;
    placeholder?: string;
    tooltip?: string;
    type?: string;
    weight: number;
    conditional?: unknown;
    components?: unknown;
}

export interface DocType {
    id: string;
    name: string;
}

export interface FormState {
    name: string;
    version: string;
    deploymentName: string;
    elasticPush?: string;
}

export interface PropertiesSchema {
    elasticPush?: string;
    isInit: boolean;
    requestType: string;
    endpoint: string;
    requestBody: object;
    submit?: boolean;
}
