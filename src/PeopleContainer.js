import React from 'react'
import { ProblemCard } from './ProblemCard.js'
import { SelectField } from './FormFields.js'
import NoRecords from '../static/images/no_records.svg'
import { ipcRenderer, TouchBarOtherItemsProxy } from 'electron'
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
            isEmpty: false,
            loading: false
        }
        this.applyFilter = this.applyFilter.bind(this)
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
            val = this.parseMonthNameToIndex(value) + 1
        this.setState({
            [field]: val,
            loading: true
        }, () => {
            ipcRenderer.send('grab_problems', {year_filter: this.state.year_filter, month_filter: this.state.month_filter})
        })
    }

    render() {
        this.props.problems.map((problem) => {
            console.log(problem)
        })
        return (
            <div id="people_cont__main_wrapper">
                <div id="filters">
                    <SelectField main={true} fieldName="year_filter" placeholder="Выберите год" options={['2021', '2022', '2023', '2024', '2025', '2026', '2027', '2028', '2029', '2030']} initial={new Date().getFullYear()} onChoice={this.applyFilter} />
                    <SelectField  main={true} fieldName="month_filter" placeholder="Выберите месяц" options={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']} initial={this.parseMonth(new Date().getMonth())} onChoice={this.applyFilter} />
                </div>
                <hr className="line_people_container"></hr>
                <div id="table_headers">
                    <h2 className="table_header_item">Дата обращения</h2>
                    <h2 className="table_header_item">Номер обращения</h2>
                    <h2 className="table_header_item">Обратившийся</h2>
                    <h2 className="table_header_item">Ответственный</h2>
                    <h2 className="table_header_item">Описание</h2>
                </div>
                <div id="people_container_problems_wrapper" style={{marginBottom: '50px', backgroundColor: '#36393f', width: '90%',
                minWidth: '860px', height: '60%', minHeight: '250px', borderRadius: '3px'}}>
                {!this.state.loading &&
                    <div id="people_container">
                        {this.props.problems.map((problem, index) => <ProblemCard key={index} data={problem} />)}
                    </div>
                }
                    {this.state.loading &&
                        <LoadingAnim width='15%' height="15%" style={{position: 'relative', margin: 'auto', top: '40%'}} />
                    }
                </div>
            </div>
        )
    }
}

export { PeopleContainer }