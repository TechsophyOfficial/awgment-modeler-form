import React, { useReducer } from 'react';
import { HIDE_LAYOUT, MINIMIZE_LAYOUT, MAXIMIZE_LAYOUT, INITIAL_LAYOUT } from 'constants/actions';
import LayoutContext from './layout-context';
import layoutReducer from './layout-reducer';

const LayoutState = ({ children }) => {
    const [layoutState, dispatch] = useReducer(layoutReducer, INITIAL_LAYOUT);

    const hideLayout = () => {
        dispatch({ type: HIDE_LAYOUT });
    };

    const minimizeLayout = () => {
        dispatch({ type: MINIMIZE_LAYOUT });
    };

    const maximizeLayout = () => {
        dispatch({ type: MAXIMIZE_LAYOUT });
    };

    return (
        <LayoutContext.Provider
            value={{
                layout: layoutState,
                hideLayout: hideLayout,
                minimizeLayout: minimizeLayout,
                maximizeLayout: maximizeLayout,
            }}>
            {children}
        </LayoutContext.Provider>
    );
};

export default LayoutState;
