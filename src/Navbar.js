import React from 'react'
import AddItem from '../static/images/add_item.svg'
import MakeReport from '../static/images/make_report.svg'
import Settings from '../static/images/settings.svg'

class Navbar extends React.Component {
    constructor(props) {
        super(props)
        this.handleAddItem = this.handleAddItem.bind(this)
        this.openAlterLists = this.openAlterLists.bind(this)
        this.timeoutTipShow = null
        this.timeoutTipDestroy = null
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutTipDestroy)
        clearTimeout(this.timeoutTipShow)
    }

    handleAddItem(e) {
        this.destroyTip(null)
        this.props.onAddItem()
    }

    openAlterLists(e) {
        this.destroyTip(null)
        this.props.onOpenAlterLists()
    }

    findParentRecursively = (elem) => {
        if (elem.id !== '')
                return elem
            else
                return this.findParentRecursively(elem.parentNode)
    }

    showTip = (event) => {
        let tip = document.createElement('div');
        let SVGimg = this.findParentRecursively(event.target)
        tip.classList.add('tip', 'animating')
        let rect = SVGimg.getBoundingClientRect()
        tip.style.left = `${rect.left + 80}px`
        tip.style.top = `${rect.top + 5}px`
        switch(SVGimg.id) {
            case 'add_item':
                tip.innerText = 'Добавить обращение'
                break
            case 'make_report':
                tip.innerText = 'Создать отчет'
                break
            case 'settings':
                tip.innerText = 'Настроить списки'
                break
        }
        document.body.appendChild(tip)
        this.timeoutTipShow = setTimeout(() => {
            tip.classList.remove('animating')
        }, 0)
    }

    destroyTip = (event) => {
        let elem = document.querySelector('div.tip')
        if (elem !== null)
            document.body.removeChild(elem)
    }

    render() {
        return (
            <div className="navbar">
                <AddItem id="add_item" className="btn_nav" onClick={this.handleAddItem} onMouseEnter={this.showTip} onMouseLeave={this.destroyTip} />
                <MakeReport id="make_report" className="btn_nav" onMouseEnter={this.showTip} onMouseLeave={this.destroyTip} onClick={this.props.onCallForCreateReport} />
                <Settings id="settings" onClick={this.openAlterLists} onMouseEnter={this.showTip} onMouseLeave={this.destroyTip} />
            </div>
        )
    }
}

export { Navbar }