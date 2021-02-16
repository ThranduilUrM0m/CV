import React from 'react';
import axios from 'axios';
import { loadProgressBar } from 'axios-progress-bar';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import logo from '../../logo.svg';
import favicon from '../../favicon.svg';
import * as $ from "jquery";
import 'bootstrap';
import 'axios-progress-bar/dist/nprogress.css';

const _ = require('lodash');

class Header extends React.Component {
    constructor(props) {
        super(props);
		this.state = {
            logo_to_show: logo,
            _search_value: '',
            currentPage: 1,
          	todosPerPage: 4,
			currentCard: 0,
		};
        this._handleClickEvents = this._handleClickEvents.bind(this);
        this._handleClickPage = this._handleClickPage.bind(this);
        this.handleJSONTOHTMLIMAGE = this.handleJSONTOHTMLIMAGE.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        const { onLoad, onLoadProject } = this.props;
        axios('/api/articles')
        .then(function (response) {
            onLoad(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

        axios('/api/projects')
        .then(function (response) {
            onLoadProject(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    componentDidMount() {
        loadProgressBar();

        this._handleClickEvents();
        this.handleSearch();

        const self = this;
        
        function displayWindowSize(){
            if ($(window).width() <= 425) {
                self.setState({
                    logo_to_show: favicon
                });
                $('.logoHolder').addClass('small');
            } else {
                self.setState({
                    logo_to_show: logo
                });
                $('.logoHolder').removeClass('small');
            }
        }
        window.addEventListener("resize", displayWindowSize);
        displayWindowSize();

        if($(window).scrollTop() > 100) {
            $('.fixedHeaderContainer').css("background-color", "rgba(white, 0.25)");
        } else {
            $('.fixedHeaderContainer').css("background-color", "rgba(white, 0)");
        }
        $(window).scroll(function() {
            if($(window).scrollTop() > 100) {
                $('.fixedHeaderContainer').css("background-color", "rgba(255, 255, 255, 0.85)");
            } else {
                $('.fixedHeaderContainer').css("background-color", "rgba(255, 255, 255, 0)");
            }
        });

        
        let _url = window.location.pathname;
        if(_url === "/login" || _url === "/signup")
            $('.fixedHeaderContainer').hide();

        if(_url === "/dashboard")
            $('.fixedHeaderContainer').addClass('dashboard_header');

        if(_url === "/contact")
            $('.fixedHeaderContainer').addClass('dark_mode');
        else
            $('.fixedHeaderContainer').removeClass('dark_mode');
    }
    _handleClickEvents() {
        let searchWrapper = document.querySelector('.search-wrapper'),
            searchInput = document.querySelector('.search-input'),
            searchIcon = document.querySelector('.search'),
            $searchModal = $('#search-modal'),
            searchActivated = false,
            self = this;

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
                    $searchModal.removeClass('active');
                    self.setState({
                        _search_value: ''
                    });
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
	_handleClickPage(event) {
        this.setState({
          	currentPage: Number(event.target.id)
        });
	}
	handleJSONTOHTMLIMAGE(inputDelta, index) {
		function runAfterElementExists(jquery_selector, callback){
			var checker = window.setInterval(function() {
			if (jquery_selector) {
				clearInterval(checker);
				callback();
			}}, 200);
		}
		runAfterElementExists(inputDelta, function() {
			const html = $.parseHTML(inputDelta);
			$('.card_'+index+' figure').html($(html).find('img').first());
		});
	}
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
    handleSearch() {
        $('.search-input').on('focusin', function() {
            $('#search-modal').addClass('active');
        });
    }
    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        const { logo_to_show, _search_value, currentPage, todosPerPage } = this.state;
        const { articles, projects } = this.props;
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
                                <img className="logo img-fluid" src={logo_to_show} alt="Risala"/>
                            </a>
                            <form className="search_form">
                                <div className="input-field search-wrapper">
                                    <input 
                                        className="search-input validate form-group-input _search_value"
                                        id="_search_value"
                                        type="text"
                                        name="_search_value"
                                        value={_search_value} 
                                        onChange={this.handleChange}
                                    />
                                    <label htmlFor='_search_value' className={_search_value ? 'active' : ''}>Search.</label>
                                    <div className="form-group-line"></div>

                                    <span className="hover_effect"></span>
                                    <div className='search'></div>
                                </div>
                            </form>
                        </header>
                    </div>
                </div>
                {/* the actual header */}
                <div id="search-modal">
                    <div className="search-modal-background"></div>
                    <div className="search-content-area">
                        <div className="search-results">
                            <ul id="page">
                                {
                                    _.slice(_.filter(_.filter(_.union(articles, projects), (_a) => { return !_a._hide && _search_value != '' }), (_ap) => {
                                        return _.split(_.lowerCase(_search_value), ' ').some(_s_v => _.lowerCase(_ap.title).includes(_s_v)) || _.split(_.lowerCase(_search_value), ' ').some(_s_v => _.lowerCase(_ap.author).includes(_s_v)) || _ap.tag.some(x => _.split(_.lowerCase(_search_value), ' ').some(_s_v => _.lowerCase(x).includes(_s_v)));
                                    }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((ap, index) => {
                                        return (
                                            <li className="article_card article_anchor" data-name={ moment(ap.createdAt).format("YYYY Do MM") } id="article_card" key={index}>
                                                <div className={"col card card_" + index} data-title={_.snakeCase(ap.title)} data-index={_.add(index,1)}>
                                                    <div className="card-body">
                                                        <div className="text">
                                                            <p className="text-muted author">by <b>{ap.author}</b>, {moment(new Date(ap.createdAt)).fromNow()}</p>
                                                            <figure>{this.handleJSONTOHTMLIMAGE(ap.body, index)}</figure>
                                                            <h4>{ap.title}</h4>
                                                            <a href={ap.categorie ? `blog/${ap._id}` : ap.link_to} target={!ap.categorie ? "_blank" : ''}>
                                                                <div className="readmore">
                                                                    <button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
                                                                        <div className="line line-1"></div>
                                                                        <div className="line line-2"></div>
                                                                    </button>
                                                                </div>
                                                            </a>
                                                            <div className="comments_up_down">
                                                                <p className="text-muted views"><b>{_.size(ap.view)}</b><i className="fas fa-eye"></i></p>
                                                                <p className="text-muted comments"><b>{_.size(ap.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                <p className="text-muted upvotes"><b>{_.size(ap.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                <p className="text-muted downvotes"><b>{_.size(ap.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                            <ul id="page-numbers">
                                {
                                    ([...Array(Math.ceil(_.filter(_.filter(articles, (_a) => { return !_a._hide && _search_value != '' }), (_ap) => {
                                        return _.includes(_ap.title, _search_value) || _.includes(_ap.author, _search_value) || _.includes(_ap.categorie, _search_value) || _ap.tag.some(x => x.includes(_search_value));
                                    }).length / todosPerPage)).keys()]).map(number => {
                                        return (
                                            <li
                                                key={number+1}
                                                id={number+1}
                                                onClick={this._handleClickPage}
                                                className={currentPage === number+1 ? 'current' : ''}
                                                >
                                                    <p className="shadow_page">.{this._FormatNumberLength(number+1,2)}</p>
                                            </li>
                                        );
                                    })
                                }
                            </ul>
                        </div>
                        <div className="search-suggestions">
                            <div><small>Here</small></div>
                            <div className="togglebtn"><span role="img" aria-label="sheep">👉</span> May we suggest?</div>
                            <ul className="text-muted tags">
                                {
                                    _.orderBy(_.filter(_.union(articles, projects), (_a) => { return !_a._hide }), ['comment', 'upvotes', 'view'], ['desc', 'desc', 'desc']).map((_ap, _index) => {
                                        return (
                                            _ap.tag.map((t, i) => {
                                                return (
                                                    <li key={_index+'_'+i} className="tag_item" onClick={() => { this.setState({_search_value: t}); }}>{t}</li>
                                                )
                                            })
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <ul className="menu menu--is-closed">
                    <li><span className="item item-0"></span></li>
                    <li><span className="item item-1"><Link to='/' activeClassName='active' className="nav-link" id="_home_link"> Home. </Link></span></li>
                    <li><span className="item item-2"><Link to='/blog' activeClassName='active' className="nav-link" id="_blog_link"> Blog. </Link></span></li>
                    <li><span className="item item-4"><Link to='/minttea' activeClassName='active' className="nav-link" id="_minttea_link"> Mint Tea. </Link></span></li>
                    <li><span className="item item-3"><Link to='/about' activeClassName='active' className="nav-link" id="_about_link"> About Me. </Link></span></li>
                    <li><span className="item item-5"><Link to='/contact' activeClassName='active' className="nav-link" id="_contact_link"> Contact Me. </Link></span></li>
                </ul>
            </>
        );
    }
}

const mapStateToProps = state => ({
    articles: state.home.articles,
    projects: state.home.projects,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);