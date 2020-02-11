import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Footer from '../Footer/Footer';
import Calendar from './Calendar';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import Fingerprint from 'fingerprintjs';
import API from '../../utils/API';
import Clock from 'react-live-clock';
import $ from 'jquery';

var _ = require('lodash');

class Dashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _user: {},
            _classroom: {},
            _student: {},
            _students: [],
            _first_parent: {},
            _second_parent: {},
            _guardian: {},
            _school: {},
            _classroom_subject: '',
            _attendance_by_classrooms: '',
            _attendance_by_options: '',
            _attendance_by_classrooms_modal: '',
            _attendance_by_options_modal: '',
            _subject: {},
            _module: {},
            _session: {},
            _course: {},
            _event: {},
            _events: [],
            _attendance_date: moment().format('MMM DD, YYYY'),
            _dayAttended: false,
            _attendance: [],
        };

        this.handleChangeField = this.handleChangeField.bind(this);

        /* CLASSROOM */
        this.handleSubmitClassroom = this.handleSubmitClassroom.bind(this);
        this.handleDeleteClassroom = this.handleDeleteClassroom.bind(this);
        this.handleEditClassroom = this.handleEditClassroom.bind(this);

        /* STUDENT */
        this.handleSubmitStudent = this.handleSubmitStudent.bind(this);
        this.handleDeleteStudent = this.handleDeleteStudent.bind(this);
        this.handleEditStudent = this.handleEditStudent.bind(this);
        this.handleSubmitAttendance = this.handleSubmitAttendance.bind(this);

        /* SUBJECT */
        this.handleSubmitSubject = this.handleSubmitSubject.bind(this);
        this.handleDeleteSubject = this.handleDeleteSubject.bind(this);
        this.handleEditSubject = this.handleEditSubject.bind(this);

        /* MODULE */
        this.handleSubmitModule = this.handleSubmitModule.bind(this);
        this.handleDeleteModule = this.handleDeleteModule.bind(this);
        this.handleEditModule = this.handleEditModule.bind(this);

        /* COURSE */
        this.handleSubmitCourse = this.handleSubmitCourse.bind(this);
        this.handleDeleteCourse = this.handleDeleteCourse.bind(this);
        this.handleEditCourse = this.handleEditCourse.bind(this);

        /* EVENT */
        this.handleSubmitEvent = this.handleSubmitEvent.bind(this);
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this);
        this.handleEditEvent = this.handleEditEvent.bind(this);
        
        this.get_user = this.get_user.bind(this);

        this.getBusinessDays = this.getBusinessDays.bind(this);
    }

    componentDidMount() {
        const { onLoadClassroom, onLoadStudent, onLoadSubject, onLoadModule, onLoadCourse, onLoadEvent } = this.props;
        const self = this;

        this.get_user()
        .then(() => {
            const { _user } = self.state;

            /* CLASSROOMS */
            axios('http://localhost:8800/api/classrooms')
            .then((res) => {
                let obj = {
                    classrooms: _.filter(res.data.classrooms, {'_teacher': _user._id})
                }
                onLoadClassroom(obj)
                self.setState({
                    _attendance_by_classrooms_modal: _.get(_.head(_.filter(res.data.classrooms, {'_teacher': _user._id})), '_id', 'default'),
                    _classroom_subject: _.get(_.head(_.filter(res.data.classrooms, {'_teacher': _user._id})), '_id', 'default'),
                    _attendance_by_classrooms: _.get(_.head(_.filter(res.data.classrooms, {'_teacher': _user._id})), '_id', 'default'),
                });

                /* STUDENTS */
                axios('http://localhost:8800/api/students')
                .then((res) => {
                    let obj_students = {
                        students: _.filter(res.data.students, (S) => {
                            return _.includes(_.map(obj.classrooms, '_id'), S._classroom);
                        })
                    }
                    onLoadStudent(obj_students);
                    
                    const { _attendance_by_options_modal, _attendance_by_classrooms_modal, _attendance_date } = this.state;
                    const _Ss = _.filter(_.orderBy(obj_students.students, [_attendance_by_options_modal === '_by_last_name' ? '_last_name' : _attendance_by_options_modal === '_by_first_name' ? '_first_name' : _attendance_by_options_modal === '_by_age' ? '_dateofbirth' : '_registration_number'], ['asc']), {'_classroom': _attendance_by_classrooms_modal})
                    
                    _.filter(_.map(_Ss, '_attendance'), (_A) => { 
                        self.setState({
                            _dayAttended: moment(_A._date).isSame(moment(_attendance_date)),
                            _students: obj_students.students,
                        });
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });

                /* SUBJECTS */
                axios('http://localhost:8800/api/subjects')
                .then((res) => {
                    let obj_subjects = {
                        subjects: _.filter(res.data.subjects, (S) => {
                            return _.includes(_.map(obj.classrooms, '_id'), S._classroom);
                        })
                    }
                    onLoadSubject(obj_subjects)

                    /* MODULES */
                    axios('http://localhost:8800/api/modules')
                    .then((res) => {
                        let obj_modules = {
                            modules: _.filter(res.data.modules, (M) => {
                                return _.includes(_.map(obj_subjects.subjects, '_id'), M._subject);
                            })
                        }
                        onLoadModule(obj_modules)
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });

                    /* COURSES */
                    axios('http://localhost:8800/api/courses')
                    .then((res) => {
                        let obj_courses = {
                            courses: _.filter(res.data.courses, (C) => {
                                return _.includes(_.map(obj_subjects.subjects, '_id'), C._subject);
                            })
                        }
                        onLoadCourse(obj_courses)
                    })
                    .catch(function (error) {
                        // handle error
                        console.log(error);
                    });
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });

            axios('http://localhost:8800/api/events')
            .then((res) => onLoadEvent(res.data))
            .then((res) => {
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            });
        });

        this._handleTap('_students');
        this._handleTap('_classrooms');
        this._handleTap('_subjects');
        this._handleTap('_modules');
        this._handleTap('_courses');

        $('.tab-pane').addClass('animated');
        $('.tab-pane').addClass('faster');
        $('.nav_link').click((event) => {

            let _li_parent = $(event.target).parent().parent();
            let _li_target = $($(event.target).attr('href'));
            let _link_target = $(event.target);

            //$('.tab-pane').not(_li_target).addClass('zoomOut');
            //$('.tab-pane').not(_li_target).removeClass('zoomIn');
            $(".nav li").not(_li_parent).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('show');
            $(".nav_link").not(_link_target).removeClass('active');
            $('.nav_link').not(_link_target).removeClass('show');

            //$(_li_target).removeClass('zoomOut');
            //$(_li_target).addClass('zoomIn');
            $(_li_parent).addClass('active');
            $(_li_target).addClass('active');
            $(_li_target).addClass('show');
            $(_link_target).addClass('active');
            $(_link_target).addClass('show');

        });

        this._handleSort('classrooms_list');
        this._handleSort('students_list');
        this._handleSort('subjects_list');
        this._handleSort('modules_list');
        this._handleSort('courses_list');

        this._handleFilter();

        this._handleSteps('_student_box');
        this._handleSteps('_course_box');

        $('input.datepicker').datepicker({
            dateFormat: 'yy-mm-dd',
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true,
            defaultDate: +0,
            showAnim: "fold",
            onSelect: function(dateText, ev) {
                if(($(this)[0].$el)[0].id === "_dateofbirth"){
                    self.setState(prevState => ({
                        _student: {                   // object that we want to update
                            ...prevState._student,    // keep all other key-value pairs
                            _dateofbirth: moment(dateText).format('MMM DD, YYYY')       // update the value of specific key
                        }
                    }));
                }
                if(($(this)[0].$el)[0].id === "_registration_date"){
                    self.setState(prevState => ({
                        _student: {                   // object that we want to update
                            ...prevState._student,    // keep all other key-value pairs
                            _registration_date: moment(dateText).format('MMM DD, YYYY')       // update the value of specific key
                        }
                    }));
                }
                if(($(this)[0].$el)[0].id === "_date_start_event"){
                    self.setState(prevState => ({
                        _event: {                   // object that we want to update
                            ...prevState._event,    // keep all other key-value pairs
                            _date_start: moment(dateText).format('MMM DD, YYYY')       // update the value of specific key
                        }
                    }));
                }
                if(($(this)[0].$el)[0].id === "_attendance_date"){
                    const { _attendance_by_options_modal, _attendance_by_classrooms_modal, _students } = self.state;
                    const _Ss = _.filter(_.orderBy(_students, [_attendance_by_options_modal === '_by_last_name' ? '_last_name' : _attendance_by_options_modal === '_by_first_name' ? '_first_name' : _attendance_by_options_modal === '_by_age' ? '_dateofbirth' : '_registration_number'], ['asc']), {'_classroom': _attendance_by_classrooms_modal})
                    _.filter(_.map(_Ss, '_attendance'), (_A) => {
                        self.setState({
                            _dayAttended: moment(_A._date).isSame(moment(dateText)),
                        });
                    });
                    self.setState(prevState => ({
                        _attendance_date: moment(dateText).format('MMM DD, YYYY'),
                    }));
                }
            },
        });
        $('.datepicker.sample').datepicker({
            dateFormat: 'yy-mm-dd',
            showButtonPanel: true,
            changeMonth: true,
            changeYear: true,
            defaultDate: +0,
            showAnim: "fold"
        });

        document.getElementById('dashboard_page').parentElement.style.height = 'initial';
    }

    _handleSteps(_class) {
        $('.next-button').click(function(){
            var current = $(this).parent();
            var next = $(this).parent().next();
            $(".progress li").eq($("."+_class+"").index(next)).addClass("active");
            current.hide();
            next.show();
        });
        $('.prev-button').click(function(){
            var current = $(this).parent();
            var prev = $(this).parent().prev()
            $(".progress li").eq($("."+_class+"").index(current)).removeClass("active");
            current.hide();
            prev.show();
        });
    }
    _handleFilter() {
        (function(document) {
            'use strict';
            var LightTableFilter = (function(Arr) {
                var _input;
                function _onInputEvent(e) {
                    _input = e.target;
                    var tables = document.getElementsByClassName(_input.getAttribute('data-table'));
                    Arr.forEach.call(tables, function(table) {
                        Arr.forEach.call(table.tBodies, function(tbody) {
                            Arr.forEach.call(tbody.rows, _filter);
                        });
                    });
                }
        
                function _filter(row) {
                    var text = row.textContent.toLowerCase(), val = _input.value.toLowerCase();
                    row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
                }
        
                return {
                    init: function() {
                        var inputs = document.getElementsByClassName('light-table-filter');
                        Arr.forEach.call(inputs, function(input) {
                            input.oninput = _onInputEvent;
                        });
                    }
                };
            })(Array.prototype);
            document.addEventListener('readystatechange', function() {
                if (document.readyState === 'complete') {
                    LightTableFilter.init();
                }
            });
        })(document);
    }
    _handleSort(_class) {
        // sort start
        function sortTable(f, n, i, _class) {            
            $('.'+_class+' ._arrow').remove();

            $(i).append('<div class="_arrow"></div>');

            var rows = $("."+_class+" tbody tr").get();
            rows.sort(function(a, b) {
                var A = getVal(a);
                var B = getVal(b);
                if (A < B) {
                    return -1 * f;
                }
                if (A > B) {
                    return 1 * f;
                }
                return 0;
            });
            function getVal(elm) {
                var v = $(elm).children("td").eq(n).text().toUpperCase();
                if ($.isNumeric(v)) {
                    v = parseInt(v, 10);
                }
                return v;
            }
            $.each(rows, function(index, row) {
                $("."+_class+"").children("tbody").append(row);
            });

            if(getVal(_.first(rows)) < getVal(_.last(rows))){
                $('.'+_class+' ._arrow').html('<i class="fas fa-caret-down"></i>');
            }else {
                $('.'+_class+' ._arrow').html('<i class="fas fa-caret-up"></i>');
            }
        }

        var f_thisTh = 1;

        $("."+_class+" th:not(._empty)", this.id).click(function(event) {
            if(_.startsWith(event.target.className, 'fas')){
                f_thisTh *= -1;
                var n = $(this).parent().parent().prevAll().length;
                var i = event.target.parentNode.parentNode;
                sortTable(f_thisTh, n, i, _class);
            }
            else {
                f_thisTh *= -1;
                var n = $(this).prevAll().length;
                var i = event.target;
                sortTable(f_thisTh, n, i, _class);
            }
        });
        
        $('.'+_class+' th:not(._empty)').append('<div class="_arrow"></div>');
        $('._arrow').html('<i class="fas fa-sort"></i>');
        // sort end 
    }

    async get_user() {
        const self = this;
        try {
            const { data } = await API.get_user(localStorage.getItem('email'));
            self.setState( prevState => ({
                _user: data.user
            }), () => {
                axios(`http://localhost:8800/api/schools/${data.user.school}`)
                .then(function (response) {
                    // handle success
                    self.setState({
                        _school: response.data.school,
                    })
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.classroomToEdit) {
            this.setState({
                _classroom: nextProps.classroomToEdit,
            })
        }
        if(nextProps.studentToEdit) {
            this.setState({
                _student: nextProps.studentToEdit,
            })
        }
        if(nextProps.subjectToEdit) {
            this.setState({
                _subject: nextProps.subjectToEdit,
            })
        }
        if(nextProps.moduleToEdit) {
            this.setState({
                _module: nextProps.moduleToEdit,
            })
        }
        if(nextProps.courseToEdit) {
            this.setState({
                _course: nextProps.courseToEdit,
            })
        }
        if(nextProps.eventToEdit) {
            this.setState({
                _event: nextProps.eventToEdit,
            })
        }
    }

    /* CLASSROOM */
    handleSubmitClassroom(){
        const { _user } = this.state;
        this.setState(prevState => ({
            _classroom: {
                ...prevState._classroom,
                _school: _user.school,
                _teacher: _user._id,
            },
        }), () => {
            const { onSubmitClassroom, classroomToEdit, onEditClassroom } = this.props;
            const { _code, _name, _grade, _section, _school, _teacher, _subjects, _students } = this.state._classroom;
            const self = this;
            if(!classroomToEdit) {
                return axios.post('http://localhost:8800/api/classrooms', {
                    _code,
                    _name,
                    _grade,
                    _section,
                    _school,
                    _teacher,
                    _subjects,
                    _students,
                })
                    .then((res) => onSubmitClassroom(res.data))
                    .then(function() {
                        self.setState(prevState => ({ 
                            _classroom: {
                                ...prevState._classroom,
                                _code: '',
                                _name: '',
                                _grade: '',
                                _section: '',
                                _school: '',
                                _teacher: '',
                                _subjects: [],
                                _students: [],
                            }
                        }));
                        $('#_classroom_modal').modal('toggle');
                    });
            } else {
                return axios.patch(`http://localhost:8800/api/classrooms/${classroomToEdit._id}`, {
                    _code,
                    _name,
                    _grade,
                    _section,
                    _school,
                    _teacher,
                    _subjects,
                    _students,
                })
                    .then((res) => onEditClassroom(res.data))
                    .then(function() {
                        self.setState(prevState => ({ 
                            _classroom: {
                                ...prevState._classroom,
                                _code: '',
                                _name: '',
                                _grade: '',
                                _section: '',
                                _school: '',
                                _teacher: '',
                                _subjects: [],
                                _students: [],
                            }
                        }));
                        $('#_classroom_modal').modal('toggle');
                    });
            }
        });
    }
    handleDeleteClassroom(id) {
        const { onDeleteClassroom } = this.props;
        return axios.delete(`http://localhost:8800/api/classrooms/${id}`)
            .then(() => onDeleteClassroom(id));
    }
    handleEditClassroom(classroom) {
        const { setEditClassroom } = this.props;
        setEditClassroom(classroom);
    }
    
    /* STUDENT */
    handleSubmitStudent(){
        const { _first_parent, _second_parent, _guardian } = this.state;
        this.setState(prevState => ({
            _student: {
                ...prevState._student,
                _first_parent: _first_parent,
                _second_parent: _second_parent,
                _guardian: _guardian,
            }
        }), () => {
            const { _user } = this.state;
            const { onSubmitStudent, studentToEdit, onEditStudent } = this.props;
            const { _registration_number, _first_name, _last_name, _classroom, _gender, _dateofbirth, _registration_date, _attendance, _first_parent, _second_parent, _guardian } = this.state._student;
            const self = this;
            if(!studentToEdit) {
                return axios.post('http://localhost:8800/api/students', {
                    _registration_number,
                    _first_name,
                    _last_name,
                    _classroom,
                    _gender,
                    _dateofbirth,
                    _registration_date,
                    _attendance,
                    _first_parent,
                    _second_parent,
                    _guardian,
                })
                    .then((res) => onSubmitStudent(res.data))
                    .then(function() {
                        self.setState(prevState => ({ 
                            _student: {
                                ...prevState._student,
                                _registration_number: '',
                                _first_name: '',
                                _last_name: '',
                                _classroom: '',
                                _gender: '',
                                _dateofbirth: '',
                                _registration_date: '',
                                _attendance: [],
                                _first_parent: {},
                                _second_parent: {},
                                _guardian: {},
                            }
                        }));
                        $('#_student_modal').modal('toggle');
                    });
            } else {
                return axios.patch(`http://localhost:8800/api/students/${studentToEdit._id}`, {
                    _registration_number,
                    _first_name,
                    _last_name,
                    _classroom,
                    _gender,
                    _dateofbirth,
                    _registration_date,
                    _attendance,
                    _first_parent,
                    _second_parent,
                    _guardian,
                })
                    .then((res) => onEditStudent(res.data))
                    .then(function() {
                        self.setState(prevState => ({ 
                            _student: {
                                ...prevState._student,
                                _registration_number: '',
                                _first_name: '',
                                _last_name: '',
                                _classroom: '',
                                _gender: '',
                                _dateofbirth: '',
                                _registration_date: '',
                                _attendance: [],
                                _first_parent: {},
                                _second_parent: {},
                                _guardian: {},
                            }
                        }));
                        $('#_student_modal').modal('toggle');
                    });
            }
        });
    }
    handleDeleteStudent(id) {
        const { onDeleteStudent } = this.props;
        return axios.delete(`http://localhost:8800/api/students/${id}`)
            .then(() => onDeleteStudent(id));
    }
    handleEditStudent(student) {
        const { setEditStudent } = this.props;
        setEditStudent(student);
    }
    handleSubmitAttendance(){
        const self = this;
        const { _attendance_by_options_modal, _attendance_by_classrooms_modal, _students, _attendance_date } = self.state;
        _.filter(_.orderBy(_students, [_attendance_by_options_modal === '_by_last_name' ? '_last_name' : _attendance_by_options_modal === '_by_first_name' ? '_first_name' : _attendance_by_options_modal === '_by_age' ? '_dateofbirth' : '_registration_number'], ['asc']), {'_classroom': _attendance_by_classrooms_modal}).map((student, index) => {
            self.handleEditStudent(student);
            const attendance_value_per_student = $('form#form_'+index+' input[type=radio]:checked').val();

            if(_.includes(student._attendance, _attendance_date)){
                console.log('bgha y modifier ezzamel');
            } else {
                self.setState(prevState => ({
                    _attendance: [...student._attendance, {_date: _attendance_date, _status: attendance_value_per_student, _checked_at: moment().format()}],
                }), () => {
                    const { onEditStudent } = self.props;
                    const { _attendance } = self.state;
                    const { _registration_number, _first_name, _last_name, _classroom, _gender, _dateofbirth, _registration_date, _first_parent, _second_parent, _guardian } = student;
                    
                    return axios.patch(`http://localhost:8800/api/students/${student._id}`, {
                        _registration_number,
                        _first_name,
                        _last_name,
                        _classroom,
                        _gender,
                        _dateofbirth,
                        _registration_date,
                        _attendance,
                        _first_parent,
                        _second_parent,
                        _guardian,
                    })
                        .then((res) => onEditStudent(res.data))
                        .then((res) => {
                            
                            var index = _.findIndex(_students, {id: _.get(res.data.student, '_id')});
                            //khessni n updater state li hya students wlkn rah tableau dial les objets li tbedel fihum wa7ed tableau dial objets, wa tfrgue3
                            self.setState(prevState => ({
                                _students: {
                                    ...prevState._students,
                                    [prevState._students[index]]: res.data.student,
                                },
                            }));
                        });
                });
            }
        });
    }
    
    /* SUBJECT */
    handleSubmitSubject(){
        const { onSubmitSubject, subjectToEdit, onEditSubject } = this.props;
        const { _name, _classroom} = this.state._subject;
        const self = this;

        if(!subjectToEdit) {
            return axios.post('http://localhost:8800/api/subjects', {
                _name,
                _classroom,
            })
                .then((res) => onSubmitSubject(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _subject: {
                            ...prevState._subject,
                            _name: '',
                            _classroom: '',
                        }
                    }));
                    $('#_subject_modal').modal('toggle');
                });
        } else {
            return axios.patch(`http://localhost:8800/api/subjects/${subjectToEdit._id}`, {
                _name,
                _classroom,
            })
                .then((res) => onEditSubject(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _subject: {
                            ...prevState._subject,
                            _name: '',
                            _classroom: '',
                        }
                    }));
                    $('#_subject_modal').modal('toggle');
                });
        }
    }
    handleDeleteSubject(id) {
        const { onDeleteSubject } = this.props;
        return axios.delete(`http://localhost:8800/api/subjects/${id}`)
            .then(() => onDeleteSubject(id));
    }
    handleEditSubject(subject) {
        const { setEditSubject } = this.props;
        setEditSubject(subject);
    }
    
    /* MODULE */
    handleSubmitModule(){
        const { onSubmitModule, moduleToEdit, onEditModule } = this.props;
        const self = this;

        if(!moduleToEdit) {
            const { _name, _sessions, _subject } = this.state._module;
            return axios.post('http://localhost:8800/api/modules', {
                _name,
                _sessions,
                _subject,
            })
                .then((res) => onSubmitModule(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _module: {
                            ...prevState._module,
                            _name: '',
                            _sessions: [],
                            _subject: '',
                        }
                    }));
                    $('#_module_modal').modal('toggle');
                });
        } else {
            const { _session } = this.state;
            this.setState(prevState => ({
                _module: {
                    ...prevState._module,
                    _sessions: [...prevState._module._sessions, _session],
                }
            }), () => {
                const { _name, _sessions, _subject } = this.state._module;
                return axios.patch(`http://localhost:8800/api/modules/${moduleToEdit._id}`, {
                    _name,
                    _sessions,
                    _subject,
                })
                    .then((res) => onEditModule(res.data))
                    .then(function() {
                        self.setState(prevState => ({
                            _module: {
                                ...prevState._module,
                                _name: '',
                                _sessions: [],
                                _subject: '',
                            },
                            _session: {
                                ...prevState._session,
                                _period_in_minutes: '',
                            },
                        }));
                        $('#_module_modal').modal('toggle');
                    });
            });
            
        }
    }
    handleDeleteModule(id) {
        const { onDeleteModule } = this.props;
        return axios.delete(`http://localhost:8800/api/modules/${id}`)
            .then(() => onDeleteModule(id));
    }
    handleEditModule(module) {
        const { setEditModule } = this.props;
        setEditModule(module);
    }
    handleAddModule(subject) {
        this.setState(prevState => ({
            _module: {                   // object that we want to update
                ...prevState._module,    // keep all other key-value pairs
                _subject: subject._id       // update the value of specific key
            }
        }));
    }
    
    /* COURSE */
    handleSubmitCourse(){
        const { _user } = this.state;
        const { onSubmitCourse, courseToEdit, onEditCourse, subjectToEdit } = this.props;
        const { _name, _abilities_inview, _sessions, _subject} = this.state._course;
        const self = this;

        if(!subjectToEdit) {
            return axios.post('http://localhost:8800/api/subjects', {
                _name,
                _abilities_inview,
                _sessions,
                _subject,
            })
                .then((res) => onSubmitCourse(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _course: {
                            ...prevState._course,
                            _name: '',
                            _abilities_inview: '',
                            _sessions: '',
                            _subject: '',
                        }
                    }));
                    $('#_course_modal').modal('toggle');
                });
        } else {
            return axios.patch(`http://localhost:8800/api/subjects/${courseToEdit._id}`, {
                _name,
                _abilities_inview,
                _sessions,
                _subject,
            })
                .then((res) => onEditCourse(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _course: {
                            ...prevState._course,
                            _name: '',
                            _abilities_inview: '',
                            _sessions: '',
                            _subject: '',
                        }
                    }));
                    $('#_course_modal').modal('toggle');
                });
        }
    }
    handleDeleteCourse(id) {
        const { onDeleteCourse } = this.props;
        return axios.delete(`http://localhost:8800/api/courses/${id}`)
            .then(() => onDeleteCourse(id));
    }
    handleEditCourse(course) {
        const { setEditCourse } = this.props;
        setEditCourse(course);
    }
    
    /* EVENT */
    handleSubmitEvent(){
        const { _user } = this.state;
        const { onSubmitEvent, eventToEdit, onEditEvent } = this.props;
        const { _name, _date_start, _days, _type } = this.state._event;
        const self = this;

        if(!eventToEdit) {
            return axios.post('http://localhost:8800/api/events', {
                _name,
                _date_start,
                _days,
                _type,
            })
                .then((res) => onSubmitEvent(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _event: {
                            ...prevState._event,
                            _name: '',
                            _date_start: '',
                            _days: '',
                            _type: '',
                        }
                    }));
                    $('#_event_modal').modal('toggle');
                });
        } else {
            return axios.patch(`http://localhost:8800/api/events/${eventToEdit._id}`, {
                _name,
                _date_start,
                _days,
                _type,
            })
                .then((res) => onEditEvent(res.data))
                .then(function() {
                    self.setState(prevState => ({ 
                        _event: {
                            ...prevState._event,
                            _name: '',
                            _date_start: '',
                            _days: '',
                            _type: '',
                        }
                    }));
                    $('#_event_modal').modal('toggle');
                });
        }
    }
    handleDeleteEvent(id) {
        const { onDeleteEvent } = this.props;
        return axios.delete(`http://localhost:8800/api/events/${id}`)
            .then(() => onDeleteEvent(id));
    }
    handleEditEvent(event) {
        const { setEditEvent } = this.props;
        setEditEvent(event);
    }

    handleChangeField(key, event) {
        const _val = event.target.value;
        const _target = event.target;
        if(key === "_code" || key === "_name" || key === "_grade" || key === "_section"){
            if(key === "_code") {
                this.setState(prevState => ({
                    _classroom: {                   // object that we want to update
                        ...prevState._classroom,    // keep all other key-value pairs
                        _code: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_name") {
                this.setState(prevState => ({
                    _classroom: {                   // object that we want to update
                        ...prevState._classroom,    // keep all other key-value pairs
                        _name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_grade") {
                this.setState(prevState => ({
                    _classroom: {                   // object that we want to update
                        ...prevState._classroom,    // keep all other key-value pairs
                        _grade: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_section") {
                this.setState(prevState => ({
                    _classroom: {                   // object that we want to update
                        ...prevState._classroom,    // keep all other key-value pairs
                        _section: _val       // update the value of specific key
                    }
                }));
            }
        }
        if(key === "_registration_number" || key === "_first_name" || key === "_last_name" || key === "_classroom" || key === "_gender" || key === "_dateofbirth" || key === "_registration_date" || _.endsWith(key, "_first_parent") || _.endsWith(key, "_second_parent") || _.endsWith(key, "_guardian")) {
            if(key === "_registration_number"){
                this.setState(prevState => ({
                    _student: {                   // object that we want to update
                        ...prevState._student,    // keep all other key-value pairs
                        _registration_number: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_first_name"){
                this.setState(prevState => ({
                    _student: {                   // object that we want to update
                        ...prevState._student,    // keep all other key-value pairs
                        _first_name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_last_name"){
                this.setState(prevState => ({
                    _student: {                   // object that we want to update
                        ...prevState._student,    // keep all other key-value pairs
                        _last_name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_gender"){
                this.setState(prevState => ({
                    _student: {                   // object that we want to update
                        ...prevState._student,    // keep all other key-value pairs
                        _gender: _val       // update the value of specific key
                    }
                }));
            }
            
            if(key === "_classroom") {
                this.setState(prevState => ({
                    _student: {                   // object that we want to update
                        ...prevState._student,    // keep all other key-value pairs
                        _classroom: _val       // update the value of specific key
                    }
                }));
            }

            if(key === "_full_name_first_parent"){
                this.setState(prevState => ({
                    _first_parent: {                   // object that we want to update
                        ...prevState._first_parent,    // keep all other key-value pairs
                        _full_name_first_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_gender_first_parent"){
                this.setState(prevState => ({
                    _first_parent: {                   // object that we want to update
                        ...prevState._first_parent,    // keep all other key-value pairs
                        _gender_first_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_adresse_first_parent"){
                this.setState(prevState => ({
                    _first_parent: {                   // object that we want to update
                        ...prevState._first_parent,    // keep all other key-value pairs
                        _adresse_first_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_phone_first_parent"){
                this.setState(prevState => ({
                    _first_parent: {                   // object that we want to update
                        ...prevState._first_parent,    // keep all other key-value pairs
                        _phone_first_parent: _val       // update the value of specific key
                    }
                }));
            }

            if(key === "_full_name_second_parent"){
                this.setState(prevState => ({
                    _second_parent: {                   // object that we want to update
                        ...prevState._second_parent,    // keep all other key-value pairs
                        _full_name_second_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_gender_second_parent"){
                this.setState(prevState => ({
                    _second_parent: {                   // object that we want to update
                        ...prevState._second_parent,    // keep all other key-value pairs
                        _gender_second_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_adresse_second_parent"){
                this.setState(prevState => ({
                    _second_parent: {                   // object that we want to update
                        ...prevState._second_parent,    // keep all other key-value pairs
                        _adresse_second_parent: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_phone_second_parent"){
                this.setState(prevState => ({
                    _second_parent: {                   // object that we want to update
                        ...prevState._second_parent,    // keep all other key-value pairs
                        _phone_second_parent: _val       // update the value of specific key
                    }
                }));
            }

            if(key === "_full_name_guardian"){
                this.setState(prevState => ({
                    _guardian: {                   // object that we want to update
                        ...prevState._guardian,    // keep all other key-value pairs
                        _full_name_guardian: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_gender_guardian"){
                this.setState(prevState => ({
                    _guardian: {                   // object that we want to update
                        ...prevState._guardian,    // keep all other key-value pairs
                        _gender_guardian: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_adresse_guardian"){
                this.setState(prevState => ({
                    _guardian: {                   // object that we want to update
                        ...prevState._guardian,    // keep all other key-value pairs
                        _adresse_guardian: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_phone_guardian"){
                this.setState(prevState => ({
                    _guardian: {                   // object that we want to update
                        ...prevState._guardian,    // keep all other key-value pairs
                        _phone_guardian: _val       // update the value of specific key
                    }
                }));
            }
        }
        if(key === "_attendance_by_classrooms_modal") {
            this.setState(prevState => ({
                _attendance_by_classrooms_modal: _val
            }));
        }
        if(key === "_attendance_by_classrooms") {
            this.setState(prevState => ({
                _attendance_by_classrooms: _val
            }));
        }
        if(key === "_attendance_by_options_modal") {
            this.setState(prevState => ({
                _attendance_by_options_modal: _val
            }));
        }
        if(key === "_attendance_by_options") {
            this.setState(prevState => ({
                _attendance_by_options: _val
            }));
        }
        if(key === "_classroom_subject") {
            this.setState(prevState => ({
                _classroom_subject: _val
            }));
        }
        if(key === "_name_subject" || key === "_classroom_subject") {
            if(key === "_name_subject") {
                this.setState(prevState => ({
                    _subject: {                   // object that we want to update
                        ...prevState._subject,    // keep all other key-value pairs
                        _name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_classroom_subject") {
                this.setState(prevState => ({
                    _subject: {                   // object that we want to update
                        ...prevState._subject,    // keep all other key-value pairs
                        _classroom: _val       // update the value of specific key
                    }
                }));
            }
        }
        if(key === "_name_module" || key === "_subject_module") {
            if(key === "_name_module") {
                this.setState(prevState => ({
                    _module: {                   // object that we want to update
                        ...prevState._module,    // keep all other key-value pairs
                        _name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_subject_module") {
                this.setState(prevState => ({
                    _module: {                   // object that we want to update
                        ...prevState._module,    // keep all other key-value pairs
                        _subject: _val       // update the value of specific key
                    }
                }));
            }
        }
        if(key === "_period_in_minutes") {
            this.setState(prevState => ({
                _session: {                   // object that we want to update
                    ...prevState._session,    // keep all other key-value pairs
                    _period_in_minutes: _val       // update the value of specific key
                }
            }));
        }
        if(key === "_name_course") {
            this.setState(prevState => ({
                _course: {                   // object that we want to update
                    ...prevState._course,    // keep all other key-value pairs
                    _name: _val       // update the value of specific key
                }
            }));
        }
        if(key === "_name_event" || key === '_date_start_event' || key === '_days_event' || key === '_type_event') {
            if(key === "_name_event") {
                this.setState(prevState => ({
                    _event: {                   // object that we want to update
                        ...prevState._event,    // keep all other key-value pairs
                        _name: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_date_start_event") {
                this.setState(prevState => ({
                    _event: {                   // object that we want to update
                        ...prevState._event,    // keep all other key-value pairs
                        _date_start: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_days_event") {
                this.setState(prevState => ({
                    _event: {                   // object that we want to update
                        ...prevState._event,    // keep all other key-value pairs
                        _days: _val       // update the value of specific key
                    }
                }));
            }
            if(key === "_type_event") {
                this.setState(prevState => ({
                    _event: {                   // object that we want to update
                        ...prevState._event,    // keep all other key-value pairs
                        _type: _val       // update the value of specific key
                    }
                }));
            }
        }
    }
    
    _handleTap(_class) {
        let searchWrapper_name = document.querySelector('.search-wrapper-name'+_class),
            searchInput_name = document.querySelector('.search-input-name'+_class),
            searchIcon_name = document.querySelector('.search-name'+_class),
            searchActivated_name = false;

        $('.search-name'+_class).click(() => {
            if (!searchActivated_name) {
                $('._search_form'+_class).addClass('_opened');
                searchWrapper_name.classList.add('focused');
                searchIcon_name.classList.add('active');
                searchInput_name.focus();
                searchActivated_name = !searchActivated_name;
            } else {
                $('._search_form'+_class).removeClass('_opened');
                searchWrapper_name.classList.remove('focused');
                searchIcon_name.classList.remove('active');
                searchActivated_name = !searchActivated_name;
            }
        });
    }
    
    getBusinessDays(startDate, endDate){
        var startDateMoment = moment(startDate);
        var endDateMoment = moment(endDate)
        var days = Math.round(startDateMoment.diff(endDateMoment, 'days') - startDateMoment .diff(endDateMoment, 'days') / 7 * 2);
        if (endDateMoment.day() === 6) {
          days--;
        }
        if (startDateMoment.day() === 7) {
          days--;
        }
        return days;
    }
    
    render() {
        const { articles, classrooms, classroomToEdit, courses, courseToEdit, exams, homeworks, letters, reports, schools, students, studentToEdit, subjects, subjectToEdit, modules, moduleToEdit, user, events, eventToEdit } = this.props;
        const { _classroom, _attendance_by_options, _attendance_by_options_modal, _attendance_by_classrooms, _attendance_by_classrooms_modal, _user, _school, _student, _first_parent, _second_parent, _guardian, _subject, _classroom_subject, _module, _session, _course, _event, _events, _attendance_date, _dayAttended } = this.state;
        return(
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section id="dashboard_page" className="first_section_dashboard">
                        <div className="wrapper_full">
                            <ul className="nav nav-pills flex-column">
                                <li>
                                    <span className="_icon"><i className="fas fa-th-large"></i></span>
                                    <span className="item"><a href="#1a" className="nav_link active" data-toggle="tab">  Dashboards </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="far fa-calendar-check"></i></span>
                                    <span className="item"><a href="#2a" className="nav_link" data-toggle="tab">  Attendance </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="fas fa-users"></i></span>
                                    <span className="item"><a href="#3a" className="nav_link" data-toggle="tab">  Students </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="fas fa-chalkboard"></i></span>
                                    <span className="item"><a href="#4a" className="nav_link" data-toggle="tab">  Classrooms </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="fas fa-book"></i></span>
                                    <span className="item"><a href="#5a" className="nav_link" data-toggle="tab">  Subjects </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="far fa-bookmark"></i></span>
                                    <span className="item"><a href="#6a" className="nav_link" data-toggle="tab">  Courses </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="far fa-copy"></i></span>
                                    <span className="item"><a href="#7a" className="nav_link" data-toggle="tab">  Homeworks </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="far fa-file-alt"></i></span>
                                    <span className="item"><a href="#8a" className="nav_link" data-toggle="tab">  Reports </a></span>
                                </li>
                                <li>
                                    <span className="_icon"><i className="fas fa-graduation-cap"></i></span>
                                    <span className="item"><a href="#9a" className="nav_link" data-toggle="tab">  Exams </a></span>
                                </li>
                            </ul>
                            <div className="tab-content clearfix">
                                <div className="dashboard_pane tab-pane active" id="1a">
                                    <div className="timeanddatenow">
                                        <div className="timenow">
                                            <Clock
                                                format={'hh:mm A'}
                                                ticking={true}
                                            />
                                        </div>
                                        <div className="datenow">
                                            <Clock
                                            format={'dddd, Do MMMM'}
                                            />
                                        </div>
                                    </div>
                                    <ul className="cards">
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_events_pane">
                                                        <div className="_events_header">
                                                            <div className="card__title">Events</div>
                                                            <div className="_filter_form">
                                                                <button className="_add_event btn-primary" data-toggle="modal" data-target="#_event_modal"><i className="fas fa-plus"></i></button>
                                                            </div>
                                                        </div>
                                                        <div className="_events_content">
                                                            <div className="_events_data data-container">
                                                                <ul className="events_list">
                                                                    {
                                                                        _.orderBy(events, ['_date_start'], ['asc']).map((event_it, index) => {
                                                                            return (
                                                                                <li className="event_card event_anchor row">
                                                                                    <div className={"col card card_" + index} data-title={_.snakeCase(event_it._name)} data-index={_.add(index,1)}>
                                                                                        <div className="shadow_letter">{_.head(_.head(_.words(event_it._name)))}</div>
                                                                                        <div className={`card-body ${
                                                                                            ! moment(moment(moment(new Date()).startOf('M')).startOf('week')).isSame(moment(new Date()).startOf('M'), 'month')
                                                                                            ? "Past"
                                                                                            : moment(moment(moment(new Date()).startOf('M')).startOf('week')).isSame(new Date(), 'day')
                                                                                            ? "Today"
                                                                                            : ""
                                                                                        }`}
                                                                                        id={`type_${_.trim(event_it._type)}`}>
                                                                                            <div className="event_date">
                                                                                                <p className="text-muted author"><b>{moment(event_it._date_start).format('ddd')}</b></p>
                                                                                                <p className="text-muted author"><b>{moment(event_it._date_start).format('DD MMM')}</b></p>
                                                                                            </div>
                                                                                            <div className="event_content">
                                                                                                <h2>
                                                                                                    {event_it._name}
                                                                                                    <button onClick={() => this.handleEditEvent(event_it)} className="btn btn-primary" data-toggle="modal" data-target="#_event_modal">
                                                                                                        <i className="fas fa-pencil-alt"></i>
                                                                                                    </button>
                                                                                                    <button onClick={() => this.handleDeleteEvent(event_it._id)} className="btn btn-primary">
                                                                                                        <i className="far fa-trash-alt"></i>
                                                                                                    </button>
                                                                                                </h2>
                                                                                                <p className="text-muted author"><b>{event_it._days}</b> Day{event_it._days > 1 ? 's' : ''}, Starting <b>{moment(event_it._date_start).format('MMM DD, YYYY')}</b></p>
                                                                                                <p className="text-muted author"><b>{event_it._type}</b></p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                            <div id="pagination_events"></div>
                                                        </div>
                                                    </div>
                                                    <div className="_event_modal modal fade" id="_event_modal" tabIndex="-1" role="dialog" aria-labelledby="_event_modalLabel" aria-hidden="true">
                                                        <div className="modal-dialog" role="document">
                                                            <div className="modal-content">
                                                                <div className="modal-body">
                                                                <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                                <h5 className="modal-title" id="_event_modalLabel">OKAY!</h5>
                                                                <div className="wrapper_form_event">
                                                                    <span>event Information : </span>
                                                                    <div className="modal-content_event">
                                                                        <fieldset className="input-field form-group">
                                                                            <input
                                                                            onChange={(ev) => this.handleChangeField('_name_event', ev)}
                                                                            value={_event._name}
                                                                            className="validate form-group-input _name_event" 
                                                                            id="_name_event"
                                                                            type="text" 
                                                                            name="_name_event" 
                                                                            required="required"
                                                                            />
                                                                            <label htmlFor='_name_event' className={_event._name ? 'active' : ''}>Event Name</label>
                                                                            <div className="form-group-line"></div>
                                                                        </fieldset>
                                                                        <fieldset className="input-field form-group">
                                                                            <input
                                                                            onChange={(ev) => this.handleChangeField('_date_start_event', ev)}
                                                                            value={_event._date_start}
                                                                            className="validate datepicker form-group-input _date_start_event" 
                                                                            id="_date_start_event"
                                                                            type="text" 
                                                                            name="_date_start_event" 
                                                                            required="required"
                                                                            />
                                                                            <label htmlFor='_date_start_event' className={_event._date_start ? 'active' : ''}>Event Date Start</label>
                                                                            <div className="form-group-line"></div>
                                                                            <div className="datepicker sample"></div>
                                                                        </fieldset>
                                                                        <fieldset className="input-field form-group">
                                                                            <input
                                                                            onChange={(ev) => this.handleChangeField('_days_event', ev)}
                                                                            value={_event._days}
                                                                            className="validate form-group-input _days_event" 
                                                                            id="_days_event"
                                                                            type="number" 
                                                                            name="_days_event" 
                                                                            required="required"
                                                                            />
                                                                            <label htmlFor='_days_event' className={_event._days ? 'active' : ''}>Event Days</label>
                                                                            <div className="form-group-line"></div>
                                                                        </fieldset>
                                                                        <fieldset className="input-field form-group">
                                                                            <input
                                                                            onChange={(ev) => this.handleChangeField('_type_event', ev)}
                                                                            value={_event._type}
                                                                            className="validate form-group-input _type_event" 
                                                                            id="_type_event"
                                                                            type="text" 
                                                                            name="_type_event" 
                                                                            required="required"
                                                                            />
                                                                            <label htmlFor='_type_event' className={_event._type ? 'active' : ''}>Event Type</label>
                                                                            <div className="form-group-line"></div>
                                                                        </fieldset>
                                                                    </div>
                                                                    <button onClick={this.handleSubmitEvent} className="btn btn-primary float-right">{eventToEdit ? 'Update' : 'Submit'}</button>
                                                                </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="#" className="icon-button scroll">
                                                    <span className="scroll-icon">
                                                        <span className="scroll-icon__wheel-outer">
                                                            <span className="scroll-icon__wheel-inner"></span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_calendars_pane">
                                                        <div className="_calendars_header">
                                                            <div className="card__title">Calendar</div>
                                                            <div className="_filter_form">
                                                                <button className="_add_calendar btn-primary" data-toggle="modal" data-target="#_calendar_modal"><i className="fas fa-plus"></i></button>
                                                            </div>
                                                        </div>
                                                        <div className="_calendars_content">
                                                            <div className="_calendars_data data-container">
                                                                <Calendar STUDENTS={students} EVENTS={events}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <a href="#" className="icon-button scroll">
                                                    <span className="scroll-icon">
                                                        <span className="scroll-icon__wheel-outer">
                                                            <span className="scroll-icon__wheel-inner"></span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div className="attendances_pane tab-pane" id="2a">
                                    <div className="_attendances_pane">
                                        <div className="_attendances_header">
                                            <div className="_search_form_attendances">
                                                <div className="search-wrapper-name_attendances">
                                                    <input className="search-input-name_attendances light-table-filter" type="search" data-table="attendances_list" placeholder="Search"/>
                                                    <span></span>
                                                    <div className='search-name_attendances'></div>
                                                </div>
                                            </div>
                                            <div className="_filter_form">

                                                <fieldset className="input-field form-group">
                                                    <select 
                                                    onChange={(ev) => this.handleChangeField('_attendance_by_classrooms', ev)}
                                                    value={_attendance_by_classrooms}
                                                    className="validate form-group-input _attendance_by_classrooms" 
                                                    id="_attendance_by_classrooms"
                                                    name="_attendance_by_classrooms" 
                                                    required="required"
                                                    >
                                                        {
                                                            _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                                return (
                                                                    <option value={classroom._id}>{classroom._code}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <label htmlFor='_attendance_by_classrooms' className={_attendance_by_classrooms ? 'active' : ''}>_attendance_by_classrooms</label>
                                                    <div className="form-group-line"></div>
                                                </fieldset>

                                                <fieldset className="input-field form-group">
                                                    <select 
                                                    onChange={(ev) => this.handleChangeField('_attendance_by_options', ev)}
                                                    value={_attendance_by_options}
                                                    className="validate form-group-input _attendance_by_options" 
                                                    id="_attendance_by_options"
                                                    name="_attendance_by_options" 
                                                    required="required"
                                                    >
                                                        <option value='_by_last_name'>_by_last_name</option>
                                                        <option value='_by_first_name'>_by_first_name</option>
                                                        <option value='_by_age'>_by_age</option>
                                                        <option value='_by_monthly_attendance'>_by_monthly_attendance</option>
                                                        <option value='_by_yearly_attendance'>_by_yearly_attendance</option>
                                                    </select>
                                                    <label htmlFor='_attendance_by_options' className={_attendance_by_options ? 'active' : ''}>_attendance_by_options</label>
                                                    <div className="form-group-line"></div>
                                                </fieldset>

                                                <button className={moment().format('dddd') === 'Sunday' || _.find(events, {'_date_start': moment().format()}) ? '_add_attendance btn-primary disabled' : '_add_attendance btn-primary'} data-toggle="modal" data-target="#_attendance_modal"><i className="fas fa-plus"></i></button>
                                            
                                            </div>
                                        </div>
                                        <div className="_attendances_content">
                                            <div className="_attendances_data data-container">
                                                <ul className="attendances_list">
                                                    {
                                                        _.filter(_.orderBy(students, [_attendance_by_options === '_by_last_name' ? '_last_name' : _attendance_by_options === '_by_first_name' ? '_first_name' : _attendance_by_options === '_by_age' ? '_dateofbirth' : '_registration_number'], ['asc']), {'_classroom': _attendance_by_classrooms}).map((student, index) => {
                                                            return (
                                                                <li className="attendance_card attendance_anchor row">
                                                                    <div className={"col card card_" + index} data-title={_.snakeCase(student._first_name)} data-index={_.add(index,1)}>
                                                                        <div className="shadow_letter">{_.head(_.head(_.words(student._first_name)))}</div>
                                                                        <div className="card-body">
                                                                            <h2>{student._first_name} <b>{student._last_name}</b></h2>
                                                                            <p className="text-muted author"><b>{moment().diff(new Date(student._dateofbirth), 'years')}</b> Yo, {_.get(_.find(classrooms, {'_id': student._classroom}), '_code')}</p>
                                                                            <hr/>
                                                                            <div className="_diagrams">
                                                                                <div className="Monthly">
                                                                                    <span className="diagram_monthly">
                                                                                        {
                                                                                            moment(_.get(_.find(events, {'_type': 'Closing'}), '_date_start')).diff(moment(_.get(_.find(events, {'_type': 'Opening'}), '_date_start')), 'days')
                                                                                        }
                                                                                    </span>
                                                                                    <span>Monthly</span>
                                                                                </div>
                                                                                <div className="Yearly">
                                                                                    <span className="diagram_yearly">
                                                                                        {
                                                                                            this.getBusinessDays(_.get(_.find(events, {'_type': 'Closing'}), '_date_start'), _.get(_.find(events, {'_type': 'Opening'}), '_date_start'))
                                                                                        }
                                                                                    </span>
                                                                                    <span>Yearly</span>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div id="pagination_attendances"></div>
                                        </div>
                                    </div>
                                    <div className="_attendance_modal modal fade" id="_attendance_modal" tabIndex="-1" role="dialog" aria-labelledby="_attendance_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <h5 className="modal-title" id="_attendance_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_attendance">
                                                        <div className="modal-content_attendance">
                                                            <div className="timedateandfieldset">
                                                                
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_attendance_date', ev)}
                                                                    value={_attendance_date}
                                                                    className="validate datepicker form-group-input _attendance_date" 
                                                                    id="_attendance_date"
                                                                    type="text" 
                                                                    name="_attendance_date" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_attendance_date' className={_attendance_date ? 'active' : ''}>{moment(_attendance_date).format('dddd')}</label>
                                                                    <div className="form-group-line"></div>
                                                                    <div className="datepicker sample"></div>
                                                                </fieldset>
                                                                
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_attendance_by_classrooms_modal', ev)}
                                                                    value={_attendance_by_classrooms_modal}
                                                                    className="validate form-group-input _attendance_by_classrooms_modal" 
                                                                    id="_attendance_by_classrooms_modal"
                                                                    name="_attendance_by_classrooms_modal" 
                                                                    required="required"
                                                                    >
                                                                        {
                                                                            _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                                                return (
                                                                                    <option value={classroom._id}>{classroom._code}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_attendance_by_classrooms_modal' className={_attendance_by_classrooms_modal ? 'active' : ''}>_attendance_by_classrooms_modal</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>

                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_attendance_by_options_modal', ev)}
                                                                    value={_attendance_by_options_modal}
                                                                    className="validate form-group-input _attendance_by_options_modal" 
                                                                    id="_attendance_by_options_modal"
                                                                    name="_attendance_by_options_modal" 
                                                                    required="required"
                                                                    >
                                                                        <option value='_by_last_name'>_by_last_name</option>
                                                                        <option value='_by_first_name'>_by_first_name</option>
                                                                        <option value='_by_age'>_by_age</option>
                                                                        <option value='_by_monthly_attendance'>_by_monthly_attendance</option>
                                                                        <option value='_by_yearly_attendance'>_by_yearly_attendance</option>
                                                                    </select>
                                                                    <label htmlFor='_attendance_by_options_modal' className={_attendance_by_options_modal ? 'active' : ''}>_attendance_by_options_modal</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>

                                                            </div>
                                                            <div className="_attendances_data data-container">
                                                                <ul className="attendances_list">
                                                                    { 
                                                                        _.filter(_.orderBy(students, [_attendance_by_options_modal === '_by_last_name' ? '_last_name' : _attendance_by_options_modal === '_by_first_name' ? '_first_name' : _attendance_by_options_modal === '_by_age' ? '_dateofbirth' : '_registration_number'], ['asc']), {'_classroom': _attendance_by_classrooms_modal}).map((student, index) => {
                                                                            return (
                                                                                <li className="attendance_card attendance_anchor row">
                                                                                    <div className={"col card card_" + index} data-title={_.snakeCase(student._first_name)} data-index={_.add(index,1)}>
                                                                                        <div className="shadow_letter">{_.head(_.head(_.words(student._first_name)))}</div>
                                                                                        <div className="card-body">
                                                                                            <h2>{student._first_name} {student._last_name}</h2>
                                                                                            <p className="text-muted author"><b>{moment().diff(new Date(student._dateofbirth), 'years')}</b> Yo, {_.get(_.find(classrooms, {'_id': student._classroom}), '_code')}</p>
                                                                                            <div className="custom-control custom-switch">
                                                                                                <form id={'form_'+index}>
                                                                                                    <input type="radio" id={'present_'+index} name={'attendance_to_student_'+index} value="true" data-index={index} checked/>
                                                                                                    <label htmlFor={'present_'+index}>Present</label>
                                                                                                    <input type="radio" id={'absent_'+index} name={'attendance_to_student_'+index} value="false" data-index={index}/>
                                                                                                    <label htmlFor={'absent_'+index}>Absent</label>
                                                                                                </form>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </div>
                                                        </div>
                                                        <button onClick={this.handleSubmitAttendance} className="btn btn-primary float-right">{ _dayAttended ? 'Update' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="students_pane tab-pane" id="3a">
                                    <div className="_students_pane">
                                        <div className="_students_header">
                                            <div className="_search_form_students">
                                                <div className="search-wrapper-name_students">
                                                    <input className="search-input-name_students light-table-filter" type="search" data-table="students_list" placeholder="Search"/>
                                                    <span></span>
                                                    <div className='search-name_students'></div>
                                                </div>
                                            </div>
                                            <div className="_filter_form">
                                                <button className="_add_student btn-primary" data-toggle="modal" data-target="#_student_modal"><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="_students_content">
                                            <div className="_students_data">
                                                <table className="students_list table table-striped">
                                                    <thead>
                                                        <tr className="students_list_header">
                                                            <th>Reg Number</th>
                                                            <th>Reg Date</th>
                                                            <th>Classroom</th>
                                                            <th>Full Name</th>
                                                            <th>Birthday</th>
                                                            <th>Gender</th>
                                                            <th>Attendance</th>
                                                            <th>First Parent</th>
                                                            <th>Second Parent</th>
                                                            <th>Guardian</th>
                                                            <th className="_empty"></th>
                                                            <th className="_empty"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="data-container">
                                                    {
                                                        _.orderBy(students, ['createdAt'], ['desc']).map((student, index) => {
                                                            return (
                                                                <tr className="student_card student_anchor">
                                                                    <td>{student._registration_number}</td>
                                                                    <td>{moment(student._registration_date).format('MMM DD, YYYY')}</td>
                                                                    <td>{_.get(_.find(classrooms, {'_id': student._classroom}), '_code')}</td>
                                                                    <td>{student._first_name} {student._last_name}</td>
                                                                    <td>{moment(student._dateofbirth).format('MMM DD, YYYY')}</td>
                                                                    <td>{student._gender}</td>
                                                                    <td><a href="" data-toggle="modal" data-target="#_attendance_modal_student" onClick={() => this.handleEditStudent(student)}>click</a></td>
                                                                    <td>{student._first_parent._full_name_first_parent}</td>
                                                                    <td>{student._second_parent._full_name_second_parent}</td>
                                                                    <td>{student._guardian._full_name_guardian}</td>
                                                                    <td className="dropdown">
                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                        </span>
                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                            <a className="dropdown-item" href="" data-toggle="modal" data-target="#_student_modal" onClick={() => this.handleEditStudent(student)}>Edit Student {student._code}</a>
                                                                            <a className="dropdown-item" href="" onClick={() => this.handleDeleteStudent(student._id)}>Delete Student {student._code}</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                    <tfoot id="pagination_students"></tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="_student_modal modal fade" id="_student_modal" tabIndex="-1" role="dialog" aria-labelledby="_student_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <div className="_top_shelf">
                                                        <ul className='progress'>
                                                            <li className="active"></li>
                                                            <li></li>
                                                            <li></li>
                                                            <li></li>
                                                            <li></li>
                                                        </ul>
                                                        <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    </div>
                                                    <h5 className="modal-title" id="_student_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_student">
                                                        <div className="_student_box modal-body-step-1 is-showing">
                                                            <span>Student Registration Information : </span>
                                                            <div className="modal-content_student">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_registration_number', ev)}
                                                                    value={_student._registration_number}
                                                                    className="validate form-group-input _registration_number" 
                                                                    id="_registration_number"
                                                                    type="text" 
                                                                    name="_registration_number" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_registration_number' className={_student._registration_number ? 'active' : ''}>Student _registration_number</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_registration_date', ev)}
                                                                    value={_student._registration_date}
                                                                    className="validate datepicker form-group-input _registration_date" 
                                                                    id="_registration_date"
                                                                    type="text" 
                                                                    name="_registration_date" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_registration_date' className={_student._registration_date ? 'active' : ''}>Student _registration_date</label>
                                                                    <div className="form-group-line"></div>
                                                                    <div className="datepicker sample"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_classroom', ev)}
                                                                    value={_student._classroom}
                                                                    className="validate form-group-input _classroom" 
                                                                    id="_classroom"
                                                                    name="_classroom" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                                                return (
                                                                                    <option value={classroom._id}>{classroom._code}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_classroom' className={_student._classroom ? 'active' : ''}>_classroom</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <input type='button' name='next' className='next-button custom-button' value="Next"></input>
                                                        </div>

                                                        <div className="_student_box modal-body-step-2">
                                                            <span>Student Personal Information</span>
                                                            <div className="modal-content_student">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_first_name', ev)}
                                                                    value={_student._first_name}
                                                                    className="validate form-group-input _first_name" 
                                                                    id="_first_name"
                                                                    type="text" 
                                                                    name="_first_name" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_first_name' className={_student._first_name ? 'active' : ''}>_first_name</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_last_name', ev)}
                                                                    value={_student._last_name}
                                                                    className="validate form-group-input _last_name" 
                                                                    id="_last_name"
                                                                    type="text" 
                                                                    name="_last_name" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_last_name' className={_student._last_name ? 'active' : ''}>_last_name</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_dateofbirth', ev)}
                                                                    value={_student._dateofbirth}
                                                                    className="validate datepicker form-group-input _dateofbirth" 
                                                                    id="_dateofbirth"
                                                                    type="text" 
                                                                    name="_dateofbirth" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_dateofbirth' className={_student._dateofbirth ? 'active' : ''}>_dateofbirth</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_gender', ev)}
                                                                    value={_student._gender}
                                                                    className="validate form-group-input _gender" 
                                                                    id="_gender"
                                                                    name="_gender" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            ['Mr.', 'Mrs.', 'Ms.', 'Other'].map((g, index) => {
                                                                                return (
                                                                                    <option value={g}>{g}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_gender' className={_student._gender ? 'active' : ''}>_gender</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <input type='button' name='next' className='next-button custom-button' value="Next"></input>
                                                            <input type='button' name='previous' className='prev-button custom-button' value="Back"></input>
                                                        </div>

                                                        <div className="_student_box modal-body-step-3">
                                                            <span>First Parent Information : </span>
                                                            <div className="modal-content_student">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_full_name_first_parent', ev)}
                                                                    value={_first_parent._full_name_first_parent}
                                                                    className="validate form-group-input _full_name_first_parent" 
                                                                    id="_full_name_first_parent"
                                                                    type="text" 
                                                                    name="_full_name_first_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_full_name_first_parent' className={_first_parent._full_name_first_parent ? 'active' : ''}>_full_name_first_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_gender_first_parent', ev)}
                                                                    value={_first_parent._gender_first_parent}
                                                                    className="validate form-group-input _gender_first_parent" 
                                                                    id="_gender_first_parent"
                                                                    name="_gender_first_parent" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            ['Mr.', 'Mrs.', 'Ms.', 'Other'].map((g, index) => {
                                                                                return (
                                                                                    <option value={g}>{g}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_gender_first_parent' className={_first_parent._gender_first_parent ? 'active' : ''}>_gender_first_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_adresse_first_parent', ev)}
                                                                    value={_first_parent._adresse_first_parent}
                                                                    className="validate form-group-input _adresse_first_parent" 
                                                                    id="_adresse_first_parent"
                                                                    type="text" 
                                                                    name="_adresse_first_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_adresse_first_parent' className={_first_parent._adresse_first_parent ? 'active' : ''}>_adresse_first_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_phone_first_parent', ev)}
                                                                    value={_first_parent._phone_first_parent}
                                                                    className="validate form-group-input _phone_first_parent" 
                                                                    id="_phone_first_parent"
                                                                    type="text" 
                                                                    name="_phone_first_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_phone_first_parent' className={_first_parent._phone_first_parent ? 'active' : ''}>_phone_first_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <input type='button' name='next' className='next-button custom-button' value="Next"></input>
                                                            <input type='button' name='previous' className='prev-button custom-button' value="Back"></input>
                                                        </div>

                                                        <div className="_student_box modal-body-step-4">
                                                            <span>Second Parent Information : </span>
                                                            <div className="modal-content_student">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_full_name_second_parent', ev)}
                                                                    value={_second_parent._full_name_second_parent}
                                                                    className="validate form-group-input _full_name_second_parent" 
                                                                    id="_full_name_second_parent"
                                                                    type="text" 
                                                                    name="_full_name_second_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_full_name_second_parent' className={_second_parent._full_name_second_parent ? 'active' : ''}>_full_name_second_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_gender_second_parent', ev)}
                                                                    value={_second_parent._gender_second_parent}
                                                                    className="validate form-group-input _gender_second_parent" 
                                                                    id="_gender_second_parent"
                                                                    name="_gender_second_parent" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            ['Mr.', 'Mrs.', 'Ms.', 'Other'].map((g, index) => {
                                                                                return (
                                                                                    <option value={g}>{g}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_gender_second_parent' className={_second_parent._gender_second_parent ? 'active' : ''}>_gender_second_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_adresse_second_parent', ev)}
                                                                    value={_second_parent._adresse_second_parent}
                                                                    className="validate form-group-input _adresse_second_parent" 
                                                                    id="_adresse_second_parent"
                                                                    type="text" 
                                                                    name="_adresse_second_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_adresse_second_parent' className={_second_parent._adresse_second_parent ? 'active' : ''}>_adresse_second_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_phone_second_parent', ev)}
                                                                    value={_second_parent._phone_second_parent}
                                                                    className="validate form-group-input _phone_second_parent" 
                                                                    id="_phone_second_parent"
                                                                    type="text" 
                                                                    name="_phone_second_parent" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_phone_second_parent' className={_second_parent._phone_second_parent ? 'active' : ''}>_phone_second_parent</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <input type='button' name='next' className='next-button custom-button' value="Next"></input>
                                                            <input type='button' name='previous' className='prev-button custom-button' value="Back"></input>
                                                        </div>

                                                        <div className="_student_box modal-body-step-5">
                                                            <span>Guardian Information : </span>
                                                            <div className="modal-content_student">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_full_name_guardian', ev)}
                                                                    value={_guardian._full_name_guardian}
                                                                    className="validate form-group-input _full_name_guardian" 
                                                                    id="_full_name_guardian"
                                                                    type="text" 
                                                                    name="_full_name_guardian" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_full_name_guardian' className={_guardian._full_name_guardian ? 'active' : ''}>_full_name_guardian</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_gender_guardian', ev)}
                                                                    value={_guardian._gender_guardian}
                                                                    className="validate form-group-input _gender_guardian" 
                                                                    id="_gender_guardian"
                                                                    name="_gender_guardian" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            ['Mr.', 'Mrs.', 'Ms.', 'Other'].map((g, index) => {
                                                                                return (
                                                                                    <option value={g}>{g}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_gender_guardian' className={_guardian._gender_guardian ? 'active' : ''}>_gender_guardian</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_adresse_guardian', ev)}
                                                                    value={_guardian._adresse_guardian}
                                                                    className="validate form-group-input _adresse_guardian" 
                                                                    id="_adresse_guardian"
                                                                    type="text" 
                                                                    name="_adresse_guardian" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_adresse_guardian' className={_guardian._adresse_guardian ? 'active' : ''}>_adresse_guardian</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_phone_guardian', ev)}
                                                                    value={_guardian._phone_guardian}
                                                                    className="validate form-group-input _phone_guardian" 
                                                                    id="_phone_guardian"
                                                                    type="text" 
                                                                    name="_phone_guardian" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_phone_guardian' className={_guardian._phone_guardian ? 'active' : ''}>_phone_guardian</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <button onClick={this.handleSubmitStudent} className="btn btn-primary float-right">{studentToEdit ? 'Update' : 'Submit'}</button>
                                                            <input type='button' name='previous' className='prev-button custom-button' value="Back"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="_attendance_modal_student modal fade" id="_attendance_modal_student" tabIndex="-1" role="dialog" aria-labelledby="_attendance_modal_studentLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <div className="wrapper_form_attendance">
                                                        <div className="wrapper_form_attendance_header">
                                                            <div className={"card card_student"}>
                                                                <div className="shapes shapes1"></div>
                                                                <div className="shapes shapes2"></div>
                                                                <div className="card-body">
                                                                    <div className="_inside">
                                                                        <h2>{_student._first_name} {_student._last_name}</h2>
                                                                        <p className="text-muted author"><b>{moment().diff(new Date(_student._dateofbirth), 'years')}</b> Yo,</p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="_middays_total_present_absent">
                                                                <span className="_title">Middays</span>
                                                                <span className="_percentage"></span>
                                                                <span className="_shape"></span>
                                                            </div>
                                                            <div className="_weekly_total_present_absent">
                                                                <span className="_title">Weekly</span>
                                                                <span className="_percentage"></span>
                                                                <span className="_shape"></span>
                                                            </div>
                                                            <div className="_monthly_total_present_absent">
                                                                <span className="_title">Monthly</span>
                                                                <span className="_percentage"></span>
                                                                <span className="_shape"></span>
                                                            </div>
                                                            <div className="_yearly_total_present_absent">
                                                                <span className="_title">Yearly</span>
                                                                <span className="_percentage"></span>
                                                                <span className="_shape"></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="classrooms_pane tab-pane" id="4a">
                                    <div className="_classrooms_pane">
                                        <div className="_classrooms_header">
                                            <div className="_search_form_classrooms">
                                                <div className="search-wrapper-name_classrooms">
                                                    <input className="search-input-name_classrooms light-table-filter" type="search" data-table="classrooms_list" placeholder="Search"/>
                                                    <span></span>
                                                    <div className='search-name_classrooms'></div>
                                                </div>
                                            </div>
                                            <div className="_filter_form">
                                                <button className="_add_classroom btn-primary" data-toggle="modal" data-target="#_classroom_modal"><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="_classrooms_content">
                                            <div className="_classrooms_data">
                                                <table className="classrooms_list table table-striped">
                                                    <thead>
                                                        <tr className="classrooms_list_header">
                                                            <th>Code</th>
                                                            <th>Name</th>
                                                            <th>Grade</th>
                                                            <th>Section</th>
                                                            <th>School</th>
                                                            <th>Teacher</th>
                                                            <th>Subjects</th>
                                                            <th>Students</th>
                                                            <th className="_empty"></th>
                                                            <th className="_empty"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="data-container">
                                                    {
                                                        _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                            return (
                                                                <tr>
                                                                    <td>{classroom._code}</td>
                                                                    <td>{classroom._name}</td>
                                                                    <td>{classroom._grade}</td>
                                                                    <td>{classroom._section}</td>
                                                                    <td>{_school._name}</td>
                                                                    <td>{classroom._teacher === _user._id ? _user.firstname+' '+_user.lastname : ''}</td>
                                                                    <td>{}</td>
                                                                    <td>{_.size(_.filter(_.orderBy(students, ['createdAt'], ['desc']), {'_classroom': classroom._id}))}</td>
                                                                    <td className="dropdown">
                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                        </span>
                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                            <a className="dropdown-item" href="" data-toggle="modal" data-target="#_classroom_modal" onClick={() => this.handleEditClassroom(classroom)}>Edit Classroom {classroom._code}</a>
                                                                            <a className="dropdown-item" href="" onClick={() => this.handleDeleteClassroom(classroom._id)}>Delete Classroom {classroom._code}</a>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })
                                                    }
                                                    </tbody>
                                                    <tfoot id="pagination_classrooms"></tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="_classroom_modal modal fade" id="_classroom_modal" tabIndex="-1" role="dialog" aria-labelledby="_classroom_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <h5 className="modal-title" id="_classroom_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_classroom">
                                                        <span>Classroom Information : </span>
                                                        <div className="modal-content_classroom">
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_code', ev)}
                                                                value={_classroom._code}
                                                                className="validate form-group-input _code" 
                                                                id="_code"
                                                                type="text" 
                                                                name="_code" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_code' className={_classroom._code ? 'active' : ''}>Classroom Code</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_name', ev)}
                                                                value={_classroom._name}
                                                                className="validate form-group-input _name" 
                                                                id="_name"
                                                                type="text" 
                                                                name="_name" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_name' className={_classroom._name ? 'active' : ''}>Classroom Name</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_grade', ev)}
                                                                value={_classroom._grade}
                                                                className="validate form-group-input _grade" 
                                                                id="_grade"
                                                                type="text" 
                                                                name="_grade" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_grade' className={_classroom._grade ? 'active' : ''}>Grade</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_section', ev)}
                                                                value={_classroom._section}
                                                                className="validate form-group-input _section" 
                                                                id="_section"
                                                                type="text" 
                                                                name="_section" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_section' className={_classroom._section ? 'active' : ''}>Section</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                        </div>
                                                        <button onClick={this.handleSubmitClassroom} className="btn btn-primary float-right">{classroomToEdit ? 'Update' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="subjects_pane tab-pane" id="5a">
                                    <div className="_subjects_pane">
                                        <div className="_subjects_header">
                                            <div className="_search_form_subjects">
                                                <div className="search-wrapper-name_subjects">
                                                    <input className="search-input-name_subjects light-table-filter" type="search" data-table="subjects_list" placeholder="Search"/>
                                                    <span></span>
                                                    <div className='search-name_subjects'></div>
                                                </div>
                                            </div>
                                            <div className="_filter_form">
                                                <fieldset className="input-field form-group">
                                                    <select 
                                                    onChange={(ev) => this.handleChangeField('_classroom_subject', ev)}
                                                    value={_classroom_subject}
                                                    className="validate form-group-input _classroom_subject" 
                                                    id="_classroom_subject"
                                                    name="_classroom_subject" 
                                                    required="required"
                                                    >
                                                        {
                                                            _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                                return (
                                                                    <option value={classroom._id}>{classroom._code}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    <label htmlFor='_classroom_subject' className={_classroom_subject ? 'active' : ''}>_classroom_subject</label>
                                                    <div className="form-group-line"></div>
                                                </fieldset>
                                                <button className="_add_subject btn-primary" data-toggle="modal" data-target="#_subject_modal"><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="_subjects_content">
                                            <div className="_subjects_data data-container">
                                                <ul className="subjects_list">
                                                    {
                                                        _.filter(_.orderBy(subjects, ['createdAt'], ['desc']), {'_classroom': _classroom_subject}).map((subject, index) => {
                                                            return (
                                                                <li className="subject_card subject_anchor row">
                                                                    <div className={"col card card_" + index} data-title={_.snakeCase(subject._name)} data-index={_.add(index,1)}>
                                                                        <div className="shadow_letter">{_.head(_.head(_.words(_.get(_.find(classrooms, {'_id': subject._classroom}), '_code'))))}</div>
                                                                        <div className="card-body">
                                                                            <h2>
                                                                                {subject._name}
                                                                                <button onClick={() => this.handleEditSubject(subject)} className="btn btn-primary" data-toggle="modal" data-target="#_subject_modal">
                                                                                    <i className="fas fa-pencil-alt"></i>
                                                                                </button>
                                                                                <button onClick={() => this.handleDeleteSubject(subject._id)} className="btn btn-primary" data-toggle="modal" data-target="#_subject_modal">
                                                                                    <i className="far fa-trash-alt"></i>
                                                                                </button>
                                                                            </h2>
                                                                            <p className="text-muted author">{_.get(_.find(classrooms, {'_id': subject._classroom}), '_code')}</p>
                                                                            <hr/>
                                                                            <ul className="text-muted">
                                                                                {
                                                                                    _.filter(_.orderBy(modules, ['createdAt'], ['desc']), {'_subject': subject._id}).map((mod, index) => {
                                                                                        return (
                                                                                            <li className="tag_item">
                                                                                                <button className="_add_session btn-primary" data-toggle="modal" data-target="#_session_modal" onClick={() => this.handleEditModule(mod)}>
                                                                                                    { _.size(mod._sessions) }":
                                                                                                    { _.reduce(mod._sessions.map(a => a._period_in_minutes), function(sum, n) { return sum + n; }, 0) }min
                                                                                                </button>
                                                                                                <button className="_add_module btn-primary" data-toggle="modal" data-target="#_module_modal" onClick={() => this.handleEditModule(mod)}>
                                                                                                    { mod._name }
                                                                                                </button>
                                                                                            </li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <div className="_filter_form">
                                                                                <button onClick={() => this.handleAddModule(subject)} className="_add_module btn-primary" data-toggle="modal" data-target="#_module_modal"><i className="fas fa-plus"></i></button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div id="pagination_subjects"></div>
                                        </div>
                                    </div>
                                    <div className="_subject_modal modal fade" id="_subject_modal" tabIndex="-1" role="dialog" aria-labelledby="_subject_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <h5 className="modal-title" id="_subject_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_subject">
                                                        <span>Subject Information : </span>
                                                        <div className="modal-content_subject">
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_name_subject', ev)}
                                                                value={_subject._name}
                                                                className="validate form-group-input _name" 
                                                                id="_name"
                                                                type="text" 
                                                                name="_name" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_code' className={_subject._name ? 'active' : ''}>Subject Name</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                            <fieldset className="input-field form-group">
                                                                <select 
                                                                onChange={(ev) => this.handleChangeField('_classroom_subject', ev)}
                                                                value={_subject._classroom}
                                                                className="validate form-group-input _classroom" 
                                                                id="_classroom"
                                                                name="_classroom" 
                                                                required="required"
                                                                >
                                                                    <option hidden disabled selected value></option>
                                                                    {
                                                                        _.orderBy(classrooms, ['createdAt'], ['desc']).map((classroom, index) => {
                                                                            return (
                                                                                <option value={classroom._id}>{classroom._code}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                                <label htmlFor='_classroom' className={_subject._classroom ? 'active' : ''}>_classroom</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                        </div>
                                                        <label>In case of a subject that has no modules, just add a module of the same name of the subject to put up the general period and sessions</label>
                                                        <button onClick={this.handleSubmitSubject} className="btn btn-primary float-right">{subjectToEdit ? 'Update' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="_module_modal modal fade" id="_module_modal" tabIndex="-1" role="dialog" aria-labelledby="_module_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <h5 className="modal-title" id="_module_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_module">
                                                        <span>Modules Information : </span>
                                                        <div className="modal-content_module">
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                onChange={(ev) => this.handleChangeField('_name_module', ev)}
                                                                value={_module._name}
                                                                className="validate form-group-input _name" 
                                                                id="_name"
                                                                type="text" 
                                                                name="_name" 
                                                                required="required"
                                                                />
                                                                <label htmlFor='_code' className={_module._name ? 'active' : ''}>Module Name</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                            <fieldset className="input-field form-group">
                                                                <select 
                                                                onChange={(ev) => this.handleChangeField('_subject_module', ev)}
                                                                value={_module._subject}
                                                                className="validate form-group-input _subject" 
                                                                id="_subject"
                                                                name="_subject" 
                                                                required="required"
                                                                >
                                                                    <option hidden disabled selected value></option>
                                                                    {
                                                                        _.orderBy(subjects, ['createdAt'], ['desc']).map((subject, index) => {
                                                                            return (
                                                                                <option value={subject._id}>{subject._name} {_.get(_.find(classrooms, {'_id': subject._classroom}), '_code')}</option>
                                                                            )
                                                                        })
                                                                    }
                                                                </select>
                                                                <label htmlFor='_subject' className={_module._subject ? 'active' : ''}>_subject</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                        </div>
                                                        <label>To Modify sessions periods and recurrence, just tap on the minutes and recurrence of the module</label>
                                                        <button onClick={this.handleSubmitModule} className="btn btn-primary float-right">{moduleToEdit ? 'Update' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="_session_modal modal fade" id="_session_modal" tabIndex="-1" role="dialog" aria-labelledby="_module_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    <h5 className="modal-title" id="_session_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_session">
                                                        <span>Session Information : </span>
                                                        <div className="modal-content_session">
                                                            <fieldset className="input-field form-group">
                                                                <input
                                                                    onChange={(ev) => this.handleChangeField('_period_in_minutes', ev)}
                                                                    value={_session._period_in_minutes}
                                                                    className="validate form-group-input _period_in_minutes" 
                                                                    id="_period_in_minutes"
                                                                    type="text" 
                                                                    name="_period_in_minutes" 
                                                                    required="required"
                                                                />
                                                                <label htmlFor='_period_in_minutes' className={_session._period_in_minutes ? 'active' : ''}>_period_in_minutes</label>
                                                                <div className="form-group-line"></div>
                                                            </fieldset>
                                                        </div>
                                                        <button onClick={this.handleSubmitModule} className="btn btn-primary float-right">{moduleToEdit ? 'Update' : 'Submit'}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="courses_pane tab-pane" id="6a">
                                    <div className="_courses_pane">
                                        <div className="_courses_header">
                                            <div className="_search_form_courses">
                                                <div className="search-wrapper-name_courses">
                                                    <input className="search-input-name_courses light-table-filter" type="search" data-table="courses_list" placeholder="Search"/>
                                                    <span></span>
                                                    <div className='search-name_courses'></div>
                                                </div>
                                            </div>
                                            <div className="_filter_form">
                                                <button className="_add_course btn-primary" data-toggle="modal" data-target="#_course_modal"><i className="fas fa-plus"></i></button>
                                            </div>
                                        </div>
                                        <div className="_courses_content">
                                            <div className="_courses_data data-container">
                                                <ul className="courses_list">
                                                    {
                                                        _.orderBy(courses, ['createdAt'], ['desc']).map((course, index) => {
                                                            return (
                                                                <li className="course_card course_anchor row">
                                                                    <div className={"col card card_" + index} data-title={_.snakeCase(course._name)} data-index={_.add(index,1)}>
                                                                        <div className="shadow_letter">{_.head(_.head(_.words(course._name)))}</div>
                                                                        <div className="card-body">
                                                                            <h2>{course._name}</h2>
                                                                            <hr/>
                                                                        </div>
                                                                    </div>
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </ul>
                                            </div>
                                            <div id="pagination_courses"></div>
                                        </div>
                                    </div>
                                    <div className="_course_modal modal fade" id="_course_modal" tabIndex="-1" role="dialog" aria-labelledby="_course_modalLabel" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-body">
                                                    <div className="_top_shelf">
                                                        <ul className='progress'>
                                                            <li className="active"></li>
                                                            <li></li>
                                                        </ul>
                                                        <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                                    </div>
                                                    <h5 className="modal-title" id="_course_modalLabel">OKAY!</h5>
                                                    <div className="wrapper_form_course">
                                                        <div className="_course_box modal-body-step-1 is-showing">
                                                            <span>Course Information : </span>
                                                            <div className="modal-content_course">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_name_course', ev)}
                                                                    value={_course._name}
                                                                    className="validate form-group-input _name" 
                                                                    id="_name"
                                                                    type="text" 
                                                                    name="_name" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_name' className={_course._name ? 'active' : ''}>Course _name</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_abilities_inview', ev)}
                                                                    value={_course._abilities_inview}
                                                                    className="validate form-group-input _abilities_inview" 
                                                                    id="_abilities_inview"
                                                                    type="text" 
                                                                    name="_abilities_inview" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_abilities_inview' className={_course._abilities_inview ? 'active' : ''}>Course _abilities_inview</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                                <fieldset className="input-field form-group">
                                                                    <select 
                                                                    onChange={(ev) => this.handleChangeField('_subject_course', ev)}
                                                                    value={_course._subject}
                                                                    className="validate form-group-input _subject" 
                                                                    id="_subject"
                                                                    name="_subject" 
                                                                    required="required"
                                                                    >
                                                                        <option hidden disabled selected value></option>
                                                                        {
                                                                            _.orderBy(subjects, ['createdAt'], ['desc']).map((subject, index) => {
                                                                                return (
                                                                                    <option value={subject._id}>{subject._name} {_.get(_.find(classrooms, {'_id': subject._classroom}), '_code')}</option>
                                                                                )
                                                                            })
                                                                        }
                                                                    </select>
                                                                    <label htmlFor='_subject' className={_course._subject ? 'active' : ''}>_subject</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <input type='button' name='next' className='next-button custom-button' value="Next"></input>
                                                        </div>

                                                        <div className="_course_box modal-body-step-2">
                                                            <span>Session Information : </span>
                                                            <div className="modal-content_course">
                                                                <fieldset className="input-field form-group">
                                                                    <input
                                                                    onChange={(ev) => this.handleChangeField('_sessions', ev)}
                                                                    value={_course._sessions}
                                                                    className="validate form-group-input _sessions" 
                                                                    id="_sessions"
                                                                    type="text" 
                                                                    name="_sessions" 
                                                                    required="required"
                                                                    />
                                                                    <label htmlFor='_sessions' className={_course._sessions ? 'active' : ''}>_sessions</label>
                                                                    <div className="form-group-line"></div>
                                                                </fieldset>
                                                            </div>
                                                            <button onClick={this.handleSubmitCourse} className="btn btn-primary float-right">{courseToEdit ? 'Update' : 'Submit'}</button>
                                                            <input type='button' name='previous' className='prev-button custom-button' value="Back"></input>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="homeworks_pane tab-pane" id="7a">
                                
                                </div>
                                <div className="reports_pane tab-pane" id="8a">
                                
                                </div>
                                <div className="exams_pane tab-pane" id="9a">
                                
                                </div>
                            </div>
                        </div>
                    </section>
				</Slide>
				<Slide>
					<Footer/>
				</Slide>
            </FullPage>
        )
    }
}

const mapStateToProps = state => ({
    classrooms: state.home.classrooms,
    classroomToEdit: state.home.classroomToEdit,

    students: state.home.students,
    studentToEdit: state.home.studentToEdit,

    subjects: state.home.subjects,
    subjectToEdit: state.home.subjectToEdit,
    
    modules: state.home.modules,
    moduleToEdit: state.home.moduleToEdit,
    
    courses: state.home.courses,
    courseToEdit: state.home.courseToEdit,
    
    events: state.home.events,
    eventToEdit: state.home.eventToEdit,
});

const mapDispatchToProps = dispatch => ({
    onLoadClassroom: data => dispatch({ type: 'CLASSROOM_PAGE_LOADED', data }),
    onSubmitClassroom: data => dispatch({ type: 'SUBMIT_CLASSROOM', data }),
    onEditClassroom: data => dispatch({ type: 'EDIT_CLASSROOM', data }),
    onDeleteClassroom: id => dispatch({ type : 'DELETE_CLASSROOM', id }),
    setEditClassroom: classroom => dispatch({ type: 'SET_EDIT_CLASSROOM', classroom }),

    onLoadStudent: data => dispatch({ type: 'STUDENT_PAGE_LOADED', data }),
    onSubmitStudent: data => dispatch({ type: 'SUBMIT_STUDENT', data }),
    onEditStudent: data => dispatch({ type: 'EDIT_STUDENT', data }),
    onDeleteStudent: id => dispatch({ type : 'DELETE_STUDENT', id }),
    setEditStudent: student => dispatch({ type: 'SET_EDIT_STUDENT', student }),

    onLoadSubject: data => dispatch({ type: 'SUBJECT_PAGE_LOADED', data }),
    onSubmitSubject: data => dispatch({ type: 'SUBMIT_SUBJECT', data }),
    onEditSubject: data => dispatch({ type: 'EDIT_SUBJECT', data }),
    onDeleteSubject: id => dispatch({ type : 'DELETE_SUBJECT', id }),
    setEditSubject: subject => dispatch({ type: 'SET_EDIT_SUBJECT', subject }),

    onLoadModule: data => dispatch({ type: 'MODULE_PAGE_LOADED', data }),
    onSubmitModule: data => dispatch({ type: 'SUBMIT_MODULE', data }),
    onEditModule: data => dispatch({ type: 'EDIT_MODULE', data }),
    onDeleteModule: id => dispatch({ type : 'DELETE_MODULE', id }),
    setEditModule: module => dispatch({ type: 'SET_EDIT_MODULE', module }),

    onLoadCourse: data => dispatch({ type: 'COURSE_PAGE_LOADED', data }),
    onSubmitCourse: data => dispatch({ type: 'SUBMIT_COURSE', data }),
    onEditCourse: data => dispatch({ type: 'EDIT_COURSE', data }),
    onDeleteCourse: id => dispatch({ type : 'DELETE_COURSE', id }),
    setEditCourse: course => dispatch({ type: 'SET_EDIT_COURSE', course }),

    onLoadEvent: data => dispatch({ type: 'EVENT_PAGE_LOADED', data }),
    onSubmitEvent: data => dispatch({ type: 'SUBMIT_EVENT', data }),
    onEditEvent: data => dispatch({ type: 'EDIT_EVENT', data }),
    onDeleteEvent: id => dispatch({ type : 'DELETE_EVENT', id }),
    setEditEvent: event => dispatch({ type: 'SET_EDIT_EVENT', event }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard) 

/* PAGE DASHBOARD a blog box nd upon click it takes the whole zone to show recent articles, and main articles and how to manage articles */