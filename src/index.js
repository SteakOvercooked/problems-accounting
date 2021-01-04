import React from 'react'
import ReactDOM from 'react-dom'
import { ControlBar } from './ControlBar.js'
import { ipcRenderer } from 'electron'
import { Navbar } from './Navbar.js'
import { PeopleContainer } from './PeopleContainer.js'
import { AddUserForm } from './AddUserForm.js'
import { ModalYesNo } from './ModalWindows.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileToRender: 'index.html',
            showModalYesNo: false,
            delete_data: null,
            problems: props.problems
        }
        this.handleProblemAdded = this.handleProblemAdded.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.openAddItem = this.openAddItem.bind(this)
        this.peopleContainerRef = React.createRef()
        this.refreshProblems = this.refreshProblems.bind(this)
    }

    componentDidUpdate() {
        if (this.state.fileToRender === 'addUserForm.html') {

            document.getElementById('close_form')
            .addEventListener('click', () => {
                this.setState({
                    fileToRender: 'index.html'
                })
            })
        }
        
        if (this.state.fileToRender === 'index.html') {

            document.getElementById('add_item')
            .addEventListener('click', () => {
                this.setState({
                    fileToRender: 'addUserForm.html'
                })
            })
        }
    }

    handleProblemAdded() {
        this.setState({
            fileToRender: 'index.html'
        }, () => {
            this.peopleContainerRef.current.refreshData()
        })
    }

    closeModal() {
        document.querySelector('.modal_wrapper').classList.add('zoomed_out')
        setTimeout(() => {
            this.setState({
                showModalYesNo: false
            })
        }, 150)
    }

    openModal(problem_id, resolution_id) {
        this.setState({
            delete_data: {
                problem_id: problem_id,
                resolution_id: resolution_id
            },
            showModalYesNo: true
        })
        ipcRenderer.on('records_deleted', (e, args) => {
            this.peopleContainerRef.current.refreshData()
        })
    }

    openAddItem() {
        this.setState({
            fileToRender: 'addUserForm.html'
        })
    }

    refreshProblems(problems) {
        this.setState({
            problems: problems
        })
    }

    render() {
        return (
            <div id="main_content">
                <ControlBar />
                {this.state.fileToRender === 'index.html' &&
                    <div id="nav_cont_wrapper">
                    {this.state.showModalYesNo &&
                        <ModalYesNo delete_data={this.state.delete_data} text="Вы уверены?" closeModal={this.closeModal}/>
                    }
                        <Navbar onAddItem={this.openAddItem} />
                        <PeopleContainer refreshProblems={this.refreshProblems} ref={this.peopleContainerRef} onCallForModal={this.openModal} problems={this.state.problems} />
                    </div>
                }
                {this.state.fileToRender === 'addUserForm.html' &&
                    <AddUserForm classif={this.props.classificator} onProblemAdded={this.handleProblemAdded} />
                }
            </div>
        )
    }
}

ipcRenderer.on('start_up_data', (e, result) => {
    ReactDOM.render(<App classificator={result.classif} problems={result.problems} />, document.getElementById('main'))
})