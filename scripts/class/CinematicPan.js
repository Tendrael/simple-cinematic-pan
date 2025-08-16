import { MODULE_ID } from "../constants/module.js";
import { consoleLog } from "../utils.js";

/**
 * Simple Cinematic Pan module for Foundry VTT v13
 * Allows the GM to synchronize all players' view with their own view
 */
export class CinematicPan {
    constructor() {
        consoleLog('SimpleCinematicPan : Module initialized');
        this.isLocked = false;
        this.initializeSocket();
    }

    /**
     * Initialize the socket system for communication
     */
    initializeSocket() {
        consoleLog('SimpleCinematicPan : Initializing socket system');
        if (game.socket) {
            game.socket.on('module.'+MODULE_ID, (data) => {
                consoleLog('SimpleCinematicPan : Socket message received:'+ data);
                this.handleSocketMessage(data);
            });
            consoleLog('SimpleCinematicPan : Socket listener configured');
        } else {
            consoleLog('SimpleCinematicPan : Socket not available', 'warn');
        }
    }

    /**
     * Set canvas lock state (called by toggle button)
     */
    setCanvasLock(locked) {
        consoleLog('SimpleCinematicPan : setCanvasLock() called by '+ game.user.name + ' with locked:'+ locked);
        
        if (!game.user.isGM) {
            consoleLog('SimpleCinematicPan : Non-GM user attempted to set canvas lock', 'warn');
            this.showNotification(game.i18n.localize('simple-cinematic-pan.notifications.gm-only-canvas-lock'), "warn");
            return;
        }

        this.isLocked = locked;
        consoleLog('SimpleCinematicPan : Canvas lock state set to:'+ this.isLocked);
        
        // Re-render the scene controls to update button state
        this.refreshSceneControls();
        
        // Send lock state to all players
        this.sendLockState();
        this.toggleCinematicBars(locked);
        this.togglePlayerUI(locked);
        
        const status = this.isLocked ? 'locked' : 'unlocked';
        this.showNotification(game.i18n.localize(`simple-cinematic-pan.notifications.canvas-${status}`), "info");
    }

    /**
     * Refresh scene controls to update button states
     */
    refreshSceneControls() {
        consoleLog('SimpleCinematicPan : Refreshing scene controls');
        
        // Trigger a re-render of the scene controls using Foundry's API
        if (ui.controls.tools['simpleCinematicPan-canvas-lock']) {
            ui.controls.tools['simpleCinematicPan-canvas-lock'].active = this.isLocked;
            ui.controls.render()
            consoleLog('SimpleCinematicPan : Scene controls refreshed');
        }
    }

    /**
     * Toggle canvas lock for players (legacy method, kept for compatibility)
     */
    toggleCanvasLock() {
        consoleLog('SimpleCinematicPan : toggleCanvasLock() called by '+ game.user.name);
        this.setCanvasLock(!this.isLocked);
    }

    /**
     * Send lock state to players
     */
    sendLockState() {
        consoleLog('SimpleCinematicPan : Sending lock state to players:'+ this.isLocked);
        
        const message = {
            type: 'canvas-lock',
            data: { locked: this.isLocked },
            timestamp: Date.now(),
            sender: game.user.id
        };

        if (game.socket) {
            consoleLog('SimpleCinematicPan : Emitting lock state message');
            game.socket.emit('module.'+MODULE_ID, message);
        } else {
            consoleLog('SimpleCinematicPan : Socket not available for sending lock state', 'error');
        }
    }

    /**
     * Apply canvas lock locally
     */
    applyCanvasLock(locked) {
        consoleLog('SimpleCinematicPan : Applying canvas lock locally:'+ locked);
        
        if (!canvas.ready) {
            consoleLog('SimpleCinematicPan : Canvas not ready, cannot apply lock', 'warn');
            return;
        }

        this.isLocked = locked;

        
        try {
            if(!game?.user?.isGM) {
                if (locked) {
                    // Disable canvas interactions
                    canvas.stage.interactive = false;
                    canvas.stage.buttonMode = false;
                    
                    // Disable mouse events by preventing interaction
                    if (canvas.mouseInteractionManager) {
                        canvas.mouseInteractionManager.enabled = false;
                    }
                    
                    // Deselect currently selected tokens
                    if (canvas.tokens && canvas.tokens.controlled.length > 0) {
                        canvas.tokens.releaseAll();
                    }
                    
                    // Disable drag and pan
                    if (canvas.dragDrop) {
                        canvas.dragDrop.enabled = false;
                    }
                    consoleLog('SimpleCinematicPan : Canvas interactions disabled');
                } else {
                    // Re-enable canvas interactions
                    canvas.stage.interactive = true;
                    canvas.stage.buttonMode = true;
                    
                    // Re-enable mouse events
                    if (canvas.mouseInteractionManager) {
                        canvas.mouseInteractionManager.enabled = true;
                    }
                    
                    // Re-enable keyboard navigation
                    if (canvas.keyboardManager) {
                        canvas.keyboardManager.enabled = true;
                    }
                    
                    // Re-enable drag and pan
                    if (canvas.dragDrop) {
                        canvas.dragDrop.enabled = true;
                    }
                    consoleLog('SimpleCinematicPan : Canvas interactions enabled');
                }
            }

            this.toggleCinematicBars(locked);
            
            this.showNotification(game.i18n.localize(`simple-cinematic-pan.notifications.canvas-${locked ? 'locked' : 'unlocked'}-local`), "info");
        } catch (error) {
            consoleLog('SimpleCinematicPan : Error applying canvas lock:', 'error');
            consoleLog(error, 'error');
        }
        
        // Toggle player UI for non-GM users
        this.togglePlayerUI(locked);
    }

