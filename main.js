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

function getBorders(year, month) {
    let today = new Date(year, month, 1)
    const LB_prep = today // left border
    today.setDate(today.getDate() + 40)
    today.setDate(1)
    today.setDate(today.getDate() - 1)
    const RB_prep = today // right border
    let RB = {
        year: RB_prep.getFullYear(),
        month: RB_prep.getMonth() + 1 < 10 ? `0${RB_prep.getMonth() + 1}` : RB_prep.getMonth() + 1,
        date: RB_prep.getDate()
    }
    let LB = {
        year: LB_prep.getFullYear(),
        month: LB_prep.getMonth() + 1 < 10 ? `0${LB_prep.getMonth() + 1}` : LB_prep.getMonth() + 1,
        date: '01'
    }
    return [LB, RB]
}

function queryProblems(LB, RB) {
    return `SELECT Problems.number, handover_date, problem_id, person_id, res_id, Problems.respon, People.fio, Problems.desc
            FROM (People INNER JOIN
            (Problems INNER JOIN
            (SELECT handover_date, problem_id, id as res_id FROM Resolutions
                WHERE datetime(handover_date) BETWEEN datetime('${LB.year}-${LB.month}-${LB.date}') AND datetime('${RB.year}-${RB.month}-${RB.date}'))
            ON Problems.id = problem_id)
            ON People.id = Problems.person_id)`
}

function getProblems(borders) {
    return new Promise((resolve, reject) => {
        let Problems = []
        MainDB.all(queryProblems(...borders), (err, rows) => {
            if (err)
                console.log(err.message)
            rows.forEach(row => {
                const date = row.handover_date
                const dateFormat = date.substring(8) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4)
                Problems.push({
                    handover_date: dateFormat,
                    number: row.number,
                    person_id: row.person_id,
                    res_id: row.res_id,
                    problem_id: row.problem_id,
                    respon: row.respon,
                    fio: row.fio,
                    desc: row.desc.length > 60 ? row.desc.substring(0, 57) + '...' : row.desc
                })
            })
            resolve(Problems)
        })
    })
}

function insertData(data_obj, col_count, table) {
    return new Promise((resolve, reject) => {
        let placeholders = []
        for (let i = 1; i <= col_count; i++)
            placeholders.push(`?${i}`)
        const placeholder_str = placeholders.join(',')
        MainDB.run(`INSERT INTO ${table} VALUES(${placeholder_str})`, data_obj, function (err) {
            if (err === null) 
                resolve(this.lastID)
            else
                reject(err.message)
        })
    })
}

function dateToSQLiteDate(date_obj) {
    const date = date_obj.date < 10 ? `0${date_obj.date}` : date_obj.date
    const month = date_obj.month + 1 < 10 ? `0${date_obj.month + 1}` : date_obj.month + 1
    return `${date_obj.year}-${month}-${date}`
}

app.on('ready', () => {
    let db = new SQLite.Database('./Классификатор/Классификатор.db')
    let promises = []

    const prom = new Promise((resolve, reject) => {
        let Classificator = {
            0: [],
            1: [],
            2: [],
            3: [],
            4: []
        }
        for (let i = 0; i < 5; i++) {
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
        }
        resolve(Classificator)
    })
    promises.push(prom)

    MainDB = new SQLite.Database('./static/database/MainDB.db')
    const currentDate = new Date()
    const borders = getBorders(currentDate.getFullYear(), currentDate.getMonth())
    promises.push(getProblems(borders))

    Promise.all(promises)
    .then((values) => {
        createMainWindow()
        MainWindow.webContents.on('did-finish-load', () => {
            MainWindow.webContents.send('start_up_data', {classif: values[0], problems: values[1]})
            db.close()
        })
    })
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
    const { form_data, file, existingID } = args

    let insertPerson = null
    if (existingID === null)
        insertPerson = insertData({
            1: null, 2: form_data.cor_fio,
            3: form_data.cor_fio.toLowerCase(),
            4: form_data.cor_terr, 5: form_data.cor_addr,
            6: form_data.cor_tel, 7: form_data.cor_soc
        }, 7, 'People')
    else
        insertPerson = new Promise((resolve, reject) => { resolve(existingID) })

    const insertProblem = insertPerson.then(personID => {
        if (file === null)
            return insertData({
                1: null, 2: form_data.prob_num, 3: form_data.leg_branch,
                4: form_data.respon, 5: form_data.doc_type, 6: null, 7: null,
                8: form_data.sect, 9: form_data.subj_matter, 10: form_data.theme,
                11: form_data.problem, 12: form_data.sub_problem, 13: form_data.choice,
                14: form_data.desc, 15: personID
            }, 15, 'Problems')
        else {
            const file_ext = file.split('.').pop()
            FS.readFile(file, (err, data) => {
                return insertData({
                    1: null, 2: form_data.prob_num, 3: form_data.leg_branch,
                    4: form_data.respon, 5: form_data.doc_type, 6: data, 7: file_ext,
                    8: form_data.sect, 9: form_data.subj_matter, 10: form_data.theme,
                    11: form_data.problem, 12: form_data.sub_problem, 13: form_data.choice,
                    14: form_data.desc, 15: personID
                }, 15, 'Problems')
            })
        }
    })

    const insertResolution = insertProblem.then(problemID => {
        console.log(problemID)
        return insertData({
            1: null, 2: form_data.author,
            3: form_data.resolut, 4: dateToSQLiteDate(form_data.handover_date),
            5: dateToSQLiteDate(form_data.fullfil_term), 6: null,
            7: null, 8: problemID
        }, 8, 'Resolutions')
    })

    insertResolution.then(() => {e.reply('problem_added', null)})
})

ipcMain.on('grab_problems', (e, filters) => {
    const borders = getBorders(filters.year_filter, filters.month_filter)
    getProblems(borders).then((result) => {
        e.reply('problems_grabbed', result)
    })
})

ipcMain.on('yes_modal', (e, delete_data) => {
    MainDB.run('DELETE FROM Resolutions WHERE id = ?', delete_data.resolution_id, function (err) {
        if (err === null)
            MainDB.run('DELETE FROM Problems WHERE id = ?', delete_data.problem_id, function (err) {
                if (err === null)
                    e.reply('records_deleted', null)
            })
    })
})

ipcMain.on('grab_people', (e, pattern) => {
    new Promise((resolve, reject) => {
        let People = []
        MainDB.all(`SELECT * FROM People WHERE fio_lower LIKE '%${pattern}%' LIMIT 30`, function (err, rows) {
            if (err === null) {
                rows.forEach(row => {
                    People.push(row)
                })
                resolve(People)
            }
            else
                reject(err.message)
        })
    }).then(people => {
        e.reply('people_grabbed', people)
    })
})