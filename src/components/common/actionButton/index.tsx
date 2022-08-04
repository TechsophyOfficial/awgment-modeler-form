import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { WHITE } from 'theme/colors';

interface ActionButtonProps {
    variant: 'primary' | 'secondary';
    height?: number;
    width?: number;
    fontSize?: number;
    buttonProps?: ButtonProps;
    onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
    variant,
    height,
    width,
    fontSize,
    children,
    buttonProps,
    onClick,
}) => {
    const useStyles = makeStyles((theme) => ({
        root: {
            height: height || 36,
            width: width || 96,
            fontSize: fontSize || 15,
            borderRadius: 9,
            fontWeight: 500,
            textTransform: 'none',
        },
        primary: {
            backgroundColor: theme.palette.primary.main,
            '& .MuiButton-label': {
                color: WHITE,
            },
            '&:hover': {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.8,
            },
        },
        secondary: {
            border: `2px solid ${theme.palette.primary.main}`,
            '& .MuiButton-label': {
                color: theme.palette.primary.main,
            },
            '&:hover': {
                backgroundColor: 'transparent',
                opacity: 0.8,
            },
        },
    }));

    const classes = useStyles();

    return (
        <Button
            variant={variant === 'primary' ? 'contained' : 'outlined'}
            disableElevation
            {...buttonProps}
            className={`${classes.root} ${classes[variant]} ${buttonProps?.className}`}
            onClick={onClick}>
            {children}
        </Button>
    );
};

export default ActionButton;
