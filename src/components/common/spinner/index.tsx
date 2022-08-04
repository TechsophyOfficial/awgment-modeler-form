import React, { useContext } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import makeStyles from '@mui/styles/makeStyles';
import SpinnerContext from '../../../contexts/spinnerContext/spinner-context';

const useStyles = makeStyles(() => ({
    backdrop: {
        zIndex: 10000,
        color: '#fff',
    },
}));

const Spinner = () => {
    const classes = useStyles();
    const { spinner } = useContext(SpinnerContext);

    return (
        <Backdrop className={classes.backdrop} open={spinner}>
            <CircularProgress color="inherit" />
        </Backdrop>
    );
};

export default Spinner;
