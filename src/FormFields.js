import { ipcRenderer } from 'electron'
import React from 'react'
import Arrow from '../static/images/arrow.svg'
import DatePickerPic from '../static/images/date_picker.svg'
import SearchFieldIcon from '../static/images/search.svg'
import LoadingAnim from '../static/anim/loading.svg'

class InputField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initial
        }
        this.blurred = this.blurred.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    blurred(e) {
        this.props.onLeave(this.props.fieldName, this.state.value)
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    render() {
        return (
            <input onChange={this.handleChange} readOnly={this.props.readonly} value={this.state.value} className={`form_field ${this.props.readonly ? "readonly" : ""}`}
            onBlur={this.blurred} type={this.props.type} placeholder={this.props.placeholder} style={this.props.styleExtra} ></input>
        )
    }
}

class SelectField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initial,
            options: props.options,
            wrapped: true,
            stillOver: false,
            blocked: props.blocked
        }
        this.handleChange = this.handleChange.bind(this)
        this.optionClick = this.optionClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleUnwrap = this.handleUnwrap.bind(this)
        this.handleMouseOverOptions = this.handleMouseOverOptions.bind(this)
        this.handleMouseLeaveOptions = this.handleMouseLeaveOptions.bind(this)
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
        const selected = e.target.parentNode.parentNode.parentNode.querySelector('.selected')
        this.setState({
            value: e.target.innerHTML,
        },
        () => {
            this.props.onChoice(this.props.fieldName, this.state.value)
            selected.classList.remove('focused')
            setTimeout(() => {
                this.setState({
                    wrapped: true,
                    stillOver: false
                })
            }, 150)
        })
    }

    handleBlur(e) {
        if (!this.state.stillOver) {
            e.target.parentNode.classList.remove('focused')
            setTimeout(() => {
                this.setState({
                    wrapped: true
                })
            }, 150)
        }
    }

    handleUnwrap(e) {
        if (this.state.wrapped)
            this.setState({
                wrapped: false
            }, () => {
                setTimeout(() => {
                    e.target.classList.add('focused')
                    const input = e.target.querySelector('.select_input')
                    input.focus()
                }, 0)
            })
        else {
            e.target.classList.remove('focused')
            const input = e.target.querySelector('.select_input')
            input.blur()
            setTimeout(() => {
                this.setState({
                    wrapped: true
                })
            }, 150)
        }
    }

    handleMouseOverOptions(e) {
        this.setState({
            stillOver: true
        })
    }

    handleMouseLeaveOptions(e) {
        this.setState({
            stillOver: false
        })
    }

    render() {
        return (
            <div className="select_wrapper">
                <div className={`selected ${this.state.blocked ? "blocked" : ""}`} onClick={this.handleUnwrap}>
                     <input type="text" value={this.state.value} onBlur={this.handleBlur} onChange={this.handleChange} className="select_input" placeholder={this.props.placeholder}></input>
                     <Arrow className="arrow_select"/>
                </div>
                {!this.state.wrapped &&
                <div className="select_options" onMouseOver={this.handleMouseOverOptions} onMouseLeave={this.handleMouseLeaveOptions}>
                    <ul>
                        {this.state.options.map((option, ind) => {
                            return (
                                <li onClick={this.optionClick} key={option + `${ind}`} className="option">{option}</li>
                            )
                        })} 
                    </ul>
                </div>
                }
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
            currentMonth: props.datepicked === null ? this.parseMonth(today.getMonth()) : this.parseMonth(props.datepicked.month - 1),
            currentYear: props.datepicked === null ? today.getFullYear() : props.datepicked.year,
            currentMonthIndex: props.datepicked === null ? today.getMonth() : props.datepicked.month - 1,
            datePicked: props.datepicked === null
            ? {
                year: today.getFullYear(),
                month: today.getMonth(),
                date: today.getDate()
            }
            : {
                year: props.datepicked.year,
                month: props.datepicked.month,
                date: props.datepicked.date
            },
            active: false
        }
        this.handleBackward = this.handleBackward.bind(this)
        this.handleForward = this.handleForward.bind(this)
        this.handleClick = this.handleClick.bind(this)
        this.handleClickDate = this.handleClickDate.bind(this)
        this.handleMouseLeaveCalendar = this.handleMouseLeaveCalendar.bind(this)
    }

    componentDidMount() {
        this.props.onChoice(this.props.fieldName, this.state.datePicked)
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
        const calendarParent = e.target.parentNode
        if (!this.state.active)
            this.setState({
                active: true
            }, () => {
                setTimeout(() => {
                    calendarParent.querySelector('.calendar').classList.add('active')
                }, 0)
            })
        else {
            calendarParent.querySelector('.calendar').classList.remove('active')
            setTimeout(() => {
                this.setState({
                    active: false
                })
            }, 150)
        }
    }

    handleMouseLeaveCalendar(e) {
        document.querySelector('.calendar.active').classList.remove('active')
        setTimeout(() => {
            this.setState({
                active: false
            }, () => {
                this.props.onChoice(this.props.fieldName, this.state.datePicked)
            })
        }, 150);
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
        const date = this.state.datePicked.date < 10 ? `0${this.state.datePicked.date}` : this.state.datePicked.date
        const month = this.state.datePicked.month + 1 < 10 ? `0${this.state.datePicked.month + 1}` : this.state.datePicked.month + 1
        const pickedDateStr = `${date}-${month}-${this.state.datePicked.year}`
        const strCompare = `${this.state.datePicked.date}-${this.state.datePicked.month + 1}-${this.state.datePicked.year}`
        for (let i = 0; i < daysInMonths[this.state.currentMonth]; i++)
            if (strCompare === `${i + 1}-${this.state.currentMonthIndex + 1}-${this.state.currentYear}`)
                dates.push(<div key={'month'+i.toString()} className="cell_date active" onClick={this.handleClickDate}>{i + 1}</div>)
            else
                dates.push(<div key={'month'+i.toString()} className="cell_date" onClick={this.handleClickDate}>{i + 1}</div>)

        return (
            <div style={{position:'relative'}}>
                <div className="chosen_date" onClick={this.handleClick}>
                    <input className="date_input" value={pickedDateStr} readOnly type="text" placeholder="Выберите дату"
                    style={{color:'inherit', backgroundColor:'inherit', fontFamily:'inherit', border:'none', outline:'none', fontSize:'1rem', margin:'0 5px', pointerEvents:'none'}} />
                    <DatePickerPic className="date_picker_pic"/>
                </div>
                {this.state.active &&
                    <div className="calendar" onMouseLeave={this.handleMouseLeaveCalendar}>
                        <div className="cur_date">
                            <Arrow onClick={this.handleBackward} className="arrow_date_left" />
                            <h2 className="lbl">{this.state.currentMonth} {this.state.currentYear}</h2>
                            <Arrow onClick={this.handleForward} className="arrow_date_right" />
                        </div>
                        <div className="dates">
                            {dates.map(item => item)}
                        </div>
                    </div>
                }
            </div>
        )
    }
}

