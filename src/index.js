import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import App from './App';
import EnglishTranslations from './i18n/en-US.json';
import GermanTranslations from './i18n/de-DE.json';

i18n.use(initReactI18next).init({
    resources: {
        'en-US': {
            translation: EnglishTranslations,
        },
        'de-DE': {
            translation: GermanTranslations,
        },
    },
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
        escapeValue: false,
    },
});

ReactDOM.render(<App />, document.getElementById('root'));
