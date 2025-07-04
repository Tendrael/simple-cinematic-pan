import { MODULE_ID } from './constants/module.js';
import { consoleLog } from './utils.js';

// Initialize settings when module is ready
export const registerSettings = async() => {
    
    // Setting for animation duration
    game.settings.register(MODULE_ID, 'animation-duration', {
        name: game.i18n.localize('simple-cinematic-pan.settings.animation-duration.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.animation-duration.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 3000,
        range: {
            min: 0,
            max: 10000,
            step: 100
        }
    });

    // Setting to enable/disable notifications
    game.settings.register(MODULE_ID, 'show-notifications', {
        name: game.i18n.localize('simple-cinematic-pan.settings.show-notifications.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.show-notifications.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });

    // Setting for cinematic bars height
    game.settings.register(MODULE_ID, 'cinematic-bars-height', {
        name: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-height.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-height.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 10,
        range: {
            min: 0,
            max: 50,
            step: 1
        }
    });

    // Setting for cinematic bars color
    game.settings.register(MODULE_ID, 'cinematic-bars-color', {
        name: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-color.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-color.hint'),
        scope: 'world',
        config: true,
        type: String,
        default: '#000000'
    });

    // Setting for cinematic bars opacity
    game.settings.register(MODULE_ID, 'cinematic-bars-opacity', {
        name: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-opacity.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.cinematic-bars-opacity.hint'),
        scope: 'world',
        config: true,
        type: Number,
        default: 1,
        range: {
            min: 0,
            max: 1.0,
            step: 0.1
        }
    });

    // Setting to hide UI for players during cinematic mode
    game.settings.register(MODULE_ID, 'hide-ui-for-players', {
        name: game.i18n.localize('simple-cinematic-pan.settings.hide-ui-for-players.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.hide-ui-for-players.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });
    
    // Setting to toggle debug mode
    game.settings.register(MODULE_ID, 'debug-mode', {
        name: game.i18n.localize('simple-cinematic-pan.settings.debug-mode.name'),
        hint: game.i18n.localize('simple-cinematic-pan.settings.debug-mode.hint'),
        scope: 'world',
        config: true,
        type: Boolean,
        default: false
    });

    consoleLog('SimpleCinematicPan Settings : All settings registered successfully');
};
