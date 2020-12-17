import { stat } from 'fs'
import React from 'react'
import Arrow from '../static/images/arrow.svg'
import DatePickerPic from '../static/images/date_picker.svg'

class InputField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    render() {
        return (
            <input className="form_field" type={this.props.type} placeholder={this.props.placeholder}></input>
        )
    }
}

class SelectField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            options: this.props.options
        }
        this.handleChange = this.handleChange.bind(this)
        this.optionClick = this.optionClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
    }

    handleChange(e) {
        
        this.setState((state, props) => {
            if (e.target.value === '') {
                return {
                    value: e.target.value,
                    options: props.options
                }
            }
            else {
                const opts = props.options
                .filter(item => item.toLowerCase().includes(e.target.value.toLowerCase()))
                .sort((a, b) => {
                    if (a.indexOf(e.target.value) > b.indexOf(e.target.value))
                        return 1
                    else
                        return -1
                })
                return {
                    value: e.target.value,
                    options: opts
                }
            }
        })
    }

    optionClick(e) {
        this.setState({
            value: e.target.innerHTML,
            options: this.props.options
        })
    }

    handleBlur(e) {
        if (!e.target.classList.contains('selected'))
            e.target.parentNode.classList.toggle('focused')
    }

    handleFocus(e) {
        if (e.target.classList.contains('selected')) {
            e.target.classList.toggle('focused')
            e.target.querySelector('.select_input').focus()
        }
    }

    render() {
        return (
            <div className="select_wrapper">
                <div className="selected" tabIndex="-1" onBlur={this.handleBlur} onFocus={this.handleFocus}>
                     <input type="text" value={this.state.value} onChange={this.handleChange} className="select_input" placeholder={this.props.placeholder}></input>
                     <Arrow className="arrow_select"/>
                </div>
                <div className="select_options">
                    <ul>
                        {this.state.options.map((option, ind) => {
                            return (
                                <li onClick={this.optionClick} key={option + `${ind}`} className="option">{option}</li>
                            )
                        })} 
                    </ul>
                </div>
            </div>
        )
    }
}

class DatePickerField extends React.Component {
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
        const today = new Date()
        this.state = {
            currentMonth: this.parseMonth(today.getMonth()),
            currentYear: today.getFullYear(),
            currentMonthIndex: today.getMonth(),
            datePicked: this.props.datepicked === null
            ? {
                year: today.getFullYear(),
                month: today.getMonth(),
                date: today.getDate()
            }
            : {
                year: this.props.datepicked.year,
                month: this.props.datepicked.month,
                date: this.props.datepicked.date
            }
        }
        this.handleBackward = this.handleBackward.bind(this)
        this.handleForward = this.handleForward.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleClickDate = this.handleClickDate.bind(this)
    }

    parseMonth(month) {
        return this.months[month]
    }

    handleBackward() {

        this.setState(state => {
            if (state.currentMonth === 'Январь')
                return {
                    currentMonth: 'Декабрь',
                    currentYear: state.currentYear - 1,
                    currentMonthIndex: 11,
                    datePicked: state.datePicked
                }
            else
                return {
                    currentMonth: this.months[state.currentMonthIndex - 1],
                    currentYear: state.currentYear,
                    currentMonthIndex: --state.currentMonthIndex,
                    datePicked: state.datePicked
                }
        })
    }

    handleForward() {

        this.setState(state => {
            if (state.currentMonth === 'Декабрь')
                return {
                    currentMonth: 'Январь',
                    currentYear: ++state.currentYear,
                    currentMonthIndex: 0,
                    datePicked: state.datePicked
                }
            else
                return {
                    currentMonth: this.months[state.currentMonthIndex + 1],
                    currentYear: state.currentYear,
                    currentMonthIndex: ++state.currentMonthIndex,
                    datePicked: state.datePicked
                }
        })
    }

    handleClick(e) {
        e.target.parentNode.querySelector('.calendar').classList.toggle('active')
        e.target.parentNode.querySelector('.calendar').focus()
    }

    handleCalendarBlur(e) {
        e.target.classList.toggle('active')
    }

    handleClickDate(e) {
        if (`${e.target.innerHTML}-${this.state.currentMonthIndex}-${this.state.currentYear}` !== `${this.state.datePicked.date}-${this.state.datePicked.month}-${this.state.datePicked.year}`) {
            e.target.parentNode.querySelectorAll('.cell_date')
            .forEach(item => {
                if (item.classList.contains('active'))
                    item.classList.remove('active')
            })
            e.target.classList.add('active')
            this.setState(state => ({
                currentMonth: state.currentMonth,
                currentYear: state.currentYear,
                currentMonthIndex: state.currentMonthIndex,
                datePicked: {
                    year: state.currentYear,
                    month: state.currentMonthIndex,
                    date: Number(e.target.innerHTML)
                }
            }))
        }
        
    }

    render() {
        const  daysInMonths = {
            'Январь': 31,
            'Февраль': this.state.currentYear % 4 === 0 ? 29 : 28,
            'Март': 31,
            'Апрель': 30,
            'Май': 31,
            'Июнь': 30,
            'Июль': 31,
            'Август': 31,
            'Сентябрь': 30,
            'Октябрь': 31,
            'Ноябрь': 30,
            'Декабрь': 31
        }
        let dates = [];
        const pickedDateStr = `${this.state.datePicked.date}-${this.state.datePicked.month + 1}-${this.state.datePicked.year}`
        for (let i = 0; i < daysInMonths[this.state.currentMonth]; i++)
            if (pickedDateStr === `${i + 1}-${this.state.currentMonthIndex + 1}-${this.state.currentYear}`)
                dates.push(<div key={'month'+i.toString()} className="cell_date active" onClick={this.handleClickDate}>{i + 1}</div>)
            else
                dates.push(<div key={'month'+i.toString()} className="cell_date" onClick={this.handleClickDate}>{i + 1}</div>)

        return (
            <div style={{position:'relative'}}>
                <div className="chosen_date" onClick={this.handleClick}>
                    <input className="date_input" value={pickedDateStr} type="text" placeholder="Выберите дату"
                    style={{color:'inherit', backgroundColor:'inherit', fontFamily:'inherit', border:'none', outline:'none', fontSize:'1rem', margin:'0 5px', pointerEvents:'none'}} />
                    <DatePickerPic className="date_picker_pic"/>
                </div>
                <div className="calendar" onBlur={this.handleCalendarBlur} tabIndex="-2">
                    <div className="cur_date">
                        <Arrow onClick={this.handleBackward} className="arrow_date_left" />
                        <h2 className="lbl">{this.state.currentMonth} {this.state.currentYear}</h2>
                        <Arrow onClick={this.handleForward} className="arrow_date_right" />
                    </div>
                    <div className="dates">
                        {dates.map(item => item)}
                    </div>
                </div>
            </div>
        )
    }
}

