import React from 'react'
import ReactDOM from 'react-dom'
import { Navbar } from './Navbar.js'
import { ipcRenderer } from 'electron'

class App extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <Navbar />
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