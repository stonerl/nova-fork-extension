# Fork for Nova

Official Nova extension for the [Fork](https://fork.dev) Git client, enabling
repository access, commit history, and file change inspection.

## Requirements

1. Install Fork via [website download](https://fork.dev) or homebrew:

   `brew install --cask fork`

2. Install Fork CLI (not required with homebrew):

   `Settings → Integration → Install Command Line Tools`

## Usage

The following commands are available when the current workspace is a Git repository:

### Editor and Context Menus

- **Show File History in Fork** – Opens the Git commit history for the active file.

### Extensions Menu

- **Open Repository** – Launches the current workspace in Fork.
- **Open Commit View** – Displays uncommitted changes and opens the commit UI.
- **Show All Commits** – Displays the full commit history for the repository.

All commands are also available via the Command Palette (⌘⇧P).

### Keyboard shortcuts

To set keyboard shortcuts for any of the above commands, use Nova’s [Key Bindings](https://help.panic.com/nova/preferences/#key-bindings) feature.

#### Acknowledgements

- The Fork icon is property of Danil Pristupov and used here for integration purposes.
- Based on the original [OpenInFork Nova extension](https://github.com/gwhobbs/OpenInFork.novaextension)
  by Gant Hobbs.
