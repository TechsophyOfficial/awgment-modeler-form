import { HIDE_LAYOUT, MINIMIZE_LAYOUT, MAXIMIZE_LAYOUT } from 'constants/actions';
import { LayoutProps } from './layout-context';

const layoutReducer = (state: LayoutProps, action) => {
    switch (action.type) {
        case HIDE_LAYOUT:
            return { isHidden: true, isMinimized: false, isMaximized: false };
        case MINIMIZE_LAYOUT:
            return { isHidden: false, isMinimized: true, isMaximized: false };
        case MAXIMIZE_LAYOUT:
            return { isHidden: false, isMinimized: false, isMaximized: true };
        default:
            return state;
    }
};

export default layoutReducer;