class SelectFieldClassificator extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initial,
            options: props.options,
            currentOptions: props.options,
            code: '0000.0000.0000.0000',
            approved: props.initial === '' ? false : true,
            blocked: props.initial === '' ? props.blocked : false,
            wrapped: true,
            stillOver: false
        }
        this.handleChange = this.handleChange.bind(this)
        this.optionClick = this.optionClick.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
        this.handleUnwrap = this.handleUnwrap.bind(this)
        this.handleMouseOverOptions = this.handleMouseOverOptions.bind(this)
        this.handleMouseLeaveOptions = this.handleMouseLeaveOptions.bind(this)
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
        const selected = e.target.parentNode.parentNode.parentNode.parentNode.querySelector('.selected')
        const index = this.family.indexOf(this.props.iden)
        const value = e.target.parentNode.querySelector('.desc_full').innerHTML
        const code = e.target.parentNode.querySelector('.code').innerHTML
        const ownID =  Number(e.target.parentNode.querySelector('.own_id').innerHTML)
        this.setState({
            value: value,
            options: this.state.options,
            currentOptions: this.state.options,
            code: e.target.parentNode.querySelector('.code').innerHTML,
            approved: true
        }, () => {
            selected.classList.remove('focused')
            this.props.onApproved(index, value, code, ownID)
            setTimeout(() => {
                this.setState({
                    wrapped: true,
                    stillOver: false
                })
            }, 150)
        })
    }

    handleBlur(e) {
        if (!this.state.stillOver) {
            e.target.parentNode.classList.remove('focused')
            setTimeout(() => {
                this.setState({
                    wrapped: true
                })
            }, 150)
        }
    }

    handleUnwrap(e) {
        if (this.state.wrapped)
            this.setState({
                wrapped: false
            }, () => {
                setTimeout(() => {
                    e.target.classList.add('focused')
                    const input = e.target.querySelector('.select_input')
                    input.focus()
                }, 0)
            })
        else {
            e.target.classList.remove('focused')
            const input = e.target.querySelector('.select_input')
            input.blur()
            setTimeout(() => {
                this.setState({
                    wrapped: true
                })
            }, 150)
        }
    }

    handleMouseOverOptions(e) {
        this.setState({
            stillOver: true
        })
    }

    handleMouseLeaveOptions(e) {
        this.setState({
            stillOver: false
        })
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
            if (opts.length === 0)
                this.props.showChoice(index)
            this.setState({
                value: opts.length === 0 ? '-' : '',
                options: opts,
                currentOptions: opts,
                code: '0000.0000.0000.0000',
                approved: opts.length === 0 ? true : false,
                blocked: false
            })
        }
    }

    render() {
        return (
            <div className="select_wrapper">
                <div className={`selected ${this.state.blocked ? "blocked" : ""}`} onClick={this.handleUnwrap}>
                     <input type="text" value={this.state.value} onBlur={this.handleBlur} onChange={this.handleChange} className="select_input" placeholder={this.props.placeholder}></input>
                     <Arrow className="arrow_select"/>
                </div>
                {!this.state.wrapped &&
                    <div className="select_options" onMouseLeave={this.handleMouseLeaveOptions} onMouseOver={this.handleMouseOverOptions}>
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
                }
            </div>
        )
    }
}

