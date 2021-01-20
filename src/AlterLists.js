import React from 'react'
import CloseForm from '../static/images/close_form.svg'
import { FormList } from './FormFields.js'

class AlterLists extends React.Component {
    constructor(props) {
        super(props)
        this.closeAlterLists = this.closeAlterLists.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('#alter_lists_wrapper').classList.remove('zoomed_out')
        }, 0)
    }

    closeAlterLists() {
        this.props.closeAlterLists('#alter_lists_wrapper')
    }

    render() {
        return (
            <div id="alter_lists_wrapper" className="zoomed_out">
                <CloseForm id="close_form" style={{gridArea: 'exit'}} onClick={this.closeAlterLists} />
                <FormList data={this.props.lists.responsibles} table="Responsibles" placeholder="Ответственный" style={{gridArea: 'first'}} />
                <FormList data={this.props.lists.authors} table="Authors" placeholder="Исполнитель" style={{gridArea: 'second'}} />
                <FormList data={this.props.lists.branches} table="LegBranches" placeholder="Орган власти" style={{gridArea: 'third'}} />
            </div>
        )
    }
}

export { AlterLists }