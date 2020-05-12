import React from "react";
import axios from 'axios';
import Swiper from 'swiper';
import moment from 'moment';
import { Form } from '../Article';
import { FormProject } from '../Project';
import Calendar from './Calendar';
import Account from './Account';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import Clock from 'react-live-clock';
import 'whatwg-fetch';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');
//user has role normal so wut now
class Dashboard extends React.Component {
  	constructor(props) {
        super(props);
        
		this.state = {
            _user: {},
            currentPage: 1,
          	todosPerPage: 6,
			currentCard: 0,
			position: 0,
			width: 0,
            tags: '',
            title: '',
            title_projects: '',
			sort: 'Relevant',
			timeframe: 'All_Time',
            categorie: '',
            _article: {},
            _project: {},
            _testimony: {},
        };

		this.disconnect = this.disconnect.bind(this);
        this._handleDrag = this._handleDrag.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this.handleJSONTOHTMLIMAGE = this.handleJSONTOHTMLIMAGE.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
        this.handleClickPage = this.handleClickPage.bind(this);
        this._handleModal = this._handleModal.bind(this);
        this.handleShowFilter = this.handleShowFilter.bind(this);
        
		this.handleEditArticle = this.handleEditArticle.bind(this);
        this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
        
		this.handleEditProject = this.handleEditProject.bind(this);
        this.handleDeleteProject = this.handleDeleteProject.bind(this);
        
		this.handleEditTestimony = this.handleEditTestimony.bind(this);
        this.handleDeleteTestimony = this.handleDeleteTestimony.bind(this);
        
		this.handleChange = this.handleChange.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
	}
	componentDidMount() {
		const { onLoad, onLoadProject, onLoadTestimony } = this.props;
		let self = this;
        
        document.getElementById('first_section_dashboard').parentElement.style.height = 'initial';
        document.getElementById('first_section_dashboard').parentElement.style.minHeight = '100%';

		axios('/api/articles')
        .then(function (response) {
            // handle success
			onLoad(response.data);
			function runAfterElementExists(jquery_selector, callback){
                var checker = window.setInterval(function() {
                //if one or more elements have been yielded by jquery
                //using this selector
                if ($(jquery_selector).length) {
                    //stop checking for the existence of this element
                    clearInterval(checker);
                    //call the passed in function via the parameter above
                    callback();
                }}, 200); //I usually check 5 times per second
            }
            runAfterElementExists(".first_section_dashboard .articles_slider_wrapper_cards_item", function() {
				self._handleDrag('articles_slider_wrapper');
			});
			$('.fixedHeaderContainer').addClass('blog_header');
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
		});

        axios('/api/projects')
        .then(function (response) {
            // handle success
            onLoadProject(response.data);
            function runAfterElementExists(jquery_selector, callback){
                var checker = window.setInterval(function() {
                //if one or more elements have been yielded by jquery
                //using this selector
                if ($(jquery_selector).length) {
                    //stop checking for the existence of this element
                    clearInterval(checker);
                    //call the passed in function via the parameter above
                    callback();
                }}, 200); //I usually check 5 times per second
            }
            runAfterElementExists(".first_section_dashboard .projects_slider_wrapper_cards_item", function() {
				self._handleDrag('projects_slider_wrapper');
			});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
        
        axios('/api/testimonies')
        .then(function (response) {
            // handle success
            onLoadTestimony(response.data);
            function runAfterElementExists(jquery_selector, callback){
                var checker = window.setInterval(function() {
                //if one or more elements have been yielded by jquery
                //using this selector
                if ($(jquery_selector).length) {
                    //stop checking for the existence of this element
                    clearInterval(checker);
                    //call the passed in function via the parameter above
                    callback();
                }}, 200); //I usually check 5 times per second
            }
            runAfterElementExists(".first_section_dashboard .testimonies_slider_wrapper_cards_item", function() {
				self._handleDrag('testimonies_slider_wrapper');
			});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
		
		//to get the user object
		this.get_user();

		//when hovered on the nav
		$('.nav').hover(
			function() {
			  	$('.wrapper_full .after').css(
					'left', '35%'
				);
			}, function() {
				$('.wrapper_full .after').css(
				  	'left', '5rem'
			  	);
			}
		);

		//control the tabs
		$('.tab-pane').addClass('animated');
        $('.tab-pane').addClass('faster');
        $('.nav_link').click((event) => {

            let _li_parent = $(event.target).parent().parent();
            let _li_target = $($(event.target).attr('href'));
            let _link_target = $(event.target);

            $('.tab-pane').not(_li_target).addClass('fadeOutRight');
            $('.tab-pane').not(_li_target).removeClass('fadeInLeft');
            $(".nav li").not(_li_parent).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('show');
            $(".nav_link").not(_link_target).removeClass('active');
            $('.nav_link').not(_link_target).removeClass('show');

            $(_li_target).removeClass('fadeOutRight');
            $(_li_target).addClass('fadeInLeft');
            $(_li_parent).addClass('active');
            $(_li_target).addClass('active');
            $(_li_target).addClass('show');
            $(_link_target).addClass('active');
            $(_link_target).addClass('show');

        });
        
		this._handleModal('_article_modal_trigger', '_all_article_modal_view');
		this._handleModal('_project_modal_trigger', '_all_project_modal_view');
		this._handleModal('_testimony_modal_trigger', '_all_testimony_modal_view');
	}
	disconnect() {
		API.logout();
		window.location = "/login";
	}
	async get_user() {
        const self = this;
        try {
            const { data } = await API.get_user(localStorage.getItem('email'));
			self.setState({
				_user: data.user,
			});
        } catch (error) {
            console.error(error);
        }
    }
	_handleDrag(source) {
        if(source !== 'testimonies_slider_wrapper')
            var mySwiper = new Swiper ('.'+source+'.swiper-container', {
                // Optional parameters
                effect: 'coverflow',
                direction: 'horizontal',
                grabCursor: true,
                slidesPerView: 1.25,
                centeredSlides: false,
                centeredSlidesBounds: false,
                paginationClickable: true,
                centerInsufficientSlides: false,
                spaceBetween: 0,
                autoResize: false,
                observer: true,
                watchOverflow: true,
                variableWidth : true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 0,
                    modifier: 3,
                    slideShadows: false
                },
                simulateTouch: true,
                // If we need pagination
                pagination: {
                    el: '.'+source+' .swiper-pagination',
                    dynamicBullets: true,
                }
            });
        else
            var mySwiperTestimonies = new Swiper ('.'+source+'.swiper-container', {
                // Optional parameters
                effect: 'coverflow',
                direction: 'vertical',
                loop: false,
                slideToClickedSlide: true,
                slidesPerView: 2.5,
                grabCursor: true,
                centeredSlides: false,
                paginationClickable: true,
                centerInsufficientSlides: true,
                spaceBetween: 0,
                autoResize: false,
                observer: true,
                watchOverflow: true,
                freeMode:false,
                freeModeSticky:true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 0,
                    modifier: 3,
                    slideShadows: false
                },
                simulateTouch: true,
                // If we need pagination
                pagination: {
                    el: '.'+source+' .swiper-pagination',
                    dynamicBullets: true,
                },
                scrollbar: '.'+source+' .swiper-scrollbar',
            });
    }
    handleEditArticle(article) {
        const { setEdit } = this.props;
        setEdit(article);
    }
    handleDeleteArticle(_id) {
        const { onDelete } = this.props;
		return axios.delete(`/api/articles/${_id}`)
			.then(() => onDelete(_id));
    }
    handleEditProject(project) {
        const { setEditProject } = this.props;
        setEditProject(project);
    }
    handleDeleteProject(_id) {
        const { onDeleteProject } = this.props;
		return axios.delete(`/api/projects/${_id}`)
			.then(() => onDeleteProject(_id));
    }
    handleEditTestimony(testimony) {
        const { setEditTestimony } = this.props;
        setEditTestimony(testimony);
    }
    handleDeleteTestimony(_id) {
        const { onDeleteTestimony } = this.props;
		return axios.delete(`/api/testimonies/${_id}`)
			.then(() => onDeleteTestimony(_id));
    }
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
    }
    handleJSONTOHTML(inputDelta) {
		function runAfterElementExists(jquery_selector, callback){
			var checker = window.setInterval(function() {
			if (jquery_selector) {
				clearInterval(checker);
				callback();
			}}, 200);
		}
		runAfterElementExists(inputDelta, function() {
			const html = $.parseHTML(inputDelta);
			$('h6.body_article').html(html);
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
	handleClickPage(event) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#_all_article_modal_view").offset().top
		}, 500);
        this.setState({
          	currentPage: Number(event.target.id)
        });
	}
	handleShowFilter(event) {
		var wrapper = $('.modal-top-filter'),
			buttonF = $('#_all_article_modal_view .filter');
		if ( ! wrapper.hasClass('expand') ){
			wrapper.addClass('expand', 500);
			buttonF.addClass('expand', 500);
		} else {
			wrapper.removeClass('expand', 500);
			buttonF.removeClass('expand', 500);
		}
	}
    handleChangeField(key, event) {
        this.setState({ [key]: event.target.value });
    }
	_handleModal(trigger, modal_target) {
		const self = this;
		var Boxlayout = function() {
			var wrapper = document.getElementById('first_section_dashboard'),
				element = $('#'+trigger),
				modal = $('#'+modal_target),
				closeButton = $('#'+modal_target+' .modal-close'),
				expandedClass = 'is-expanded',
				hasExpandedClass = 'has-expanded-item';
		  
			return { init : init };
			function init() {
			  	_initEvents();
			}
			function _initEvents() {
				element.click(function() {
					if ( !modal.hasClass(expandedClass) ) {
						modal.addClass(expandedClass, 500);
						wrapper.classList.add(hasExpandedClass);
						//to edit the focus of the tags input in filter modal, because the label is not directly after it, it's after the autocomplete object
						$('.modal-top-filter input.tags').focus(() => {
							$('.modal-top-filter label#tags_label').toggleClass('active');
						});
						$('.modal-top-filter input.tags').blur(() => {
							if(!self.state.tags)
								$('.modal-top-filter label#tags_label').toggleClass('active');
						});
					}
				});
				closeButton.click(function(event) {
					if ( modal.hasClass(expandedClass) ) {
						modal.removeClass(expandedClass);
                        wrapper.classList.remove(hasExpandedClass);
                        self.setState({
                            currentPage: 1,
                            todosPerPage: 6,
                            currentCard: 0,
                            position: 0,
                            width: 0,
                            tags: '',
                            sort: 'Relevant',
                            timeframe: 'All_Time',
                            categorie: '',
                        })
					}
				});
			}
		}();
		Boxlayout.init();
	}
	render() {
        //if user choose to update than close nd add, he'll eventually be updating, so wtf
		const { _user, title, title_projects, sort, timeframe, categorie, _article, _testimony, currentPage, todosPerPage, tags } = this.state;
        const { articles, projects, testimonies } = this.props;
		return (
			<FullPage scrollMode={'normal'}>
				<Slide>
					<section id="first_section_dashboard" className="first_section_dashboard">
						<div className="wrapper_full">
							<div className="nav nav-pills flex-column">
								<ul className="settings_dashboard">
									<li><a href="#1a" className="nav_link active" data-toggle="tab">Dashboard</a></li>
									<li><a href="#2a" className="nav_link" data-toggle="tab">Settings</a></li>
								</ul>
                                <div className="hello">
									<p>Hello,</p>
									<h3>{_user.username}</h3>
								</div>
								<div className="timeanddatenow">
									<div className="timenow">
										<Clock
											format={'hh:mm A'}
											ticking={true}
										/>
									</div>
									<div className="datenow">
										<Clock
										format={'dddd, Do MMMM'}
										/>
									</div>
								</div>
                                <Calendar/>
                            </div>
							<div className="after"></div>
							
                            <div className="tab-content clearfix">
								<div className="dashboard_pane tab-pane active" id="1a">
                                    <div className="top_roof">
                                        <div className="left_roof">
                                            <h2>Dashboard</h2>
                                            <div className="name">{_user.email}</div>
                                        </div>
                                        <a href="# " className="logout" onClick={() => this.disconnect()}><p className="text-muted">{_user.username}</p><i className="fas fa-door-open"></i></a>
                                    </div>
									<ul className="cards">
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_articles_pane _pane">
                                                        <div className="_articles_header _header">
                                                            <div className="title_search input-field">
                                                                <Autocomplete
                                                                    items={_.map(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), 'title')}
                                                                    getItemValue={(item) => item}
                                                                    inputProps={{ id: 'title', className: 'form-group-input title', name: 'title' }}
                                                                    shouldItemRender={(item, title) => item.toLowerCase().indexOf(title.toLowerCase()) > -1}
													                renderItem={(item, isHighlighted) =>
                                                                        <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                            {item}
                                                                        </div>
                                                                    }
                                                                    value={title}
                                                                    onChange={(ev) => this.setState({ title: ev.target.value })}
                                                                    onSelect={(title) => this.setState({ title })}
                                                                />
                                                                <label id="title_label" htmlFor='title' className={title ? 'active' : ''}>Search</label>
                                                                <div className='form-group-line'></div>
                                                            </div>
                                                            <div className="card__title">Articles</div>
                                                            <div className="dropdown">
                                                                <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </span>
                                                                <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton">
                                                                    <button className="dropdown-item show_more _show_articles btn-primary" id='_article_modal_trigger' data-toggle="modal" data-target="#_all_article_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    <button className="dropdown-item add _add_article btn-primary" data-toggle="modal" data-target="#_article_modal"><i className="fas fa-plus"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="_articles_content _content">
                                                            <div className="_articles_data data-container">
																<div className="articles_slider_wrapper swiper-container">
																	<div className="articles_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author })), function(o) { 
                                                                                if(timeframe === 'Today')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                                                if(timeframe === 'This_Past_Week')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                                                if(timeframe === 'This_Past_Month')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                                                if(timeframe === 'This_Past_Year')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                                                if(timeframe === 'All_Time')
                                                                                    return true;
                                                                                }), (op) => {
                                                                                    if(!categorie)
                                                                                        return true;
                                                                                    else 
                                                                                        return op.categorie === categorie;
                                                                                }), (op_byTitle) => {
                                                                                    if(!title)
                                                                                        return true;
                                                                                    else
                                                                                        return _.includes(op_byTitle.title.toLowerCase(), title.toLowerCase());
                                                                                }).map((article, index) => {
                                                                                return (
                                                                                    <div className="articles_slider_wrapper_cards_item swiper-slide" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="articles_slider_wrapper_cards_item" key={index}>
                                                                                        <div className='article_item swiper-slide_item'>
                                                                                            <div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <h2>{article.title}</h2>
                                                                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                                                                    <p className="categorie">{article.categorie}</p>
                                                                                                    <p className="categorie"><i className={article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                                    <br/>
                                                                                                    <div className="dropdown">
                                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                                            {(() => {
                                                                                                                if(_user.role === "admin" || _user.username === article.author) {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleEditArticle(article)}><i className="fas fa-edit"></i></a>
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteArticle(article._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()}
                                                                                                            <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view"><i className="fas fa-expand-alt"></i></a>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        <p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                                        <p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="articles_slider_pagination swiper-pagination"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_projects_pane _pane">
                                                        <div className="_projects_header _header">
                                                            <div className="title_search input-field">
                                                                <Autocomplete
                                                                    items={_.map(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), 'title')}
                                                                    getItemValue={(item) => item}
                                                                    inputProps={{ id: 'title_projects', className: 'form-group-input title_projects', name: 'title_projects' }}
                                                                    shouldItemRender={(item, title_projects) => item.toLowerCase().indexOf(title_projects.toLowerCase()) > -1}
													                renderItem={(item, isHighlighted) =>
                                                                        <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                            {item}
                                                                        </div>
                                                                    }
                                                                    value={title_projects}
                                                                    onChange={(ev) => this.setState({ title_projects: ev.target.value })}
                                                                    onSelect={(title_projects) => this.setState({ title_projects })}
                                                                />
                                                                <label id="title_projects_label" htmlFor='title_projects' className={title_projects ? 'active' : ''}>Search</label>
                                                                <div className='form-group-line'></div>
                                                            </div>
                                                            <div className="card__title">Projects</div>
                                                            <div className="dropdown">
                                                                <span className="dropdown-toggle" id="dropdownMenuButton_projects" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </span>
                                                                <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton_projects">
                                                                    <button className="dropdown-item show_more _show_projects btn-primary" id='_project_modal_trigger' data-toggle="modal" data-target="#_all_project_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    <button className="dropdown-item add _add_project btn-primary" data-toggle="modal" data-target="#_project_modal"><i className="fas fa-plus"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="_projects_content _content">
                                                            <div className="_projects_data data-container">
																<div className="projects_slider_wrapper swiper-container">
																	<div className="projects_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author })), function(o) { 
                                                                                if(timeframe === 'Today')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                                                if(timeframe === 'This_Past_Week')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                                                if(timeframe === 'This_Past_Month')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                                                if(timeframe === 'This_Past_Year')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                                                if(timeframe === 'All_Time')
                                                                                    return true;
                                                                                }), (op) => {
                                                                                    if(!categorie)
                                                                                        return true;
                                                                                    else 
                                                                                        return op.categorie === categorie;
                                                                                }), (op_byTitle) => {
                                                                                    if(!title)
                                                                                        return true;
                                                                                    else
                                                                                        return _.includes(op_byTitle.title.toLowerCase(), title_projects.toLowerCase());
                                                                                }).map((project, index) => {
                                                                                return (
                                                                                    <div className="projects_slider_wrapper_cards_item swiper-slide" data-name={ moment(project.createdAt).format("YYYY Do MM") } id="projects_slider_wrapper_cards_item" key={index}>
                                                                                        <div className='project_item swiper-slide_item'>
                                                                                            <div className={"col card card_" + index} data-title={_.snakeCase(project.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <h2>{project.title}</h2>
                                                                                                    <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
                                                                                                    <p className="categorie"><i className={project._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                                    <br/>
                                                                                                    <div className="dropdown">
                                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton_project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_project">
                                                                                                            {(() => {
                                                                                                                if(_user.role === "admin" || _user.username === project.author) {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_project_modal" onClick={() => this.handleEditProject(project)}><i className="fas fa-edit"></i></a>
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteProject(project._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()}
                                                                                                            <a className="dropdown-item _view" href={project.link_to} target="_blank" rel="noopener noreferrer"><i className="fas fa-expand-alt"></i></a>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(project.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        <p className="text-muted comments"><b>{_.size(project.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                                        <p className="text-muted upvotes"><b>{_.size(project.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className="text-muted downvotes"><b>{_.size(project.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="projects_slider_pagination swiper-pagination"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_testimonies_pane _pane">
                                                        <div className="_testimonies_content _content">
                                                            <div className="_testimonies_head">
                                                                <h6>Testimonies</h6>
                                                                <div className="dropdown">
                                                                    <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton_testimonies">
                                                                        <button className="dropdown-item show_more _show_testimonies btn-primary" id='_testimony_modal_trigger' data-toggle="modal" data-target="#_all_testimony_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="_testimonies_data data-container">
																<div className="testimonies_slider_wrapper swiper-container">
																	<div className="testimonies_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' })), function(o) { 
                                                                                if(timeframe === 'Today')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                                                if(timeframe === 'This_Past_Week')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                                                if(timeframe === 'This_Past_Month')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                                                if(timeframe === 'This_Past_Year')
                                                                                    return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                                                if(timeframe === 'All_Time')
                                                                                    return true;
                                                                                })).map((testimony, index) => {
                                                                                return (
                                                                                    <div className="testimonies_slider_wrapper_cards_item swiper-slide" data-name={ moment(testimony.createdAt).format("YYYY Do MM") } id="testimonies_slider_wrapper_cards_item" key={index}>
                                                                                        <div className={`testimony_item swiper-slide_item ${!testimony.is_private ? '' : 'is_private'}`}>
                                                                                            <div className={"col card card_testimonies card_" + index} data-title={_.snakeCase(testimony.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <div className="_heads_up">
                                                                                                        <div className="intel">
                                                                                                            <p className="text-muted author">by </p>
                                                                                                            <p className="text-muted author">{testimony.author}</p>
                                                                                                            <p className="text-muted author">{moment(new Date(testimony.createdAt)).fromNow()}</p>
                                                                                                        </div>
                                                                                                        <div className="dropdown">
                                                                                                            <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                                <i className="fas fa-ellipsis-h"></i>
                                                                                                            </span>
                                                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_testimonies">
                                                                                                                {(() => {
                                                                                                                    if(_user.role === "admin" || _user.username === testimony.author) {
                                                                                                                        return (
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteTestimony(testimony._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        )
                                                                                                                    }
                                                                                                                })()}
                                                                                                                <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_testimony : testimony}); }} data-id={testimony._id} data-toggle="modal" data-target="#_testimony_modal"><i className="fas fa-expand-alt"></i></a>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="_testy_body">
                                                                                                        <h6>{testimony.body}</h6>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(testimony.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        
                                                                                                        <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                                                                        <p className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.upvotes)}</b><i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.downvotes)}</b><i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="testimonies_slider_pagination swiper-pagination"></div>
                                                                    <div className="testimonies_slider_scrollbar swiper-scrollbar"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
								</div>
								<div className="settings_pane tab-pane" id="2a">
                                    <div className="top_roof">
                                        <div className="left_roof">
                                            <h2>Settings</h2>
                                            <div className="name">{_user.email}</div>
                                        </div>
                                        <a href="# " className="logout" onClick={() => this.disconnect()}><p className="text-muted">{_user.username}</p><i className="fas fa-door-open"></i></a>
                                    </div>
                                    <ul className="forms">
                                        <li className="forms__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_account_pane _pane">
                                                        <div className="_account_content _content">
                                                            <div className="_account_head">
                                                                <h4>Account Settings.</h4>
                                                                <p className="text-muted">Here you can change the email address you use and password</p>
                                                            </div>
                                                            <div className="_account_data data_container">
                                                                <Account/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="forms__item">
                                            <div className="card">
                                                
                                            </div>
                                        </li>
                                    </ul>
                                </div>
							</div>
                            
                            <div className="_article_modal modal _modal fade" id="_article_modal" tabIndex="-1" role="dialog" aria-labelledby="_article_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <Form />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_article_modal_view modal _modal fade" id="_article_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_article_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <div className="card">
                                                <div className="shadow_title">{_.head(_.words(_article.body))}</div>
                                                <div className="card-body">
                                                    <div className="top_row">
                                                        <p className="text-muted views"><b>{_.size(_article.view)}</b><i className="fas fa-eye"></i> Views</p>
                                                        <i className="fas fa-circle dot"></i>
									                    <h6 className="author">by <b>{_article.author}</b></h6>
                                                        <p className="text-muted fromNow">{moment(new Date(_article.createdAt)).fromNow()}</p>
                                                        <div className="up_down">
                                                            <p className="text-muted comments"><i className={_article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                            <p className="text-muted comments"><b>{_.size(_.get(_article, 'comment'))}</b><i className="fas fa-comment-alt"></i></p>
									                        <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(_article, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_article, 'upvotes'))}</b> 
                                                                <i className="fas fa-thumbs-up"></i>
                                                            </div>
                                                            <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(_article, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_article, 'downvotes'))}</b>
                                                                <i className="fas fa-thumbs-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="middle_row">
                                                        <h6 className="text-muted body body_article">
                                                            {
                                                                this.handleJSONTOHTML(_article.body)
                                                            }
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_article_modal_view _all_view modal _modal fade" id="_all_article_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_article_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }) ))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        })))}
                                                    </strong> 
                                                    &nbsp;articles.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
                                                </div>
                                            </div>
                                            <div className="modal-top-filter">
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={sort}
                                                        onChange={(ev) => this.handleChangeField('sort', ev)}
                                                        className="form-group-input sort" 
                                                        id="sort" 
                                                        name="sort"
                                                    >
                                                        <option value="Trending">Trending</option>
                                                        <option value="Relevant">Relevant</option>
                                                        <option value="Most_Liked">Most Liked</option>
                                                        <option value="Recent">Recent</option>
                                                    </select>
                                                    <label htmlFor='sort' className={sort ? 'active' : ''}>sort</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={timeframe}
                                                        onChange={(ev) => this.handleChangeField('timeframe', ev)}
                                                        className="form-group-input timeframe" 
                                                        id="timeframe" 
                                                        name="timeframe"
                                                    >
                                                        <option value="Today">Today</option>
                                                        <option value="This_Past_Week">This Past Week</option>
                                                        <option value="This_Past_Month">This Past Month</option>
                                                        <option value="This_Past_Year">This Past Year</option>
                                                        <option value="All_Time">All Time</option>
                                                    </select>
                                                    <label htmlFor='timeframe' className={timeframe ? 'active' : ''}>timeframe</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={categorie}
                                                        onChange={(ev) => this.handleChangeField('categorie', ev)}
                                                        className="form-group-input categorie" 
                                                        id="categorie" 
                                                        name="categorie"
                                                    >
                                                        <option value=''></option>
                                                        <option value="Education">Education</option>
                                                        <option value="Design">Design</option>
                                                        <option value="Personnel">Community</option>
                                                        <option value="Tutorials">Tutorials</option>
                                                    </select>
                                                    <label htmlFor='categorie' className={categorie ? 'active' : ''}>categorie</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <Autocomplete
                                                        items={_.flattenDeep(_.map(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), 'tag'))}
                                                        getItemValue={(item) => item}
                                                        inputProps={{ id: 'tags', className: 'form-group-input tags', name: 'tags' }}
                                                        shouldItemRender={(item, tags) => item.toLowerCase().indexOf(tags.toLowerCase()) > -1}
                                                        renderItem={(item, isHighlighted) =>
                                                            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                {item}
                                                            </div>
                                                        }
                                                        value={tags}
                                                        onChange={(ev) => this.setState({ tags: ev.target.value })}
                                                        onSelect={(tags) => this.setState({ tags })}
                                                    />
                                                    <label id="tags_label" htmlFor='tags' className={tags ? 'active' : ''}>tags</label>
                                                    <div className='form-group-line'></div>
                                                </div>
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author })), function(o) { 
                                                        if(timeframe === 'Today')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else {
                                                                return op_bytag.tag.some(x => x.includes(tags));
                                                            }
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((article, index) => {
                                                        return (
                                                            <li className="article_card _card article_anchor" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="article_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <figure>{this.handleJSONTOHTMLIMAGE(article.body, index)}</figure>
                                                                        <div className="text">
                                                                            <div className="cat_drop">
                                                                                <p className="categorie">{article.categorie}</p>
                                                                                <p className="categorie"><i className={article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                <div className="dropdown">
                                                                                    <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                                    </span>
                                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                        {(() => {
                                                                                            if(_user.role === "admin" || _user.username === article.author) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleEditArticle(article)}><i className="fas fa-edit"></i></a>
                                                                                                        <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteArticle(article._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                    </>
                                                                                                )
                                                                                            }
                                                                                        })()}
                                                                                        <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view"><i className="fas fa-expand-alt"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <h4>{article.title}</h4>
                                                                            <ul className="text-muted tags">
                                                                                {
                                                                                    article.tag.map((t, i) => {
                                                                                        return (
                                                                                            <li className="tag_item">{t}</li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <Link onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view">
                                                                                <div className="readmore">
                                                                                    <button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
                                                                                        <div className="line line-1"></div>
                                                                                        <div className="line line-2"></div>
                                                                                    </button>
                                                                                </div>
                                                                            </Link>
                                                                            <br/>
                                                                            <div className="comments_up_down">
                                                                                <p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
                                                                                <p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                <p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                <p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                            </div>
                                                                            <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _user.role === 'admin' || _user.username === _a.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }).length / todosPerPage)).keys()]).map(number => {
                                                        return (
                                                            <li
                                                                key={number+1}
                                                                id={number+1}
                                                                onClick={this.handleClickPage}
                                                                className={currentPage === number+1 ? 'current' : ''}
                                                                >
                                                                    <p className="shadow_page">.{this._FormatNumberLength(number+1,2)}</p>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="_project_modal modal _modal fade" id="_project_modal" tabIndex="-1" role="dialog" aria-labelledby="_project_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <FormProject />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_project_modal_view _all_view modal _modal fade" id="_all_project_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_project_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }) ))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        })))}
                                                    </strong> 
                                                    &nbsp;projects.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
                                                </div>
                                            </div>
                                            <div className="modal-top-filter">
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={sort}
                                                        onChange={(ev) => this.handleChangeField('sort', ev)}
                                                        className="form-group-input sort" 
                                                        id="sort" 
                                                        name="sort"
                                                    >
                                                        <option value="Trending">Trending</option>
                                                        <option value="Relevant">Relevant</option>
                                                        <option value="Most_Liked">Most Liked</option>
                                                        <option value="Recent">Recent</option>
                                                    </select>
                                                    <label htmlFor='sort' className={sort ? 'active' : ''}>sort</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={timeframe}
                                                        onChange={(ev) => this.handleChangeField('timeframe', ev)}
                                                        className="form-group-input timeframe" 
                                                        id="timeframe" 
                                                        name="timeframe"
                                                    >
                                                        <option value="Today">Today</option>
                                                        <option value="This_Past_Week">This Past Week</option>
                                                        <option value="This_Past_Month">This Past Month</option>
                                                        <option value="This_Past_Year">This Past Year</option>
                                                        <option value="All_Time">All Time</option>
                                                    </select>
                                                    <label htmlFor='timeframe' className={timeframe ? 'active' : ''}>timeframe</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <select 
                                                        value={categorie}
                                                        onChange={(ev) => this.handleChangeField('categorie', ev)}
                                                        className="form-group-input categorie" 
                                                        id="categorie" 
                                                        name="categorie"
                                                    >
                                                        <option value=''></option>
                                                        <option value="Education">Education</option>
                                                        <option value="Design">Design</option>
                                                        <option value="Personnel">Community</option>
                                                        <option value="Tutorials">Tutorials</option>
                                                    </select>
                                                    <label htmlFor='categorie' className={categorie ? 'active' : ''}>categorie</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s3">
                                                    <Autocomplete
                                                        items={_.flattenDeep(_.map(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), 'tag'))}
                                                        getItemValue={(item) => item}
                                                        inputProps={{ id: 'tags', className: 'form-group-input tags', name: 'tags' }}
                                                        shouldItemRender={(item, tags) => item.toLowerCase().indexOf(tags.toLowerCase()) > -1}
                                                        renderItem={(item, isHighlighted) =>
                                                            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                {item}
                                                            </div>
                                                        }
                                                        value={tags}
                                                        onChange={(ev) => this.setState({ tags: ev.target.value })}
                                                        onSelect={(tags) => this.setState({ tags })}
                                                    />
                                                    <label id="tags_label" htmlFor='tags' className={tags ? 'active' : ''}>tags</label>
                                                    <div className='form-group-line'></div>
                                                </div>
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author })), function(o) { 
                                                        if(timeframe === 'Today')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else {
                                                                return op_bytag.tag.some(x => x.includes(tags));
                                                            }
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((project, index) => {
                                                        return (
                                                            <li className="project_card _card project_anchor" data-name={ moment(project.createdAt).format("YYYY Do MM") } id="project_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(project.title)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <figure>{this.handleJSONTOHTMLIMAGE(project.body, index)}</figure>
                                                                        <div className="text">
                                                                            <div className="cat_drop">
                                                                                <h4>{project.title}</h4>
                                                                                <div className="dropdown">
                                                                                    <span className="dropdown-toggle" id="dropdownMenuButton_project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                                    </span>
                                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_project">
                                                                                        {(() => {
                                                                                            if(_user.role === "admin" || _user.username === project.author) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_project_modal" onClick={() => this.handleEditProject(project)}><i className="fas fa-edit"></i></a>
                                                                                                        <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteProject(project._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                    </>
                                                                                                )
                                                                                            }
                                                                                        })()}
                                                                                        <a className="dropdown-item _view" href={project.link_to} target="_blank" rel="noopener noreferrer"><i className="fas fa-expand-alt"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <p className="categorie"><i className={project._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                            <ul className="text-muted tags">
                                                                                {
                                                                                    project.tag.map((t, i) => {
                                                                                        return (
                                                                                            <li className="tag_item">{t}</li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <a href={project.link_to} target="_blank" rel="noopener noreferrer">
                                                                                <div className="readmore">
                                                                                    <button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
                                                                                        <div className="line line-1"></div>
                                                                                        <div className="line line-2"></div>
                                                                                    </button>
                                                                                </div>
                                                                            </a>
                                                                            <br/>
                                                                            <div className="comments_up_down">
                                                                                <p className="text-muted views"><b>{_.size(project.view)}</b><i className="fas fa-eye"></i></p>
                                                                                <p className="text-muted comments"><b>{_.size(project.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                <p className="text-muted upvotes"><b>{_.size(project.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                <p className="text-muted downvotes"><b>{_.size(project.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                            </div>
                                                                            <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _user.role === 'admin' || _user.username === _p.author })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }).length / todosPerPage)).keys()]).map(number => {
                                                        return (
                                                            <li
                                                                key={number+1}
                                                                id={number+1}
                                                                onClick={this.handleClickPage}
                                                                className={currentPage === number+1 ? 'current' : ''}
                                                                >
                                                                    <p className="shadow_page">.{this._FormatNumberLength(number+1,2)}</p>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="_testimony_modal modal _modal fade" id="_testimony_modal" tabIndex="-1" role="dialog" aria-labelledby="_testimony_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <div className="card">
                                                <div className="shadow_title">{_.head(_.words(_testimony.body))}</div>
                                                <div className="card-body">
                                                    <div className="top_row">
                                                        <h6 className="author">by <b>{_testimony.author}</b></h6>
                                                        <p className="text-muted fromNow">{moment(new Date(_testimony.createdAt)).fromNow()}</p>
                                                        <div className="up_down">
                                                            <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': _testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                            <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(_testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_testimony, 'upvotes'))}</b> 
                                                                <i className="fas fa-thumbs-up"></i>
                                                            </div>
                                                            <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(_testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_testimony, 'downvotes'))}</b>
                                                                <i className="fas fa-thumbs-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="middle_row">
                                                        <h5>{_testimony.body}</h5>
                                                    </div>
                                                    {(() => {
                                                        if(_testimony.is_private === true) {
                                                            return (
                                                                <p className="is_private">Private.</p>
                                                            )
                                                        }
                                                    })()}
                                                    {
                                                        _.orderBy(_.reject(_.filter(testimonies, (_t) => { return !_t.is_private || _testimony.author === _user.username }), { parent_id: null }), ['view'], ['desc']).map((testimony_reply, index_reply) => {
                                                            if(testimony_reply.parent_id === _testimony._id)
                                                                return (
                                                                    <div className={"card card_" + index_reply} data-index={index_reply+1}>
                                                                        <div className="shadow_title">{_.head(_.words(testimony_reply.body))}</div>
                                                                        <div className="card-body">
                                                                            <div className="top_row">
                                                                                <h6 className="author">by <b>{testimony_reply.author}</b></h6>
                                                                                <p className="text-muted fromNow">{moment(new Date(testimony_reply.createdAt)).fromNow()}</p>
                                                                                <div className="up_down">
                                                                                    <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony_reply, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                                        <b>{_.size(_.get(testimony_reply, 'upvotes'))}</b> 
                                                                                        <i className="fas fa-thumbs-up"></i>
                                                                                    </div>
                                                                                    <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony_reply, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                                        <b>{_.size(_.get(testimony_reply, 'downvotes'))}</b>
                                                                                        <i className="fas fa-thumbs-down"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="middle_row">
                                                                                <h5>{testimony_reply.body}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_testimony_modal_view _all_view modal _modal fade" id="_all_testimony_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_testimony_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        })))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        })))}
                                                    </strong> 
                                                    &nbsp;testimonies.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
                                                </div>
                                            </div>
                                            <div className="modal-top-filter">
                                                <div className="input-field col s6">
                                                    <select 
                                                        value={sort}
                                                        onChange={(ev) => this.handleChangeField('sort', ev)}
                                                        className="form-group-input sort" 
                                                        id="sort" 
                                                        name="sort"
                                                    >
                                                        <option value="Trending">Trending</option>
                                                        <option value="Relevant">Relevant</option>
                                                        <option value="Most_Liked">Most Liked</option>
                                                        <option value="Recent">Recent</option>
                                                    </select>
                                                    <label htmlFor='sort' className={sort ? 'active' : ''}>sort</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                                <div className="input-field col s6">
                                                    <select 
                                                        value={timeframe}
                                                        onChange={(ev) => this.handleChangeField('timeframe', ev)}
                                                        className="form-group-input timeframe" 
                                                        id="timeframe" 
                                                        name="timeframe"
                                                    >
                                                        <option value="Today">Today</option>
                                                        <option value="This_Past_Week">This Past Week</option>
                                                        <option value="This_Past_Month">This Past Month</option>
                                                        <option value="This_Past_Year">This Past Year</option>
                                                        <option value="All_Time">All Time</option>
                                                    </select>
                                                    <label htmlFor='timeframe' className={timeframe ? 'active' : ''}>timeframe</label>
                                                    <div className="form-group-line"></div>
                                                </div>
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' || _user.role === 'admin' }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' })), function(o) { 
                                                        if(timeframe === 'Today')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((testimony, index) => {
                                                        return (
                                                            <li className="testimony_card _card testimony_anchor" data-name={ moment(testimony.createdAt).format("YYYY Do MM") } id="testimony_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(testimony.author)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <div className="_heads_up">
                                                                            <div className="intel">
                                                                                <p className="text-muted author">by </p>
                                                                                <p className="text-muted author">{testimony.author}</p>
                                                                                <p className="text-muted author">{moment(new Date(testimony.createdAt)).fromNow()}</p>
                                                                            </div>
                                                                            <div className="dropdown">
                                                                                <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                                </span>
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_testimonies">
                                                                                    {(() => {
                                                                                        if(_user.role === "admin" || _user.username === testimony.author) {
                                                                                            return (
                                                                                                <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteTestimony(testimony._id)}><i className="far fa-trash-alt"></i></a>
                                                                                            )
                                                                                        }
                                                                                    })()}
                                                                                    <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_testimony : testimony}); }} data-id={testimony._id} data-toggle="modal" data-target="#_testimony_modal"><i className="fas fa-expand-alt"></i></a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {(() => {
                                                                            if(testimony.is_private === true) {
                                                                                return (
                                                                                    <p className="is_private">Private.</p>
                                                                                )
                                                                            }
                                                                        })()}
                                                                        <div className="_testy_body">
                                                                            <h4>{testimony.body}</h4>
                                                                        </div>
                                                                        <div className="comments_up_down">
                                                                            <p className="text-muted views"><b>{_.size(testimony.view)}</b><i className="fas fa-eye"></i></p>
                                                                            
                                                                            <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                                            <p className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.upvotes)}</b><i className="fas fa-thumbs-up"></i></p>
                                                                            <p className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.downvotes)}</b><i className="fas fa-thumbs-down"></i></p>
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _user.role === 'admin' })), function(o) { 
                                                        if(timeframe === 'Today') 
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
                                                        if(timeframe === 'This_Past_Week')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
                                                        if(timeframe === 'This_Past_Month')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
                                                        if(timeframe === 'This_Past_Year')
                                                            return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
                                                        if(timeframe === 'All_Time')
                                                            return true;
                                                        }), (op) => {
                                                            if(!categorie)
                                                                return true;
                                                            else 
                                                                return op.categorie === categorie;
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }).length / todosPerPage)).keys()]).map(number => {
                                                        return (
                                                            <li
                                                                key={number+1}
                                                                id={number+1}
                                                                onClick={this.handleClickPage}
                                                                className={currentPage === number+1 ? 'current' : ''}
                                                                >
                                                                    <p className="shadow_page">.{this._FormatNumberLength(number+1,2)}</p>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
						
                            <div className="modal fade" id="edit_modal" tabIndex="-1" role="dialog" aria-labelledby="edit_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <h5 className="modal-title" id="edit_modalLabel">Hey!</h5>
                                            <div>Your Informations has been updated, we've sent you details to your email, we love you.</div>
                                            <div><small>Thanks {localStorage.getItem('username')}</small></div>
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

const mapStateToProps = state => ({
    articles: state.home.articles,
    projects: state.home.projects,
    testimonies: state.home.testimonies,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
    setEdit: article => dispatch({ type: 'SET_EDIT', article }),
    
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
    onDeleteProject: id => dispatch({ type: 'DELETE_PROJECT', id }),
    setEditProject: project => dispatch({ type: 'SET_EDIT_PROJECT', project }),
    
    onLoadTestimony: data => dispatch({ type: 'TESTIMONY_PAGE_LOADED', data }),
    onDeleteTestimony: id => dispatch({ type: 'DELETE_TESTIMONY', id }),
	setEditTestimony: testimony => dispatch({ type: 'SET_EDIT_TESTIMONY', testimony }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);