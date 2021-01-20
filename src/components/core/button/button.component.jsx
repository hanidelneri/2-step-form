import React from 'react';
import BaseButton from '@material-ui/core/Button';
import { useTranslation } from 'react-i18next';

const Button = ({ text, ...props }) => {
    const { t } = useTranslation();

    return <BaseButton {...props}>{t(text)}</BaseButton>;
};

export default Button;
