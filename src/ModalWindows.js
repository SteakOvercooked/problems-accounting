import React from 'react'
import CloseModal from '../static/images/close_modal.svg'
import { ipcMain, ipcRenderer } from 'electron'

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
        this.props.closeModal()
    }

    handleYes() {
        ipcRenderer.send('yes_modal', this.props.delete_data)
        this.props.closeModal()
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

export { ModalYesNo }