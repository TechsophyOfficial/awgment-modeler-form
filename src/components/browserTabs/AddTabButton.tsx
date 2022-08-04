import React, { useContext } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import TabContext from 'contexts/tabContext/tab-context';
import { BLACK, TAB_ADD_BUTTON_HOVER_COLOR } from 'theme/colors';
import getNewFormioForm from 'constants/newFoimioForm';

const AddTabButton: React.FC = () => {
    const { addTab } = useContext(TabContext);

    const useStyles = makeStyles(() => ({
        root: {
            width: 45,
            height: 'calc(100% - 8px)',
            '&:hover': {
                backgroundColor: TAB_ADD_BUTTON_HOVER_COLOR,
            },
        },
        plus: {
            width: '100%',
            height: '100%',
            transform: 'scale(0.35)',
            cursor: 'pointer',
        },
        plusHover: {
            '&:hover': {
                fill: BLACK,
            },
        },
    }));

    const classes = useStyles();

    const Plus: React.FC = () => (
        <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 409.6 409.6"
            xmlSpace="preserve"
            className={classes.plus}>
            <g>
                <g>
                    <path
                        className={classes.plusHover}
                        d="M392.533,187.733H221.867V17.067C221.867,7.641,214.226,0,204.8,0s-17.067,7.641-17.067,17.067v170.667H17.067
    C7.641,187.733,0,195.374,0,204.8s7.641,17.067,17.067,17.067h170.667v170.667c0,9.426,7.641,17.067,17.067,17.067
    s17.067-7.641,17.067-17.067V221.867h170.667c9.426,0,17.067-7.641,17.067-17.067S401.959,187.733,392.533,187.733z"
                    />
                </g>
            </g>
        </svg>
    );

    const { formName, newFormioForm } = getNewFormioForm();
    return (
        <div
            onClick={() =>
                addTab({
                    key: formName,
                    name: formName,
                    content: newFormioForm,
                })
            }
            className={classes.root}>
            <Plus />
        </div>
    );
};

export default AddTabButton;
