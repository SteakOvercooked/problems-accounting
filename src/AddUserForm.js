import React from 'react'
import { InputField, SelectField, DatePickerField, SelectFieldClassificator, TextAreaField } from './FormFields.js'
import CloseForm from '../static/images/close_form.svg'
import FileAdded from '../static/images/file_added.svg'
import { ipcRenderer } from 'electron'
import LoadingAnim from '../static/anim/loading.svg'
import { ModalChooseFromExisting } from '../src/ModalWindows.js'

class AddUserForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabToRender: 'doc_info',
            activeButton: null,
            file: null,
            chooseFromExisting: false,
            showModalChoose: false,
            classif_code: '',
            loading: false,
            form_data: {
                prob_num: '',
                cor_terr: '',
                cor_fio: '',
                cor_addr: '',
                cor_tel: '',
                cor_soc: '',
                leg_branch: '',
                respon: '',
                doc_type: '',
                sect: '',
                subj_matter: '',
                theme: '',
                problem: '',
                sub_problem: '',
                choice: '',
                desc: '',
                author: '',
                resolut: '',
                handover_date: null,
                fullfil_term: null
            }
        }
        this.handleClick = this.handleClick.bind(this)
        this.Classificator = this.props.classif
        this.classifFields = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
        this.personDataFields = [React.createRef(), React.createRef(), React.createRef(), React.createRef(), React.createRef()]
        this.textAreaRef = React.createRef()
        this.handleClassifFieldApproved = this.handleClassifFieldApproved.bind(this)
        this.fileInputChange = this.fileInputChange.bind(this)
        this.handleChoice = this.handleChoice.bind(this)
        this.handleFieldLeave = this.handleFieldLeave.bind(this)
        this.addProblem = this.addProblem.bind(this)
        this.hanldeChooseFromExisting = this.hanldeChooseFromExisting.bind(this)
        this.handleAddNew = this.handleAddNew.bind(this)
        this.handleCloseModal = this.handleCloseModal.bind(this)
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
            file: e.target.files[0].path
        }))
    }

    handleClassifFieldApproved(index, value, code, ownID) {
        const { form_data } = this.state
        let new_form_data = form_data
        switch (index) {
            case 0:
                new_form_data.sect = value
                break
            case 1:
                new_form_data.subj_matter = value
                break
            case 2:
                new_form_data.theme = value
                break
            case 3:
                new_form_data.problem = value
                break
            case 4:
                new_form_data.sub_problem = value
                break
        }
        this.setState({
            form_data: new_form_data,
            classif_code: index > 2 ? code : ''
        },
        () => {
            if (index != 4) {
                for (let i = index + 1; i < 5; i++)
                    this.classifFields[i].current.narrowOptions(index, i, ownID)
            }
            else {
                this.handleChoice(index)
            }
        })
    }

    handleChoice(index) {
        const { form_data } = this.state
        let new_form_data = form_data
        if (index === 3) {
            let value = this.state.classif_code + ' - ' + this.state.form_data.problem
            new_form_data.sub_problem = '-'
            new_form_data.choice = value
            this.setState({
                form_data: new_form_data
            })
            this.textAreaRef.current.setState({
                value: value
            })
        }
        else {
            console.log('index is 4, setting a new value')
            let value = this.state.classif_code + ' - ' + this.state.form_data.problem + ` [${this.state.form_data.sub_problem}]`
            new_form_data.choice = value
            this.setState({
                form_data: new_form_data
            })
            this.textAreaRef.current.setState({
                value: value
            })
        }
    }

    handleFieldLeave(field, value) {
        new Promise((resolve, reject) => {
            const { form_data } = this.state
            let new_form_data = form_data
            new_form_data[`${field}`] = value
            resolve(new_form_data)
        }).then(res => {
            this.setState({
                form_data: res
            })
        })
    }

    addProblem(e) {
        e.preventDefault()
        this.setState({
            loading: true
        })
        const { form_data, file } = this.state
        ipcRenderer.send('add_problem', {form_data: form_data, file: file})
        ipcRenderer.on('problem_added', (e, args) => {
            this.setState({
                loading: false
            }, () => {
                this.props.onProblemAdded()
            })
        })
    }

    hanldeChooseFromExisting(e) {
        e.preventDefault()
        this.setState({
            showModalChoose: true
        })
    }

    handleAddNew(e) {
        e.preventDefault()
        this.setState({
            chooseFromExisting: false
        }, () => {
            this.personDataFields.forEach(field => {
                field.current.setState({
                    value: ''
                })
            })
        })
    }

    handleCloseModal() {
        document.querySelector('.modal_wrapper').classList.add('zoomed_out')
        setTimeout(() => {
            this.setState({
                showModalChoose: false
            })
        }, 150)
    }

    render() {
        return (
            <form id="user_form">
            {this.state.showModalChoose &&
                <ModalChooseFromExisting text="Выберите человека:" closeModal={this.handleCloseModal}/>
            }
                <CloseForm id="close_form"/>
                <div className="first_piece" style={{width:'100%'}}>
                    <div style={{backgroundColor:'inherit', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', width:'100%'}}>
                        <InputField type="text" placeholder="№ обращения" initial={this.state.form_data.prob_num} fieldName="prob_num" onLeave={this.handleFieldLeave} />
                        <h2 className="lbl">Корреспондент:</h2>
                        <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                            <InputField type="text" placeholder="Территория" ref={this.personDataFields[0]} readonly={this.state.chooseFromExisting} initial={this.state.form_data.cor_terr} fieldName="cor_terr" onLeave={this.handleFieldLeave} />
                            <InputField type="text" placeholder="ФИО" ref={this.personDataFields[1]} readonly={this.state.chooseFromExisting} initial={this.state.form_data.cor_fio} fieldName="cor_fio" onLeave={this.handleFieldLeave} />
                            <InputField type="text" placeholder="Адрес" ref={this.personDataFields[2]} readonly={this.state.chooseFromExisting} initial={this.state.form_data.cor_addr} fieldName="cor_addr" onLeave={this.handleFieldLeave} />
                            <InputField type="text" placeholder="Телефон" ref={this.personDataFields[3]} readonly={this.state.chooseFromExisting} initial={this.state.form_data.cor_tel} fieldName="cor_tel" onLeave={this.handleFieldLeave} />
                            <InputField type="text" placeholder="Соц. положение" ref={this.personDataFields[4]} readonly={this.state.chooseFromExisting} initial={this.state.form_data.cor_soc} fieldName="cor_soc" onLeave={this.handleFieldLeave} />
                        </div>
                        {!this.state.chooseFromExisting &&
                            <button className="app_button_blue" style={{margin: '10px 0', padding: '10px', borderWidth: '0px'}} onClick={this.hanldeChooseFromExisting}>Выбрать из существующих</button>
                        }
                        {this.state.chooseFromExisting &&
                            <button className="app_button_blue" style={{margin: '10px 0', padding: '10px', borderWidth: '0px'}} onClick={this.handleAddNew}>Добавить нового</button>
                        }
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
                                    <SelectField fieldName="leg_branch" placeholder="Орган власти" options={['Администрация г. Радужный']} initial={this.state.form_data.leg_branch} onChoice={this.handleFieldLeave} />
                                    <SelectField fieldName="respon" placeholder="Ответственный" options={['Дядя', 'тетя']} initial={this.state.form_data.respon} onChoice={this.handleFieldLeave} />
                                    <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center'}}>
                                        <SelectField fieldName="doc_type" placeholder="Вид документа" options={['Жалоба', 'Заявление', 'Запрос', 'Предложение']} initial={this.state.form_data.doc_type} onChoice={this.handleFieldLeave} />
                                        <button style={{marginLeft: '10px', padding: '10px', borderWidth: '0px'}} className="app_button_blue" onClick={this.handleFileInput}>Прикрепить документ</button>
                                        <input style={{display:'none'}} type="file" id="add_file" accept='.doc, .docx, .pdf' onChange={this.fileInputChange}></input>
                                        <FileAdded id="file_added_checkmark" className={this.state.file !== null ? "success" : ""} />
                                        <h2 id="file_added_prompt" className={`lbl ${this.state.file !== null ? "success" : ""}`}>Файл добавлен</h2>
                                    </div>
                                </div>
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '35px', width: '90%'}}>
                                    <h2 className="lbl">Содержание обращения:</h2>
                                    <SelectFieldClassificator ref={this.classifFields[0]} onApproved={this.handleClassifFieldApproved} placeholder="Раздел" options={this.Classificator[0]} iden="SECTION" blocked={false} initial={this.state.form_data.sect} />
                                    <SelectFieldClassificator ref={this.classifFields[1]} onApproved={this.handleClassifFieldApproved} placeholder="Тематика" options={this.Classificator[1]} iden="SUBJ_MATTER" blocked={true} initial={this.state.form_data.subj_matter} />
                                    <SelectFieldClassificator ref={this.classifFields[2]} onApproved={this.handleClassifFieldApproved} placeholder="Тема" options={this.Classificator[2]} iden="THEME" blocked={true} initial={this.state.form_data.theme} />
                                    <SelectFieldClassificator ref={this.classifFields[3]} onApproved={this.handleClassifFieldApproved} placeholder="Вопрос" options={this.Classificator[3]} iden="PROBLEM" blocked={true} initial={this.state.form_data.problem} />
                                    <SelectFieldClassificator ref={this.classifFields[4]} onApproved={this.handleClassifFieldApproved} showChoice={this.handleChoice} placeholder="Уточнение" options={this.Classificator[4]} iden="SUB_PROBLEM" blocked={true} initial={this.state.form_data.sub_problem} />
                                </div>
                                <TextAreaField rdonly={true} ref={this.textAreaRef} initial={this.state.form_data.choice} />
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', marginTop: '20px', width: '90%'}}>
                                    <h2 className="lbl">Аннотация:</h2>
                                    <TextAreaField rdonly={false} initial={this.state.form_data.desc} fieldName="desc" onLeave={this.handleFieldLeave} />
                                </div>
                            </div>
                        }
                        {this.state.tabToRender === 'resol' &&
                            <div>
                                <div style={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
                                    <SelectField fieldName="author" placeholder="Автор" options={['Дада я', 'Kemical', 'Empty lol']} initial={this.state.form_data.author} onChoice={this.handleFieldLeave} />
                                    <SelectField fieldName="resolut" placeholder="Резолюция" options={['Направлено на рассмотрение с ответом', 'Направлено на рассмотрение с ответом (контроль)', 'Проверка']} initial={this.state.form_data.resolut} onChoice={this.handleFieldLeave} />
                                </div>
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                    <h2 className="lbl" style={{marginRight:'10px'}}>Дата передачи на исполнение:</h2>
                                    <DatePickerField datepicked={this.state.form_data.handover_date} fieldName="handover_date" onChoice={this.handleFieldLeave} />
                                    <h2 className="lbl" style={{marginRight:'10px', marginLeft: '20px'}}>Срок исполнения:</h2>
                                    <DatePickerField datepicked={this.state.form_data.fullfil_term} fieldName="fullfil_term" onChoice={this.handleFieldLeave} />
                                </div>
                                {/* <InputField type="text" placeholder="Результат" />
                                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'flex-start', alignItems:'center', margin:'10px 0px'}}>
                                    <h2 className="lbl" style={{marginRight:'10px'}}>Исполнен:</h2>
                                    <DatePickerField datepicked={null} />
                                </div> */}
                            </div>
                        }
                    </div>
                </div>
                <hr className="line"></hr>
                <div style={{backgroundColor:'inherit', display:'flex', justifyContent:'center', alignItems:'center', margin:'10px 0px', width:'100%'}}>
                    {!this.state.loading && <button className="app_button_blue" onClick={this.addProblem} style={{marginRight: '10px', padding: '10px', borderWidth: '0px'}}>Подтвердить</button>}
                    {this.state.loading && <LoadingAnim className="loading_anim__add_prob"/>}
                </div>
            </form>
        )
    }
}

export { AddUserForm }