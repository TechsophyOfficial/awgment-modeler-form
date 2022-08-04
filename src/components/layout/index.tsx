import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Topbar from 'tsf_drawer/dist/components/topbar';
import LayoutContext from 'contexts/layoutContext/layout-context';
import { BACKGROUND_COLOR } from 'theme/colors';
import MaximizeView from 'components/layout/views/maximize';
import MinimizeView from 'components/layout/views/minimize';

const Layout = () => {
    const { layout, hideLayout, minimizeLayout, maximizeLayout } = useContext(LayoutContext);
    const useStyles = makeStyles(() => ({
        root: {
            backgroundColor: BACKGROUND_COLOR,
            height: '100%',
        },
    }));

    const classes = useStyles();

    return (
        <div className={classes.root}>
            <Topbar
                layout={layout}
                hideLayout={hideLayout}
                minimizeLayout={minimizeLayout}
                maximizeLayout={maximizeLayout}
            />
            {layout.isMaximized ? <MaximizeView /> : <MinimizeView />}
        </div>
    );
};

export default Layout;
