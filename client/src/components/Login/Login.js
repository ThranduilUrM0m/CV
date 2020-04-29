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

class Login extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
			email: '',
			password: ''
		};
        this.send_login = this.send_login.bind(this);
        this.handleChange = this.handleChange.bind(this);
	}
	async send_login() {
        const { email, password } = this.state;
        if (!email || email.length === 0) return;
        if (!password || password.length === 0) return;
        try {
            const { data } = await API.login(email, password);

            localStorage.setItem("token", data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);

            window.location = "/dashboard";
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
		const { email, password } = this.state;
		return (
			<FullPage>
				<Slide>
					<section className="first_section_login">
						<div className="wrapper_full">
							<div className="Sidebar">
								<div className="wrap">
									<div className="Head_Login">
										<div>
											<h3>Login</h3>
											<a className="text-muted" href="/signup">Signup</a>
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

							</div>
						</div>
					</section>
				</Slide>
			</FullPage>
		);
	}
}

export default Login