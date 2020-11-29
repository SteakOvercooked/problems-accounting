import React from 'react'
import ArrowSelect from '../static/images/arrow_select.svg'

class InputField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
    }

    render() {
        return (
            <input className="form_field" type={this.props.type} placeholder={this.props.placeholder}></input>
        )
    }
}

class SelectField extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: '',
            options: this.props.options
        }
        this.handleChange = this.handleChange.bind(this)
        this.optionClick = this.optionClick.bind(this)
    }

    handleChange(e) {
        
        this.setState((state, props) => {
            if (e.target.value === '') {
                return {
                    value: e.target.value,
                    options: props.options
                }
            }
            else {
                const opts = props.options
                .filter(item => item.includes(e.target.value))
                .sort((a, b) => {
                    if (a.indexOf(e.target.value) > b.indexOf(e.target.value))
                        return 1
                    else
                        return -1
                })
                return {
                    value: e.target.value,
                    options: opts
                }
            }
        })
    }

    optionClick(e) {
        this.setState({
            value: e.target.innerHTML,
            options: this.props.options
        })
    }

    render() {
        return (
            <div className="select_wrapper">
                <div className="selected" tabIndex="-1">
                     <input type="text" value={this.state.value} onChange={this.handleChange} className="select_input" placeholder={this.props.placeholder}></input>
                     <ArrowSelect className="arrow_select"/>
                </div>
                <div className="select_options">
                    <ul>
                        {this.state.options.map((option, ind) => {
                            return (
                                <li onClick={this.optionClick} key={option + `${ind}`} className="option">{option}</li>
                            )
                        })} 
                    </ul>
                </div>
            </div>
        )
    }
}

export { InputField, SelectField }