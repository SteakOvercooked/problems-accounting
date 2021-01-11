import React from 'react'
import CloseForm from '../static/images/close_form.svg'
import { FormList } from '../src/FormFields.js'

class AlterLists extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="alter_lists_wrapper">
                <CloseForm id="close_form" style={{gridArea: 'exit'}} onClick={this.props.closeAlterLists} />
                <FormList data={this.props.lists.responsibles} table="Responsibles" placeholder="Ответственный" style={{gridArea: 'first'}} />
                <FormList data={this.props.lists.authors} table="Authors" placeholder="Исполнитель" style={{gridArea: 'second'}} />
                <FormList data={this.props.lists.branches} table="LegBranches" placeholder="Орган власти" style={{gridArea: 'third'}} />
            </div>
        )
    }
}

export { AlterLists }