import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TabContext from 'contexts/tabContext/tab-context';
import Tab from './Tab';
import AddTabButton from './AddTabButton';

const TabsLoop: React.FC = () => {
    const {
        tabsList: { tabs, activeTabIndex },
    } = useContext(TabContext);

    const useStyles = makeStyles(() => ({
        tab: {
            display: 'flex',
            flex: '1',
            minWidth: '110px',
            maxWidth: '200px',
            height: '45px',
            overflow: 'hidden',
        },
        activeTab: {
            zIndex: 40,
            position: 'relative',
            paddingBottom: '1px',
        },
        border: {
            margin: '8px 0',
            height: 19,
            borderRight: '2px solid rgb(0 0 0 / 6%)',
        },
    }));

    const classes = useStyles();
    return (
        <>
            {tabs.map((tab, index) => {
                const isLast = index === tabs.length - 1;
                const lastStyle = isLast ? { maxWidth: 245 } : {};

                return (
                    <div
                        key={'tab' + tab.key}
                        className={`${classes.tab} ${activeTabIndex === index && classes.activeTab}`}
                        style={lastStyle}>
                        <Tab index={index} name={tab.name} />
                        {activeTabIndex - 1 !== index && activeTabIndex !== index && !isLast && (
                            <div className={classes.border}></div>
                        )}
                        {isLast && <AddTabButton />}
                    </div>
                );
            })}
        </>
    );
};

export default TabsLoop;
