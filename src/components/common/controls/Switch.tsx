import React from 'react';
import { Theme } from '@mui/material/styles';
import withStyles from '@mui/styles/withStyles';
import createStyles from '@mui/styles/createStyles';
import Switch, { SwitchClassKey, SwitchProps } from '@mui/material/Switch';

interface Styles extends Partial<Record<SwitchClassKey, string>> {
    focusVisible?: string;
}

interface Props extends SwitchProps {
    classes: Styles;
}

interface TS_SwitchProps {
    isActive: boolean;
    color?: string;
    onToggleSwitch: () => void;
}

const TS_Switch: React.FC<TS_SwitchProps> = ({ isActive, onToggleSwitch, color = '#007bff' }) => {
    const IOSSwitch = withStyles((theme: Theme) =>
        createStyles({
            root: {
                width: 42,
                height: 26,
                padding: 0,
                margin: theme.spacing(1),
            },
            switchBase: {
                padding: 1,
                '&$checked': {
                    transform: 'translateX(16px)',
                    color: theme.palette.common.white,
                    '& + $track': {
                        backgroundColor: `${color}`,
                        opacity: 1,
                        border: 'none',
                    },
                },
                '&$focusVisible $thumb': {
                    color: `${color}`,
                    border: '16px solid #fff',
                },
            },
            thumb: {
                width: 24,
                height: 24,
                // backgroundColor: `${color}`,
            },
            track: {
                borderRadius: 26 / 2,
                border: `1px solid ${theme.palette.grey[400]}`,
                backgroundColor: theme.palette.grey[50],
                opacity: 1,
                transition: theme.transitions.create(['background-color', 'border']),
            },
            checked: {},
            focusVisible: {},
        }),
    )(({ classes, ...props }: Props) => {
        return (
            <Switch
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                }}
                {...props}
            />
        );
    });

    return <IOSSwitch checked={isActive} onChange={onToggleSwitch} name="checkedB" />;
};

export default TS_Switch;
