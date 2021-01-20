import React, { useEffect, useState } from 'react';
import { TextInput, Button, useForm } from '../../core';
import { useTranslation } from 'react-i18next';

const validateEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const EmailForm = ({ next }) => {
    const { t } = useTranslation();
    const [isSubmited, setIsSubmited] = useState(false);

    useEffect(() => {
        if (isSubmited) next();
    }, [isSubmited]);

    const handleSubmit = values => {
        try {
            console.log('email', values.email);
            setIsSubmited(true);
            return {};
        } catch (errors) {
            return {
                errors,
            };
        }
    };

    const validate = values => {
        const errors = {};
        if (!values.email) {
            errors.email = t('required');
        } else if (!validateEmail(values.email)) {
            errors.email = t('email.invalid');
        }
        return errors;
    };

    const form = useForm({
        submit: handleSubmit,
        initialValues: { email: '' },
        validate,
    });

    return (
        <div>
            <TextInput
                {...form.getFieldProps('email')}
                label={'email.title'}
                fullWidth
                placeholder={'email.placeholder'}
                type="email"
            />
            <Button
                size="large"
                fullWidth
                variant="contained"
                color="primary"
                text="email.submit"
                onClick={form.submitForm}
                disabled={form.isSubmitting()}
            />
        </div>
    );
};

export default EmailForm;