class TextAreaField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initial
        }
        this.handleChange = this.handleChange.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    handleBlur(e) {
        this.props.onLeave(this.props.fieldName, this.state.value)
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }

    render() {
        let elem = null
        if (this.props.rdonly)
            elem = <textarea readOnly value={this.state.value} onChange={this.handleChange} className="notation_readonly"></textarea>
        else
            elem = <textarea value={this.state.value} onChange={this.handleChange} maxLength="256" className="notation" onBlur={this.handleBlur}></textarea>
        return (
            elem
        )
    }
}

class SearchField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            active: false,
            stillOver: false,
            wrapped: true,
            value: '',
            options: []
        }
        this.handleBlur = this.handleBlur.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleFocus = this.handleFocus.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleChoice = this.handleChoice.bind(this)
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('people_grabbed')
    }

    handleMouseOver(e) {
        this.setState({
            stillOver: true
        })
    }

    handleMouseLeave(e) {
        this.setState({
            stillOver: false
        })
    }

    handleBlur(e) {
        if (!this.state.stillOver)
            this.setState({
                active: false
            })
    }

    handleFocus(e) {
        if (!this.state.active) {
            this.setState({
                active: true
            })
            e.target.querySelector('.search_field_input').focus()
        }
    }

    handleChange(e) {
        this.props.onFieldChange()
        if (e.target.value === '') {
            this.setState({
                wrapped: true,
                value: '',
                options: []
            })
        }
        else {
            this.setState({
                value: e.target.value
            }, () => {
                ipcRenderer.send('grab_people', e.target.value.toLowerCase())
                ipcRenderer.on('people_grabbed', (ev, people) => {
                    this.setState({
                        wrapped: false,
                        options: people
                    })
                })
            })
        }
    }

    handleChoice(e) {
        const index = Number(e.target.getAttribute('data-index'))
        this.props.onApproved(this.state.options[index])
        this.setState({
            value: e.target.innerHTML,
            wrapped: true,
            stillOver: false,
            active: false,
            options: []
        })
    }

    render() {
        let ulElems = []
        if (this.state.options.length === 0) 
            ulElems.push(<li key={1} className="search_option empty">Ничего не найдено</li>)
        else
            this.state.options.forEach((option, ind) => {
                ulElems.push(<li key={ind} data-index={ind.toString()} onClick={this.handleChoice} className="search_option">{`${option.fio}, ${option.terr}, ${option.addr}`}</li>)
            })

        return (
            <div className="search_field_wrapper">
                <div className={`search_box_wrapper ${this.state.active ? "active" : ""}`} onClick={this.handleFocus} >
                    <SearchFieldIcon className="search_field_icon" />
                    <input onChange={this.handleChange} onBlur={this.handleBlur} className="search_field_input" value={this.state.value} type="text"></input>
                </div>
            {!this.state.wrapped &&
                <ul className="search_field_options">
                    {ulElems.map(option => option)}
                </ul>
            }
            </div>
        )
    }
}

