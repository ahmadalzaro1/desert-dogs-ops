import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { I18nProvider } from './i18n/I18nProvider';
import RenderBoundary from './components/RenderBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <I18nProvider>
            <RenderBoundary name="app-root">
                <App />
            </RenderBoundary>
        </I18nProvider>
    </React.StrictMode>,
);
