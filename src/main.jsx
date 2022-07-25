import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import App from './App';
import './styles/index.scss';

/**
 * To use tailwindcss with Mantine, we need to set the emotionOptions as given below
 * https://github.com/mantinedev/mantine/issues/823#issuecomment-1033762396
 * https://mantine.dev/theming/mantine-provider/#configure-emotion
 */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider
      emotionOptions={{ key: 'mantine', prepend: false }}
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colors: {
          brand: ['#DAC4FF', '#C7A5FF', '#B387FA', '#9A69EA', '#824DD8', '#692FC7', '#4B0DAF'],
        },
        primaryColor: 'brand',
      }}
    >
      <App />
    </MantineProvider>
  </React.StrictMode>,
);
