import { request, ResponseProps } from '../request';
import axios from 'axios';
import { FormProps, SaveFormResponse, FormDeployProps, DocType } from '../components/formModeler/FormTypes';
import {
    DMS_ENDPOINT,
    FORM_ENDPOINT,
    RUNTIME_FORM_ENDPOINT,
    DELETE_DOCUMENT,
    DOWNLOAD_DOCUMENT,
} from '../constants/endpoints';
import { ComponentFormResponse } from '../components/components';

export interface FormInstance {
    content: string;
    createdOn: Date;
    id: string;
    name: string;
    updatedById: string;
    updatedOn: Date;
    version: string;
}

interface FormTableProps {
    totalElements: number;
    page: number;
    size: number;
    content: FormInstance[] | [];
}
interface FormReqProps {
    type: 'form' | 'component';
    paginate: boolean;
    rowsPerPage?: number;
    page?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
    searchTerm?: string;
}

export const FORM_API_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${FORM_ENDPOINT}`;
export const RUNTIME_FORM_API_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${RUNTIME_FORM_ENDPOINT}`;
export const DMS_API_ENDPOINT = `${process.env.REACT_APP_API_GATEWAY_URL}${DMS_ENDPOINT}`;

export const getDocumentTypes = async (): Promise<{
    success: boolean;
    data?: DocType[];
}> => {
    const r: ResponseProps = (await request.get(DMS_API_ENDPOINT)) as ResponseProps;
    if (r.success) {
        return { success: r.success, data: r.data as DocType[] };
    }
    return { success: false };
};

export const getAllFormsOrComponents = async ({
    type,
    paginate = true,
    rowsPerPage = 10,
    page = 1,
    sortBy = '',
    sortDirection = 'desc',
    searchTerm = '',
}: FormReqProps): Promise<{ success: boolean; message?: string; data?: FormTableProps | any }> => {
    const sort = sortBy && sortDirection ? `&sort-by=${sortBy}:${sortDirection}` : '';
    const search = searchTerm ? `&q=${searchTerm}` : '';
    let URL = `${FORM_API_ENDPOINT}?include-content=true&type=${type}`;

    if (!paginate) {
        URL += `${sort}${search}`;
        const r: ResponseProps = (await request.get(URL)) as ResponseProps;
        if (r.success) {
            return { success: true, message: r.message, data: r.data as any };
        }
    } else {
        URL += `&size=${rowsPerPage}&page=${page}${sort}${search}`;
        const r: ResponseProps = (await request.get(URL)) as ResponseProps;
        if (r.success) {
            const data: FormTableProps = r.data as FormTableProps;
            return { success: true, message: r.message, data: data };
        }
    }

    return { success: false, message: 'Unable to fetch forms' };
};

//API call to get forms and components

export const getFormOrComponentDetails = async (
    id: string,
): Promise<{ success: boolean; data?: FormProps | ComponentFormResponse; message?: string }> => {
    const r: ResponseProps = (await request.get(`${FORM_API_ENDPOINT}/${id}`)) as ResponseProps;

    if (r && r.success) {
        const form = r.data as FormProps;
        return { success: r.success, data: form, message: r.message };
    }

    return { success: false };
};

export const fetchRuntimeFormDetails = async (
    id: string,
): Promise<{ success: boolean; data?: FormProps | ComponentFormResponse; message?: string }> => {
    const r: ResponseProps = (await request.get(`${RUNTIME_FORM_API_ENDPOINT}/${id}`)) as ResponseProps;

    if (r.success) {
        const form = r.data as FormProps;
        return { success: r.success, data: form, message: r.message };
    }

    return { success: false };
};

export const saveFormOrComponent = async (
    type: 'form' | 'component',
    formDetails,
): Promise<{ success: boolean; data?: SaveFormResponse; message?: string }> => {
    const r: ResponseProps = (await request.post(FORM_API_ENDPOINT, { ...formDetails, type: type })) as ResponseProps;

    if (r.success) {
        const form = r.data as SaveFormResponse;
        return { success: r.success, data: form, message: r.message };
    }

    return { success: false };
};

export const deployFormOrComponent = async (
    type: 'form' | 'component',
    formDetails: FormDeployProps | ComponentFormResponse,
): Promise<{ success: boolean; message?: string }> => {
    const { name, id, components, version, properties } = formDetails;

    const apiData = {
        name: name,
        id: id,
        components: components,
        version: version,
        type: type,
        properties: properties,
    };
    const r: ResponseProps = (await request.post(RUNTIME_FORM_API_ENDPOINT, apiData)) as ResponseProps;

    if (r.success) {
        return { success: r.success, message: r.message };
    }

    return { success: false };
};

export const deleteFormOrComponent = async (id: string): Promise<{ success: boolean; message?: string }> => {
    const r: ResponseProps = (await request.delete(`${FORM_API_ENDPOINT}/${id}`)) as ResponseProps;

    if (r.success) {
        return { success: r.success, message: r.message };
    }

    return { success: false };
};

export const uploadDocument = async (url, data) => {
    const apiEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}${url}`;
    const r: ResponseProps = (await request.postForm(apiEndpoint, data)) as ResponseProps;

    if (r.success) {
        return { success: r.success, message: r.message, data: r.data };
    }

    return { success: false };
};

export const deleteDocument = async (id) => {
    const apiEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}${DELETE_DOCUMENT}${id}`;
    const r: ResponseProps = (await request.delete(apiEndpoint)) as ResponseProps;

    if (r.success) {
        return { success: r.success, message: r.message, data: r.data };
    }

    return { success: false };
};

// export const downloadDocument = async (id) => {
//     const apiEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}${DOWNLOAD_DOCUMENT}${id}`;
//     const r: ResponseProps = (await request.get(apiEndpoint)) as ResponseProps;

//     if (r.success) {
//         return { success: r.success, message: r.message, data: r };
//     }

//     return { success: false };
// };

export const downloadDocument = async (id: string) => {
    const token = sessionStorage.getItem('react-token');
    const apiEndpoint = `${process.env.REACT_APP_API_GATEWAY_URL}${DOWNLOAD_DOCUMENT}${id}`;

    const response = await axios.get(apiEndpoint, {
        headers: {
            Authorization: `Bearer ${token}`,

            responseType: 'blob', // VERY IMPORTANT 'arrayBuffer'
        },
    });
    console.log(response);
    return response;
};