    /**
     * Main method to synchronize the view
     */
    syncView(animationDuration) {
        consoleLog('SimpleCinematicPan : syncView() called by '+ game.user.name);
        
        if (!game.user.isGM) {
            consoleLog('SimpleCinematicPan : Non-GM user attempted to sync view', 'warn');
            this.showNotification(game.i18n.localize('simple-cinematic-pan.notifications.gm-only-sync'), "warn");
            return;
        }

        if (!canvas.ready) {
            consoleLog('SimpleCinematicPan : Canvas not ready', 'error');
            this.showNotification(game.i18n.localize('simple-cinematic-pan.notifications.canvas-not-ready'), "error");
            return;
        }

        if(!this.isLocked) {
            this.setCanvasLock(true);
        }

        const viewData = this.getCurrentView();
        consoleLog('SimpleCinematicPan : Current view data:'+ viewData);
        
        animationDuration = animationDuration ? animationDuration : game.settings.get(MODULE_ID, 'animation-duration');
        this.sendToPlayers(viewData, animationDuration);

        const progress = ui.notifications.info(game.i18n.localize('simple-cinematic-pan.notifications.players-synchronizing'), {progress: true});
        let pct = 0;
        let interval = setInterval(()=>{
            pct += 0.01;
            progress.update({pct: pct});
        }, animationDuration/100);
        setTimeout(()=>{
            progress.update({pct: 1});
            progress.update({message: game.i18n.localize('simple-cinematic-pan.notifications.view-synchronized')});
            clearInterval(interval);
        }, animationDuration);

        consoleLog('SimpleCinematicPan : View synchronization completed');
    }

    /**
     * Get the current canvas view
     */
    getCurrentView() {
        if (!canvas.ready) {
            consoleLog('SimpleCinematicPan : Canvas not ready, returning default view', 'warn');
            return { x: 0, y: 0, scale: 1 };
        }

        // Use the official Foundry VTT v13 method
        const view = canvas.scene._viewPosition || canvas.stage.position;
        const scale = canvas.stage.scale.x;
        
        const viewData = {
            x: view.x,
            y: view.y,
            scale: scale
        };
        
        consoleLog('SimpleCinematicPan : Retrieved view data:');
        consoleLog(viewData);
        return viewData;
    }

    /**
     * Send view data to players
     */
    sendToPlayers(viewData, animationDuration) {
        consoleLog('SimpleCinematicPan : Sending view data to players:');
        consoleLog(viewData);
        
        const message = {
            type: 'sync-view',
            data: viewData,
            timestamp: Date.now(),
            sender: game.user.id,
            animationDuration: animationDuration
        };

        if (game.socket) {
            consoleLog('SimpleCinematicPan : Emitting socket message');
            game.socket.emit('module.'+MODULE_ID, message);
            // Also apply locally for the GM
            this.applyView(viewData);
        } else {
            consoleLog('SimpleCinematicPan : Socket not available for sending', 'error');
        }
    }

    /**
     * Handle player connected
     */
    handlePlayerConnected() {
        const message = {
            type: 'player-connected',
            timestamp: Date.now(),
            sender: game.user.id
        };
        if (game.socket) {
            consoleLog('SimpleCinematicPan : Emitting user connected message');
            game.socket.emit('module.'+MODULE_ID, message);
        }
    }

