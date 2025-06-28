import { CinematicPan } from './scripts/class/CinematicPan.js';
import { registerSettings } from './scripts/settings.js';
import { consoleLog } from './scripts/utils.js';

// Global module instance
let SimpleCinematicPan;

// Initialize module
Hooks.once('ready', async () => {
    consoleLog('SimpleCinematicPan : Module ready, initializing...');
    try {
        await registerSettings();
        SimpleCinematicPan = new CinematicPan();
        window.SimpleCinematicPan = SimpleCinematicPan;
        consoleLog('SimpleCinematicPan : Module initialized successfully');
        if(game.user.isGM){
            SimpleCinematicPan.resetAndResyncAllUsers();
        }else {
            SimpleCinematicPan.handlePlayerConnected();
        }
    } catch (error) {
        consoleLog('SimpleCinematicPan : Error creating CinematicPan instance: ', 'error');
        consoleLog(error, 'error');
    }
});

// Handle scene change
Hooks.on('preUpdateScene', (scene, options) => {
    if(game.user.isGM && SimpleCinematicPan && SimpleCinematicPan.isLocked){
        SimpleCinematicPan.toggleCanvasLock();
    }
});

// Register scene control buttons
Hooks.on('getSceneControlButtons', controls => {
    consoleLog('SimpleCinematicPan : Registering scene control buttons');
    if(game.user.isGM){
        controls.simpleCinematicPan = {
            name: "simpleCinematicPan",
            title: game.i18n.localize('simple-cinematic-pan.controls.title'),
            icon: "fas fa-video",
            activeTool: "simpleCinematicPan-hidden",
            tools: {
                "simpleCinematicPan-hidden": {
                    name: "simpleCinematicPan-hidden",
                    visible: true,
                    order: 0,
                },
                "simpleCinematicPan-canvas-lock": {
                    name: "simpleCinematicPan-canvas-lock",                    
                    title: game.i18n.localize('simple-cinematic-pan.controls.canvas-lock.title'),
                    icon: "fas fa-lock",    
                    visible: true,
                    order: 1,
                    onChange: (event, active) => {
                        consoleLog('SimpleCinematicPan : Canvas lock tool clicked, active:'+ active);
                        if (SimpleCinematicPan && game.user.isGM) {
                            SimpleCinematicPan.setCanvasLock(active);
                        }
                    },
                    toggle: true,
                    active: SimpleCinematicPan?.isLocked || false
                },
                "simpleCinematicPan-sync-view": {
                    name: "simpleCinematicPan-sync-view",
                    title: game.i18n.localize('simple-cinematic-pan.controls.sync-view.title'),
                    icon: "fas fa-sync-alt",
                    visible: true,
                    button: true,
                    order: 2,
                    onChange: (event) => {
                        consoleLog('SimpleCinematicPan : Sync view tool clicked');
                        if (SimpleCinematicPan && game.user.isGM) {
                            SimpleCinematicPan.syncView();
                        }
                    }
                },
                "simpleCinematicPan-reset": {
                    name: "simpleCinematicPan-reset",
                    title: game.i18n.localize('simple-cinematic-pan.controls.reset.title'),
                    icon: "fas fa-undo",
                    visible: true,
                    button: true,
                    order: 3,
                    onChange: (event) => {
                        consoleLog('SimpleCinematicPan : Reset view tool clicked');
                        if (SimpleCinematicPan && game.user.isGM) {
                            SimpleCinematicPan.resetAndResyncAllUsers();
                        }
                    }
                }
            }
        };
    }
});

Hooks.on('renderSceneControls', () => {
    const hiddenBtn = document.querySelector('button[data-tool="simpleCinematicPan-hidden"]');
    if(hiddenBtn){
        hiddenBtn.parentElement.style.display = 'none';
    }
})
