import { UPDATE_THEME } from '../../constants/actions';
import { ThemeProps } from '../../services/ThemeService';

const themeReducer = (state: ThemeProps, action) => {
    switch (action.type) {
        case UPDATE_THEME:
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export default themeReducer;
