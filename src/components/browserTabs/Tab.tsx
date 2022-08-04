import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TabContext from 'contexts/tabContext/tab-context';
import { RED, TAB_COLOR, TAB_HOVER_COLOR, TAB_LABEL_COLOR, WHITE } from 'theme/colors';

interface TabProps {
    index: number;
    name: string;
}

const Tab: React.FC<TabProps> = ({ index, name }) => {
    const {
        tabsList: { activeTabIndex },
        updateActiveTabIndex,
        closeTab,
    } = useContext(TabContext);

    const useStyles = makeStyles(() => ({
        tabBox: {
            flex: 1,
            display: 'flex',
            height: '50px',
            minWidth: '100px',
            paddingLeft: '10px',
            borderRadius: 5,
            backgroundColor: activeTabIndex === index ? WHITE : TAB_COLOR,
            '&:hover': {
                backgroundColor: activeTabIndex !== index && TAB_HOVER_COLOR,
            },
        },
        activeTabBox: {
            marginBottom: -4,
        },
        tab: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            paddingBottom: 12,
        },
        nameWrapper: {
            cursor: 'pointer',
            display: 'flex',
            flex: 1,
            height: '100%',
            alignItems: 'center',
        },
        name: {
            color: TAB_LABEL_COLOR,
            fontSize: 12,
            flex: 1,
            lineHeight: '15px',
            height: 19,
            overflow: 'hidden',
        },
        crossWrapper: {
            width: 10,
            display: 'flex',
            height: 10,
            marginRight: 10,
            alignSelf: 'center',
        },
        cross: {
            width: '100%',
            marginBottom: 2,
            cursor: 'pointer',
        },
        crossHover: {
            '&:hover': {
                fill: RED,
            },
        },
    }));

    const classes = useStyles();

    const Cross: React.FC = () => {
        return (
            <svg viewBox="0 0 47.971 47.971" className={classes.cross}>
                <g>
                    <path
                        className={classes.crossHover}
                        d="M28.228,23.986L47.092,5.122c1.172-1.171,1.172-3.071,0-4.242c-1.172-1.172-3.07-1.172-4.242,0L23.986,19.744L5.121,0.88
            c-1.172-1.172-3.07-1.172-4.242,0c-1.172,1.171-1.172,3.071,0,4.242l18.865,18.864L0.879,42.85c-1.172,1.171-1.172,3.071,0,4.242
            C1.465,47.677,2.233,47.97,3,47.97s1.535-0.293,2.121-0.879l18.865-18.864L42.85,47.091c0.586,0.586,1.354,0.879,2.121,0.879
            s1.535-0.293,2.121-0.879c1.172-1.171,1.172-3.071,0-4.242L28.228,23.986z"
                    />
                </g>
            </svg>
        );
    };

    return (
        <div className={`${classes.tabBox} ${activeTabIndex === index && classes.activeTabBox}`}>
            <div className={classes.tab}>
                {/* FIXME: NEED TO WORK */}
                <div onClick={() => updateActiveTabIndex(index)} className={classes.nameWrapper}>
                    <span className={classes.name}>{name.length > 9 ? `${name.substring(0, 9)}...` : name}</span>
                </div>
                {/* FIXME: NEED TO WORK */}
                <div className={classes.crossWrapper} onClick={() => closeTab(index)}>
                    <Cross />
                </div>
            </div>
        </div>
    );
};

export default Tab;
