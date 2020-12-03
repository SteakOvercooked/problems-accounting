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
            file: null
        }
        this.handleClick = this.handleClick.bind(this)
        this.Classificator = this.props.classif
    }

    componentDidMount() {
        this.setState(state => ({
            tabToRender: 'doc_info',
            activeButton: document.querySelector('.active_tab'),
            file: null
        }))

        const file_input = document.querySelector('#add_file')
        file_input.onchange = (e) => {
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
                            <button style={{margin:'10px 2px 20px 10%'}}className="app_button_grey active_tab" onClick={this.handleClick}>Информация о документе</button>
                            <button style={{margin:'10px 0px 20px 2px'}}className="app_button_grey" onClick={this.handleClick}>Резолюция</button>
                        </div>
                        {this.state.tabToRender === 'doc_info' &&
                        <div style={{width:'100%', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
                            <div style={{display:'flex', justifyContent:'flex-start', alignItems:'center'}}>
                                <SelectField name="leg_branch" placeholder="Орган власти" options={['Администрация г. Радужный', 'Залупень', 'Прекол', 'Крутотень']} />
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                    <SelectField name="doc_type" placeholder="Вид документа" options={['Жалоба', 'Заявление', 'Запрос', 'Предложение']} />
                                    <button style={{marginLeft: '10px'}} className="app_button_blue" onClick={this.handleFileInput}>Прикрепить документ</button>
                                    <input style={{display:'none'}} type="file" id="add_file" accept='.doc, .docx, .pdf'></input>
                                    <FileAdded id="file_added_checkmark" />
                                    <h2 id="file_added_prompt" className="lbl">Файл добавлен</h2>
                                </div>
                            </div>
                            <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '35px'}}>
                                <h2 className="lbl">Содержание обращения:</h2>
                                <SelectFieldClassificator name="section" placeholder="Раздел" options={this.Classificator[0]} classes="selected" iden="SECTION" />
                                <SelectFieldClassificator name="subject_matter" placeholder="Тематика" options={this.Classificator[1]} classes="selected blocked" iden="SUBJ_MATTER" />
                                <SelectFieldClassificator name="theme" placeholder="Тема" options={this.Classificator[2]} classes="selected blocked" iden="THEME" />
                                <SelectFieldClassificator name="problem" placeholder="Вопрос" options={this.Classificator[3]} classes="selected blocked" iden="PROBLEM" />
                                <SelectFieldClassificator name="sub_problem" placeholder="Уточнение" options={this.Classificator[4]} classes="selected blocked" iden="SUB_PROBLEM" />
                            </div>
                        </div>
                        }
                        {this.state.tabToRender === 'resol' &&
                        <div>
                            <SelectField name="author" placeholder="Автор" options={['Дада я', 'Kemical', 'Empty lol']} />
                            <SelectField name="resolut" placeholder="Резолюция" options={['Направлено на рассмотрение с ответом', 'Dada', 'kil']} />
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