import { MODULE_ID } from './constants/module.js';

export const consoleLog = (message, type = 'info') => {
    let debugMode = true
    try {
        debugMode = game?.settings?.get(MODULE_ID, 'debug-mode');
    } catch (error) {
        console.log(message)
        return;
    }

    if (debugMode) {
        switch (type) {
            case 'info':
                console.log(message);
                break;
            case 'error':
                console.error(message);
                break;
            case 'warn':
                console.warn(message);
                break;
            case 'debug':
                console.debug(message);
                break;
        }
    }
}