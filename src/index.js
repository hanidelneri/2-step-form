import React from 'react';
import ReactDOM from 'react-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
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

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
