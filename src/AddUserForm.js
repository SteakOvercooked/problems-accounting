import React from 'react'
import { InputField, SelectField } from './FormFields.js'
import CloseForm from '../static/images/close_form.svg'

class AddUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabToRender: 'doc_info'
        }
    }

    render() {
        return (
            <form id="user_form">
                <CloseForm id="close_form"/>
                <div className="first_piece" style={{width:'100%', marginLeft:'10%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', width:'100%'}}>
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
                <div className="second_piece" style={{width: '100%', marginLeft:'10%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'flex-start', width:'100%'}}>
                        <h1 className="lbl_1">Информация о документе:</h1>
                        <SelectField name="leg_branch" placeholder="Орган власти" options={['Администрация г. Радужный', 'Залупень', 'Прекол', 'Крутотень']} />
                        <SelectField name="doc_type" placeholder="Вид документа" options={['Жалоба', 'Заявление', 'Запрос', 'Предложение']} />
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <h2 className="lbl">Содержание обращения:</h2>
                            <SelectField name="section" placeholder="Раздел" options={['Ашот', 'Борис', 'Пельмень', 'Брага']} />
                            <SelectField name="subject_matter" placeholder="Тематика" options={['Ашот', 'Борис', 'Пельменьds', 'Брага']} />
                            <SelectField name="theme" placeholder="Тема" options={['Ашот', 'Борис', 'Пельмень', 'Брага']} />
                            <SelectField name="problem" placeholder="Вопрос" options={['Ашот', 'Борис', 'Пельмень', 'Брага']} />
                            <SelectField name="sub_problem" placeholder="Уточнение" options={['Ашот', 'Борис', 'Пельмень', 'Брага']} />
                        </div>
                    </div>
                </div>
                <hr className="line"></hr>
            </form>
        )
    }
}

export { AddUserForm }