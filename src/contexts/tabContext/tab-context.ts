import { createContext } from 'react';
import { FormioSchema } from 'components/formModeler/FormTypes';

export type Index = number;
export interface Tab {
    prototype?: any;
    key: string;
    id?: string;
    version?: string;
    name: string;
    content: FormioSchema;
    properties?: any;
}

export interface TabsList {
    tabs: Tab[];
    activeTabIndex: number;
}

interface TabContextProps {
    tabsList: TabsList;
    updateActiveTabIndex: (index: Index) => void;
    addTab: (tab: Tab) => void;
    updateTab: (tab: Tab) => void;
    closeTab: (index: Index) => void;
}

const TabContext = createContext({} as TabContextProps);

export default TabContext;
