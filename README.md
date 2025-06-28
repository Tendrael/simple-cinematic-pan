# Simple Cinematic Pan

A Foundry VTT v13 module that allows the GM to synchronize all players' view with their own view to create cinematic moments.

## Features

- **View synchronization**: The GM can synchronize all players' view with their own view
- **Smooth animations**: Uses official Foundry VTT v13 APIs for smooth transitions
- **Native UI integration**: Integrated controls in Foundry's scene controls with layer/tools architecture
- **Configurable settings**: Customizable animation duration and notifications
- **Macro support**: Direct access to module methods for custom macros

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
   - **🔄 Sync View**: Synchronize all players' view with yours
   - **🎯 Pan to Position**: Open a dialog to enter specific coordinates
   - **👤 Center on Token**: Open a dialog to select a token to center on
   - **🏠 Reset View**: Reset view to default center position

#### Method 2: Keyboard shortcut
- Press `Ctrl + Shift + C` for quick view synchronization

#### Method 3: Macros
You can create custom macros using the module's API methods:

```javascript
// Synchronize current view with default animation duration
CinematicPan.syncView();

// Synchronize current view with a set animation duration in ms
CinematicPan.syncView(5000);




```

### Interactive Dialogs

#### Pan to Position Dialog
When you click the "Pan to Position" tool, a dialog opens allowing you to:
- Enter X and Y coordinates
- Set an optional scale factor
- The coordinates are in canvas pixels

#### Token Selection Dialog
When you click the "Center on Token" tool, a dialog opens showing:
- A dropdown list of all tokens on the current scene
- Token names with their current coordinates
- Optional scale factor input

### For players

Players don't need to do anything! Their view will be automatically synchronized when the GM uses the module.

## Settings

The module offers several configurable settings:

- **Animation duration**: Transition duration in milliseconds (0-5000ms)
- **Show notifications**: Enable/disable synchronization notifications

## API for developers

The module exposes a global API `window.CinematicPan` with the following methods:

```javascript
// Module instance
const cinematicPan = window.CinematicPan;

// Synchronize view
cinematicPan.syncView();

// Pan to position
cinematicPan.panTo(x, y, scale);

// Center on token
cinematicPan.centerOnToken(tokenId, scale);

// Center on map point
cinematicPan.centerOnMapPoint(x, y, scale);

// Reset view to default
cinematicPan.resetView();

// Toggle cinematic mode
cinematicPan.toggleActive();
```

## Compatibility

- **Foundry VTT**: Version 13+
- **Systems**: Compatible with all systems (D&D 5e, Pathfinder 2e, etc.)
- **Modules**: No known conflicts

## Support

If you encounter issues or have suggestions:

1. Make sure you're using Foundry VTT v13+
2. Temporarily disable other modules to test
3. Check the browser console for errors
4. Contact the author with problem details

## Changelog

### Version 2.0.0
- Complete code refactoring
- Use of official Foundry VTT v13 APIs
- Native UI integration with layer/tools architecture
- Interactive dialogs for coordinate input and token selection
- Removed chat commands for cleaner interface
- Added configurable settings
- Improved user interface
- Multi-language support (English, French)

### Version 1.0.0
- Initial version
- Basic view synchronization
- Chat commands
- Interface button

## License

This module is distributed under MIT license. You are free to use, modify and distribute it.

## Acknowledgments

- Foundry VTT team for excellent documentation
- Foundry VTT community for feedback and suggestions 