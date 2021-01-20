import React from 'react'
import ReactDOM from 'react-dom'
import { ControlBar } from './ControlBar.js'
import { ipcRenderer } from 'electron'
import { Navbar } from './Navbar.js'
import { PeopleContainer } from './PeopleContainer.js'
import { AddUserForm } from './AddUserForm.js'
import { ViewUserForm } from './ViewUserForm.js'
import { ModalYesNo, ModalCloseProblem } from './ModalWindows.js'
import { AlterLists } from './AlterLists.js'

class App extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            pageToRender: 'main',
            showModalYesNo: false,
            showModalCP: false,
            delete_data: null,
            close_data: null,
            view_problem_data: null,
            lists: null,
            type_filter: 'Открытые',
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
        this.controlAnim = this.controlAnim.bind(this)
        ipcRenderer.on('lists_grabbed', (e, result) => {
            this.setState({
                lists: {
                    authors: result.authors,
                    responsibles: result.responsibles,
                    branches: result.branches
                }
            }, () => {
                this.controlAnim('#nav_cont_wrapper', result.page)
            })
        })
        ipcRenderer.on('records_deleted', (e, args) => {
            this.peopleContainerRef.current.refreshData()
        })
        ipcRenderer.on('problem_closed', (e, args) => {
            this.peopleContainerRef.current.refreshData()
        })
        ipcRenderer.on('opened_problem_view', (e, data) => {
            this.setState({
                view_problem_data: data,
                pageToRender: 'viewUserProblem'
            })
        })
    }

    componentWillUnmount() {
        ipcRenderer.removeAllListeners('lists_grabbed')
        ipcRenderer.removeAllListeners('opened_problem_view')
        ipcRenderer.removeAllListeners('records_deleted')
        ipcRenderer.removeAllListeners('problem_closed')
    }

    componentDidMount() {
        document.querySelector('#nav_cont_wrapper').classList.remove('zoomed_out')
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
                [modal_type]: false,
                delete_data: null,
                close_data: null
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
    }

    openModalCP(res_id) {
        this.setState({
            close_data: {
                res_id: res_id
            },
            showModalCP: true
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

    openMain(idFrom) {
        this.controlAnim(idFrom, 'main')
    }

    openAlterLists() {
        ipcRenderer.send('grab_lists', 'alterLists')
    }

    controlAnim(idFrom, pageTo) {
        document.querySelector(idFrom).classList.add('zoomed_out')
        setTimeout(() => {
            this.setState({
                pageToRender: pageTo
            })
        }, 100)
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageToRender !== this.state.pageToRender)
            if (this.state.pageToRender === 'main')
                setTimeout(() => {
                    document.querySelector('#nav_cont_wrapper').classList.remove('zoomed_out')
                }, 0)
    }

    openProblem(person_id, res_id, problem_id) {
        ipcRenderer.send('open_problem_view', {p_id: person_id, prob_id: problem_id, res_id: res_id})
    }

    render() {
        return (
            <div id="main_content">
                <ControlBar />
                {this.state.pageToRender === 'main' &&
                    <div id="nav_cont_wrapper" className="zoomed_out">
                    {this.state.showModalYesNo &&
                        <ModalYesNo delete_data={this.state.delete_data} text="Вы уверены?" closeModal={this.closeModal} />
                    }
                    {this.state.showModalCP &&
                        <ModalCloseProblem close_data={this.state.close_data} text="Закройте обращение" closeModal={this.closeModal} />
                    }
                        <Navbar onAddItem={this.openAddItem} onOpenAlterLists={this.openAlterLists} />
                        <PeopleContainer refreshProblems={this.refreshProblems} ref={this.peopleContainerRef} onCallForModal={this.openModal}
                        rememberType={(type) => {this.setState({type_filter: type})}} problems={this.state.problems} onCallForModalCP={this.openModalCP}
                        openProblem={this.openProblem} type_filter={this.state.type_filter} />
                    </div>
                }
                {this.state.pageToRender === 'addUser' &&
                    <AddUserForm classif={this.props.classificator} onProblemAdded={this.handleProblemAdded} closeAddUser={this.openMain} lists={this.state.lists} />
                }
                {this.state.pageToRender === 'viewUserProblem' &&
                    <ViewUserForm closeViewUser={this.openMain} form_data={this.state.view_problem_data} />
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