    /**
     * Handle messages received via socket
     */
    handleSocketMessage(message) {
        consoleLog('SimpleCinematicPan : Processing message from'+ message.sender);
        
        // Ignore messages sent by self
        if (message.sender === game.user.id) {
            consoleLog('SimpleCinematicPan : Ignoring message from self');
            return;
        }

        switch (message.type) {
            case 'sync-view':
                consoleLog('SimpleCinematicPan : Applying sync-view message');
                this.applyView(message.data, message.animationDuration);
                break;
            case 'canvas-lock':
                consoleLog('SimpleCinematicPan : Applying canvas lock message');
                this.applyCanvasLock(message.data.locked);
                break;
            case 'reset':
                consoleLog('SimpleCinematicPan : Applying reset-view message');
                this.reset();
                break;
            case 'player-connected':
                consoleLog('SimpleCinematicPan : Applying player-connected message');
                if(game.user.isGM && this.isLocked){
                    this.setCanvasLock(true);
                }
                break;
            default:
                consoleLog('SimpleCinematicPan : Unknown message type:'+ message.type, 'warn');
        }
    }

    /**
     * Apply received view to local canvas
     */
    applyView(viewData, animationDuration) {
        consoleLog('SimpleCinematicPan : Applying view data:');
        consoleLog(viewData);
        consoleLog('SimpleCinematicPan : Animation duration:');
        consoleLog(animationDuration);
        
        if (!canvas.ready) {
            consoleLog('SimpleCinematicPan : Canvas not ready, cannot apply view', 'warn');
            return;
        }

        if(game.user.isGM) {
            return;
        }

        this.isLocked = true;

        try {
            const duration = animationDuration ? animationDuration : game.settings.get(MODULE_ID, 'animation-duration');
            consoleLog('SimpleCinematicPan : Animation duration:');
            consoleLog(duration);
            
            // Use canvas.animatePan() for smooth transition
            if (typeof canvas.animatePan === 'function') {
                consoleLog('SimpleCinematicPan : Using canvas.animatePan()');
                canvas.animatePan({
                    x: viewData.x,
                    y: viewData.y,
                    scale: viewData.scale,
                    duration: duration
                });
            } else {
                // Fallback to canvas.pan()
                consoleLog('SimpleCinematicPan : Using canvas.pan() fallback');
                canvas.pan({
                    x: viewData.x,
                    y: viewData.y,
                    scale: viewData.scale
                });
            }
            
            consoleLog('SimpleCinematicPan : View applied successfully');
        } catch (error) {
            consoleLog('SimpleCinematicPan : Error applying view:', 'error');
            consoleLog(error, 'error');
        }
    }

    resetAndResyncAllUsers() {

        if (!game.user.isGM) {
            consoleLog('SimpleCinematicPan : Non-GM user attempted to reset view', 'warn');
            this.showNotification(game.i18n.localize('simple-cinematic-pan.notifications.gm-only-reset'), "warn");
            return;
        }
        const message = {
            type: 'reset',
            timestamp: Date.now(),
            sender: game.user.id
        };

        if (game.socket) {
            consoleLog('SimpleCinematicPan : Emitting reset message');
            game.socket.emit('module.'+MODULE_ID, message);
        }
        this.reset();
    }

    /**
     * Reset view to default
     */
    reset() {
        consoleLog('SimpleCinematicPan : reset() called');

        if(this.isLocked) {
            this.setCanvasLock(false);
            this.toggleCinematicBars(false);
            this.togglePlayerUI(false);
        }
        this.isLocked = false;
    }

