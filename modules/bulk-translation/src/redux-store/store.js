import { configureStore } from '@reduxjs/toolkit';
import bulkTranslateStore from './features/actions.js';

const store = configureStore({
    reducer: bulkTranslateStore,
});

export { store };
