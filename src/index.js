import React from 'react'
import ReactDOM from 'react-dom'
import { ControlBar } from './ControlBar.js'
import { ipcRenderer } from 'electron'
import { Navbar } from './Navbar.js'
import { Content } from './Content.js'
import { AddUserForm } from './AddUserForm.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileToRender: 'index.html'
        }
    }

    componentDidMount() {
        
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

        document.getElementById('add_item')
        .addEventListener('click', () => {
            this.setState({
                fileToRender: 'addUserForm.html'
            })
        })
        
    }

    componentDidUpdate() {
        if (this.state.fileToRender === 'addUserForm.html') {

            document.getElementById('close_form')
            .addEventListener('click', () => {
                this.setState({
                    fileToRender: 'index.html'
                })
            })

            document.querySelectorAll('.select_input')
            .forEach(item => {
                item.addEventListener('focusin', () => {
                    item.parentElement.classList.toggle('focused')
                })

                item.addEventListener('focusout', () => {
                    item.parentElement.classList.toggle('focused')
                })
            })
        }
        
        if (this.state.fileToRender === 'index.html') {

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

            document.getElementById('add_item')
            .addEventListener('click', () => {
                this.setState({
                    fileToRender: 'addUserForm.html'
                })
            })
        }
    }

    render() {
        return (
            <div id="main_content">
                <ControlBar />
                {this.state.fileToRender === 'index.html' &&
                <div id="nav_cont_wrapper">
                    <Navbar />
                    <Content />
                </div>
                }
                {this.state.fileToRender === 'addUserForm.html' &&
                <AddUserForm />
                }
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('main'))