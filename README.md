# Time Tracking App

This is a simple time tracking app built with Electron. It allows you to track time spent on tasks and captures screenshots at regular intervals.

## Getting Started

1. Clone the repository:

   ```
   git clone https://github.com/shaweesh/electron-time-tracker.git
   ```

2. Install dependencies:

   ```
   cd electron-time-tracker
   npm install
   ```

3. Build the CSS:

   ```
   npm run build:css
   ```

4. Start the application:

   ```
   npm start

   ```

## Features

- Time tracking with start/stop functionality
- Screenshot capture every 10 minutes
- Data saved as JSON

## Usage

To use the app, simply run the `main.js` file. A small window will appear, which you can use to start and stop time tracking.

## Technical Details

The app is built with Electron, using the `desktopCapturer` and `screen` modules to capture screenshots. Time tracking data is saved as a JSON file.

Here is a brief overview of the main files:

- `main.js`: The main Electron file, which sets up the window and handles time tracking and screenshot functionality.
- `index.html`: The HTML file for the app's UI.
- `renderer.js`: The JavaScript file for the app's UI, which communicates with the main process via IPC.

## IPC Channels

The following IPC channels are used to communicate between the main and renderer processes:

- `time-update`: Sends the current elapsed time to the renderer process.
- `start-time-tracking`: Starts time tracking and screenshot capture.
- `stop-time-tracking`: Stops time tracking and screenshot capture.
- `close-app`: Closes the app.

## Screenshots

Screenshots are saved as PNG files in the same directory as the app, with filenames in the format `screenshot_<timestamp>.png`.

## Data Storage

Time tracking data is saved as a JSON file in the same directory as the app, with the filename `time_tracking_data.json`. The file is updated every time time tracking is stopped.

## License

This project is licensed under the MIT License.
