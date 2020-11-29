const { app, BrowserWindow, ipcMain } = require('electron')

let MainWindow;
function createMainWindow() {
    MainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        minWidth: 1200,
        minHeight: 500,
        frame: false,
        icon: './static/images/app_icon_64x64.ico',
        webPreferences: {
            nodeIntegration: true
        }
    })

    MainWindow.loadFile('index.html')
    MainWindow.webContents.toggleDevTools()
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