    /**
     * Toggle cinematic bars (black bars top and bottom)
     */
    toggleCinematicBars(locked) {
        consoleLog('SimpleCinematicPan : toggleCinematicBars() called');
        let cinematicOverlay = document.getElementById('cinematic-pan-overlay');
        
        if (!locked && cinematicOverlay) {
            // Animate removal of existing overlay
            consoleLog('SimpleCinematicPan : Animating cinematic bars removal');
            const topBar = cinematicOverlay.querySelector('.cinematic-bar-top');
            const bottomBar = cinematicOverlay.querySelector('.cinematic-bar-bottom');
            
            if (topBar && bottomBar) {
                // Animate height to 0
                topBar.style.transition = 'height 1s ease-in-out';
                bottomBar.style.transition = 'height 1s ease-in-out';
                topBar.style.height = '0%';
                bottomBar.style.height = '0%';
                
                // Remove overlay after animation completes
                setTimeout(() => {
                    cinematicOverlay.remove();
                    consoleLog('SimpleCinematicPan : Cinematic bars removed after animation');
                }, 1000);
            } else {
                // Fallback: remove immediately if bars not found
                cinematicOverlay.remove();
                consoleLog('SimpleCinematicPan : Cinematic bars removed immediately (fallback)');
            }
        } else if(!cinematicOverlay) {
            // Get settings
            const height = game.settings.get(MODULE_ID, 'cinematic-bars-height');
            const color = game.settings.get(MODULE_ID, 'cinematic-bars-color');
            const opacity = game.settings.get(MODULE_ID, 'cinematic-bars-opacity');
            
            consoleLog('SimpleCinematicPan : Using settings - height:'+ height + ' color:'+ color + ' opacity:'+ opacity);
            
            // Create new overlay
            let cinematicOverlay = document.createElement('div');
            cinematicOverlay.id = 'cinematic-pan-overlay';
            cinematicOverlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                z-index: 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                pointer-events: none;
            `;
            if(!game?.user?.isGM) {
                cinematicOverlay.style.pointerEvents = 'auto';
            }
            
            // Top bar
            const topBar = document.createElement('div');
            topBar.className = 'cinematic-bar-top';
            topBar.style.cssText = `
                width: 100%;
                height: 0%;
                background-color: ${color};
                opacity: ${opacity};
                transition: height 1s ease-in-out;
            `;
            
            // Bottom bar
            const bottomBar = document.createElement('div');
            bottomBar.className = 'cinematic-bar-bottom';
            bottomBar.style.cssText = `
                width: 100%;
                height: 0%;
                background-color: ${color};
                opacity: ${opacity};
                transition: height 1s ease-in-out;
            `;
            
            cinematicOverlay.appendChild(topBar);
            cinematicOverlay.appendChild(bottomBar);
            
            document.body.appendChild(cinematicOverlay);
            
            // Trigger animation after a small delay to ensure DOM is ready
            setTimeout(() => {
                topBar.style.height = `${height}%`;
                bottomBar.style.height = `${height}%`;
                consoleLog('SimpleCinematicPan : Cinematic bars animation started');
            }, 10);
            
            consoleLog('SimpleCinematicPan : Cinematic bars added with animation');
        }
    }

    /**
     * Toggle player UI visibility (only for non-GM users)
     */
    togglePlayerUI(locked) {
        consoleLog('SimpleCinematicPan : togglePlayerUI() called with locked:'+ locked);
        
        // Only apply to non-GM users
        if (game.user.isGM) {
            consoleLog('SimpleCinematicPan : Skipping UI toggle for GM user');
            return;
        }
        
        // Check if the setting is enabled
        const hideUIForPlayers = game.settings.get(MODULE_ID, 'hide-ui-for-players');
        if (!hideUIForPlayers) {
            consoleLog('SimpleCinematicPan : UI hiding disabled in settings');
            return;
        }
        
        // Get UI elements to hide/show
        const uiElements = document.querySelectorAll('body > *:not(#cinematic-pan-overlay, #board)');

        if (locked) {
            // Hide UI elements
            consoleLog('SimpleCinematicPan : Hiding UI elements for player');
            uiElements.forEach(element => {
                if(element.id === 'interface') {
                    element.style.zIndex = '1';
                    element.style.scale = '1.05';
                }

                element.dataset.scpInitialTransition = element.style.transition;
                element.style.transition = '500ms ease-in-out';

                element.dataset.scpInitialOpacity = element.style.opacity;
                element.style.opacity = '0';

                element.dataset.scpInitialPointerEvents = element.style.pointerEvents;
                element.style.pointerEvents = 'none';
            });
        } else {
            // Show UI elements
            consoleLog('SimpleCinematicPan : Showing UI elements for player');
            uiElements.forEach(element => {
                element.style.transition = '500ms 1s ease-in-out';
                element.style.opacity = '1';

                if(element.id === 'interface') {
                    element.style.scale = '1';
                }

                if(element.dataset.scpInitialPointerEvents) {
                    element.style.pointerEvents = element.dataset.scpInitialPointerEvents;
                }else {
                    element.style.removeProperty('pointer-events');
                }

                setTimeout(() => {
                    if(element.id === 'interface') {
                        element.style.removeProperty('scale');
                        setTimeout(() => {
                            element.style.removeProperty('z-index');
                        }, 100);
                    }

                    if(element.dataset.scpInitialTransition) {
                        element.style.transition = element.dataset.scpInitialTransition;
                    }else {
                        element.style.removeProperty('transition');
                    }

                    if(element.dataset.scpInitialOpacity && element.id !== 'interface') {
                        element.style.opacity = element.dataset.scpInitialOpacity;
                    }else {
                        element.style.removeProperty('opacity');
                    }
                }, 1500);
            });
        }

        
    }

    /**
     * Show notification if enabled in settings
     */
    showNotification(message, type = "info") {
        // Only show notifications to GM
        if (!game.user.isGM) {
            return;
        }
        
        const showNotifications = game.settings.get(MODULE_ID, 'show-notifications');
        if (showNotifications) {
            consoleLog('SimpleCinematicPan : Showing notification:'+ message + ' type:'+ type);
            ui.notifications[type](message);
        }
    }
}