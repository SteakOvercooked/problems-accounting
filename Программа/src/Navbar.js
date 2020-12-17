import React from 'react'
import AddItem from '../static/images/add_item.svg'
import MakeReport from '../static/images/make_report.svg'
import Settings from '../static/images/settings.svg'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="navbar">             
                    <AddItem id="add_item" className="btn_nav" />
                    <MakeReport id="make_report" className="btn_nav" />
                    <Settings id="settings" className="btn_na" />
            </div>
        )
    }
}

export { Navbar }