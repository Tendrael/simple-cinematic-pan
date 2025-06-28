# Simple Cinematic Pan

A **simple** Foundry VTT v13 module that allows the GM to synchronize all players' view with their current own view to create cinematic moments. 
With just two main actions - **Synchronize View** to instantly sync all players' view with yours using smooth canvas animations, and **Toggle Canvas Lock** to exit cinematic mode and restore normal player control - you can create perfect cinematic moments without any complex dialogs or complicated settings. 
The module includes optional cinematic bars for that movie theater feel, UI hiding for immersive experience, and is seamlessly integrated into Foundry's scene controls with multi-language support.

## Features

- **Simple one-click synchronization**: One button to sync all players' view with yours and enter cinematic mode
- **Smooth animations**: Beautiful canvas transitions using official Foundry VTT v13 APIs
- **Cinematic bars**: Optional black bars for that movie theater feel
- **UI hiding**: Option to hide Foundry UI for players during cinematic mode
- **Native integration**: Seamlessly integrated into Foundry's scene controls
- **Macros**: Direct API access for custom automation and advanced control
- **Multi-language support**: Available in English, French, Spanish, German, Italian, and Portuguese
- **Configurable settings**: Customizable animation duration, notifications, and cinematic bars

## Installation

1. Download the module from the manifest
2. Enable the module in your world settings
3. The module is ready to use!

## Usage

### For the GM

#### Method 1: Scene Controls Interface
The module adds a cinematic controls layer to Foundry's scene controls:

1. **Main Layer Button**: Click the camera icon (🎥) in the scene controls layers
2. **Tool Panel**: A panel of tools will appear with the following options:
   
   - **🔒 Toggle Canvas Lock**: Lock/unlock canvas for all players
   - **🔄 Synchronize View**: Synchronize all players' view with yours
   - **🔄 Reset and resync all users**: Reset view and resync all players

#### Method 2: Macros
You can create custom macros using the module's API methods:

```javascript

// Synchronize current view with default animation duration
cinematicPan.syncView();

// Synchronize current view with a set animation duration in ms
cinematicPan.syncView(5000);

// Toggle canvas lock
cinematicPan.setCanvasLock(true); // or false

// Reset and resync all users
cinematicPan.resetAndResyncAllUsers();
```

### For players

Players don't need to do anything! Their view will be automatically synchronized when the GM uses the module. If the "Hide UI for players" setting is enabled, their interface will be hidden during cinematic mode.

## Settings

The module offers several configurable settings:

- **Animation duration**: Transition duration in milliseconds (0-10000ms)
- **Show notifications**: Enable/disable synchronization notifications (only for the GM)
- **Cinematic bars height**: Height of the cinematic bars as percentage of screen height (0-50%)
- **Cinematic bars color**: Color of the cinematic bars (hex format, e.g. #000000)
- **Cinematic bars opacity**: Opacité des barres cinématiques (0 - 1)
- **Hide UI for players**: When enabled, hides the Foundry UI for players when cinematic mode is active
- **Debug mode**: When enabled, shows debug information in the console


## Compatibility

- **Foundry VTT**: Version 13+
- **Systems**: Compatible with all systems (D&D 5e, Pathfinder 2e, etc.)
- **Modules**: No known conflicts

## Support

If you encounter issues or have suggestions:

1. Make sure you're using Foundry VTT v13+
2. Temporarily disable other modules to test
3. Check the browser console for errors
4. Contact me on my discord : https://discord.gg/jMQm3muXVh

## Changelog

### Version 1.0.0
- Initial version
- View synchronization with smooth animations
- Native UI integration with scene controls
- Configurable settings for animation duration and notifications
- Cinematic bars with customizable height, color, and opacity
- UI hiding option for players during cinematic mode
- Multi-language support (English, French, Spanish, German, Italian, Portuguese)
- Socket-based communication for real-time synchronization
- Canvas lock functionality for cinematic mode

## License

This module is distributed under MIT license. You are free to use, modify and distribute it.

## Acknowledgments

- Foundry VTT team for excellent documentation
- Foundry VTT community for feedback and suggestions 