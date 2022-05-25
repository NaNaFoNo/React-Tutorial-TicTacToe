import React from 'react';
import { createRoot } from 'react-dom/client';
import { Game } from './js/App';
import './styles/App.scss'
import './js/script'


const container = document.getElementById('app');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Game />);