import React from 'react';
import { TextField } from '@mui/material';

const Input = (props) => {
    const { name, label, size = 'medium', value, error = null, onChange, ...other } = props;
    return (
        <TextField
            variant="outlined"
            size={size}
            label={label}
            name={name}
            value={value}
            onChange={onChange}
            {...other}
            {...(error && { error: true, helperText: error })}
        />
    );
};

export default Input;
