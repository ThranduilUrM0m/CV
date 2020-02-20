export default (state={
        articles: [], 
        letters: [],
        events: [],
        projects: [],
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

        //PROJECT
        case 'PROJECT_PAGE_LOADED':
            return {
                ...state,
                projects: action.data.projects,
            };
        case 'SUBMIT_PROJECT':
            return {
                ...state,
                projects: ([action.data.project]).concat(state.projects),
            };
        case 'DELETE_PROJECT':
            return {
                ...state,
                projects: state.projects.filter((project) => project._id !== action.id),
            };
        case 'SET_EDIT_PROJECT':
            return {
                ...state,
                projectToEdit: action.project,
            };
        case 'EDIT_PROJECT':
            return {
                ...state,
                projects: state.projects.map((project) => {
                    if(project._id === action.data.project._id) {
                        return {
                            ...action.data.project,
                        }
                    }
                    return project;
                }),
                projectToEdit: undefined,
            };

        //DASHBOARD
        case 'DASHBOARD_PAGE_LOADED':
            return {
                ...state,
                articles: action.data.articles,
                events: action.data.events,
                letters: action.data.letters,
                projects: action.data.projects,
                user: action.data.user,
            };

        default:
            return state;
    }
};