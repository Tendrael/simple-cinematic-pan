import { CinematicPan } from './scripts/class/CinematicPan.js';
import { MODULE_ID } from './scripts/constants/module.js';
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

// Handle scene activation - check for cinematic mode on load
Hooks.on('updateScene', (scene) => {
    consoleLog('SimpleCinematicPan : Scene updated:');
    consoleLog(scene);
    if (SimpleCinematicPan) {
        const cinematicModeOnLoad = scene.getFlag(MODULE_ID, 'cinematicModeOnLoadScene');
        consoleLog('SimpleCinematicPan : Cinematic mode on load:', cinematicModeOnLoad);
        if (cinematicModeOnLoad && !SimpleCinematicPan.isLocked &&  scene.active) {
            consoleLog('SimpleCinematicPan : Cinematic mode on load detected for scene: ' + scene.name);
            SimpleCinematicPan.applyCanvasLock(true);
        }
    }
});

// Handle canvas ready
Hooks.on('canvasReady', (canvas) => {
    consoleLog('SimpleCinematicPan : Canvas ready:');
    consoleLog(canvas);
    if (SimpleCinematicPan && SimpleCinematicPan.isLocked && !game?.user?.isGM) {
        if (canvas.tokens && canvas.tokens.controlled.length > 0) {
            canvas.tokens.releaseAll();
        }
        const cinematicModeOnLoad = canvas.scene.getFlag(MODULE_ID, 'cinematicModeOnLoadScene');
        if (cinematicModeOnLoad) {
            SimpleCinematicPan.applyView(canvas.scene.initial);
        }
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

// Hide the simpleCinematicPan-hidden button
Hooks.on('renderSceneControls', (sceneControls) => {
    const hiddenBtn = document.querySelector('button[data-tool="simpleCinematicPan-hidden"]');
    if(hiddenBtn){
        hiddenBtn.parentElement.style.display = 'none';
    }

    const canvasLockBtn = document.querySelector('button[data-tool="simpleCinematicPan-canvas-lock"]');
    if(canvasLockBtn){
        sceneControls.controls.simpleCinematicPan.tools['simpleCinematicPan-canvas-lock'].active = SimpleCinematicPan?.isLocked || false;
    }
})

Hooks.on("renderSceneConfig", (app, html, data) => {
   const cinamaticModeOnLoadScene = app.document.getFlag(MODULE_ID, "cinematicModeOnLoadScene") ?? false;
   
   const formHtml = `
   <br/>
    <fieldset>
        <legend>Simple Cinematic Pan</legend>
        <div class="form-group">
            <label for="flags.${MODULE_ID}.cinematicModeOnLoadScene">${game.i18n.localize('simple-cinematic-pan.settings.cinematic-mode-on-load-scene.name')}</label>
            <input type="checkbox" id="flags.${MODULE_ID}.cinematicModeOnLoadScene" name="flags.${MODULE_ID}.cinematicModeOnLoadScene" ${cinamaticModeOnLoadScene ? 'checked' : ''}>
        </div>
    </fieldset>
    `;
    const tab = html.querySelector('.tab[data-tab="basics"]');
    if (tab) {
        tab.insertAdjacentHTML('beforeend', formHtml);
        tab.classList.add('scrollable');
    } else {
        console.log('SimpleCinematicPan: .tab[data-tab="basics"] not found');
    }
});

// Render settings config
Hooks.on('renderSettingsConfig', (app, html) => {
    const element = html.querySelector('[name="' + MODULE_ID + '.cinematic-bars-color"]');
    element.type = 'color';
});