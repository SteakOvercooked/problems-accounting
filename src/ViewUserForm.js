import React from 'react'
import { InputField, DatePickerField, TextAreaField } from './FormFields.js'
import CloseForm from '../static/images/close_form.svg'
import { ipcRenderer } from 'electron'

class ViewUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabToRender: 'doc_info',
            activeButton: null
        }
        this.handleClick = this.handleClick.bind(this)
        this.handleFormClose = this.handleFormClose.bind(this)
        this.handleFileOpen = this.handleFileOpen.bind(this)
    }

    componentDidMount() {
        setTimeout(() => {
            document.querySelector('#user_form_view').classList.remove('zoomed_out')
        }, 0)
        this.setState(state => ({
            tabToRender: 'doc_info',
            activeButton: document.querySelector('.active_tab')
        }))
    }

    componentDidUpdate() {
        const inputs = document.querySelectorAll("input[type='text']")
        inputs.forEach(item => {
            const val = item.getAttribute('value')
            if (val !== null && val !== '')
                if (val.length < 40)
                    item.setAttribute('size', item.getAttribute('value').length + 1)
                else
                    item.setAttribute('size', 40)
        })
    }

    handleClick(e) {
        e.preventDefault()
        if (!e.target.classList.contains('active_tab')) {

            this.setState(state => {
                state.activeButton.classList.toggle('active_tab')
                e.target.classList.toggle('active_tab')
                if (state.tabToRender === 'doc_info')
                    return {
                        tabToRender: 'resol',
                        activeButton: e.target
                    }
                else
                    return {
                        tabToRender: 'doc_info',
                        activeButton: e.target
                    }
            })
        }
    }

    handleFormClose(e) {
        this.props.closeViewUser('#user_form_view')
    }

    handleFileOpen(e) {
        e.preventDefault()
        ipcRenderer.send('get_file', {prob_id: this.props.form_data.prob_id})
    }

    render() {
        return (
            <form id="user_form_view" className="zoomed_out">
                <CloseForm id="close_form" onClick={this.handleFormClose} />
                <div className="first_piece" style={{width:'100%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
                        <InputField type="text" placeholder="№ обращения" readonly={true} view={true} initial={this.props.form_data.prob_num} fieldName="prob_num" />
                        <h2 className="lbl">Корреспондент:</h2>
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <InputField type="text" placeholder="Территория" readonly={true} view={true} initial={this.props.form_data.cor_terr} fieldName="cor_terr" />
                            <InputField type="text" placeholder="ФИО" readonly={true} view={true} initial={this.props.form_data.cor_fio} fieldName="cor_fio" />
                            <InputField type="text" placeholder="Адрес" readonly={true} view={true} initial={this.props.form_data.cor_addr} fieldName="cor_addr" />
                            <InputField type="text" placeholder="Телефон" readonly={true} view={true} initial={this.props.form_data.cor_tel} fieldName="cor_tel" />
                            <InputField type="text" placeholder="Соц. положение" readonly={true} view={true} initial={this.props.form_data.cor_soc} fieldName="cor_soc" />
                        </div>
                    </div>
                </div>
                <hr className="line"></hr>
                <div className="second_piece" style={{width: '100%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'100%'}}>
                            <button style={{margin:'10px 2px 20px 5%', padding: '7px'}} className="app_button_grey active_tab" onClick={this.handleClick}>Информация о документе</button>
                            <button style={{margin:'10px 0px 20px 2px', padding: '7px'}} className="app_button_grey" onClick={this.handleClick}>Резолюция</button>
                        </div>
                        {this.state.tabToRender === 'doc_info' &&
                            <div style={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                                <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                    <InputField type="text" readonly={true} view={true} fieldName="leg_branch" placeholder="Орган власти" initial={this.props.form_data.leg_branch} />
                                    <InputField type="text" readonly={true} view={true} fieldName="respon" placeholder="Ответственный" initial={this.props.form_data.respon} />
                                    <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                        <InputField type="text" readonly={true} view={true} fieldName="doc_type" placeholder="Вид документа" initial={this.props.form_data.doc_type} />
                                        {this.props.form_data.ext !== null &&
                                            <button style={{marginLeft: '10px', padding: '10px', borderWidth: '0px'}} className="app_button_blue" onClick={this.handleFileOpen}>Открыть файл</button>
                                        }
                                    </div>
                                </div>
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '35px', width: '90%'}}>
                                    <h2 className="lbl">Содержание обращения:</h2>
                                    <InputField placeholder="Раздел" initial={this.props.form_data.sect} type="text" readonly={true} view={true} fieldName="section" />
                                    <InputField placeholder="Тематика" initial={this.props.form_data.subj_matter} type="text" readonly={true} view={true} fieldName="subj_matter" />
                                    <InputField placeholder="Тема" initial={this.props.form_data.theme} type="text" readonly={true} view={true} fieldName="theme" />
                                    <InputField placeholder="Вопрос" initial={this.props.form_data.problem} type="text" readonly={true} view={true} fieldName="problem" />
                                    <InputField placeholder="Уточнение" initial={this.props.form_data.sub_problem} type="text" readonly={true} view={true} fieldName="sub_problem" />
                                </div>
                                <TextAreaField rdonly={true} initial={this.props.form_data.choice} />
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '20px', width: '90%'}}>
                                    <h2 className="lbl">Аннотация:</h2>
                                    <TextAreaField view={true} initial={this.props.form_data.desc} fieldName="desc" />
                                </div>
                            </div>
                        }
                        {this.state.tabToRender === 'resol' &&
                            <div>
                                <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                    <InputField fieldName="author" placeholder="Автор" initial={this.props.form_data.author} type="text" readonly={true} view={true} />
                                    <InputField fieldName="resolut" placeholder="Резолюция" initial={this.props.form_data.resolut} type="text" readonly={true} view={true} />
                                </div>
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                    <h2 className="lbl" style={{marginRight:'10px'}}>Дата передачи на исполнение:</h2>
                                    <DatePickerField readonly={true} datepicked={this.props.form_data.handover_date} fieldName="handover_date" />
                                    <h2 className="lbl" style={{marginRight:'10px', marginLeft: '20px'}}>Срок исполнения:</h2>
                                    <DatePickerField readonly={true} datepicked={this.props.form_data.fullfil_term} fieldName="fullfil_term" />
                                </div>
                                {this.props.form_data.result !== null &&
                                    <div style={{backgroundColor:'inherit', width: '100%', display:'flex', justifyContent:'center', alignItems:'center', margin:'10px 0px'}}>
                                        <InputField fieldName="result" placeholder="Результат" initial={this.props.form_data.result} type="text" readonly={true} view={true} />
                                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', margin:'10px 0px'}}>
                                            <h2 className="lbl" style={{marginRight:'10px'}}>Исполнен:</h2>
                                            <DatePickerField readonly={true} dateSensitive={true} datepicked={this.props.form_data.fullfil_date} fieldName="fullfil_date" />
                                        </div>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </div>
            </form>
        )
    }
}

export { ViewUserForm }