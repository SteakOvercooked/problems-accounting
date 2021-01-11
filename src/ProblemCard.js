import React from 'react'

class ProblemCard extends React.Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseOver = this.handleMouseOver.bind(this)
        this.handleDelete = this.handleDelete.bind(this)
        this.handleCloseProblem = this.handleCloseProblem.bind(this)
        this.state = {
            active : false,
            hover: false
        }
    }

    handleClick(e) {
        if (!this.state.active)
            this.setState({
                active: true,
                hover: false
            }, () => {
                setTimeout(() => {
                    e.target.parentNode.classList.add('active')
                    e.target.parentNode.classList.remove('hover')
                    setTimeout(() => {
                        const people_container = document.querySelector('#people_container')
                        if (e.target.parentNode === people_container.lastChild)
                            people_container.scroll({top: people_container.scrollHeight, behavior: 'smooth'})
                    }, 150)
                }, 0)
            })
        else {
            if (e.target.parentNode.classList.contains('card_wrapper')) {
                e.target.parentNode.classList.remove('active')
                setTimeout(() => {
                    this.setState({
                        active: false
                    })
                }, 150)
            }
        }
    }

    handleMouseOver(e) {
        if (!this.state.active) {
            if (e.target.parentNode.classList.contains('card_wrapper'))
                e.target.parentNode.classList.add('hover')
            else if (e.target.classList.contains('card_wrapper'))
                e.target.classList.add('hover')
        }
    }

    handleMouseLeave(e) {
        if (!this.state.active) {
            if (e.target.parentNode.classList.contains('card_wrapper'))
                e.target.parentNode.classList.remove('hover')
            else if (e.target.classList.contains('card_wrapper'))
                e.target.classList.remove('hover')
        }
        else {
            let changeState = false
            if (e.target.parentNode.classList.contains('card_wrapper')) {
                e.target.parentNode.classList.remove('active')
                changeState = true
            }
            else if (e.target.classList.contains('card_wrapper')) {
                e.target.classList.remove('active')
                changeState = true
            }
            if (changeState)
                setTimeout(() => {
                    this.setState({
                        active: false
                    })
                }, 150)
        }
    }

    handleDelete(e) {
        e.preventDefault()
        this.props.onTryDelete(this.props.data.problem_id, this.props.data.res_id)
    }
    
    handleCloseProblem(e) {
        e.preventDefault()
        this.props.onTryCloseProblem(this.props.data.res_id)
    }

    render() {
        return (
            <div className={`card_wrapper ${this.props.type === 'Просроченные' ? "outdated" : ""}`} onClick={this.handleClick} onMouseOver={this.handleMouseOver} onMouseLeave={this.handleMouseLeave} >
                <div className="problem_info">
                    <h2 className="card_data">{this.props.data.handover_date}</h2>
                {this.props.type === 'Открытые' &&
                    <h2 className="card_data red">{this.props.data.days_left}</h2>
                }
                {this.props.type === 'Закрытые' &&
                    <h2 className="card_data">{this.props.data.number}</h2>
                }
                {this.props.type === 'Просроченные' &&
                    <h2 className="card_data">{this.props.data.days_past}</h2>
                } 
                    <h2 className="card_data">{this.props.data.fio}</h2>
                    <h2 className="card_data">{this.props.data.respon}</h2>
                    <h2 className="card_data">{this.props.data.desc}</h2>
                </div>
                {this.state.active &&
                <div className="problem_controls">
                {this.props.type === 'Открытые' &&
                    <button className="app_button_blue" onClick={this.handleCloseProblem} style={{margin: '0 5px 5px 0', fontSize: '0.9rem', padding: '4px'}}>Закрыть</button>
                }
                    <button className="app_button_blue" style={{margin: '0 5px 5px 5px', fontSize: '0.9rem', padding: '4px'}}>Просмотреть</button>
                    <button className="app_button_red" onClick={this.handleDelete} style={{margin: '0 5px 5px 5px', fontSize: '0.9rem', padding: '4px'}}>Удалить</button>
                </div>
                }
            </div>
        )
    }
}

export { ProblemCard }