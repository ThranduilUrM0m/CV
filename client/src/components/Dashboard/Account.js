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
        const { _user, _old_username, _old_email, _current_password, _new_password, _confirm_password } = this.state;
        if (!_user.username || _user.username.length === 0) return;
        if (!_user.email || _user.email.length === 0) return;
        if (_new_password){
            if(!_current_password || !_confirm_password) return;
            if(_new_password !== _confirm_password) return;
        }
        try {
            const { data } = await API.update({ _user, _old_username, _old_email, _current_password, _new_password });
            $('#edit_modal').modal('toggle');
        } catch (error) {
            console.error(error);
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
        const { _user, _current_password, _new_password, _confirm_password } = this.state;
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
                                <label htmlFor='_confirm_password' className={_confirm_password ? 'active' : ''}>Password</label>
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