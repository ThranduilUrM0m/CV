import React from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize-module';
import API from "../../../utils/API";
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

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _user: {},
            title: '',
            body: '',
            author: '',
            categorie: '',
            _hide: false,
            tag: [],
            tagInput: '',
            comment: [],
            upvotes: [],
            downvotes: [],
            view: [],
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleInputKeyDown = this.handleInputKeyDown.bind(this);
    }
    componentDidMount() {
        this.get_user();
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.articleToEdit) {
            this.setState({
                title: nextProps.articleToEdit.title,
                body: nextProps.articleToEdit.body,
                author: nextProps.articleToEdit.author,
                categorie: nextProps.articleToEdit.categorie,
                _hide: nextProps.articleToEdit._hide,
                tag: nextProps.articleToEdit.tag,
                tagInput: nextProps.articleToEdit.tagInput,
                comment: nextProps.articleToEdit.comment,
                upvotes: nextProps.articleToEdit.upvotes,
                downvotes: nextProps.articleToEdit.downvotes,
                view: nextProps.articleToEdit.view,
            });
        }
    }
	async get_user() {
        const self = this;
        try {
            const { data } = await API.get_user(localStorage.getItem('email'));
			self.setState({
                _user: data.user,
                author: data.user.username,
			});
        } catch (error) {
            console.error(error);
        }
    }
    handleSubmit(){
        const { onSubmit, articleToEdit, onEdit } = this.props;
        const { title, body, author, categorie, _hide, tag, tagInput, comment, upvotes, downvotes, view } = this.state;
        const self = this;
        
        if(!articleToEdit) {
            return axios.post('/api/articles', {
                title,
                body,
                author,
                categorie,
                _hide,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => onSubmit(res.data))
                .then(function() {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        body: '',
                        author: '',
                        categorie: '',
                        _hide: false,
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: [],
                        downvotes: [],
                        view: [],
                    })
                }).catch(error => {
                    console.log(error.response)
                });
        } else {
            return axios.patch(`/api/articles/${articleToEdit._id}`, {
                title,
                body,
                author,
                categorie,
                _hide,
                tag,
                comment,
                upvotes,
                downvotes,
                view,
            })
                .then((res) => onEdit(res.data))
                .then(function() {
                    var element = document.getElementsByClassName("ql-editor");
                    element[0].innerHTML = "";
                    self.setState({ 
                        title: '',
                        body: '',
                        author: '',
                        categorie: '',
                        _hide: false,
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: [],
                        downvotes: [],
                        view: [],
                    })
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
            body: value,
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
        const { articleToEdit } = this.props;
        const { title, body, author, categorie, _hide, tag, tagInput } = this.state;
    
        return (
            <div className="wrapper_form">
                <div className="row">
                    <div className="input-field col s12">
                        <input
                            className="validate form-group-input title_article" 
                            id="title_article" 
                            type="text" 
                            name="title_article" 
                            required="required"
                            value={title}
                            onChange={(ev) => this.handleChangeField('title', ev)}
                        />
                        <label htmlFor='title_article' className={title ? 'active' : ''}>Title</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <ReactQuill id="editor"
                            value={body}
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
                                className="validate form-group-input tag_article"
                                value={tagInput}
                                onChange={(ev) => this.handleChangeField('tagInput', ev)}
                                onKeyDown={(ev) => this.handleInputKeyDown('tag', ev)}
                                id="tag_article" 
                                type="text" 
                                name="tag_article"
                            />
                        </ul>
                        <label htmlFor='tag_article' className={tag ? 'active' : ''}>Tags</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <input
                            className="validate form-group-input author__hide" 
                            id="author__hide" 
                            type="checkbox"
                            name="author__hide" 
                            required="required"
                            value={_hide}
                            checked={_hide}
                            onClick={(ev) => this.handleChangeField('_hide', ev)}
                        />
                        <label className={_hide ? 'active' : ''} htmlFor="author__hide"><i className={_hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></label>
                    </div>
                </div>

                <div className="row">
                    <div className="input-field col s12">
                        <select 
                            value={categorie}
                            onChange={(ev) => this.handleChangeField('categorie', ev)}
                            className="form-group-input categorie_article" 
                            id="categorie_article" 
                            name="categorie_article"
                        >
                            <option value=""></option>
                            <option value="Education">Education</option>
                            <option value="Design">Design</option>
                            <option value="Community">Community</option>
                            <option value="Tutorials">Tutorials</option>
                        </select>
                        <label htmlFor='categorie_article' className={categorie ? 'active' : ''}>Categorie</label>
                        <div className="form-group-line"></div>
                    </div>
                </div>

                <button onClick={this.handleSubmit} className="btn btn-primary float-right submit_article">{articleToEdit ? 'Update' : 'Submit'}</button>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => ({
    onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
    onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
	onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
	onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
	setEdit: article => dispatch({ type: 'SET_EDIT', article }),
}) 
  
const mapStateToProps = state => ({
    articleToEdit: state.home.articleToEdit,
}) 
  
export default connect(mapStateToProps, mapDispatchToProps)(Form) 