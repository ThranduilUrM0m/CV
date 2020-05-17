import React from "react";
import 'whatwg-fetch';
import API from '../../utils/API';
import $ from 'jquery';

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
        this.get_user = this.get_user.bind(this);
        this.send_user = this.send_user.bind(this);
        this._progress = this._progress.bind(this);
    }
    componentDidMount() {
        this.get_user();
    }
	async get_user() {
        const self = this;
        try {
            const { data } = await API.get_user(localStorage.getItem('email'));
			self.setState({
                _user: data.user,
                _old_username: data.user.username,
                _old_email: data.user.email,
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
                if(_new_password !== _confirm_password) throw { text: 'Please check your password confirmation'};
            }
            await API.update({ _user, _old_username, _old_email, _current_password, _new_password })
            .then((res) => {
                self.setState({
                    modal_msg: res.data.text
                }, () => {
                    self.get_user();
                    $('#edit_modal').modal('toggle');
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
        this.setState({ [key]: event.target.value });
    }
    _progress(user) {
        function percentage(partialValue, totalValue) {
            return (100 * partialValue) / totalValue;
        }

        var count = 0;
        let total = 0;
        Object.keys(user).forEach(function(key,index) {
            if(key !== '_id' && key !== 'activated' && key !== 'messages' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v'){
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
            if(key !== '_id' && key !== 'activated' && key !== 'messages' && key !== 'createdAt' && key !== 'updatedAt' && key !== '__v')
                count += 1;
        });
        return _.ceil(count, 0);
    }
    render() {
        const { _user, _current_password, _new_password, _confirm_password, modal_msg } = this.state;
        return (
            <>
                <div className="modal fade" id="edit_modal_error" tabIndex="-1" role="dialog" aria-labelledby="edit_modal_errorLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                <h5 className="modal-title" id="edit_modal_errorLabel">Hey!</h5>
                                <div>{ modal_msg }</div>
                                <div><small>Thanks {localStorage.getItem('username')}</small></div>
                            </div>
                        </div>
                    </div>
                </div>
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

export default Account;