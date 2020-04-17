export default (state={
        articles: [],
        events: [],
        experiences: [],
        projects: [],
        testimonies: [],
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

        //EXPERIENCE
        case 'EXPERIENCE_PAGE_LOADED':
            return {
                ...state,
                experiences: action.data.experiences,
            };
        case 'SUBMIT_EXPERIENCE':
            return {
                ...state,
                experiences: ([action.data.experience]).concat(state.experiences),
            };
        case 'DELETE_EXPERIENCE':
            return {
                ...state,
                experiences: state.experiences.filter((experience) => experience._id !== action.id),
            };
        case 'SET_EDIT_EXPERIENCE':
            return {
                ...state,
                experienceToEdit: action.experience,
            };
        case 'EDIT_EXPERIENCE':
            return {
                ...state,
                experiences: state.experiences.map((experience) => {
                    if(experience._id === action.data.experience._id) {
                        return {
                            ...action.data.experience,
                        }
                    }
                    return experience;
                }),
                experienceToEdit: undefined,
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

        //TESTIMONY
        case 'TESTIMONY_PAGE_LOADED':
            return {
                ...state,
                testimonies: action.data.testimonies,
            };
        case 'SUBMIT_TESTIMONY':
            return {
                ...state,
                testimonies: ([action.data.testimony]).concat(state.testimonies),
            };
        case 'DELETE_TESTIMONY':
            return {
                ...state,
                testimonies: state.testimonies.filter((testimony) => testimony._id !== action.id),
            };
        case 'SET_EDIT_TESTIMONY':
            return {
                ...state,
                testimonyToEdit: action.testimony,
            };
        case 'EDIT_TESTIMONY':
            return {
                ...state,
                testimonies: state.testimonies.map((testimony) => {
                    if(testimony._id === action.data.testimony._id) {
                        return {
                            ...action.data.testimony,
                        }
                    }
                    return testimony;
                }),
                testimonyToEdit: undefined,
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

        default:
            return state;
    }
};