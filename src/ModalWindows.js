import React from 'react'
import CloseModal from '../static/images/close_modal.svg'
import Warning from '../static/images/warning.svg'
import { ipcRenderer } from 'electron'
import { SearchField, InputField, DatePickerField } from '../src/FormFields.js'

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

export { ModalYesNo, ModalChooseFromExisting, ModalCloseProblem }