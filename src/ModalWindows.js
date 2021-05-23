import React from 'react'
import CloseModal from '../static/images/close_modal.svg'
import Warning from '../static/images/warning.svg'
import ReportActive from '../static/images/reportActive.svg'
import ReportOutdated from '../static/images/reportOutdated.svg'
import { ipcRenderer } from 'electron'
import { SearchField, InputField, DatePickerField } from './FormFields.js'

class ModalYesNo extends React.Component {
    constructor(props) {
        super(props)
        this.handleClose = this.handleClose.bind(this)
        this.handleYes = this.handleYes.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('.modal_wrapper').classList.remove('zoomed_out')
        }, 0)
    }

    handleClose(e) {
        this.props.closeModal('showModalYesNo')
    }

    handleYes() {
        ipcRenderer.send('yes_modal', this.props.delete_data)
        this.props.closeModal('showModalYesNo')
    }

    render() {
        return (
            <div className="modal_wrapper zoomed_out">
                <div className="modal_background" onClick={this.handleClose}>
                </div>
                <div className="modal_content">
                    <CloseModal className="close_modal" onClick={this.handleClose}/>
                    <div className="modal_info">
                        <h2 className="modal_info_text">{this.props.text}</h2>
                    </div>
                    <div className="modal_controls">
                        <button className="app_button_light_grey" onClick={this.handleClose} style={{margin: '5px 30px 5px 30px',fontSize: '1.1rem', padding: '6px 25px 6px 25px'}}>Нет</button>
                        <button className="app_button_blue" onClick={this.handleYes} style={{margin: '5px 30px 5px 30px', fontSize: '1.1rem', padding: '6px 25px 6px 25px'}}>Да</button>
                    </div>
                </div>
            </div>
        )
    }
}

class ModalChooseFromExisting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            approved: false,
            showTip: false,
            person_data: null
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleApproved = this.handleApproved.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.handleSearchChange = this.handleSearchChange.bind(this)
        this.warningTimeout = null
    }

    componentWillUnmount() {
        clearTimeout(this.warningTimeout)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('.modal_wrapper').classList.remove('zoomed_out')
        }, 0)
    }

    handleClose(e) {
        this.props.closeModal()
    }

    handleSearchChange() {
        this.setState({
            approved: false,
            person_data: null
        })
    }

    handleApproved(data) {
        this.setState({
            approved: true,
            person_data: data
        })
    }

    handleConfirm(e) {
        e.preventDefault()
        if (!this.state.approved) {
            if (!this.state.showTip)
                this.setState({
                    showTip: true
                }, () => {
                    setTimeout(() => {
                        document.querySelector('.warning_wrapper').classList.remove('active')
                        this.warningTimeout = setTimeout(() => {
                            this.setState({
                                showTip: false
                            })
                        }, 3000)
                    }, 0)
                })
        }
        else {
            this.props.onPersonChosen(this.state.person_data)
            this.props.closeModal()
        }
    }

    render() {
        return (
            <div className="modal_wrapper zoomed_out">
                <div className="modal_background" onClick={this.handleClose}>
                </div>
                <div className="modal_content choose">
                    <CloseModal className="close_modal choose" onClick={this.handleClose}/>
                    <div className="modal_info choose">
                        <h2 className="modal_info_text" style={{marginBottom: '15px'}}>{this.props.text}</h2>
                        <SearchField onFieldChange={this.handleSearchChange} onApproved={this.handleApproved} />
                    {this.state.showTip &&
                        <div className="warning_wrapper active">
                            <Warning width="25px" height="25px" style={{margin: '0 0 2px 0'}} />
                            <h2 className="alert_info">Сначала выберите человека!</h2>
                        </div>
                    }
                    </div>
                    <div className="modal_controls choose">
                        <button className="app_button_blue" onClick={this.handleConfirm} style={{margin: '5px 30px 5px 30px', fontSize: '1.1rem', padding: '6px 25px 6px 25px'}}>Подтвердить</button>
                    </div>
                </div>
            </div>
        )
    }
}

