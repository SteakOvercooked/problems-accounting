const { app, BrowserWindow, ipcMain, shell } = require('electron')
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

function getBorders(year, month, borders_type) {
    let LB_prep = null,
        RB_prep = null,
        today = null
    switch(borders_type) {
        // открытые
        case 0:
            today = new Date()
            RB_prep = new Date(today.valueOf())
            today.setDate(today.getDate() - 60)
            LB_prep = today
            break
        // закрытые
        case 1:
            today = new Date(year, month, 1)
            LB_prep = new Date(today.valueOf()) // left border
            today.setDate(today.getDate() + 40)
            today.setDate(1)
            today.setDate(today.getDate() - 1)
            RB_prep = today // right border
            break
        case 2:
            return [null, null]
    }
    const RB = {
        year: RB_prep.getFullYear(),
        month: RB_prep.getMonth() + 1 < 10 ? `0${RB_prep.getMonth() + 1}` : RB_prep.getMonth() + 1,
        date: RB_prep.getDate() < 10 ? `0${RB_prep.getDate()}` : RB_prep.getDate()
    }
    const LB = {
        year: LB_prep.getFullYear(),
        month: LB_prep.getMonth() + 1 < 10 ? `0${LB_prep.getMonth() + 1}` : LB_prep.getMonth() + 1,
        date: LB_prep.getDate() < 10 ? `0${LB_prep.getDate()}` : LB_prep.getDate()
    }
    return [LB, RB]
}

function queryProblems(LB, RB, probs_type) {
    switch(probs_type) {
        case 0:
            return `SELECT days_left, handover_date, problem_id, person_id, res_id, Problems.respon, People.fio, Problems.desc
                    FROM (People INNER JOIN
                    (Problems INNER JOIN
                    (SELECT CAST(julianday(fullfil_term) - julianday('now') + 2 AS INT) AS days_left, handover_date, problem_id, id as res_id FROM Resolutions
                        WHERE date(handover_date) BETWEEN date('${LB.year}-${LB.month}-${LB.date}') AND date('${RB.year}-${RB.month}-${RB.date}')
                        AND fullfil_date IS NULL AND date(fullfil_term) >= date('now'))
                    ON Problems.id = problem_id)
                    ON People.id = Problems.person_id)`
        case 1:
            return `SELECT Problems.number, handover_date, problem_id, person_id, res_id, Problems.respon, People.fio, Problems.desc
                    FROM (People INNER JOIN
                    (Problems INNER JOIN
                    (SELECT handover_date, problem_id, id as res_id FROM Resolutions
                        WHERE date(handover_date) BETWEEN date('${LB.year}-${LB.month}-${LB.date}') AND date('${RB.year}-${RB.month}-${RB.date}')
                        AND fullfil_date IS NOT NULL)
                    ON Problems.id = problem_id)
                    ON People.id = Problems.person_id)`
        case 2:
            return `SELECT days_past, handover_date, problem_id, person_id, res_id, Problems.respon, People.fio, Problems.desc
                    FROM (People INNER JOIN
                    (Problems INNER JOIN
                    (SELECT CAST(julianday('now') - julianday(fullfil_term) AS INT) as days_past, handover_date, problem_id, id as res_id FROM Resolutions
                        WHERE date(fullfil_term) < date('now') AND fullfil_date IS NULL)
                    ON Problems.id = problem_id)
                    ON People.id = Problems.person_id)`
    }
    
}

