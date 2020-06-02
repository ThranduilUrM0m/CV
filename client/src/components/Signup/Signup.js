import React from "react";
import axios from 'axios';
import { connect } from 'react-redux';
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import 'bootstrap';
import Fingerprint from 'fingerprintjs';
import * as $ from "jquery";
import socketIOClient from "socket.io-client";

const socketURL =
  process.env.NODE_ENV === 'production'
    ? window.location.hostname
    : 'localhost:8800';
    
const socket = socketIOClient(socketURL, {'transports': ['websocket', 'polling']});

class Signup extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
			confirm_password: '',
			modal_msg: '',
		};
        this.send_signup = this.send_signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount() {
		if(localStorage.getItem('email')) {
			window.location = "/dashboard";
		}
	}
    async send_signup() {
		let self = this;
		var f = new Fingerprint().get();
		var _fingerprint = f.toString();
		var _role = ["normal"];
		const { username, email, password, confirm_password } = this.state;
		const { onSubmitNotification } = this.props;
        try {
			if (password != confirm_password) throw { text: 'Please check your password confirmation'};
			await API.signup({ username, email, password, _fingerprint, _role })
			.then((res) => {
				self.setState({
					modal_msg: res.data.text
				}, () => {
					$('#signup_modal').modal('toggle');
                    socket.emit("USER_UPDATED", res.data.text);
					return axios.post('/api/notifications', {
                        type: 'User Account Created',
                        description: '\''+email+'\' created an account as \''+username+'\'',
                        author: email
                    })
                    .then((res_n) => onSubmitNotification(res_n.data))
                    .catch(error => {
                        console.log(error)
                    });
				});
			})
			.catch((error) => {
				self.setState({
					modal_msg: error.response.data.text
				}, () => {
					$('#signup_modal').modal('toggle');
				});
			});
        } catch (error) {
			self.setState({
				modal_msg: JSON.stringify(error)
			}, () => {
				$('#signup_modal').modal('toggle');
			});
        }
    }
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	render() {
		const { username, email, password, confirm_password, modal_msg } = this.state;
		return (
			<FullPage>
				<Slide>
					<section className="first_section_signup">
						<div className="wrapper_full">
							<div className="modal fade" id="signup_modal" tabIndex="-1" role="dialog" aria-labelledby="signup_modalLabel" aria-hidden="true">
								<div className="modal-dialog" role="document">
									<div className="modal-content">
										<div className="modal-body">
											<a title="Close" className="modal-close" data-dismiss="modal">Close</a>
											<h5 className="modal-title" id="signup_modalLabel">Hello!</h5>
											<div>{modal_msg}</div>
										</div>
									</div>
								</div>
							</div>
							<div className="Content">
							<div className="card">
									<div className="face face1">
										<div className="content">
											<i className="fas fa-sign-in-alt"></i>
											<h3>login.</h3>
										</div>
									</div>
									<div className="face face2">
										<div className="content">
											<a className="text-muted" href="/login">
												<span>
													<span>
														<span data-attr-span="login.">
															login.
														</span>
													</span>
												</span>
											</a>
										</div>
									</div>
								</div>
							</div>
							<div className="Sidebar">
								<div className="wrap">
									<div className="Head_Signup">
										<div>
											<h3>Signup</h3>
										</div>
									</div>
									<div className="Signup">
										<div className='row'>
											<div className='input-field col s12'>
												<input 
												className='validate form-group-input' 
												type='text' 
												name='username' 
												id='username' 
												required="required"
												value={username} 
												onChange={this.handleChange}
												/>
												<label htmlFor='username' className={username ? 'active' : ''}>username</label>
												<div className="form-group-line"></div>
											</div>
										</div>
										<div className='row'>
											<div className='input-field col s12'>
												<input 
												className='validate form-group-input' 
												type='email' 
												name='email' 
												id='email' 
												required="required"
												value={email} 
												onChange={this.handleChange}
												/>
												<label htmlFor='email' className={email ? 'active' : ''}>Email</label>
												<div className="form-group-line"></div>
											</div>
										</div>
										<div className='row'>
											<div className='input-field col s6'>
												<input 
												className='validate form-group-input' 
												type='password' 
												name='password' 
												id='password' 
												required="required" 
												value={password} 
												onChange={this.handleChange}
												/>
												<label htmlFor='password' className={password ? 'active' : ''}>Password</label>
												<div className="form-group-line"></div>
											</div>
											<div className='input-field col s6'>
												<input 
												className='validate form-group-input' 
												type='password' 
												name='confirm_password' 
												id='confirm_password' 
												required="required" 
												value={confirm_password} 
												onChange={this.handleChange}
												/>
												<label htmlFor='confirm_password' className={confirm_password ? 'active' : ''}>Password</label>
												<div className="form-group-line"></div>
											</div>
										</div>
										<div className="row">
											<div className="input-field col s12">
												<button 
													className="pull-right" 
													type="submit"
													name='btn_login' 
													onClick={this.send_signup}
												>
													<span>
														<span>
															<span data-attr-span="signup.">
																signup.
															</span>
														</span>
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				</Slide>
			</FullPage>
		);
	}
}

const mapDispatchToProps = dispatch => ({ onSubmitNotification: data => dispatch({ type: 'SUBMIT_NOTIFICATION', data })})
const mapStateToProps = state => ({})
  
export default connect(mapStateToProps, mapDispatchToProps)(Signup) 