import React from "react";
import moment from 'moment';

var _ = require('lodash');

class Calendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMonth: new Date(),
            selectedDate: new Date()
        };
        this.renderHeader = this.renderHeader.bind(this);
        this.renderDays = this.renderDays.bind(this);
        this.renderCells = this.renderCells.bind(this);
        this.onDateClick = this.onDateClick.bind(this);
        this.nextMonth = this.nextMonth.bind(this);
        this.prevMonth = this.prevMonth.bind(this);
    }
    renderHeader() {
        return (
            <div className="header row flex-middle">
                <div className="col col-start">
                    <span className='p'>
                        { moment(this.state.currentMonth).format('MMMM, YYYY') }
                    </span>
                </div>
                <div className="col col-center" onClick={this.prevMonth}>
                    <div className="icon"><i className="fas fa-long-arrow-alt-left"></i></div>
                </div>
                <div className="col col-end" onClick={this.nextMonth}>
                    <div className="icon"><i className="fas fa-long-arrow-alt-right"></i></div>
                </div>
            </div>
        );
    }
    renderDays() {
        const days = [];
        let startDate = moment(this.state.currentMonth).startOf('week');
        
        for (let i = 0; i < 7; i++) {
            days.push(
                <div className="col col-center" key={i}>
                    { moment(moment(startDate).add(i, 'days')).format('ddd') }
                </div>
            );
        }

        return <div className="days row">{days}</div>;
    }
    renderCells() {
        const { currentMonth, selectedDate } = this.state;
        const monthStart = moment(currentMonth).startOf('M');
        const monthEnd = moment(monthStart).endOf('M');
        const startDate = moment(monthStart).startOf('week');
        const endDate = moment(monthEnd).endOf('week');
        
        const rows = [];

        let days = [];
        let day = startDate;
        let formattedDate = "";
        let names = [];
        let _event_dates = [];
        
        _.each(_.map(this.props.EVENTS, i => _.pick(i, '_date_start', '_days')), (value) => {
            const m = moment(value._date_start).format('YYYY-MM-DD');
            _.range(value._days).forEach((current, index, range) => {
                _event_dates.push(moment(m.toString()).add(index, 'day').format('YYYY-MM-DD'));
            });
        });

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                formattedDate = moment(day).format('D');
                const cloneDay = day;
                names = _.map(_.filter(this.props.STUDENTS, (item) => { return _.isEqual(moment(item._dateofbirth).format('MMMM Do'), moment(day).format('MMMM Do')) }), (student) => { return '['+student._first_name+']'; });
                
                days.push(
                    <div
                    className={`col cell ${
                        ! moment(day).isSame(monthStart, 'month')
                        ? "disabled"
                        : moment(day).isSame(selectedDate, 'day')
                        ? "selected"
                        : _.includes(_.map(_.map(this.props.STUDENTS, '_dateofbirth'), (item) => { return moment(item).format('MMMM Do') }), moment(day).format('MMMM Do'))
                        ? "birthday "+names
                        : _.includes(_.map(_event_dates, (item) => { return moment(item).format('MMMM Do') }), moment(day).format('MMMM Do'))
                        ? "event ["+_.map(_.filter(this.props.EVENTS, (event) => { return moment(day).isSame(moment(event._date_start), 'day') || moment(day).isBetween(moment(event._date_start), moment(event._date_start).add(event._days, 'day'), 'day') }), '_name')+"] ["+_.map(_.filter(this.props.EVENTS, (event) => { return moment(day).isSame(moment(event._date_start), 'day') || moment(day).isBetween(moment(event._date_start), moment(event._date_start).add(event._days, 'day'), 'day') }), '_type')+"]"
                        : ""
                    }`}
                    key={day}
                    onClick={() => this.onDateClick( moment(cloneDay) )}
                    >
                        <span className="number">{formattedDate}</span>
                        <span className="bg">{formattedDate}</span>
                    </div>
                );
                day = moment(day).add(1, 'days');
            }
            rows.push(
                <div className="row" key={day}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="body">{rows}</div>;
    }
    onDateClick(day) {
        this.setState({
            selectedDate: day
        });
    }
    nextMonth() {
        this.setState({
            currentMonth: moment(this.state.currentMonth).add(1, 'M').format('MMMM YYYY')
        });
    }
    prevMonth() {
        this.setState({
            currentMonth: moment(this.state.currentMonth).subtract(1, 'M').format('MMMM YYYY')
        });
    }
    render() {
        return (
            <div className="calendar">
                <h4>Calendar.</h4>
                {this.renderHeader()}
                {this.renderDays()}
                {this.renderCells()}
            </div>
        )
    }
}

export default Calendar;