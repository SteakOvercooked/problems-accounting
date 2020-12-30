import React from 'react'
import { ProblemCard } from './ProblemCard.js'
import NoRecords from '../static/images/no_records.svg'

class PeopleContainer extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div id="people_cont__main_wrapper">
                <div id="table_headers">
                    <h2 className="table_header_item">Дата обращения</h2>
                    <h2 className="table_header_item">Номер обращения</h2>
                    <h2 className="table_header_item">Обратившийся</h2>
                    <h2 className="table_header_item">Ответственный</h2>
                    <h2 className="table_header_item">Описание</h2>
                </div>
                <div id="people_container">
                    <ProblemCard data={{handover_date: '2020-10-15', number: '114 GT', respon: 'Прядько А.А.', fio: 'Волкова А.Т.', desc: 'По устройству гаражного массива'}} />
                    <ProblemCard data={{handover_date: '2020-11-12', number: '115 GT', respon: 'Валерьев Б.С.', fio: 'Птицин А.Е.', desc: 'Некорректная работа водохранилища'}}/>
                    <ProblemCard data={{handover_date: '2020-11-01', number: '116 SX', respon: 'Прядько А.А.', fio: 'Залещук В.Ф.', desc: 'Путевки в Адлер'}}/>
                </div>
            </div>
        )
    }
}

export { PeopleContainer }