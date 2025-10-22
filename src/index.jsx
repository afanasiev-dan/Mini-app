import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

import { Root } from '@/components/Root';
import { init } from '@/init.js';

import '@telegram-apps/telegram-ui/dist/styles.css';
import './index.css';

// Mock the environment in case, we are outside Telegram.
import './mockEnv.js';

// Configure all application dependencies.
init(retrieveLaunchParams().startParam === 'debug' || import.meta.env.DEV);

if (import.meta.env.DEV) {
  import('./mockEnv.js');
}

ReactDOM.createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Root/>
    </StrictMode>,
);
