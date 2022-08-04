import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TabContext from 'contexts/tabContext/tab-context';
import { WHITE } from 'theme/colors';
import TabsLoop from './TabsLoop';
import FormModeler from 'components/formModeler';

interface BrowserTabsProps {
    loadRecords: () => void;
}

const BrowserTabs: React.FC<BrowserTabsProps> = ({ loadRecords }) => {
    const {
        tabsList: { tabs, activeTabIndex },
    } = useContext(TabContext);

    const useStyles = makeStyles(() => ({
        root: {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 7,
            overflow: 'hidden',
            height: '100%',
        },
        tabs: {
            height: 34,
            display: 'flex',
            padding: '0',
            overflow: 'hidden',
            overflowX: 'auto',
            paddingTop: 3,
            paddingLeft: 5,
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        content: {
            flex: 1,
            zIndex: 1,
            backgroundColor: WHITE,
            height: `calc(100% - 54px)`,
            margin: 10,
        },
    }));

    const classes = useStyles();
    return (
        <div className={classes.root}>
            <div className={classes.tabs}>{tabs && Array.isArray(tabs) ? <TabsLoop /> : null}</div>
            {tabs.map((tab, index) => (
                <div
                    key={tab.key}
                    className={classes.content}
                    style={{
                        display: activeTabIndex !== index ? 'none' : 'flex',
                    }}>
                    <FormModeler tab={tab} loadRecords={loadRecords} />
                </div>
            ))}
        </div>
    );
};

export default BrowserTabs;
