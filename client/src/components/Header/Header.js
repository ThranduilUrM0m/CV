import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';
import API from '../../utils/API';
import * as $ from "jquery";
import 'bootstrap';

const _ = require('lodash');

class AccountForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login_email : '',
            login_password: '',
            signup_username: '',
            signup_email: '',
            signup_password: '',
            confirm_signup_password: '',
            firstname: '',
            lastname: '',
            activated: false,
            messages: [],
            whoami: '',
            school: null,
        }
        this._handleClickEvents = this._handleClickEvents.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.send_login = this.send_login.bind(this);
        this.send_signup = this.send_signup.bind(this);
    }
    componentDidMount() {
        this._handleClickEvents();
        $(".login").hide();
        const loginBtn =  document.querySelector('#login_toggle');
        const signupBtn = document.querySelector('#signup_toggle');
        function slideUp(){
            if(this.id == 'signup_toggle'){
                const parent = this.parentElement;
                const sibling = parent.nextElementSibling;
                parent.classList.remove('slide-up');
                sibling.classList.add('slide-up');
            } else {
                const parent = this.parentElement;
                
                parent.classList.add('slide-up');
                $('.login_form').classList.remove('slide-up');
            }
        }
        loginBtn.addEventListener('click', slideUp);
        signupBtn.addEventListener('click', slideUp);
    }
    _handleClickEvents() {
        /* login */
        $(".togglebtn").click(function(){
            $(".login").toggle(400);
            $('.overlay_menu').toggleClass('overlay_menu--is-closed');
        });
    }
    async send_login() {
        const { login_email, login_password } = this.state;
        if (!login_email || login_email.length === 0) return;
        if (!login_password || login_password.length === 0) return;
        try {
            const { data } = await API.login(login_email, login_password);

            localStorage.setItem("token", data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    }
    async send_signup() {
        const { signup_username, signup_email, signup_password, confirm_signup_password, firstname, lastname, activated, messages, whoami, school } = this.state;
        if (!signup_username || signup_username.length === 0) return;
        if (!signup_email || signup_email.length === 0) return;
        if (!signup_password || signup_password.length === 0 || signup_password !== confirm_signup_password) return;
        try {
            const { data } = await API.signup({ signup_username, signup_email, signup_password, firstname, lastname, activated, messages, whoami, school });
            localStorage.setItem("token", data.token);
            localStorage.setItem('email', data.email);
            localStorage.setItem('username', data.username);
            //take off the things
            $(".login").toggle(400);
            $('.overlay_menu').toggleClass('overlay_menu--is-closed');
            $('#signup_modal').modal('toggle');
            $('#signup_modal .modal-close').click(() => {
                window.location.reload();
            });
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
        return (
            <div href="#" className="icon-button accountFormHolder">
                <i className="icon far fa-user togglebtn"></i>
                <span className="hover_effect"></span>
                <div className="login form-structor">
                    <div className="signup_form slide-up">
                        <div className="form-title" id="signup_toggle">
                            <a className="question_signup" href="#" title="">Don't have an account yet?</a>
                            <a className="title_signup" href="#" title="">Sign Up to Risala</a>
                        </div>
                        <div className="form-sm-holder">
                            <div className="row">
                                <div className="col-2">
                                    <button type="button" className="btn btn-light"><i className="fab fa-twitter"></i></button>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-light"><i className="fab fa-facebook-f"></i></button>
                                </div>
                                <div className="col-8">
                                    <button type="button" className="btn btn-light"><i className="fab fa-google"></i> Sign up with Google</button>
                                </div>
                            </div>
                        </div>
                        <div className="form-holder">

                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='text' 
                                    name='signup_username' 
                                    id='signup_username' 
                                    required="required"
                                    value={this.state.signup_username} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='signup_username'>@username</label>
                                    <div className="form-group-line"></div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='email' 
                                    name='signup_email' 
                                    id='signup_email' 
                                    required="required"
                                    value={this.state.signup_email} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='signup_email'>@email</label>
                                    <div className="form-group-line"></div>
                                </div>
                            </div>
                            
                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='password' 
                                    name='signup_password' 
                                    id='signup_password' 
                                    required="required" 
                                    value={this.state.signup_password} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='signup_password'>Password</label>
                                    <div className="form-group-line"></div>
                                </div>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='password' 
                                    name='confirm_signup_password' 
                                    id='confirm_signup_password' 
                                    required="required" 
                                    value={this.state.confirm_signup_password} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='confirm_signup_password'>Confirm Password</label>
                                    <div className="form-group-line"></div>
                                </div>
                            </div>

                            <label>
                                <input type="checkbox"/>Creating an account means you're okay with our Terms of Services, Privacy Policy, and our default Notifications Settings.
                            </label>

                            <section className="center">
                                <div className='row'>
                                    <button 
                                    type='submit' 
                                    name='btn_login' 
                                    className='col s12 btn btn-large waves-effect login'
                                    onClick={this.send_signup}
                                    >
                                        Signup
                                    </button>
                                </div>
                            </section>

                        </div>
                        <div className="form-title" id="login_toggle">
                            <a className="question_login" href="#" title="">Already a member?</a>
                            <a className="title_login" href="#" title="">Sign in to Risala</a>
                        </div>
                    </div>
                    <div className="login_form">
                        <div className="form-title">
                            <a className="question_login" href="#" title="">Already a member?</a>
                            <a className="title_login" href="#" title="">Sign in to Risala</a>
                        </div>
                        <div className="form-sm-holder">
                            <div className="row">
                                <div className="col-2">
                                    <button type="button" className="btn btn-light"><i className="fab fa-twitter"></i></button>
                                </div>
                                <div className="col-2">
                                    <button type="button" className="btn btn-light"><i className="fab fa-facebook-f"></i></button>
                                </div>
                                <div className="col-8">
                                    <button type="button" className="btn btn-light"><i className="fab fa-google"></i> Sign in with Google</button>
                                </div>
                            </div>
                        </div>
                        <div className="form-holder">
                            
                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='email' 
                                    name='login_email' 
                                    id='login_email' 
                                    required="required"
                                    value={this.state.login_email} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='login_email'>@email</label>
                                    <div className="form-group-line"></div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input 
                                    className='validate form-group-input' 
                                    type='password' 
                                    name='login_password' 
                                    id='login_password' 
                                    required="required" 
                                    value={this.state.login_password} 
                                    onChange={this.handleChange}
                                    />
                                    <label htmlFor='login_password'>Password</label>
                                    <div className="form-group-line"></div>
                                </div>
                            </div>

                            <label>
                                <input type="checkbox"/>Remember me
                            </label>

                            <section className="center">
                                <div className='row'>
                                    <button 
                                    type='submit' 
                                    name='btn_login' 
                                    className='col s12 btn btn-large waves-effect login'
                                    onClick={this.send_login}
                                    >
                                        Login
                                    </button>
                                </div>
                            </section>

                            <a href="#" title="">Forgot your password?</a>
                        
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
class AccountProfil extends React.Component {
    constructor(props) {
        super(props);
        this.disconnect = this.disconnect.bind(this);
    }
    componentDidMount() {
        var menuButton = document.querySelector(".menu_button");
        menuButton.addEventListener("click", function(event) {
            event.preventDefault();
            var parent = document.querySelector(".accountProfilHolder");
            if (parent.classList.contains("open")) {
                parent.classList.remove("open");
            } else {
                parent.classList.add("open");
            }
        });
    }
    disconnect() {
        API.logout();
    }
    render() {
        return (
            <div href="#" className="icon-button accountProfilHolder">
                <div className='menu_button'>
                    <span className="hover_effect"></span>
                    <i className="icon far fa-user togglebtn"></i>
                    <span className="title">{localStorage.getItem('username')}</span>
                </div>
                <div className="menu-dropdown">
                    <div className="content">
                        <ul>
                            <li>{ localStorage.getItem('email') }</li>
                            <li><Link to='/dashboard' className="_profil_link"><i className="far fa-user"></i> Dashboard </Link></li>
                            <li><Link to='/inbox' className="_profil_link"><i className="fas fa-inbox"></i>Inbox</Link></li>
                            <li><Link to='/settings' className="_profil_link"><i className="fas fa-cog"></i>Settings</Link></li>
                            <li><a href="" onClick={this.disconnect}><i className="fas fa-sign-out-alt"></i>Logout</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

class Header extends React.Component {
    constructor(props) {
        super(props);
        this._handleClickEvents = this._handleClickEvents.bind(this);
    }
    componentDidMount() {
        this._handleClickEvents();
        let _links = $('.menu .nav-link');
        let _url = window.location.pathname;
        _links.map((_link, index) => {
            switch (index.id) {
                case "_home_link":
                    if(_url === '/'){
                        $('#'+index.id).addClass('active');
                        $('.nav-link').not('#'+index.id).removeClass('active');
                    }
                    break;
                case "_blog_link":
                    var regex = RegExp('/blog*');
                    if(regex.test(_url)){
                        $('#'+index.id).addClass('active');
                        $('.nav-link').not('#'+index.id).removeClass('active');
                    }
                    break;
                case "_about_link":
                    if(_url === '/about'){
                        $('#'+index.id).addClass('active');
                        $('.nav-link').not('#'+index.id).removeClass('active');
                    }
                    break;
                case "_coffee_link":
                    if(_url === '/coffee'){
                        $('#'+index.id).addClass('active');
                        $('.nav-link').not('#'+index.id).removeClass('active');
                    }
                    break;
                case "_faq_link":
                    if(_url === '/faq'){
                        $('#'+index.id).addClass('active');
                        $('.nav-link').not('#'+index.id).removeClass('active');
                    }
                    break;
                default:
                    console.log("Désolé, nous n'avons plus.");
            }
        });
    }
    _handleClickEvents() {
        let searchWrapper = document.querySelector('.search-wrapper'),
            searchInput = document.querySelector('.search-input'),
            searchIcon = document.querySelector('.search'),
            searchActivated = false;

        $('.search_form').click((event) => {
            if (!searchActivated) {
                searchWrapper.classList.add('focused');
                searchIcon.classList.add('active');
                searchInput.focus();
                searchActivated = !searchActivated;
                $('.overlay_menu').toggleClass('overlay_menu--is-closed');
            } else {
                if($(event.target).hasClass('search')){
                    searchWrapper.classList.remove('focused');
                    searchIcon.classList.remove('active');
                    searchActivated = !searchActivated;
                    $('.overlay_menu').toggleClass('overlay_menu--is-closed');
                }
            }
        });

        /* menu */
        $('.navToggle').click(function(event) {
            $('.navToggle').toggleClass('active');
            $('.menu').toggleClass('menu--is-closed');
            $('.overlay_menu').toggleClass('overlay_menu--is-closed');

            searchWrapper.classList.remove('focused');
            searchIcon.classList.remove('active');
            searchActivated = !searchActivated;

            if($(".login").css('display') != 'none'){
                $(".login").toggle(400);
            }

            let _profil_dropdown = document.querySelector(".accountProfilHolder");
            if (_profil_dropdown && _profil_dropdown.classList.contains("open")) {
                _profil_dropdown.classList.remove("open");
            }
        });
        
        /* menu active */
        $('.nav-link').click(function(){
            $('.navToggle').toggleClass('active');
            $('.menu').toggleClass('menu--is-closed');
            $('.overlay_menu').toggleClass('overlay_menu--is-closed');
            $(this).addClass('active');
            $('.nav-link').not(this).removeClass('active');

            searchWrapper.classList.remove('focused');
            searchIcon.classList.remove('active');
            searchActivated = !searchActivated;
        });

        $('._profil_link').click(() => {
            let _profil_dropdown = document.querySelector(".accountProfilHolder");
            if (_profil_dropdown && _profil_dropdown.classList.contains("open")) {
                _profil_dropdown.classList.remove("open");
            }

            if(!$('.menu').hasClass('menu--is-closed')) {
                $('.menu').toggleClass('menu--is-closed');
                $('.navToggle').toggleClass('active');
            }

            searchWrapper.classList.remove('focused');
            searchIcon.classList.remove('active');
            searchActivated = !searchActivated;
        });

        /* outside the login or menu */
        $('.overlay_menu').click(function(){
            $('.overlay_menu').toggleClass('overlay_menu--is-closed');

            if($(".login").css('display') != 'none'){
                $(".login").toggle(400);
            }
            
            let _profil_dropdown = document.querySelector(".accountProfilHolder");
            if (_profil_dropdown && _profil_dropdown.classList.contains("open")) {
                _profil_dropdown.classList.remove("open");
            }

            if(!$('.menu').hasClass('menu--is-closed')) {
                $('.menu').toggleClass('menu--is-closed');
                $('.navToggle').toggleClass('active');
            }

            searchWrapper.classList.remove('focused');
            searchIcon.classList.remove('active');
            searchActivated = !searchActivated;
        });

        document.querySelectorAll(".js-fr").forEach(trigger => {
            // pull trigger
            trigger.onclick = () => {
              // langTrigger
              trigger.parentNode.querySelectorAll(".js-fr").forEach(el => {
                el.classList.add("is-active");
              });
              trigger.parentNode.querySelectorAll(".js-en").forEach(el => {
                el.classList.remove("is-active");
              });
            };
        });
        document.querySelectorAll(".js-en").forEach(trigger => {
        // pull trigger
        trigger.onclick = () => {
            // langTorigger
            trigger.parentNode.querySelectorAll(".js-fr").forEach(el => {
            el.classList.remove("is-active");
            });
            trigger.parentNode.querySelectorAll(".js-en").forEach(el => {
            el.classList.add("is-active");
            });
        };
        });
    }
    render() {
        return (
            <>
                <div className="overlay_menu overlay_menu--is-closed"></div>
                <div className="fixedHeaderContainer">
                    <div className="headerWrapper wrapper">
                        <header>
                            <span className="navToggle menu-toggle">
                                <svg className="hamburger"  width="300" height="300" version="1.1" id="Layer_1" viewBox="-50 -50 100 100" preserveAspectRatio="none">
                                    <g strokeWidth="2" strokeLinecap="round" strokeMiterlimit="10">
                                        <line className="one" x1="0" y1="20" x2="50" y2="20"></line>
                                        <line className="three" x1="0" y1="30" x2="50" y2="30"></line>
                                    </g>
                                </svg>
                            </span>
                            <a className="logoHolder" href="/">
                                <img className="logo img-fluid" src={logo} alt="Risala"/>
                            </a>
                            <div className="js-lang u-mb-15">
                                <span className="js-fr">fr</span>
                                <span className="js-en is-active">en</span>
                            </div>
                            <form className="search_form">
                                <div className="search-wrapper">
                                    <input className="search-input" type="text" placeholder="Search"/>
                                    <span className="hover_effect"></span>
                                    <div className='search'></div>
                                </div>
                            </form>
                            {
                                localStorage.getItem('token') ? <AccountProfil/> : <AccountForm/>
                            }
                        </header>
                    </div>
                </div>
                <ul className="menu menu--is-closed">
                    <li><span className="item item-0"></span></li>
                    <li><span className="item item-1"><Link to='/' className="nav-link" id="_home_link"> Home. </Link></span></li>
                    <li><span className="item item-2"><Link to='/blog' className="nav-link" id="_blog_link"> Blog. </Link></span></li>
                    <li><span className="item item-3"><Link to='/about' className="nav-link" id="_about_link"> About Me. </Link></span></li>
                    <li><span className="item item-4"><Link to='/coffee' className="nav-link" id="_coffee_link"> Coffee. </Link></span></li>
                    <li><span className="item item-5"><Link to='/faq' className="nav-link" id="_faq_link"> Ask Me. </Link></span></li>
                </ul>
                <div className="modal fade" id="signup_modal" tabIndex="-1" role="dialog" aria-labelledby="signup_modalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                <h5 className="modal-title" id="signup_modalLabel">Welcome!</h5>
                                <div>We have sent you a verification email, all you have to do is just click it and boom you are one of us now.</div>
                                <div><small>Welcome {localStorage.getItem('username')}</small></div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Header;