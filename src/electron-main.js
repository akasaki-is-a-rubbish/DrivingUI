const { app, BrowserWindow } = require('electron')

function createWindow () {
  const win = new BrowserWindow({
    width: 1300,
    height: 750,
    webPreferences: {
      nodeIntegration: false,
    }
  })
  win.setMenuBarVisibility(false);
  win.loadURL('http://localhost:3000');
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
