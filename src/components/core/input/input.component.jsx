import React from 'react';
import TextField from '@material-ui/core/TextField';
import { useTranslation } from 'react-i18next';

const TextInput = ({ label, value, placeholder, ...props }) => {
    const { t } = useTranslation();
    return (
        <TextField
            value={value}
            margin="normal"
            variant="outlined"
            label={t(label)}
            placeholder={placeholder ? t(placeholder) : ''}
            InputLabelProps={{ shrink: true }}
            {...props}
        />
    );
};

export default TextInput;
