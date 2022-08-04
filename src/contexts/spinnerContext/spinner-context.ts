import { createContext } from 'react';

export interface SpinnerContextProps {
    spinner: boolean;
    openSpinner: () => void;
    closeSpinner: () => void;
}

const SpinnerContext = createContext({} as SpinnerContextProps);

export default SpinnerContext;
