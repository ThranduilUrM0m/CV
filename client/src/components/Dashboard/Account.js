import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import 'whatwg-fetch';
import API from '../../utils/API';
import $ from 'jquery';
import socketIOClient from "socket.io-client";

const socket = socketIOClient('');
var _ = require('lodash');

class Account extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            _user: {
                username: '',
                email: '',
            },
            _old_username: '',
            _old_email: '',
            _current_password: '',
            _new_password: '',
            _confirm_password: '',
            modal_msg: '',
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.set_articles_author = this.set_articles_author.bind(this);
		this.handleEditArticle = this.handleEditArticle.bind(this);
        this.get_user = this.get_user.bind(this);
        this.send_user = this.send_user.bind(this);
        this._progress = this._progress.bind(this);
    }
    componentWillMount() {
        this.get_user();
    }
    set_articles_author(_old_username, _new_username) {
        const self = this;

        axios('/api/articles')
        .then(function (response) {
            _.map(response.data.articles, (article) => {
                if(article.author == _old_username) {
                    function setEditFunction() {
                        return new Promise((resolve, reject) => {
                            setTimeout(function() {
                                self.handleEditArticle(article);
                                true ? resolve('Success') : reject('Error');
                            }, 2000);
                        })
                    }
                    setEditFunction()
                        .then(() => {
                            self.handleSubmit(_new_username);
                        });
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    handleEditArticle(article) {
        const { setEdit } = this.props;
        setEdit(article);
    }
    handleSubmit(_new_username){
        const { onSubmitNotification, articleToEdit, onEdit } = this.props;
        const { title, body, author, categorie, _hide, tag, comment, upvotes, downvotes, view } = this.state;
        
        const self = this;
        
        return axios.patch(`/api/articles/${articleToEdit._id}`, {
            author: _new_username,
        })
            .then((res) => {
                onEdit(res.data);
                return axios.post('/api/notifications', {
                    type: 'Article Edited',
                    description: '\''+author+'\' edited \''+title+'\'',
                    author: author
                })
                .then((res_n) => onSubmitNotification(res_n.data))
                .catch(error => {
                    console.log(error)
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
	async get_user() {
        const self = this;
        try {
            const { data } = await API.get_user(localStorage.getItem('email'));
			self.setState({
                _user: data.user,
                _old_username: data.user.username,
                _old_email: data.user.email,
                _current_password: '',
                _new_password: '',
                _confirm_password: '',
			});
        } catch (error) {
            console.error(error);
        }
    }
    async send_user() {
        let self = this;
        const { _user, _old_username, _old_email, _current_password, _new_password, _confirm_password } = this.state;
        
        try {
            if (_new_password){
                if(!_current_password || !_confirm_password) throw { text: 'Please fill out your old password and confirm it, if you have forgotten your password, please do contact the admin'};
                if(_new_password != _confirm_password) throw { text: 'Please check your password confirmation'};
            }
            await API.update({ _user, _old_username, _old_email, _current_password, _new_password })
            .then((res) => {
                self.setState({
                    modal_msg: res.data.text
                }, () => {
                    self.set_articles_author(_old_username, _user.username);
                    self.get_user();
                    $('#edit_modal').modal('toggle');
                    socket.on("USER_UPDATED_GET", data => self.get_user());
                    socket.emit("USER_UPDATED", res.data.text);
                })
            })
            .catch((error) => {
                self.setState({
					modal_msg: error.response.data.text
				}, () => {
					$('#edit_modal_error').modal('toggle');
				});
            });
        } catch (error) {
            self.setState({
				modal_msg: JSON.stringify(error)
			}, () => {
				$('#edit_modal_error').modal('toggle');
			});
        }
    }
    handleChangeField(key, event) {
        const self = this;
        const value = event.target.value;
        if(key === 'username' || key === 'email') {
            self.setState(prevState => ({
                _user: {
                    ...prevState._user,
                    [key]: value
                }
            }));
        } else {
            this.setState({ [key]: value });
        }
    }
    _progress(user) {
        function percentage(partialValue, totalValue) {
            return (100 * partialValue) / totalValue;
        }

        var count = 0;
        let total = 0;
        Object.keys(user).forEach(function(key,index) {
            if(key != '_id' && key != 'activated' && key != 'messages' && key != 'createdAt' && key != 'updatedAt' && key != '__v'){
                total += 1;
                count += (!user[key] ? 0 : 1);
            }
        });

        $('.bar').width(_.ceil(percentage(count, total), 0)+'%');
        return _.ceil(percentage(count, total), 0);
    }
    _progress_total(user) {
        var count = 0;
        Object.keys(user).forEach(function(key,index) {
            if(key != '_id' && key != 'activated' && key != 'messages' && key != 'createdAt' && key != 'updatedAt' && key != '__v')
                count += 1;
        });
        return _.ceil(count, 0);
    }
    render() {
        const { _user, _current_password, _new_password, _confirm_password, modal_msg } = this.state;
        return (
            <>
                <div className="_form">
                    <div className="modal-content_user">
                        <div className='row'>
                            <div className='input-field col s3'>
                                <input 
                                className='validate form-group-input username' 
                                type='text' 
                                name='username' 
                                id='username' 
                                required="required"
                                onChange={(ev) => this.handleChangeField('username', ev)}
                                value={_user.username}
                                />
                                <label htmlFor='username' className={_user.username ? 'active' : ''}>username</label>
                                <div className="form-group-line"></div>
                            </div>
                            <div className='input-field col s3'>
                                <input 
                                className='validate form-group-input email' 
                                type='email' 
                                name='email' 
                                id='email' 
                                required="required"
                                onChange={(ev) => this.handleChangeField('email', ev)}
                                value={_user.email}
                                />
                                <label htmlFor='email' className={_user.email ? 'active' : ''}>Email</label>
                                <div className="form-group-line"></div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='input-field col s3'>
                                <input 
                                className='validate form-group-input _current_password' 
                                type='password' 
                                name='_current_password' 
                                id='_current_password' 
                                required="required" 
                                onChange={(ev) => this.handleChangeField('_current_password', ev)}
                                value={_current_password}
                                autoComplete="new-password"
                                />
                                <label htmlFor='_current_password' className={_current_password ? 'active' : ''}>Current Password</label>
                                <div className="form-group-line"></div>
                            </div>
                            <div className='input-field col s3'>
                                <input 
                                className='validate form-group-input _new_password' 
                                type='password' 
                                name='_new_password' 
                                id='_new_password' 
                                required="required" 
                                onChange={(ev) => this.handleChangeField('_new_password', ev)}
                                value={_new_password}
                                />
                                <label htmlFor='_new_password' className={_new_password ? 'active' : ''}>New Password</label>
                                <div className="form-group-line"></div>
                            </div>
                            <div className='input-field col s3'>
                                <input 
                                className='validate form-group-input' 
                                type='password' 
                                name='_confirm_password' 
                                id='_confirm_password' 
                                required="required" 
                                value={_confirm_password} 
                                onChange={(ev) => this.handleChangeField('_confirm_password', ev)}
                                />
                                <label htmlFor='_confirm_password' className={_confirm_password ? 'active' : ''}>Confirm Password</label>
                                <div className="form-group-line"></div>
                            </div>
                        </div>
                        <button onClick={this.send_user} className="btn btn-primary float-right">Update.</button>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = state => ({
    articleToEdit: state.home.articleToEdit,
});

const mapDispatchToProps = dispatch => ({
    setEdit: article => dispatch({ type: 'SET_EDIT', article }),
    onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
    onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
    
    onSubmitNotification: data => dispatch({ type: 'SUBMIT_NOTIFICATION', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Account);