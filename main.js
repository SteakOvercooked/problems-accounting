const { app, BrowserWindow, ipcMain } = require('electron')
const SQLite = require('sqlite3')

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

function query(ind) {
    return `SELECT id, parent_id, code, desc FROM CLAS_LVL_${ind}`
}

app.on('ready', () => {
    let db = new SQLite.Database('./Классификатор/Классификатор.db')

    let Classificator = {
        0: [],
        1: [],
        2: [],
        3: [],
        4: []
    }
    let promises = []

    for(let i = 0; i < 5; i++) {
        const prom = new Promise((resolve, reject) => {
            db.all(query(i), (err, rows) => {
                rows.forEach(row => {
                    Classificator[i].push({
                        id: row.id,
                        pID: row.parent_id,
                        code: row.code,
                        desc_full: row.desc,
                        desc_cut: row.desc.length > 50 ? row.desc.substring(0, 46) + '...' : row.desc
                    })
                })
            })
            resolve('yay')
        })
        promises.push(prom)
    }
    Promise.all(promises)
    .then(createMainWindow())
    .then(MainWindow.webContents.on('did-finish-load', () => {
        MainWindow.webContents.send('classificator', Classificator)
    }))
})

ipcMain.on('shut_off', (e, args) => {
    app.quit()
})

ipcMain.on('minimize', (e, args) => {
    MainWindow.minimize()
})

ipcMain.on('maximize', (e, args) => {
    MainWindow.isMaximized() ? MainWindow.unmaximize() : MainWindow.maximize()
})