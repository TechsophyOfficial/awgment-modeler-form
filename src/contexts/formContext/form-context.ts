import { createContext } from 'react';
import { FormInstance } from 'services/FormService';

export interface FormTable {
    rowsPerPageOptions: number[];
    recordsCount: number;
    page: number;
    rowsPerPage: number;
    sortBy: string;
    sortDirection: 'asc' | 'desc';
    records: FormInstance[] | [];
}

export interface FormContextProps {
    formTableData: FormTable;
    updateFormTableData: (data: FormTable) => void;
}

const FormContext = createContext({} as FormContextProps);

export default FormContext;
