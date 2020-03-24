import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../logo.svg';
import API from '../../utils/API';
import * as $ from "jquery";
import 'bootstrap';

const _ = require('lodash');

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
                {/* the actual header */}
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
                        </header>
                    </div>
                </div>
                {/* the actual header */}
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