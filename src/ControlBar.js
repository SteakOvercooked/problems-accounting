import React from 'react'
import ClosePic from '../static/images/close.svg'
import MaximizePic from '../static/images/maximize.svg'
import MinimizePic from '../static/images/minimize.svg'
import { ipcRenderer } from 'electron'

class ControlBar extends React.Component {
    constructor(props){
        super(props)
        this.handleClose = this.handleClose.bind(this)
        this.handleMaximize = this.handleMaximize.bind(this)
        this.handleMinimize = this.handleMinimize.bind(this)
    }

    handleClose(e) {
        ipcRenderer.send('shut_off', null)
    }

    handleMinimize(e) {
        ipcRenderer.send('minimize', null)
    }

    handleMaximize(e) {
        ipcRenderer.send('maximize', null)
    }

    render() {
        return (
            <div id="cntrl_bar">
                <h1 id="app_name">Учет обращений граждан</h1>
                <div id="minimize_app" className="cntrl_wrapper" onClick={this.handleMinimize} >
                    <MinimizePic className="cntrl" />
                </div>
                <div id="maximize_app" className="cntrl_wrapper" onClick={this.handleMaximize} >
                    <MaximizePic className="cntrl" />
                </div>
                <div id="close_app" className="cntrl_wrapper" onClick={this.handleClose} >
                    <ClosePic className="cntrl cntrl_close" />
                </div>
            </div>
        )
    }
}

export { ControlBar }