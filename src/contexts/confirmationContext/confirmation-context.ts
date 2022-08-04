import { createContext } from 'react';
import { ConfirmDialogProps } from 'tsf_confirm_dialog/dist/components/confirmDialog';

export interface ConfirmationContextProps {
    confirmation: ConfirmDialogProps;
    showConfirmation: (data: ConfirmDialogProps) => void;
}

const ConfirmationContext = createContext({} as ConfirmationContextProps);

export default ConfirmationContext;
