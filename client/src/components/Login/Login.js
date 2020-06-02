import React from "react";
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import 'bootstrap';
import * as $ from "jquery";

class Login extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
			email: '',
			password: '',
			modal_msg: ''
		};
        this.send_login = this.send_login.bind(this);
        this.handleChange = this.handleChange.bind(this);
	}
	componentWillMount() {
		if(localStorage.getItem('email')) {
			window.location = "/dashboard";
		}
	}
	async send_login() {
		let self = this;
        const { email, password } = this.state;
        await API.login(email, password)
		.then((res) => {
			localStorage.setItem("token", res.data.token);
			localStorage.setItem('email', res.data.email);
			localStorage.setItem('username', res.data.username);
			window.location = "/dashboard";
		})
		.catch((error) => {
			self.setState({
				modal_msg: error.response.data.text
			}, () => {
				$('#login_modal').modal('toggle');
			});
		});
    }
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	render() {
		const { email, password, modal_msg } = this.state;
		return (
			<FullPage>
				<Slide>
					<section className="first_section_login">
						<div className="wrapper_full">
							<div className="modal fade" id="login_modal" tabIndex="-1" role="dialog" aria-labelledby="signup_modalLabel" aria-hidden="true">
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
							<div className="Sidebar">
								<div className="wrap">
									<div className="Head_Login">
										<div>
											<h3>Login</h3>
										</div>
									</div>
									<div className="Login">
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
											<div className='input-field col s12'>
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
										</div>
										<div className="row">
											<div className="input-field col s12">
												<button 
													className="pull-right" 
													type="submit"
													name='btn_login' 
													onClick={this.send_login}
												>
													<span>
														<span>
															<span data-attr-span="login.">
																login.
															</span>
														</span>
													</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="Content">
								<div className="card">
									<div className="face face1">
										<div className="content">
											<i className="fas fa-user-plus"></i>
										</div>
									</div>
									<div className="face face2">
										<div className="content">
											<h6>Welcome to boutaleb.</h6>
											<p>The blog to speak louder.</p>
											<a className="text-muted" href="/signup">
												<span>
													<span>
														<span data-attr-span="signup.">
															signup.
														</span>
													</span>
												</span>
											</a>
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

export default Login