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

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            body: '',
            author: '',
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
    componentWillReceiveProps(nextProps) {
        if(nextProps.articleToEdit) {
            this.setState({
                title: nextProps.articleToEdit.title,
                body: nextProps.articleToEdit.body,
                author: nextProps.articleToEdit.author,
                tag: nextProps.articleToEdit.tag,
                tagInput: nextProps.articleToEdit.tagInput,
                comment: nextProps.articleToEdit.comment,
                upvotes: nextProps.articleToEdit.upvotes,
                downvotes: nextProps.articleToEdit.downvotes,
                view: nextProps.articleToEdit.view,
            });
        }
    }
    handleSubmit(){
        const { onSubmit, articleToEdit, onEdit } = this.props;
        const { title, body, author, tag, tagInput, comment, upvotes, downvotes, view } = this.state;
        const self = this;
        if(!articleToEdit) {
            return axios.post('http://localhost:8800/api/articles', {
                title,
                body,
                author,
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
                        tag: [],
                        tagInput: '',
                        comment: [],
                        upvotes: [],
                        downvotes: [],
                        view: [],
                    })
                });
        } else {
            return axios.patch(`http://localhost:8800/api/articles/${articleToEdit._id}`, {
                title,
                body,
                author,
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
        const { title, body, author, tag, tagInput } = this.state;
    
        return (
            <div className="wrapper_form">

                <input
                onChange={(ev) => this.handleChangeField('title', ev)}
                value={title}
                className="form-control my-3 title_article"
                placeholder="Title"
                />

                <ReactQuill id="editor"
                            value={body}
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
                    className="form-control my-3 tag_article"
                    value={tagInput}
                    onChange={(ev) => this.handleChangeField('tagInput', ev)}
                    onKeyDown={(ev) => this.handleInputKeyDown('tag', ev)}
                    placeholder="#"
                    />
                </ul>

                <input
                onChange={(ev) => this.handleChangeField('author', ev)}
                value={author}
                className="form-control my-3 author_article"
                placeholder="Author"
                />

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