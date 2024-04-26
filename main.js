const { app, BrowserWindow, ipcMain, desktopCapturer, screen } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;
let timeTrackingData = [];
let screenshotInterval = null;

// Create the main window
function createWindow() {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    width: 300,
    height: 240,
    resizable: false,
    titleBarStyle: 'hidden',
    x: width - 320,
    y: 50,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App lifecycle events
app.on('ready', () => createWindow());

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Time tracking functionality
let startTime = null;
let intervalId = null;

function startTimeTracking() {
  startTime = new Date().getTime();
  intervalId = setInterval(() => {
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    mainWindow.webContents.send('time-update', elapsedTime);
  }, 1000);

  startScreenshotCapture();
}

function stopTimeTracking() {
  clearInterval(intervalId);
  clearInterval(screenshotInterval);
  const elapsedTime = new Date().getTime() - startTime;
  timeTrackingData.push({ startTime, elapsedTime });
  saveTimeTrackingData();
  startTime = null;
}

function saveTimeTrackingData() {
  try {
    fs.writeFileSync('time_tracking_data.json', JSON.stringify(timeTrackingData));
  } catch (err) {
    console.error('Error saving time tracking data:', err);
  }
}

function startScreenshotCapture() {
  screenshotInterval = setInterval(async () => {
    try {
      const sources = await desktopCapturer.getSources({ types: ['screen'], thumbnailSize: { width: 1920, height: 1080 } });

      if (sources.length > 0) {
        const entireScreenSource = sources.find((source) => source.name === 'Entire screen');
        if (entireScreenSource) {
          const image = await entireScreenSource.thumbnail.resize({ width: 1024, height: 768 });
          fs.writeFileSync(`screenshot_${Date.now()}.png`, image.toPNG());
          console.log('Screenshot saved');
        } else {
          console.error('Could not find "Entire screen" source');
        }
      } else {
        console.error('No screen sources found');
      }
    } catch (err) {
      console.error('Error capturing screenshot:', err);
    }
  }, 600000); // 10 minutes
}

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('start-time-tracking', startTimeTracking);
ipcMain.on('stop-time-tracking', stopTimeTracking);