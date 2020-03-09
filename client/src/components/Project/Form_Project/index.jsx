import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
Quill.register('modules/ImageResize', ImageResize);

var _ = require('lodash');
const modules = {
    ImageResize: {
        displaySize: true
    },
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],                                        // image and link
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
        [{ 'direction': 'rtl' }],                         // text direction
        ['clean']
    ],
}

class Form_Project extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            image: '',
            link_to: '',
            author: '',
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
    componentWillReceiveProps(nextProps) {
        if(nextProps.projectToEdit) {
            this.setState({
                title: nextProps.projectToEdit.title,
                image: nextProps.projectToEdit.image,
                link_to: nextProps.projectToEdit.link_to,
                author: nextProps.projectToEdit.author,
                tag: nextProps.projectToEdit.tag,
                tagInput: nextProps.projectToEdit.tagInput,
                comment: nextProps.projectToEdit.comment,
                upvotes: nextProps.projectToEdit.upvotes,
                downvotes: nextProps.projectToEdit.downvotes,
                view: nextProps.projectToEdit.view,
            });
        }
    }
    handleSubmit() {
        const { onSubmitProject, projectToEdit, onEditProject } = this.props;
        const { title, image, link_to, author, tag, tagInput, comment, upvotes, downvotes, view } = this.state;
        const self = this;
        if(!projectToEdit) {
            return axios.post('http://localhost:8800/api/projects', {
                title,
                image,
                link_to,
                author,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => onSubmitProject(res.data))
                .then(function() {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        image: '',
                        link_to: '',
                        author: '',
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: {},
                        downvotes: {},
                        view: [],
                    })
                });
        } else {
            return axios.patch(`http://localhost:8800/api/projects/${projectToEdit._id}`, {
                title,
                image,
                link_to,
                author,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => onEditProject(res.data))
                .then(function() {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        image: '',
                        link_to: '',
                        author: '',
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: {},
                        downvotes: {},
                        view: [],
                    })
                });
        }
    }
    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
        });
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
        const { title, image, link_to, author, tag, tagInput } = this.state;
    
        return (
            <div className="wrapper_form">

                <input
                onChange={(ev) => this.handleChangeField('title', ev)}
                value={title}
                className="form-control my-3 title_project"
                placeholder="Title"
                />

                <ReactQuill id="editor"
                            value={image}
                            onChange={this.handleChange}
                            debug='info'
                            placeholder='Compose an epic...'
                            theme='snow' 
                            modules={modules}
                            />

                <ul className="tag_Container">
                    {
                        tag.map((item, i) =>
                            <li key={i}>
                                {item}
                            </li>
                        )
                    }
                    <input
                    className="form-control my-3 tag_project"
                    value={tagInput}
                    onChange={(ev) => this.handleChangeField('tagInput', ev)}
                    onKeyDown={(ev) => this.handleInputKeyDown('tag', ev)}
                    placeholder="#"
                    />
                </ul>

                <input
                onChange={(ev) => this.handleChangeField('author', ev)}
                value={author}
                className="form-control my-3 author_project"
                placeholder="Author"
                />

                <input
                onChange={(ev) => this.handleChangeField('link_to', ev)}
                value={link_to}
                className="form-control my-3 link_to_project"
                placeholder="Link"
                />

                <button onClick={this.handleSubmit} className="btn btn-primary float-right submit_project">{projectToEdit ? 'Update' : 'Submit'}</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmitProject: data => dispatch({ type: 'SUBMIT_PROJECT', data }),
	onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
	onDeleteProject: id => dispatch({ type: 'DELETE_PROJECT', id }),
	setEditProject: project => dispatch({ type: 'SET_EDIT', project }),
}) 
  
const mapStateToProps = state => ({
    projectToEdit: state.home.projectToEdit,
}) 
  
export default connect(mapStateToProps, mapDispatchToProps)(Form_Project) 