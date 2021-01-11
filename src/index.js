import React from 'react'
import ReactDOM from 'react-dom'
import { ControlBar } from './ControlBar.js'
import { ipcRenderer } from 'electron'
import { Navbar } from './Navbar.js'
import { PeopleContainer } from './PeopleContainer.js'
import { AddUserForm } from './AddUserForm.js'
import { ModalYesNo, ModalCloseProblem } from './ModalWindows.js'
import { AlterLists } from '../src/AlterLists.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageToRender: 'main',
            showModalYesNo: false,
            showModalCP: false,
            delete_data: null,
            close_data: null,
            lists: null,
            problems: props.problems
        }
        this.handleProblemAdded = this.handleProblemAdded.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.openModal = this.openModal.bind(this)
        this.openAddItem = this.openAddItem.bind(this)
        this.openModalCP = this.openModalCP.bind(this)
        this.peopleContainerRef = React.createRef()
        this.refreshProblems = this.refreshProblems.bind(this)
        this.openMain = this.openMain.bind(this)
        this.openAlterLists = this.openAlterLists.bind(this)
        ipcRenderer.on('lists_grabbed', (e, result) => {
            this.setState({
                lists: {
                    authors: result.authors,
                    responsibles: result.responsibles,
                    branches: result.branches
                }
            }, () => {
                this.setState({
                    pageToRender: result.page
                })
            })
        })
    }

    handleProblemAdded() {
        this.setState({
            pageToRender: 'main'
        }, () => {
            this.peopleContainerRef.current.refreshData()
        })
    }

    closeModal(modal_type) {
        document.querySelector('.modal_wrapper').classList.add('zoomed_out')
        setTimeout(() => {
            this.setState({
                [modal_type]: false
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

    openModalCP(res_id) {
        this.setState({
            close_data: {
                res_id: res_id
            },
            showModalCP: true
        })
        ipcRenderer.on('problem_closed', (e, args) => {
            this.peopleContainerRef.current.refreshData()
        })
    }

    openAddItem() {
        ipcRenderer.send('grab_lists', 'addUser')
    }

    refreshProblems(problems) {
        this.setState({
            problems: problems
        })
    }

    openMain() {
        this.setState({
            pageToRender: 'main'
        })
    }

    openAlterLists() {
        ipcRenderer.send('grab_lists', 'alterLists')
    }

    render() {
        return (
            <div id="main_content">
                <ControlBar />
                {this.state.pageToRender === 'main' &&
                    <div id="nav_cont_wrapper">
                    {this.state.showModalYesNo &&
                        <ModalYesNo delete_data={this.state.delete_data} text="Вы уверены?" closeModal={this.closeModal} />
                    }
                    {this.state.showModalCP &&
                        <ModalCloseProblem close_data={this.state.close_data} text="Закройте обращение" closeModal={this.closeModal} />
                    }
                        <Navbar onAddItem={this.openAddItem} onOpenAlterLists={this.openAlterLists} />
                        <PeopleContainer refreshProblems={this.refreshProblems} ref={this.peopleContainerRef} onCallForModal={this.openModal}
                        problems={this.state.problems} onCallForModalCP={this.openModalCP} />
                    </div>
                }
                {this.state.pageToRender === 'addUser' &&
                    <AddUserForm classif={this.props.classificator} onProblemAdded={this.handleProblemAdded} closeAddUser={this.openMain} lists={this.state.lists} />
                }
                {this.state.pageToRender === 'alterLists' &&
                    <AlterLists lists={this.state.lists} closeAlterLists={this.openMain} />
                }
            </div>
        )
    }
}

ipcRenderer.on('start_up_data', (e, result) => {
    ReactDOM.render(<App classificator={result.classif} problems={result.problems} />, document.getElementById('main'))
})