class FormList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            options: props.data,
            loading: false
        }
        this.handleAddItem = this.handleAddItem.bind(this)
        this.handleFieldLeave = this.handleFieldLeave.bind(this)
        this.handleElementDeletion = this.handleElementDeletion.bind(this)
        this.inputFieldRef = React.createRef()
        ipcRenderer.on('listItemAdded', (e, data) => {
            if (data.table === this.props.table) {
                this.inputFieldRef.current.setState({value: ''})
                this.setState({
                    options: data.list_data,
                    value: '',
                    loading: false
                })
            }
        })
        ipcRenderer.on('listItemDeleted', (e, data) => {
            if (data.table === this.props.table) {
                this.inputFieldRef.current.setState({value: ''})
                this.setState({
                    options: data.list_data,
                    value: '',
                    loading: false
                })
            }
        })
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('listItemAdded')
        ipcRenderer.removeAllListeners('listItemDeleted')
    }

    handleAddItem(e) {
        e.preventDefault()
        this.setState({
            loading: true
        }, () => {
            ipcRenderer.send('addListItem', {value: this.state.value, table: this.props.table})
        })
    }

    handleFieldLeave(field, value) {
        this.setState({
            value: value
        })
    }

    handleElementDeletion(e) {
        this.setState({
            loading: true
        }, () => {
            const id = Number(e.target.getAttribute('data-id'))
            ipcRenderer.send('deleteListItem', {table: this.props.table, id: id})
        })
    }

    render() {
        return (
            <div className="form_list_wrapper" style={this.props.style}>
                <div className="form_list_controls">
                    <InputField ref={this.inputFieldRef} type="text" placeholder={this.props.placeholder} initial="" styleExtra={{width: '255px', marginLeft: '0'}} fieldName="addItem" onLeave={this.handleFieldLeave} />
                    <button className="app_button_blue" style={{marginLeft: '15px', padding: '6px'}} onClick={this.handleAddItem}>Добавить в список</button>
                </div>
                <ul className="form_list_items">
                {!this.state.loading &&
                    this.state.options.map((option, index) => <li key={index} data-id={option.id} onDoubleClick={this.handleElementDeletion} className="form_list_item">{option.item}</li>)
                }
                {this.state.loading &&
                    <li key={1} style={{position: 'relative', top: '40%'}} className="form_list_item"><LoadingAnim width="35px" height="35px" /></li>
                }
                </ul>
            </div>
        )
    }
}

export { InputField, SelectField, DatePickerField, SelectFieldClassificator, TextAreaField, SearchField, FormList }