import { ADD_TAB, UPDATE_TAB, CLOSE_TAB, UPDATE_ACTIVE_TAB_INDEX } from 'constants/actions';
import { Index, Tab, TabsList } from './tab-context';

interface ActionProps {
    type: 'ADD_TAB' | 'UPDATE_TAB' | 'CLOSE_TAB' | 'UPDATE_ACTIVE_TAB_INDEX';
    payload: Index | Tab;
}

const tabReducer = (state: TabsList, action: ActionProps) => {
    switch (action.type) {
        case ADD_TAB: {
            const tabData = action.payload as Tab;
            const { id, version } = tabData;
            if (id && version) {
                const foundIndex = state.tabs.findIndex((x) => x.id === id && x.version === version);
                if (foundIndex >= 0) {
                    return { ...state, activeTabIndex: foundIndex };
                }
                return { activeTabIndex: state.tabs.length, tabs: [...state.tabs, tabData] };
            }
            return { activeTabIndex: state.tabs.length, tabs: [...state.tabs, tabData] };
        }
        case UPDATE_TAB: {
            const tabData = action.payload as Tab;
            const foundIndex = state.tabs.findIndex((x) => x.key === tabData.key);
            state.tabs[foundIndex] = tabData;
            return state;
        }
        case CLOSE_TAB: {
            const index = action.payload as Index;
            const activeTabIndex =
                state.activeTabIndex === 0
                    ? 0
                    : state.activeTabIndex < index
                    ? state.activeTabIndex
                    : state.activeTabIndex - 1;
            const tabs = state.tabs.filter((e, i) => i !== index);
            return { activeTabIndex: activeTabIndex, tabs: tabs };
        }
        case UPDATE_ACTIVE_TAB_INDEX: {
            const index = action.payload as Index;
            return { ...state, activeTabIndex: index };
        }
        default:
            return state;
    }
};

export default tabReducer;
