# Simple Cinematic Pan

![Download Count](https://img.shields.io/github/downloads/Tendrael/simple-cinematic-pan/module.zip?color=77ccd5&label=DOWNLOADS&style=for-the-badge)

A simple Foundry VTT module that lets the GM synchronize all players' views with their own to create cinematic moments. 

With two main actions — Synchronize View, which instantly aligns all player views to the GM’s using smooth canvas animations, and Toggle Canvas Lock, which restores player control — you can craft cinematic scenes effortlessly, with no need for complex dialogs or complicated settings. 

The module also offers optional cinematic bars for that movie-theater feel, UI hiding for a more immersive experience, and seamless integration into Foundry's scene controls — with easy-to-use macro scripts.

## Youtube video showcase

[![Simple Cinematic Pan Demo](https://img.youtube.com/vi/lLBbiiz_Y24/0.jpg)](https://www.youtube.com/watch?v=lLBbiiz_Y24)

## Features

- **Simple one-click synchronization**: One button to sync all players' view with yours and enter cinematic mode
- **Smooth animations**: Beautiful canvas transitions using official Foundry VTT v13 APIs
- **Cinematic bars**: Optional black bars for that movie theater feel
- **UI hiding**: Option to hide Foundry UI for players during cinematic mode
- **Native integration**: Seamlessly integrated into Foundry's scene controls
- **Macros**: Direct API access for custom automation and advanced control
- **Multi-language support**: Available in English, French, Spanish, German, Italian, and Portuguese
- **Configurable settings**: Customizable animation duration, notifications, and cinematic bars

## Usage

### For the GM

#### Method 1: Scene Controls Interface
The module adds a cinematic controls layer to Foundry's scene controls:

1. **Main Layer Button**: Click the camera icon (🎥) in the scene controls layers
2. **Tool Panel**: A panel of tools will appear with the following options:
   
   - **🔒 Toggle Canvas Lock**: Lock/unlock canvas for all players
   - **🔄 Synchronize View**: Synchronize all players' view with yours (automatically locks canvas for all players if not already locked)
   - **🔄 Reset and resync all users**: Reset view and resync all players

#### Method 2: Macros
You can create custom macros using the module's API methods:

```javascript

// Synchronize current view with default animation duration from the settings
SimpleCinematicPan.syncView();

// Synchronize current view with a set animation duration in ms
SimpleCinematicPan.syncView(5000);

//Toggle canvas lock
SimpleCinematicPan.toggleCanvasLock();

// Set canvas lock
SimpleCinematicPan.setCanvasLock(true); // or false

// Reset and resync all users
SimpleCinematicPan.resetAndResyncAllUsers();
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

## License

This module is distributed under MIT license. You are free to use, modify and distribute it.

## Acknowledgments

- Foundry VTT team for excellent documentation
- Foundry VTT community for feedback and suggestions 

## About the author

Greetings, traveler! 🧙

I'm crafting free and premium modules for Foundry VTT — focused on immersion, user experience, and bringing stories to life. I'm a roleplayer and GM for over 20 years, and a web developer for nearly a decade. The modules I create are the ones I’ve always wanted for my own Foundry VTT game sessions — tools to draw my players deeper into the worlds and stories I tell.
 
I've chosen to dedicate a significant part of my free time to building quality content for the community, hoping that generous adventurers like you will help keep the forge burning. 🔥

Support me on Patreon : https://www.patreon.com/Tendrael

Join my Discord to get support, share suggestions, and enjoy sneak peeks : https://discord.gg/jMQm3muXVh