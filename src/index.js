import React from 'react'
import ReactDOM from 'react-dom'
import { ControlBar } from './ControlBar.js'
import { ipcRenderer } from 'electron'
import { Navbar } from './Navbar.js'
import { Content } from './Content.js'

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="main_content">
                <ControlBar />
                <div id="nav_cont_wrapper">
                <Navbar />
                <Content />
                </div>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('main'))

document.getElementById('close_app')
.addEventListener('click', () => {
    ipcRenderer.send('shut_off', null)
})

document.getElementById('maximize_app')
.addEventListener('click', () => {
    ipcRenderer.send('maximize', null)
})

document.getElementById('minimize_app')
.addEventListener('click', () => {
   ipcRenderer.send('minimize', null)
})