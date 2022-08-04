import React, { useReducer } from 'react';
import { ADD_TAB, UPDATE_TAB, CLOSE_TAB, UPDATE_ACTIVE_TAB_INDEX, INITIAL_TAB } from 'constants/actions';
import TabContext, { Index, Tab } from './tab-context';
import tabReducer from './tab-reducer';

const TabState = ({ children }) => {
    const [tabState, dispatch] = useReducer(tabReducer, INITIAL_TAB);

    const addTab = (tab: Tab) => {
        dispatch({ type: ADD_TAB, payload: tab });
    };

    const updateTab = (tab: Tab) => {
        dispatch({ type: UPDATE_TAB, payload: tab });
    };

    const closeTab = (index: Index) => {
        dispatch({ type: CLOSE_TAB, payload: index });
    };

    const updateActiveTabIndex = (index: Index) => {
        dispatch({ type: UPDATE_ACTIVE_TAB_INDEX, payload: index });
    };

    return (
        <TabContext.Provider
            value={{
                tabsList: tabState,
                updateActiveTabIndex: updateActiveTabIndex,
                addTab: addTab,
                updateTab: updateTab,
                closeTab: closeTab,
            }}>
            {children}
        </TabContext.Provider>
    );
};

export default TabState;