class SelectFieldClassificator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            options: props.options,
            currentOptions: props.options,
            code: '0000.0000.0000.0000',
            approved: false,
            blocked: props.blocked
        }
        this.handleChange = this.handleChange.bind(this)
        this.optionClick = this.optionClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.narrowOptions = this.narrowOptions.bind(this)
        this.family = ['SECTION', 'SUBJ_MATTER', 'THEME', 'PROBLEM', 'SUB_PROBLEM']
    }

    handleChange(e) {
        
        this.setState((state, props) => {
            if (e.target.value === '') {
                return {
                    value: e.target.value,
                    options: state.options,
                    currentOptions: state.options,
                    code: '0000.0000.0000.0000',
                    approved: false
                }
            }
            else {
                const opts = state.options
                .filter(item => item.desc_full.toLowerCase().includes(e.target.value.toLowerCase()))
                .sort((a, b) => {
                    if (a.desc_full.indexOf(e.target.value) > b.desc_full.indexOf(e.target.value))
                        return 1
                    else
                        return -1
                })
                return {
                    value: e.target.value,
                    options: state.options,
                    currentOptions: opts,
                    code: '0000.0000.0000.0000',
                    approved: false
                }
            }
        })
    }

    optionClick(e) {
        const index = this.family.indexOf(this.props.iden)
        const value = e.target.parentNode.querySelector('.desc_full').innerHTML
        const ownID =  Number(e.target.parentNode.querySelector('.own_id').innerHTML)
        this.setState({
            value: value,
            options: this.state.options,
            currentOptions: this.state.options,
            code: e.target.parentNode.querySelector('.code').innerHTML,
            approved: true
        })
        this.props.onApproved(index, value, ownID)
    }

    handleBlur(e) {
        if (!e.target.classList.contains('selected'))
            e.target.parentNode.classList.toggle('focused')
    }

    handleFocus(e) {
        if (e.target.classList.contains('selected')) {
            e.target.classList.toggle('focused')
            e.target.querySelector('.select_input').focus()
        }
    }

    narrowOptions(index, ownindex, pID) {
        if (ownindex - index > 1) {
            this.setState({
                value: '',
                options: this.props.options,
                currentOptions: this.props.options,
                code: '0000.0000.0000.0000',
                approved: false,
                blocked: true
            })
        }
        else {
            const opts = this.props.options
            .filter(item => item.pID === pID)
            this.setState({
                value: '',
                options: opts,
                currentOptions: opts,
                code: '0000.0000.0000.0000',
                approved: false,
                blocked: false
            })
        }
    }

    render() {
        return (
            <div className="select_wrapper">
                <div className={`selected ${this.state.blocked ? "blocked" : ""}`} tabIndex="-1" onBlur={this.handleBlur} onFocus={this.handleFocus}>
                     <input type="text" value={this.state.value} onChange={this.handleChange} className="select_input" placeholder={this.props.placeholder}></input>
                     <Arrow className="arrow_select"/>
                </div>
                <div className="select_options">
                    <ul>
                        {this.state.currentOptions.map((option, ind) => {
                            return (
                                <div onClick={this.optionClick} key={option.desc_cut[0] + `${ind}`} style={{width: '100%'}}>
                                    <li className="option">{option.desc_cut}</li>
                                    <span className="own_id" style={{display: 'none'}}>{option.id}</span>
                                    <span className="pID" style={{display: 'none'}}>{option.pID}</span>
                                    <span className="code" style={{display: 'none'}}>{option.code}</span>
                                    <span className="desc_full" style={{display: 'none'}}>{option.desc_full}</span>
                                </div>
                            )
                        })} 
                    </ul>
                </div>
            </div>
        )
    }
}

export { InputField, SelectField, DatePickerField, SelectFieldClassificator }