import React from 'react'
import { ProblemCard } from './ProblemCard.js'
import { SelectField } from './FormFields.js'
import NoRecords from '../static/images/no_records.svg'
import { ipcRenderer } from 'electron'
import LoadingAnim from '../static/anim/loading.svg'

class PeopleContainer extends React.Component {
    constructor(props) {
        super(props)
        this.months = {
            0: 'Январь',
            1: 'Февраль',
            2: 'Март',
            3: 'Апрель',
            4: 'Май',
            5: 'Июнь',
            6: 'Июль',
            7: 'Август',
            8: 'Сентябрь',
            9: 'Октябрь',
            10: 'Ноябрь',
            11: 'Декабрь'
        }
        this.monthsNameToIndex = {
            'Январь': 0,
            'Февраль': 1,
            'Март': 2,
            'Апрель': 3,
            'Май': 4,
            'Июнь': 5,
            'Июль': 6,
            'Август': 7,
            'Сентябрь': 8,
            'Октябрь': 9,
            'Ноябрь': 10,
            'Декабрь': 11
        }
        this.state = {
            year_filter: new Date().getFullYear(),
            month_filter: new Date().getMonth(),
            type_filter: 'Открытые',
            isEmpty: props.problems.length === 0 ? true : false,
            loading: false,
            problems: this.props.problems
        }
        this.applyFilter = this.applyFilter.bind(this)
        this.callForModal = this.callForModal.bind(this)
        this.refreshData = this.refreshData.bind(this)
        this.callForModalCP = this.callForModalCP.bind(this)
        this.selectRefs = [React.createRef(), React.createRef()]
        ipcRenderer.on('problems_grabbed', (e, problems) => {
            if (problems.length === 0)
                this.setState({
                    loading: false,
                    isEmpty: true,
                    problems: []
                }, () => {
                    this.props.refreshProblems([])
                })
            else
                this.setState({
                    loading: false,
                    isEmpty: false,
                    problems: problems
                }, () => {
                    this.props.refreshProblems(this.state.problems)
                })
        })
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('problems_grabbed')
    }

    parseMonth(index) {
        return this.months[index]
    }

    parseMonthNameToIndex(month) {
        return this.monthsNameToIndex[month]
    }

    applyFilter(field, value) {
        let val = value
        if (field === 'month_filter')
            val = this.parseMonthNameToIndex(value)
        if (field === 'type_filter') {
            if (value !== 'Закрытые')
                this.selectRefs.forEach(item => {
                    item.current.setState({
                        blocked: true
                    })
                })
            else
                this.selectRefs.forEach(item => {
                    item.current.setState({
                        blocked: false
                    })
                })
        }
        this.setState({
            [field]: val
        }, () => {
            this.refreshData()
        })
    }

    refreshData() {
        this.setState({
            loading: true
        }, () => {
            ipcRenderer.send('grab_problems', {year_filter: this.state.year_filter, month_filter: this.state.month_filter, type_filter: this.state.type_filter})
        })
    }

    callForModal(problem_id, resoltuion_id) {
        this.props.onCallForModal(problem_id, resoltuion_id)
    }

    callForModalCP(res_id) {
        this.props.onCallForModalCP(res_id)
    }

    render() {
        return (
            <div id="people_cont__main_wrapper">
                <div id="filters">
                    <SelectField ref={this.selectRefs[0]} fieldName="year_filter" placeholder="Выберите год" options={['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']} initial={new Date().getFullYear()} onChoice={this.applyFilter} blocked={true} />
                    <SelectField ref={this.selectRefs[1]} fieldName="month_filter" placeholder="Выберите месяц" options={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']} initial={this.parseMonth(new Date().getMonth())} onChoice={this.applyFilter} blocked={true} />
                    <SelectField fieldName="type_filter" placeholder="Выберите тип" options={['Открытые', 'Закрытые', 'Просроченные']} initial='Открытые' onChoice={this.applyFilter} />
                </div>
                <hr className="line_people_container"></hr>
                <div id="table_headers">
                    <h2 className="table_header_item">Дата обращения</h2>
                {this.state.type_filter === 'Закрытые' &&
                    <h2 className="table_header_item">Номер обращения</h2>
                }
                {this.state.type_filter === 'Открытые' &&
                    <h2 className="table_header_item">Дней осталось</h2>
                }
                {this.state.type_filter === 'Просроченные' &&
                    <h2 className="table_header_item">Дней просрочено</h2>
                }
                    <h2 className="table_header_item">Обратившийся</h2>
                    <h2 className="table_header_item">Ответственный</h2>
                    <h2 className="table_header_item">Описание</h2>
                </div>
                <div id="people_container_problems_wrapper" style={{marginBottom: '100px', backgroundColor: '#36393f', width: '90%',
                minWidth: '860px', height: '60%', minHeight: '250px', borderRadius: '3px'}}>
                {!this.state.loading && !this.state.isEmpty &&
                    <div id="people_container">
                        {this.state.problems.map((problem, index) => <ProblemCard onTryDelete={this.callForModal} onTryCloseProblem={this.callForModalCP} key={index}
                        data={problem} type={this.state.type_filter} />)}
                    </div>
                }
                {this.state.loading &&
                    <LoadingAnim width='15%' height="15%" style={{position: 'relative', margin: 'auto', top: '40%'}} />
                }
                {this.state.isEmpty &&
                    <div id="no_problems_wrapper" style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
                        <NoRecords width="60%" height="60%" />
                        <h2 id="no_problems_descr">Кажется, здесь ничего нет...</h2>
                    </div>
                }
                </div>
            </div>
        )
    }
}

export { PeopleContainer }