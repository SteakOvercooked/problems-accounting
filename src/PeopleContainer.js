import React from 'react'
import NoRecords from '../static/images/no_records.svg'

class PeopleContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="people_container">
                <NoRecords width='500px' height='500px' />
            </div>
        )
    }
}

export { PeopleContainer }