import React from 'react';
import { Stepper } from '../core';
import CountryForm from './steps/country-form.component';
import EmailForm from './steps/email-form.component';

const Form = () => (
    <Stepper stepLabels={['email.step', 'country.step']}>
        <EmailForm />
        <CountryForm />
    </Stepper>
);

export default Form;