function getProblems(borders, probs_type) {
    const column = probs_type === 0 ? 'days_left' :
        probs_type === 1 ? 'number' : 'days_past'
    return new Promise((resolve, reject) => {
        let Problems = []
        MainDB.all(queryProblems(borders[0], borders[1], probs_type), (err, rows) => {
            if (err)
                reject(err.message)
            rows.forEach(row => {
                const date = row.handover_date
                const dateFormat = date.substring(8) + '-' + date.substring(5, 7) + '-' + date.substring(0, 4)
                Problems.push({
                    handover_date: dateFormat,
                    [column]: row[column],
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

function getListsData(table, column) {
    let data = []
    return new Promise((resolve, reject) => {
        MainDB.all(`SELECT * FROM ${table}`, (err, rows) => {
            if (err !== null)
                reject(err.message)
            rows.forEach(row => {
                data.push({
                    id: row.id,
                    item: row[column]
                })
            })
            resolve(data)
        })
    })
}

function insertListsData(table, value, column) {
    return new Promise((resolve, reject) => {
        MainDB.run(`INSERT INTO ${table} (${column}) VALUES(?)`, value, (err) => {
            if (err !== null)
                reject(err.message)
            resolve()
        })
    })
}

function deleteListsData(table, id) {
    return new Promise((resolve, reject) => {
        MainDB.run(`DELETE FROM ${table} WHERE id = ?`, id, (err) => {
            if (err !== null)
                reject(err.message)
            resolve()
        })
    })
}

function dateToSQLiteDate(date_obj) {
    const date = date_obj.date < 10 ? `0${date_obj.date}` : date_obj.date
    const month = date_obj.month + 1 < 10 ? `0${date_obj.month + 1}` : date_obj.month + 1
    return `${date_obj.year}-${month}-${date}`
}

function SQLdateToObject(date_str) {
    const year = Number(date_str.substring(0, 4))
    const month = Number(date_str.substring(5, 7)) - 1
    const date = Number(date_str.substring(9, 11))
    return {year: year, month: month, date: date}
}

app.allowRendererProcessReuse = false
app.on('quit', () => {
    MainDB.close()
    FS.readdir(__dirname + '\\static\\temp_view_files', (err, files) => {
        if (err === null)
            files.forEach(file => {
                FS.unlink(__dirname + '\\static\\temp_view_files\\' + file, err => {})
            })
    })
})

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
    const borders = getBorders(currentDate.getFullYear(), currentDate.getMonth(), 0)
    promises.push(getProblems(borders, 0))

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

    const startTransaction = new Promise((resolve, reject) => {
        MainDB.run('BEGIN TRANSACTION;', (err) => {
            resolve()
        })
    })
    const insertPerson = startTransaction.then(() => {
        return new Promise((resolve, reject) => {
            if (existingID === null)
                resolve(insertData({
                    1: null, 2: form_data.cor_fio,
                    3: form_data.cor_fio.toLowerCase(),
                    4: form_data.cor_terr, 5: form_data.cor_addr,
                    6: form_data.cor_tel, 7: form_data.cor_soc
                }, 7, 'People'))
            else
                resolve(existingID)
        })
    })
    
    const insertProblem = insertPerson.then(personID => {
        return new Promise((resolve, reject) => {
            if (file === null) {
                resolve(insertData({
                    1: null, 2: form_data.prob_num, 3: form_data.leg_branch,
                    4: form_data.respon, 5: form_data.doc_type, 6: null, 7: null,
                    8: form_data.sect, 9: form_data.subj_matter, 10: form_data.theme,
                    11: form_data.problem, 12: form_data.sub_problem, 13: form_data.choice,
                    14: form_data.desc, 15: personID
                }, 15, 'Problems'))
            }
            else {
                const file_ext = file.split('.').pop()
                FS.readFile(file, (err, data) => {
                    if (err !== null)
                        reject(err.message)
                    resolve(insertData({
                        1: null, 2: form_data.prob_num, 3: form_data.leg_branch,
                        4: form_data.respon, 5: form_data.doc_type, 6: data, 7: file_ext,
                        8: form_data.sect, 9: form_data.subj_matter, 10: form_data.theme,
                        11: form_data.problem, 12: form_data.sub_problem, 13: form_data.choice,
                        14: form_data.desc, 15: personID
                    }, 15, 'Problems'))
                })
            }
        })
    }, reason => {
        MainDB.run('ROLLBACK;')
    })
    insertProblem.then(problemID => {
        insertData({
            1: null, 2: form_data.author,
            3: form_data.resolut, 4: dateToSQLiteDate(form_data.handover_date),
            5: dateToSQLiteDate(form_data.fullfil_term), 6: null,
            7: null, 8: problemID
        }, 8, 'Resolutions').then(() => {
            e.reply('problem_added', null)
            MainDB.run('COMMIT;')
        }, reason => {MainDB.run('ROLLBACK;')})
    }, reason => {
        MainDB.run('ROLLBACK;')
    })
})

ipcMain.on('grab_problems', (e, filters) => {
    const TF = filters.type_filter
    const type_index = TF === 'Открытые' ? 0 :
        TF === 'Закрытые' ? 1 : 2
    const borders = getBorders(filters.year_filter, filters.month_filter, type_index)
    getProblems(borders, type_index).then((result) => {
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

ipcMain.on('close_problem', (e, close_data) => {
    new Promise((resolve, reject) => {
        MainDB.run('UPDATE Resolutions SET result = ?1, fullfil_date = ?2 WHERE id = ?3', {
            1: close_data.result,
            2: dateToSQLiteDate(close_data.fullfil_date),
            3: close_data.res_id
        }, (err) => {
            if (err === null)
                resolve()
            else
                reject(err.message)
        })
    }).then(() => {
        e.reply('problem_closed', null)
    })
})

ipcMain.on('grab_lists', (e, page) => {
    let promises = []
    promises.push(getListsData('Authors', 'author'))
    promises.push(getListsData('Responsibles', 'responsible'))
    promises.push(getListsData('LegBranches', 'branch'))
    Promise.all(promises).then(values => {
        e.reply('lists_grabbed', {authors: values[0], responsibles: values[1], branches: values[2], page: page})
    })
})

ipcMain.on('addListItem', (e, add_data) => {
    const { value, table } = add_data
    let column = null
        if (table === 'Responsibles')
            column = 'responsible'
        else
            if (table === 'Authors')
                column = 'author'
            else
                column = 'branch'
    insertListsData(table, value, column)
    .then(() => {
        getListsData(table, column)
        .then(list_data => {
            e.reply('listItemAdded', {list_data: list_data, table: table})
        })
    })
})

ipcMain.on('deleteListItem', (e, delete_data) => {
    const { table, id } = delete_data
    let column = null
    if (table === 'Responsibles')
        column = 'responsible'
    else
        if (table === 'Authors')
            column = 'author'
        else
            column = 'branch'
    deleteListsData(table, id)
    .then(() => {
        getListsData(table, column)
        .then(list_data => {
            e.reply('listItemDeleted', {list_data: list_data, table: table})
        })
    })
})

ipcMain.on('open_problem_view', (e, open_data) => {
    const { p_id, prob_id, res_id } = open_data
    new Promise((resolve, reject) => {
        MainDB.all(
            `SELECT * FROM
            (((SELECT fio, terr, tel, soc, addr, id FROM People WHERE id = ?) as first
            INNER JOIN
            (SELECT number, leg_branch, respon, doc_type, extension, sect, subj_matter, theme, problem, sub_problem, choice, desc, person_id, id as prob_id FROM Problems WHERE id = ?) as second
            ON first.id = second.person_id) as intermed
            INNER JOIN
            (SELECT author, resolut_type, handover_date, fullfil_term, fullfil_date, result, problem_id FROM Resolutions WHERE id = ?) as resols
            ON intermed.prob_id = resols.problem_id)`, p_id, prob_id, res_id, (err, rows) => {
                if (err === null) {
                    const row = rows[0]
                    resolve({
                        cor_fio: row.fio, cor_terr: row.terr, cor_tel: row.tel,
                        cor_soc: row.soc, cor_addr: row.addr, prob_num: row.number,
                        leg_branch: row.leg_branch, respon: row.respon, doc_type: row.doc_type,
                        ext: row.extension, sect: row.sect, subj_matter: row.subj_matter,
                        theme: row.theme, problem: row.problem, sub_problem: row.sub_problem,
                        choice: row.choice, desc: row.desc, author: row.author, resolut: row.resolut_type,
                        handover_date: row.handover_date === null ? null : SQLdateToObject(row.handover_date),
                        fullfil_term: row.fullfil_term === null ? null : SQLdateToObject(row.fullfil_term),
                        fullfil_date: row.fullfil_date === null ? null : SQLdateToObject(row.fullfil_date),
                        result: row.result, prob_id: row.prob_id
                    })
                }
                else
                    reject(err.message)
            })
    }).then(view_data => {
        e.reply('opened_problem_view', view_data)
    })
})

ipcMain.on('get_file', (e, data) => {
    const id = data.prob_id
    const path = __dirname + '/static/temp_view_files/temp.'
    MainDB.all('SELECT file, extension FROM Problems WHERE id = ?', id, (err, rows) => {
        if (err === null) {
            const row = rows[0]
            FS.writeFile(path + row.extension, row.file, (err) => {
                if (err === null)
                    shell.openPath(path + row.extension).then(result => {console.log(result)})
                else
                    console.log(err.message)
            })
        }
        else
            console.log(err.message)
    })
})