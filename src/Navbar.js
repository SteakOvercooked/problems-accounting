import React from 'react'
import ClosePic from '../static/images/close.svg'
import MaximizePic from '../static/images/maximize.svg'
import MinimizePic from '../static/images/minimize.svg'

class Navbar extends React.Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div id="nav_upper">
                <div id="minimize_app" className="cntrl_wrapper">
                    <MinimizePic className="cntrl"/>
                </div>
                <div id="maximize_app" className="cntrl_wrapper">
                    <MaximizePic className="cntrl"/>
                </div>
                <div id="close_app" className="cntrl_wrapper">
                    <ClosePic className="cntrl cntrl_close"/>
                </div>
            </div>
        )
    }
}

export { Navbar }