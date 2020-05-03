import React from "react";
import axios from 'axios';
import Swiper from 'swiper';
import moment from 'moment';
import { Form } from '../Article';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import Clock from 'react-live-clock';
import 'whatwg-fetch';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

var _ = require('lodash');

class Dashboard extends React.Component {
  	constructor(props) {
        super(props);
        
		this.state = {
            _user: {},
            title: '',
			sort: 'Relevant',
			timeframe: 'All_Time',
			categorie: '',
        };

		this.disconnect = this.disconnect.bind(this);
        this._handleDrag = this._handleDrag.bind(this);
        
		this.handleEditArticle = this.handleEditArticle.bind(this);
		this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}
	componentDidMount() {
		const { onLoad, onLoadProject } = this.props;
		let self = this;
		
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
				self._handleDrag();
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
	_handleDrag() {
		var mySwiper = new Swiper ('.swiper-container', {
			// Optional parameters
			effect: 'coverflow',
			direction: 'horizontal',
			grabCursor: true,
			slidesPerView: 1.5,
			centeredSlides: false,
			centeredSlidesBounds: true,
			paginationClickable: true,
			centerInsufficientSlides: true,
            spaceBetween: 0,
            observer: true,
            watchOverflow: true,
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
                el: '.swiper-pagination',
                dynamicBullets: true,
			}
        });
        mySwiper.on('observerUpdate', () => {
            if(mySwiper.slides.length === 1)
                mySwiper.params.slidesPerView = 1
            else 
                mySwiper.params.slidesPerView = 1.5
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
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
	}
	render() {
		const { _user, title, sort, timeframe, categorie } = this.state;
        const { articles, projects } = this.props;
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
                            </div>
							<div className="after"></div>
							<div className="tab-content clearfix">
								<div className="dashboard_pane tab-pane active" id="1a">
                                    <div className="top_roof">
                                        <h3>Dashboard</h3>
                                        <a className="logout" href="" onClick={() => this.disconnect()}><i className="fas fa-door-open"></i></a>
                                        <div className="name">{_user.email}</div>
                                    </div>
									<ul className="cards">
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_articles_pane">
                                                        <div className="_articles_header">
                                                            <div className="title_search input-field">
                                                                <Autocomplete
                                                                    items={_.map(articles, 'title')}
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
                                                                    <button className="dropdown-item show_more _show_articles btn-primary" data-toggle="modal" data-target="#_articles_modal"><i className="fas fa-database"></i></button>
                                                                    <button className="dropdown-item add _add_article btn-primary" data-toggle="modal" data-target="#_article_modal"><i className="fas fa-plus"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="_articles_content">
                                                            <div className="_articles_data data-container">
																<div className="articles_slider_wrapper swiper-container">
																	<div className="articles_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(articles, ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(articles, ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(articles, ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(articles, ['createdAt'], ['desc']) : articles), function(o) { 
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
                                                                                        <div className='article_item'>
                                                                                            <div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <h2>{article.title}</h2>
                                                                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                                                                    <p className="categorie">{article.categorie}</p>
                                                                                                    <br/>
                                                                                                    <div className="dropdown">
                                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                                            <a className="dropdown-item edit" href="" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleEditArticle(article)}><i className="fas fa-edit"></i></a>
                                                                                                            <a className="dropdown-item delete" href="" onClick={() => this.handleDeleteArticle(article._id)}><i className="far fa-trash-alt"></i></a>
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
                                    </ul>
								</div>
								<div className="settings_pane tab-pane" id="2a">
									SETTINGS
								</div>
							</div>
                            <div className="_article_modal modal fade" id="_article_modal" tabIndex="-1" role="dialog" aria-labelledby="_article_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <Form />
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
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
	setEdit: article => dispatch({ type: 'SET_EDIT', article }),
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);