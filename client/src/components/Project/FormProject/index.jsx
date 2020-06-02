import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill';
import API from "../../../utils/API";
import ImageResize from 'quill-image-resize-module';
import ImageUploader from "quill-image-uploader";
import socketIOClient from "socket.io-client";

const socketURL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname
    : 'localhost:8800';
    
const socket = socketIOClient(socketURL, {'transports': ['websocket', 'polling']});
Quill.register('modules/ImageResize', ImageResize);
Quill.register("modules/imageUploader", ImageUploader);

var _ = require('lodash');
const modules = {
    ImageResize: {
        displaySize: true
    },
    imageUploader: {
        upload: file => {
            return new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append("image", file);

                fetch(
                    "https://api.imgbb.com/1/upload?key=9706800c95076c894e2699f44dbc5b45",
                    {
                        method: "POST",
                        body: formData
                    }
                )
                .then(response => response.json())
                .then(result => {
                    resolve(result.data.url);
                })
                .catch(error => {
                    reject("Upload failed");
                    console.error("Error:", error);
                });
            });
        }
    },
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }]
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        ['clean']
    ],
}

class FormProject extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _user: {},
            title: '',
            image: '',
            link_to: '',
            author: '',
            _hide: false,
            tag: [],
            tagInput: '',
            comment: [],
            upvotes: {},
            downvotes: {},
            view: [],
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    }
    componentWillMount() {
        const self = this;
        this.get_user();
        socket.on("USER_UPDATED_GET", data => self.get_user());
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.projectToEdit) {
            this.setState({
                title: nextProps.projectToEdit.title,
                image: nextProps.projectToEdit.image,
                link_to: nextProps.projectToEdit.link_to,
                author: nextProps.projectToEdit.author,
                _hide: nextProps.projectToEdit._hide,
                tag: nextProps.projectToEdit.tag,
                tagInput: nextProps.projectToEdit.tagInput,
                comment: nextProps.projectToEdit.comment,
                upvotes: nextProps.projectToEdit.upvotes,
                downvotes: nextProps.projectToEdit.downvotes,
                view: nextProps.projectToEdit.view,
            });
        } else {
            this.setState({
                title: '',
                image: '',
                link_to: '',
                author: '',
                _hide: false,
                tag: [],
                tagInput: '',
                comment: [],
                upvotes: {},
                downvotes: {},
                view: [],
            });
        }
    }
	async get_user() {
        const self = this;
        try {
            await API.get_user(localStorage.getItem('email'))
            .then((res) => {
                self.setState({
                    _user: res.data.user,
                    author: res.data.user.username,
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
    handleSubmit() {
        const { onSubmitProject, projectToEdit, onEditProject, onSubmitNotification } = this.props;
        const { title, image, link_to, author, _hide, tag, comment, upvotes, downvotes, view } = this.state;
        const self = this;

        if(!projectToEdit) {
            return axios.post('/api/projects', {
                title,
                image,
                link_to,
                author,
                _hide,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => {
                    onSubmitProject(res.data);
                    return axios.post('/api/notifications', {
                        type: 'Project Created',
                        description: '\''+author+'\' created \''+title+'\'',
                        author: author
                    })
                    .then((res_n) => onSubmitNotification(res_n.data))
                    .catch(error => {
                        console.log(error)
                    });
                })
                .then(() => {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        image: '',
                        link_to: '',
                        author: '',
                        _hide: false,
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: {},
                        downvotes: {},
                        view: [],
                    });
                })
                .catch(error => {
                    console.log(error.response)
                });
        } else {
            return axios.patch(`/api/projects/${projectToEdit._id}`, {
                title,
                image,
                link_to,
                author,
                _hide,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => {
                    onEditProject(res.data);
                    return axios.post('/api/notifications', {
                        type: 'Project Edited',
                        description: '\''+author+'\' edited \''+title+'\'',
                        author: author
                    })
                    .then((res_n) => onSubmitNotification(res_n.data))
                    .catch(error => {
                        console.log(error)
                    });
                })
                .then(() => {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        image: '',
                        link_to: '',
                        author: '',
                        _hide: false,
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: {},
                        downvotes: {},
                        view: [],
                    });
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
        });
        if(key === '_hide') {
            this.setState({
                [key]: event.target.checked,
            })
        }
    }
    handleChange(value) {
        this.setState({
            image: value,
        });
    }
    handleInputKeyDown(key, event) {
        if ( event.keyCode === 32 || event.keyCode === 9 || event.keyCode === 13 ) {
            const { value } = event.target;
            event.stopPropagation();
            this.setState(state => ({
                tag: [...state.tag, _.camelCase(value)],
                tagInput: ''
            }));
        }
        if ( this.state.tag.length && event.keyCode === 8 && !this.state.tagInput.length ) {
            this.setState(state => ({
                tag: state.tag.slice(0, state.tag.length - 1)
            }));
        }
    }
    render() {
        const { projectToEdit } = this.props;
        const { title, image, link_to, _hide, tag, tagInput } = this.state;
    
        return (
            <div className="wrapper_form">
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            className="validate form-group-input title_project" 
                            id="title_project" 
                            type="text" 
                            name="title_project" 
                            required="required"
                            value={title}
                            onChange={(ev) => this.handleChangeField('title', ev)}
                        />
                        <label htmlFor='title_project' className={title ? 'active' : ''}>Title</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <ReactQuill id="editor"
                            value={image}
                            onChange={this.handleChange}
                            debug='info'
                            placeholder='Compose an epic...'
                            theme='snow' 
                            modules={modules}
                            />

                <div className="row">
                    <div className="input-field col s12">
                        <ul className="tag_Container">
                            {
                                tag.map((item, i) =>
                                    <li key={i}>
                                        {item}
                                    </li>
                                )
                            }
                            <input
                                className="validate form-group-input tag_project"
                                value={tagInput}
                                onChange={(ev) => this.handleChangeField('tagInput', ev)}
                                onKeyDown={(ev) => this.handleInputKeyDown('tag', ev)}
                                id="tag_project" 
                                type="text" 
                                name="tag_project"
                            />
                        </ul>
                        <label htmlFor='tag_project' className={tag ? 'active' : ''}>Tags</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12 checkbox_hide">
                        <p>
                            <label>
                                <input 
                                className="validate form-group-input author__hide" 
                                id="author__hide" 
                                type="checkbox"
                                name="author__hide" 
                                required="required"
                                value={_hide}
                                checked={_hide}
                                onChange={(ev) => this.handleChangeField('_hide', ev)}
                                />
                                <span><i className={_hide ? 'far fa-eye-slash' : 'far fa-eye'}></i>Hide Project ?</span>
                            </label>
                        </p>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input
                            className="validate form-group-input link_to_project" 
                            id="link_to_project" 
                            type="text" 
                            name="link_to_project" 
                            required="required"
                            value={link_to}
                            onChange={(ev) => this.handleChangeField('link_to', ev)}
                        />
                        <label htmlFor='link_to_project' className={link_to ? 'active' : ''}>Author</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <button onClick={this.handleSubmit} className="btn btn-primary float-right submit_project">{projectToEdit ? 'Update' : 'Submit'}</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmitProject: data => dispatch({ type: 'SUBMIT_PROJECT', data }),
    onEditProject: data => dispatch({ type: 'EDIT_PROJECT', data }),
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
	onDeleteProject: id => dispatch({ type: 'DELETE_PROJECT', id }),
    setEditProject: project => dispatch({ type: 'SET_EDIT', project }),
    
    onSubmitNotification: data => dispatch({ type: 'SUBMIT_NOTIFICATION', data }),
})
  
const mapStateToProps = state => ({
    projectToEdit: state.home.projectToEdit,
})
  
export default connect(mapStateToProps, mapDispatchToProps)(FormProject) 