import React from 'react'
import { PeopleContainer } from './PeopleContainer.js'

class Content extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="content">
                <PeopleContainer />
            </div>
        )
    }
}

export { Content }