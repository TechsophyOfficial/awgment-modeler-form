import { createContext } from 'react';

export interface LayoutProps {
    isHidden: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
}

export interface LayoutContextProps {
    layout: LayoutProps;
    hideLayout: () => void;
    minimizeLayout: () => void;
    maximizeLayout: () => void;
}

const LayoutContext = createContext({} as LayoutContextProps);

export default LayoutContext;