class ModalCloseProblem extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            approved: false,
            showTip: false,
            result: '',
            fullfil_date: null
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.handleChoice = this.handleChoice.bind(this)
        this.warningTimeout = null
    }

    componentWillUnmount() {
        clearTimeout(this.warningTimeout)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('.modal_wrapper').classList.remove('zoomed_out')
        }, 0)
    }

    handleClose(e) {
        this.props.closeModal('showModalCP')
    }

    handleConfirm(e) {
        e.preventDefault()
        if (!this.state.approved) {
            if (!this.state.showTip)
                this.setState({
                    showTip: true
                }, () => {
                    setTimeout(() => {
                        document.querySelector('.warning_wrapper').classList.remove('active')
                        this.warningTimeout = setTimeout(() => {
                            this.setState({
                                showTip: false
                            })
                        }, 3000)
                    }, 0)
                })
        }
        else {
            const close_data = {
                ...this.props.close_data,
                result: this.state.result,
                fullfil_date: this.state.fullfil_date
            }
            ipcRenderer.send('close_problem', close_data)
            this.props.closeModal('showModalCP')
        }
    }

    handleChoice(field, value) {
        this.setState({
            [field]: value,
            approved: ((field === 'result' && value !== '') || (field === 'fullfil_date' && this.state.result !== '')) ? true : false
        })
    }

    render() {
        return (
            <div className="modal_wrapper zoomed_out">
                <div className="modal_background" onClick={this.handleClose}>
                </div>
                <div className="modal_content close_problem">
                    <CloseModal className="close_modal close_problem" onClick={this.handleClose}/>
                    <div className="modal_info close_problem">
                        <h2 className="modal_info_text" style={{marginBottom: '15px'}}>{this.props.text}</h2>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '200px 0 10px 0'}}>
                            <h2 className="lbl" style={{marginRight: '15px'}}>Дата исполнения:</h2>
                            <DatePickerField datepicked={null} fieldName="fullfil_date" onChoice={this.handleChoice} />
                        </div>
                        <InputField type="text" placeholder="Результат" initial="" fieldName="result" onLeave={this.handleChoice} styleExtra={{width: '380px'}} />
                    {this.state.showTip &&
                        <div className="warning_wrapper active close_problem">
                            <Warning width="25px" height="25px" style={{margin: '0 0 2px 0'}} />
                            <h2 className="alert_info">Укажите результат обращения!</h2>
                        </div>
                    }
                    </div>
                    <div className="modal_controls close_problem">
                        <button className="app_button_blue" onClick={this.handleConfirm} style={{margin: '5px 30px 5px 30px', fontSize: '1.1rem', padding: '6px 25px 6px 25px'}}>Подтвердить</button>
                    </div>
                </div>
            </div>
        )
    }
}

