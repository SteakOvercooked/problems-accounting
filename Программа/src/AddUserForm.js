import React from 'react'
import { InputField, SelectField, DatePickerField, SelectFieldClassificator } from './FormFields.js'
import CloseForm from '../static/images/close_form.svg'
import FileAdded from '../static/images/file_added.svg'

class AddUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabToRender: 'doc_info',
            activeButton: null,
            file: null,
            form_data: {
                prob_num: '',
                cor_terr: '',
                cor_fio: '',
                cor_addr: '',
                cor_tel: '',
                cor_soc: '',
                leg_branch: '',
                doc_type: '',
                sect: '',
                subj_matter: '',
                theme: '',
                problem: '',
                sub_problem: '',
                desc: '',
                author: '',
                resolut: '',
                handover_date: '',
                fullfil_term: '',
                fullfil_date: ''
            }
        }
        this.handleClick = this.handleClick.bind(this)
        this.Classificator = this.props.classif
        this.classifFields = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
        this.handleClassifFieldApproved = this.handleClassifFieldApproved.bind(this)
        this.fileInputChange = this.fileInputChange.bind(this)
    }

    componentDidMount() {
        this.setState(state => ({
            tabToRender: 'doc_info',
            activeButton: document.querySelector('.active_tab'),
            file: null
        }))
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
                        activeButton: e.target,
                        file: state.file
                    }
                else
                    return {
                        tabToRender: 'doc_info',
                        activeButton: e.target,
                        file: state.file
                    }
            })
        }
    }

    handleFileInput(e) {
        e.preventDefault()
        document.querySelector('#add_file').click()
    }

    fileInputChange(e) {
        if (!document.querySelector('#file_added_checkmark').classList.contains('success')) {
            document.querySelector('#file_added_checkmark').classList.add('success')
            document.querySelector('#file_added_prompt').classList.add('success')
        }
            
        this.setState(state => ({
            tabToRender: state.tabToRender,
            activeButton: state.activeButton,
            file: e.target.files[0]
        }))
    }

    handleClassifFieldApproved(index, value, ownID) {
        if (index != 4) {
            for (let i = index + 1; i < 5; i++)
                this.classifFields[i].current.narrowOptions(index, i, ownID)
        }
        // вызвать сет стейт формы и записать изменение
    }

    render() {
        return (
            <form id="user_form">
                <CloseForm id="close_form"/>
                <div className="first_piece" style={{width:'100%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
                        <InputField type="text" placeholder="№ обращения" />
                        <h2 className="lbl">Корреспондент:</h2>
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <InputField type="text" placeholder="Территория" />
                            <InputField type="text" placeholder="ФИО" />
                            <InputField type="text" placeholder="Адрес" />
                            <InputField type="text" placeholder="Телефон" />
                            <InputField type="text" placeholder="Соц. положение" />
                        </div>
                    </div>
                </div>
                <hr className="line"></hr>
                <div className="second_piece" style={{width: '100%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', width:'100%'}}>
                            <button style={{margin:'10px 2px 20px 5%'}}className="app_button_grey active_tab" onClick={this.handleClick}>Информация о документе</button>
                            <button style={{margin:'10px 0px 20px 2px'}}className="app_button_grey" onClick={this.handleClick}>Резолюция</button>
                        </div>
                        {this.state.tabToRender === 'doc_info' &&
                        <div style={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                <SelectField name="leg_branch" placeholder="Орган власти" options={['Администрация г. Радужный']} />
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <SelectField name="doc_type" placeholder="Вид документа" options={['Жалоба', 'Заявление', 'Запрос', 'Предложение']} />
                                    <button style={{marginLeft: '10px'}} className="app_button_blue" onClick={this.handleFileInput}>Прикрепить документ</button>
                                    <input style={{display:'none'}} type="file" id="add_file" accept='.doc, .docx, .pdf' onChange={this.fileInputChange}></input>
                                    <FileAdded id="file_added_checkmark" className={this.state.file !== null ? "success" : ""} />
                                    <h2 id="file_added_prompt" className={`lbl ${this.state.file !== null ? "success" : ""}`}>Файл добавлен</h2>
                                </div>
                            </div>
                            <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '35px', width: '90%'}}>
                                <h2 className="lbl">Содержание обращения:</h2>
                                <SelectFieldClassificator ref={this.classifFields[0]} onApproved={this.handleClassifFieldApproved} placeholder="Раздел" options={this.Classificator[0]} iden="SECTION" blocked={false} />
                                <SelectFieldClassificator ref={this.classifFields[1]} onApproved={this.handleClassifFieldApproved} placeholder="Тематика" options={this.Classificator[1]} iden="SUBJ_MATTER" blocked={true} />
                                <SelectFieldClassificator ref={this.classifFields[2]} onApproved={this.handleClassifFieldApproved} placeholder="Тема" options={this.Classificator[2]} iden="THEME" blocked={true} />
                                <SelectFieldClassificator ref={this.classifFields[3]} onApproved={this.handleClassifFieldApproved} placeholder="Вопрос" options={this.Classificator[3]} iden="PROBLEM" blocked={true} />
                                <SelectFieldClassificator ref={this.classifFields[4]} onApproved={this.handleClassifFieldApproved} placeholder="Уточнение" options={this.Classificator[4]} iden="SUB_PROBLEM" blocked={true} />
                            </div>
                        </div>
                        }
                        {this.state.tabToRender === 'resol' &&
                        <div>
                            <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                <SelectField name="author" placeholder="Автор" options={['Дада я', 'Kemical', 'Empty lol']} />
                                <SelectField name="resolut" placeholder="Резолюция" options={['Направлено на рассмотрение с ответом', 'Dada', 'kil']} />
                            </div>
                            <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                <h2 className="lbl" style={{marginRight:'10px'}}>Дата передачи на исполнение:</h2>
                                <DatePickerField datepicked={null} />
                            </div>
                            <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                <h2 className="lbl" style={{marginRight:'10px'}}>Срок исполнения:</h2>
                                <DatePickerField datepicked={null} />
                            </div>
                            <InputField type="text" placeholder="Результат" />
                            <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                <h2 className="lbl" style={{marginRight:'10px'}}>Исполнен:</h2>
                                <DatePickerField datepicked={null} />
                            </div>
                        </div>
                        }
                    </div>
                </div>
                <hr className="line"></hr>
                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', margin:'10px 0px', width:'100%'}}>
                    <button className="app_button_blue" onClick={this.addUser}>Подтвердить</button>
                </div>
            </form>
        )
    }
}

export { AddUserForm }