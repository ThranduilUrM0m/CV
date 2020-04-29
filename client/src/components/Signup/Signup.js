import React from "react";
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import 'whatwg-fetch';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

class Signup extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            confirm_password: '',
		};
        this.send_signup = this.send_signup.bind(this);
        this.handleChange = this.handleChange.bind(this);
	}
    async send_signup() {
        const { username, email, password, confirm_password } = this.state;
        if (!username || username.length === 0) return;
        if (!email || email.length === 0) return;
        if (!password || password.length === 0 || password !== confirm_password) return;
        try {
            const { data } = await API.signup({ username, email, password });
            localStorage.setItem("token", data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);
            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	render() {
		const { username, email, password, confirm_password } = this.state;
		return (
			<FullPage>
				<Slide>
					<section className="first_section_signup">
						<div className="wrapper_full">
							<div className="Content">

							</div>
							<div className="Sidebar">
								<div className="wrap">
									<div className="Head_Signup">
										<div>
											<h3>Signup</h3>
											<a className="text-muted" href="/login">Login</a>
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

export default Signup