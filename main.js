const { app, BrowserWindow, ipcMain, Main } = require('electron')

let MainWindow;
function createMainWindow() {
    MainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        frame: false,
        webPreferences: {
            nodeIntegration: true
        }
    })

    MainWindow.loadFile('index.html')
}
app.on('ready', createMainWindow)

ipcMain.on('shut_off', (e, args) => {
    app.quit()
})

ipcMain.on('minimize', (e, args) => {
    MainWindow.minimize()
})

ipcMain.on('maximize', (e, args) => {
    MainWindow.isMaximized() ? MainWindow.unmaximize() : MainWindow.maximize()
})