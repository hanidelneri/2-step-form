import React from 'react';
import axios from 'axios';

import { Autocomplete, Button, useForm } from '../../core';
import { useTranslation } from 'react-i18next';

const EmailForm = ({ back, next }) => {
    const { t } = useTranslation();

    const handleSubmit = async values => {
        try {
            console.log('country', values.country);
            return {};
        } catch (errors) {
            return {
                errors,
            };
        }
    };

    const validate = values => {
        const errors = {};
        if (!values.country) {
            errors.country = t('required');
        }
        return errors;
    };

    const form = useForm({
        submit: handleSubmit,
        initialValues: { country: '' },
        validate,
    });

    const getSuggestions = val => {
        return new Promise((resolve, reject) => {
            axios
                .get(`https://restcountries.eu/rest/v2/name/${encodeURIComponent(val)}`)
                .then(result => {
                    resolve(result.data);
                })
                .catch(err => reject(err));
        });
    };

    return (
        <div>
            <Autocomplete
                {...form.getFieldProps('country')}
                label={'country.title'}
                placeholder={'country.placeholder'}
                fullWidth
                getSuggestionValue={country => country.name}
                renderSuggestion={country => <div>{country.name}</div>}
                getSuggestions={getSuggestions}
            />
            <Button
                size="large"
                fullWidth
                variant="contained"
                text="country.submit"
                onClick={form.submitForm}
                disabled={form.isSubmitting()}
            />
            <Button text="country.back" onClick={back} />
        </div>
    );
};

export default EmailForm;
