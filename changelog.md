# Changelog

## [1.1.0] - 2025-08-16

### New Features
- **Automatic cinematic mode per scene**: Added option to scenes to automatically activate cinematic mode on scene activation (canvas pans to the initial view position if needed)

### Improvements
- **User interface**: Enhanced scene configuration interface with clearer and more concise option
- **Token management**: Replaced keyboard navigation disable with proper token deselection. Players cannot interact with their tokens during cinematic mode.
- **Persistence**: Cinematic canvas lock now persists between scenes as long as you leave it enabled.

### Bug Fixes
- **Compatibility**: Fixed show/hide UI behavior with other modules that use front layers like Dice So Nice!
- **Zoom on canvas lock**: Fixed a bug that allowed players to zoom in/out with the mousewheel when canvas was locked