class ModalCreateReport extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            showTip: false,
            start_date: null,
            end_date: null,
            datesBlocked: true,
            reportActive_active: false,
            reportOutdated_active: false
        }
        this.handleClose = this.handleClose.bind(this)
        this.handleConfirm = this.handleConfirm.bind(this)
        this.handleChoice = this.handleChoice.bind(this)
        this.warningTimeout = null
    }

    componentWillUnmount() {
        clearTimeout(this.warningTimeout)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('.modal_wrapper').classList.remove('zoomed_out')
        }, 0)
    }

    handleClose(e) {
        this.props.closeModal('showCreateReport')
    }

    handleConfirm(e) {
        e.preventDefault()
        let SD = new Date(this.state.start_date.year, this.state.start_date.month, this.state.start_date.date)
        let ED = new Date(this.state.end_date.year, this.state.end_date.month, this.state.end_date.date)
        let approved = SD <= ED && SD !== null && ED !== null && (this.state.reportActive_active || this.state.reportOutdated_active)
        if (!approved) {
            if (!this.state.showTip)
                this.setState({
                    showTip: true
                }, () => {
                    setTimeout(() => {
                        document.querySelector('.warning_wrapper').classList.remove('active')
                        this.warningTimeout = setTimeout(() => {
                            this.setState({
                                showTip: false
                            })
                        }, 3000)
                    }, 0)
                })
        }
        else {
            let report_data = {
                report_type: this.state.reportActive_active ? 0 : 1,
                start_date: this.state.start_date,
                end_date: this.state.end_date
            }
            ipcRenderer.send('create_report', report_data)
            this.props.closeModal('showCreateReport')
        }
    }

    handleChoice(field, value) {
        let SD = null, ED = null
        if (field === 'start_date') {
            SD = new Date(value.year, value.month, value.date)
            if (this.state.end_date !== null)
                ED = new Date(this.state.end_date.year, this.state.end_date.month, this.state.end_date.date)
        }
        else {
            ED = new Date(value.year, value.month, value.date)
            if (this.state.start_date !== null)
                SD = new Date(this.state.start_date.year, this.state.start_date.month, this.state.start_date.date)
        }
        this.setState({
            [field]: value
        })
    }

    handleClickReport = (event) => {
        let idStr = ''
        if (event.target.id === '')
            idStr = event.target.parentNode.id
        else
            idStr = event.target.id
        
        if (idStr === 'report_active')
            this.setState({
                reportActive_active: true,
                reportOutdated_active: false,
                datesBlocked: false
            })
        else
            this.setState({
                reportOutdated_active: true,
                reportActive_active: false,
                datesBlocked: true
            })
    }

    render() {
        return (
            <div className="modal_wrapper zoomed_out">
                <div className="modal_background" onClick={this.handleClose}>
                </div>
                <div className="modal_content create_report">
                    <CloseModal className="close_modal close_problem" onClick={this.handleClose}/>
                    <div className="modal_info close_problem">
                        <h2 className="modal_info_text" style={{marginBottom: '15px'}}>{this.props.text}</h2>
                        <div style={{display: 'flex', justifyContent: 'space-evenly', alignItems: 'center', width: '100%', margin: '30px 0'}}>
                            <div id="report_active" className={`wrapper_report_choice ${this.state.reportActive_active ? "" : "inactive"}`} 
                            onClick={this.handleClickReport}>
                                <ReportActive className="report_choice" />
                                <h2 className="lbl">Отчет по текущим</h2>
                            </div>
                            <div id="report_outdated" className={`wrapper_report_choice ${this.state.reportOutdated_active ? "" : "inactive"}`} 
                            onClick={this.handleClickReport}>
                                <ReportOutdated className="report_choice" />
                                <h2 className="lbl">Отчет по просроченным</h2>
                            </div>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '10px 0'}}>
                            <h2 className="lbl" style={{marginRight: '15px'}}>С:</h2>
                            <DatePickerField datepicked={null} fieldName="start_date" onChoice={this.handleChoice} blocked={this.state.datesBlocked} />
                        </div>
                        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', margin: '10px 0px'}}>
                            <h2 className="lbl" style={{marginRight: '15px'}}>По:</h2>
                            <DatePickerField datepicked={null} fieldName="end_date" onChoice={this.handleChoice} blocked={this.state.datesBlocked} />
                        </div>
                    {this.state.showTip &&
                        <div className="warning_wrapper active close_problem">
                            <Warning width="25px" height="25px" style={{margin: '0 0 2px 0'}} />
                            <h2 className="alert_info">Дата начала не может быть больше даты конца!</h2>
                        </div>
                    }
                    </div>
                    <div className="modal_controls close_problem">
                        <button className="app_button_blue" onClick={this.handleConfirm} style={{margin: '5px 30px 5px 30px', fontSize: '1.1rem', padding: '6px 25px 6px 25px'}}>Создать</button>
                    </div>
                </div>
            </div>
        )
    }
}

export { ModalYesNo, ModalChooseFromExisting, ModalCloseProblem, ModalCreateReport }