const { app, BrowserWindow } = require('electron')
const indexWindow = require('./src/index')

app.whenReady().then(() => {
  indexWindow.indexCreate()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) indexWindow.indexCreate()
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})
