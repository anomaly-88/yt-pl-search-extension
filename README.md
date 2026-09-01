# YouTube Playlist Search

A lightweight browser extension that adds **search, sorting, and playlist filtering controls** to YouTube and YouTube Music playlist selection dialogs.

It is especially useful for users who have a large number of playlists and want to quickly find the right one without manually scrolling through the entire list.

## Features

- Search playlists directly inside the playlist selection dialog
- Supports both:
  - YouTube
  - YouTube Music
- Instant filtering while typing
- Result counter
  - Example: `4 / 35`
- Playlist sorting:
  - A → Z
  - Z → A
  - Original order
- Numeric-aware sorting
  - `Playlist 2` comes before `Playlist 10`
- Search reset button
- Turkish character tolerant search
  - `Çanakkale` can match `Çanakkale`
- Automatically detects dynamically loaded playlists
- Works with YouTube's SPA-style navigation
- Supports playlist dialogs loaded after the page itself
- Lightweight DOM observation to avoid unnecessary polling
- Designed to work with YouTube's dark interface

## Supported Websites

| Platform | Supported |
|---|---|
| YouTube | ✅ |
| YouTube Music | ✅ |

## Installation

### Chrome / Chromium-based browsers

1. Download or clone this repository.

```bash
git clone https://github.com/anomaly-88/yt-pl-search-extension.git
```

2. Open:

```text
chrome://extensions
```

3. Enable **Developer mode**.

4. Click **Load unpacked**.

5. Select the extension directory containing `manifest.json`.

The extension will automatically activate on supported YouTube pages.

## Usage

Open any video or page where YouTube allows adding content to a playlist.

Click:

**Save → Playlist**

The extension adds a toolbar above the playlist list.

You can then:

- type a playlist name to filter the list,
- see how many playlists match the current search,
- change playlist ordering,
- clear the current search instantly.

The same functionality is available in YouTube Music playlist dialogs.

## Sorting

Click the sort button to cycle between:

```text
A → Z
↓
Z → A
↓
Original Order
```

The original playlist order is preserved internally, so you can always restore YouTube's default ordering.

## Search Behavior

Search is:

- case-insensitive,
- whitespace tolerant,
- diacritic tolerant.

For example:

```text
cagri
```

can match:

```text
Çağrı
```

This also makes searching playlist names containing accented or localized characters easier.

## How It Works

The extension injects a small toolbar into YouTube's playlist selection UI.

It supports both YouTube renderer families:

```text
ytd-*
```

and YouTube Music renderer families:

```text
ytmusic-*
```

Instead of assuming that the first modal on the page is the playlist dialog, the extension detects the currently visible dialog that actually contains playlist items.

This makes it more resilient to YouTube UI changes and dynamically created dialogs.

A `MutationObserver` is used to detect:

- newly opened playlist dialogs,
- dynamically loaded playlists,
- SPA navigation changes.

DOM scans are kept limited to reduce unnecessary CPU usage.

## Project Structure

```text
.
├── manifest.json
├── content.js
├── styles.css
└── README.md
```

Depending on the version of the project, filenames may differ slightly.

## Permissions

The extension only requires permissions necessary to inject the playlist search interface into supported YouTube pages.

It does not require access to:

- your Google account credentials,
- your playlist data through the YouTube API,
- external servers.

Playlist filtering is performed locally in the browser using the DOM already rendered by YouTube.

## Privacy

This extension does not collect, store, transmit, or analyze personal data.

No external analytics, tracking services, or remote APIs are required for playlist searching.

All filtering and sorting operations happen locally in your browser.

## Compatibility

Designed primarily for Chromium-based browsers such as:

- Google Chrome
- Microsoft Edge
- Brave
- Opera

Other Chromium-based browsers may also work.

## Known Limitations

YouTube and YouTube Music are continuously updated web applications.

Because this extension interacts with their rendered interface, major DOM changes made by YouTube may temporarily affect functionality.

The extension intentionally supports multiple selector strategies to reduce the impact of these changes.

## Development

After making changes to the extension:

1. Open:

```text
chrome://extensions
```

2. Find the extension.
3. Click **Reload**.
4. Refresh the YouTube or YouTube Music page.

For DOM-related development, test both:

```text
youtube.com
music.youtube.com
```

because their playlist renderers are not identical.

## Contributing

Bug reports, selector updates, compatibility fixes, and improvements are welcome.

If YouTube changes its playlist dialog structure, please include:

- browser version,
- affected website,
- steps to reproduce,
- relevant DOM information if available.

## Disclaimer

This project is an independent browser extension and is not affiliated with, endorsed by, or sponsored by YouTube or Google.

YouTube and YouTube Music are trademarks of Google LLC.

## License

TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATIONPersonal Use and Modification:You are free to download, install, study, and modify the source code of this Chrome Extension for your personal, non-commercial use only.Non-Commercial Restriction:You may not use this material, its source code, or any modified versions of it for commercial purposes. Commercial purposes include, but are not limited to:Selling the extension on the Chrome Web Store or any other marketplace.Charging users for downloading, installing, or using the extension.Monitizing the extension via advertisements, tracking, data sale, or premium paid features.Using the software or its parts in a commercial product or service within a business environment.Distribution:If you redistribute or share the source code (modified or unmodified), you must retain this license file and give appropriate credit to the original author.Warranty:THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY.Copyright (c) 2026 [Aykan Akduman]