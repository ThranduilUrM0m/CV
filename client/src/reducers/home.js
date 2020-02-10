export default (state={
        articles: [], 
        classrooms: [],
        courses: [],
        exams: [],
        homeworks: [],
        letters: [],
        reports: [],
        schools: [],
        students: [],
        subjects: [],
        modules: [],
        events: [],
        user: {},
    }, action) => {
    switch(action.type) {
        //ARTICLE
        case 'HOME_PAGE_LOADED':
            return {
                ...state,
                articles: action.data.articles,
            };
        case 'SUBMIT_ARTICLE':
            return {
                ...state,
                articles: ([action.data.article]).concat(state.articles),
            };
        case 'DELETE_ARTICLE':
            return {
                ...state,
                articles: state.articles.filter((article) => article._id !== action.id),
            };
        case 'SET_EDIT':
            return {
                ...state,
                articleToEdit: action.article,
            };
        case 'EDIT_ARTICLE':
            return {
                ...state,
                articles: state.articles.map((article) => {
                    if(article._id === action.data.article._id) {
                        return {
                            ...action.data.article,
                        }
                    }
                    return article;
                }),
                articleToEdit: undefined,
            };
        
        //CLASSROOM
        case 'CLASSROOM_PAGE_LOADED':
            return {
                ...state,
                classrooms: action.data.classrooms,
            };
        case 'SUBMIT_CLASSROOM':
            return {
                ...state,
                classrooms: ([action.data.classroom]).concat(state.classrooms),
            };
        case 'DELETE_CLASSROOM':
            return {
                ...state,
                classrooms: state.classrooms.filter((classroom) => classroom._id !== action.id),
            };
        case 'SET_EDIT_CLASSROOM':
            return {
                ...state,
                classroomToEdit: action.classroom,
            };
        case 'EDIT_CLASSROOM':
            return {
                ...state,
                classrooms: state.classrooms.map((classroom) => {
                    if(classroom._id === action.data.classroom._id) {
                        return {
                            ...action.data.classroom,
                        }
                    }
                    return classroom;
                }),
                classroomToEdit: undefined,
            };

        //COURSE
        case 'COURSE_PAGE_LOADED':
            return {
                ...state,
                courses: action.data.courses,
            };
        case 'SUBMIT_COURSE':
            return {
                ...state,
                courses: ([action.data.course]).concat(state.courses),
            };
        case 'DELETE_COURSE':
            return {
                ...state,
                courses: state.courses.filter((course) => course._id !== action.id),
            };
        case 'SET_EDIT_COURSE':
            return {
                ...state,
                courseToEdit: action.course,
            };
        case 'EDIT_COURSE':
            return {
                ...state,
                courses: state.courses.map((course) => {
                    if(course._id === action.data.course._id) {
                        return {
                            ...action.data.course,
                        }
                    }
                    return course;
                }),
                courseToEdit: undefined,
            };

        //EXAM
        case 'EXAM_PAGE_LOADED':
            return {
                ...state,
                exams: action.data.exams,
            };
        case 'SUBMIT_EXAM':
            return {
                ...state,
                exams: ([action.data.exam]).concat(state.exams),
            };
        case 'DELETE_EXAM':
            return {
                ...state,
                exams: state.exams.filter((exam) => exam._id !== action.id),
            };
        case 'SET_EDIT_EXAM':
            return {
                ...state,
                examToEdit: action.exam,
            };
        case 'EDIT_EXAM':
            return {
                ...state,
                exams: state.exams.map((exam) => {
                    if(exam._id === action.data.exam._id) {
                        return {
                            ...action.data.exam,
                        }
                    }
                    return exam;
                }),
                examToEdit: undefined,
            };

        //HOMEWORK
        case 'HOMEWORK_PAGE_LOADED':
            return {
                ...state,
                homeworks: action.data.homeworks,
            };
        case 'SUBMIT_HOMEWORK':
            return {
                ...state,
                homeworks: ([action.data.homework]).concat(state.homeworks),
            };
        case 'DELETE_HOMEWORK':
            return {
                ...state,
                homeworks: state.homeworks.filter((homework) => homework._id !== action.id),
            };
        case 'SET_EDIT_HOMEWORK':
            return {
                ...state,
                homeworkToEdit: action.homework,
            };
        case 'EDIT_HOMEWORK':
            return {
                ...state,
                homeworks: state.homeworks.map((homework) => {
                    if(homework._id === action.data.homework._id) {
                        return {
                            ...action.data.homework,
                        }
                    }
                    return homework;
                }),
                homeworkToEdit: undefined,
            };

        //LETTER
        case 'LETTER_PAGE_LOADED':
            return {
                ...state,
                letters: action.data.letters,
            };
        case 'SUBMIT_LETTER':
            return {
                ...state,
                letters: ([action.data.letter]).concat(state.letters),
            };
        case 'DELETE_LETTER':
            return {
                ...state,
                letters: state.letters.filter((letter) => letter._id !== action.id),
            };
        case 'SET_EDIT_LETTER':
            return {
                ...state,
                letterToEdit: action.letter,
            };
        case 'EDIT_LETTER':
            return {
                ...state,
                letters: state.letters.map((letter) => {
                    if(letter._id === action.data.letter._id) {
                        return {
                            ...action.data.letter,
                        }
                    }
                    return letter;
                }),
                letterToEdit: undefined,
            };

        //REPORT
        case 'REPORT_PAGE_LOADED':
            return {
                ...state,
                reports: action.data.reports,
            };
        case 'SUBMIT_REPORT':
            return {
                ...state,
                reports: ([action.data.report]).concat(state.reports),
            };
        case 'DELETE_REPORT':
            return {
                ...state,
                reports: state.reports.filter((report) => report._id !== action.id),
            };
        case 'SET_EDIT_REPORT':
            return {
                ...state,
                reportToEdit: action.report,
            };
        case 'EDIT_REPORT':
            return {
                ...state,
                reports: state.reports.map((report) => {
                    if(report._id === action.data.report._id) {
                        return {
                            ...action.data.report,
                        }
                    }
                    return report;
                }),
                reportToEdit: undefined,
            };

        //SCHOOL
        case 'SCHOOL_PAGE_LOADED':
            return {
                ...state,
                schools: action.data.schools,
            };
        case 'SUBMIT_SCHOOL':
            return {
                ...state,
                schools: ([action.data.school]).concat(state.schools),
            };
        case 'DELETE_SCHOOL':
            return {
                ...state,
                schools: state.schools.filter((school) => school._id !== action.id),
            };
        case 'SET_EDIT_SCHOOL':
            return {
                ...state,
                schoolToEdit: action.school,
            };
        case 'EDIT_SCHOOL':
            return {
                ...state,
                schools: state.schools.map((school) => {
                    if(school._id === action.data.school._id) {
                        return {
                            ...action.data.school,
                        }
                    }
                    return school;
                }),
                schoolToEdit: undefined,
            };

        //STUDENT
        case 'STUDENT_PAGE_LOADED':
            return {
                ...state,
                students: action.data.students,
            };
        case 'SUBMIT_STUDENT':
            return {
                ...state,
                students: ([action.data.student]).concat(state.students),
            };
        case 'DELETE_STUDENT':
            return {
                ...state,
                students: state.students.filter((student) => student._id !== action.id),
            };
        case 'SET_EDIT_STUDENT':
            return {
                ...state,
                studentToEdit: action.student,
            };
        case 'EDIT_STUDENT':
            return {
                ...state,
                students: state.students.map((student) => {
                    if(student._id === action.data.student._id) {
                        return {
                            ...action.data.student,
                        }
                    }
                    return student;
                }),
                studentToEdit: undefined,
            };

        //SUBJECT
        case 'SUBJECT_PAGE_LOADED':
            return {
                ...state,
                subjects: action.data.subjects,
            };
        case 'SUBMIT_SUBJECT':
            return {
                ...state,
                subjects: ([action.data.subject]).concat(state.subjects),
            };
        case 'DELETE_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.filter((subject) => subject._id !== action.id),
            };
        case 'SET_EDIT_SUBJECT':
            return {
                ...state,
                subjectToEdit: action.subject,
            };
        case 'EDIT_SUBJECT':
            return {
                ...state,
                subjects: state.subjects.map((subject) => {
                    if(subject._id === action.data.subject._id) {
                        return {
                            ...action.data.subject,
                        }
                    }
                    return subject;
                }),
                subjectToEdit: undefined,
            };

        //MODULE
        case 'MODULE_PAGE_LOADED':
            return {
                ...state,
                modules: action.data.modules,
            };
        case 'SUBMIT_MODULE':
            return {
                ...state,
                modules: ([action.data.module]).concat(state.modules),
            };
        case 'DELETE_MODULE':
            return {
                ...state,
                modules: state.modules.filter((module) => module._id !== action.id),
            };
        case 'SET_EDIT_MODULE':
            return {
                ...state,
                moduleToEdit: action.module,
            };
        case 'EDIT_MODULE':
            return {
                ...state,
                modules: state.modules.map((module) => {
                    if(module._id === action.data.module._id) {
                        return {
                            ...action.data.module,
                        }
                    }
                    return module;
                }),
                moduleToEdit: undefined,
            };

        //EVENT
        case 'EVENT_PAGE_LOADED':
            return {
                ...state,
                events: action.data.events,
            };
        case 'SUBMIT_EVENT':
            return {
                ...state,
                events: ([action.data.event]).concat(state.events),
            };
        case 'DELETE_EVENT':
            return {
                ...state,
                events: state.events.filter((event) => event._id !== action.id),
            };
        case 'SET_EDIT_EVENT':
            return {
                ...state,
                eventToEdit: action.event,
            };
        case 'EDIT_EVENT':
            return {
                ...state,
                events: state.events.map((event) => {
                    if(event._id === action.data.event._id) {
                        return {
                            ...action.data.event,
                        }
                    }
                    return event;
                }),
                eventToEdit: undefined,
            };

        //USER
        case 'USER_PAGE_LOADED':
            return {
                user: action.data.user,
            };
        case 'SUBMIT_USER':
            return {
                ...state,
                users: ([action.data.user]).concat(state.user),
            };
        case 'DELETE_USER':
            return {
                ...state,
                users: state.users.filter((user) => user._id !== action.id),
            };
        case 'SET_EDIT_USER':
            return {
                ...state,
                userToEdit: action.user,
            };
        case 'EDIT_USER':
            return {
                ...state,
                users: state.users.map((user) => {
                    if(user._id === action.data.user._id) {
                        return {
                            ...action.data.user,
                        }
                    }
                    return user;
                }),
                userToEdit: undefined,
            };

        //DASHBOARD
        case 'DASHBOARD_PAGE_LOADED':
            return {
                ...state,
                articles: action.data.articles,
                classrooms: action.data.classrooms,
                courses: action.data.courses,
                exams: action.data.exams,
                homeworks: action.data.homeworks,
                letters: action.data.letters,
                reports: action.data.reports,
                schools: action.data.schools,
                students: action.data.students,
                subjects: action.data.subjects,
                user: action.data.user,
            };

        default:
            return state;
    }
};