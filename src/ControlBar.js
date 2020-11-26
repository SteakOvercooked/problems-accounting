import React from 'react'
import ClosePic from '../static/images/close.svg'
import MaximizePic from '../static/images/maximize.svg'
import MinimizePic from '../static/images/minimize.svg'

class ControlBar extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div id="cntrl_bar">
                <h1 id="app_name">Учет обращений граждан</h1>
                <div id="minimize_app" className="cntrl_wrapper">
                    <MinimizePic className="cntrl" />
                </div>
                <div id="maximize_app" className="cntrl_wrapper">
                    <MaximizePic className="cntrl" />
                </div>
                <div id="close_app" className="cntrl_wrapper">
                    <ClosePic className="cntrl cntrl_close" />
                </div>
            </div>
        )
    }
}

export { ControlBar }