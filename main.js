const { app, BrowserWindow, ipcMain, Main } = require('electron')
const SQLite = require('sqlite3')
const FS = require('fs')

let MainDB = null
let MainWindow;
function createMainWindow() {
    MainWindow = new BrowserWindow({
        width: 1366,
        height: 768,
        minWidth: 1280,
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

function queryClassif(ind) {
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
            db.all(queryClassif(i), (err, rows) => {
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

ipcMain.on('add_problem', (e, args) => {
    const { form_data, file } = args
    MainDB = new SQLite.Database('./static/database/MainDB.db')

    MainDB.run('INSERT INTO People VALUES (?1,?2,?3,?4,?5,?6)', {
        1: null,
        2: form_data.cor_fio,
        3: form_data.cor_terr,
        4: form_data.cor_addr,
        5: form_data.cor_tel,
        6: form_data.cor_soc
    }, function (err) {
        if (err === null) {
            const file_ext = file.split('.').pop()
            const person_id = this.lastID
            FS.readFile(file, (err, data) => {
                MainDB.run('INSERT INTO Problems VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14,?15)', {
                    1: null,
                    2: form_data.prob_num,
                    3: form_data.leg_branch,
                    4: form_data.respon,
                    5: form_data.doc_type,
                    6: data,
                    7: file_ext,
                    8: form_data.sect,
                    9: form_data.subj_matter,
                    10: form_data.theme,
                    11: form_data.problem,
                    12: form_data.sub_problem,
                    13: form_data.choice,
                    14: form_data.desc,
                    15: person_id
                }, function (err) {
                    const problem_id = this.lastID
                    if (err === null) {
                        MainDB.run('INSERT INTO Resolutions VALUES(?1,?2,?3,?4,?5,?6,?7,?8)', {
                            1:null,
                            2: form_data.author,
                            3: form_data.resolut,
                            4: form_data.handover_date,
                            5: form_data.fullfil_term,
                            6: null,
                            7: null,
                            8: problem_id
                        }, function (err) {
                            if (err === null) {
                                e.reply('problem_added', null)
                            }      
                        })
                    }
                })
            })
        }
    })
})