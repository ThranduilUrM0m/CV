import React from 'react';
import Autocomplete from 'react-autocomplete';
import Swiper, { Navigation, Pagination } from 'swiper';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class Blog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentPage: 1,
			todosPerPage: 6,
			currentCard: 0,
			position: 0,
			width: 0,
			sort: 'Relevant',
			timeframe: 'All_Time',
			categorie: '',
			tags: '',
		};
		this.handleJSONTOHTMLIMAGE = this.handleJSONTOHTMLIMAGE.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
		this.handleClickPage = this.handleClickPage.bind(this);
		this._handleMouseMove = this._handleMouseMove.bind(this);
		this._handleModal = this._handleModal.bind(this);
		this.handleChangeField = this.handleChangeField.bind(this);
		this.handleShowFilter = this.handleShowFilter.bind(this);
		this._handleDrag = this._handleDrag.bind(this);
	}
	componentWillMount() {
		const { onLoad } = this.props;
		const self = this;
		axios('/api/articles')
			.then(function (response) {
				onLoad(response.data);
				function runAfterElementExists(jquery_selector, callback) {
					var checker = window.setInterval(function () {
						if ($(jquery_selector).length) {
							clearInterval(checker);
							callback();
						}
					}, 200);
				}
				runAfterElementExists(".second_section_blog .articles_slider_wrapper_cards_item", function () {
					self._handleDrag();
				});
				$('.fixedHeaderContainer').addClass('blog_header');
			})
			.catch(function (error) {
				console.log(error);
			});
	}
	componentDidMount() {
		this._handleMouseMove();
		this._handleModal();
		if (window.innerHeight > window.innerWidth) {
			if ($(window).width() <= 640) {
				this.setState({
					todosPerPage: 2
				});
			}
		} else {
			if ($(window).width() <= 640) {
				this.setState({
					todosPerPage: 4
				});
			}
		}
	}
	_handleDrag() {
		// configure Swiper to use modules
		Swiper.use([Navigation, Pagination]);

		var mySwiper = new Swiper('.swiper-container', {
			effect: 'coverflow',
			direction: 'horizontal',
			grabCursor: true,
			slidesPerView: 3.25,
			centeredSlides: false,
			centeredSlidesBounds: false,
			paginationClickable: true,
			centerInsufficientSlides: false,
			spaceBetween: 0,
			autoResize: false,
			observer: true,
			watchOverflow: true,
			variableWidth: true,
			coverflowEffect: {
				rotate: 0,
				stretch: 0,
				depth: 0,
				modifier: 3,
				slideShadows: false
			},
			simulateTouch: true,
			navigation: {
				nextEl: '.swiper-button-next',
				prevEl: '.swiper-button-prev',
			}
		});
		$(window).resize(function () {
			if (window.innerHeight > window.innerWidth) {
				if ($(window).width() <= 640) {
					mySwiper.params.slidesPerView = 1.25;
					mySwiper.update();
				}
				if ($(window).width() <= 768) {
					mySwiper.params.slidesPerView = 2.25;
					mySwiper.update();
				}
			} else {
				if ($(window).width() <= 768) {
					mySwiper.params.slidesPerView = 2.25;
					mySwiper.update();
				}
			}
		});
		$(window).trigger('resize');
	}
	_handleMouseMove() {
		function Parallax(options) {
			options = options || {};
			this.nameSpaces = {
				wrapper: options.wrapper || '.first_section_blog',
				layers: options.layers || '.parallax-layer',
				deep: options.deep || 'data-parallax-deep'
			};
			this.init = function () {
				var self = this,
					parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
				for (var i = 0; i < parallaxWrappers.length; i++) {
					(function (i) {
						parallaxWrappers[i].addEventListener('mousemove', function (e) {
							var x = e.clientX,
								y = e.clientY,
								layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
							for (var j = 0; j < layers.length; j++) {
								(function (j) {
									var deep = layers[j].getAttribute(self.nameSpaces.deep),
										disallow = layers[j].getAttribute('data-parallax-disallow'),
										direction = layers[j].getAttribute('data-parallax-direction'),
										itemX = (disallow && disallow === 'x') ? 0 : x / deep,
										itemY = (disallow && disallow === 'y') ? 0 : y / deep;
									itemX = (direction && direction === 'minus') ? -itemX : itemX;
									itemY = (direction && direction === 'plus') ? -itemY : itemY;
									if (disallow && disallow === 'both') return;
									layers[j].style.transform = 'translateX(' + itemX + '%) translateY(' + itemY + '%)';
								})(j);
							}
						})
					})(i);
				}
			};
			this.init();
			return this;
		}
		new Parallax();

		let items = document.querySelectorAll(".socials-item-icon");
		items.forEach((item, index) => {
			item.addEventListener("mousemove", mouseMove);
			item.addEventListener("mouseleave", mouseLeave);
		});
		function mouseMove(e) {
			let target = e.target.closest("a"),
				targetData = target.getBoundingClientRect(),
				targetIcon = target.querySelector("i"),
				offset = {
					x: ((e.pageX - (targetData.left + targetData.width / 2)) / 4) * -1,
					y: ((e.pageY - (targetData.top + targetData.height / 2)) / 4) * -1
				};
			target.style.transform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
			target.style.webkitTransform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
			document.querySelectorAll(".socials-item-icon").forEach((e) => {
				if (e != target) {
					e.style.transform = "translate(" + offset.x / 2 + "px, " + offset.y / 2 + "px) scale(" + 0.9 + ")";
					e.style.webkitTransform = "translate(" + offset.x / 2 + "px, " + offset.y / 2 + "px) scale(" + 0.9 + ")";
				}
			});
			targetIcon.style.transform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
			targetIcon.style.webkitTransform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
		}
		function mouseLeave(e) {
			document.querySelectorAll(".socials-item-icon").forEach((target) => {
				let targetIcon = target.querySelector("i");
				target.style.transform = "translate(0px,0px) scale(1)";
				target.style.webkitTransform = "translate(0px,0px) scale(1)";
				targetIcon.style.transform = "translate(0px,0px) scale(1)";
				targetIcon.style.webkitTransform = "translate(0px,0px) scale(1)";
			});
		}
	}
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
	handleJSONTOHTMLIMAGE(inputDelta, index) {
		function runAfterElementExists(jquery_selector, callback) {
			var checker = window.setInterval(function () {
				if (jquery_selector) {
					clearInterval(checker);
					callback();
				}
			}, 200);
		}
		runAfterElementExists(inputDelta, function () {
			const html = $.parseHTML(inputDelta);
			$('.card_' + index + ' figure').html($(html).find('img').first());
		});
	}
	handleClickPage(event) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#second_section_blog").offset().top
		}, 500);
		this.setState({
			currentPage: Number(event.target.id)
		});
	}
	handleShowFilter(event) {
		var wrapper = $('.modal-top-filter'),
			buttonF = $('#myModal .filter');
		if (!wrapper.hasClass('expand')) {
			wrapper.addClass('expand', 500);
			buttonF.addClass('expand', 500);
		} else {
			wrapper.removeClass('expand', 500);
			buttonF.removeClass('expand', 500);
		}
	}
	_handleModal() {
		const self = this;
		var Boxlayout = function () {
			var wrapper = document.getElementById('second_section_blog'),
				element = $('#modal_trigger'),
				modal = $('#myModal'),
				closeButton = $('.modal-close'),
				expandedClass = 'is-expanded',
				hasExpandedClass = 'has-expanded-item';

			return { init: init };
			function init() {
				_initEvents();
			}
			function _initEvents() {
				element.click(function () {
					if (!modal.hasClass(expandedClass)) {
						modal.addClass(expandedClass, 500);
						wrapper.classList.add(hasExpandedClass);
						document.getElementById('second_section_blog').parentElement.style.height = 'initial';
						document.getElementById('second_section_blog').parentElement.style.minHeight = '100vh';
						$('.fixedHeaderContainer').toggleClass('blog_header');
						$('.modal-top-filter input.tags').focus(() => {
							$('.modal-top-filter label#tags_label').toggleClass('active');
						});
						$('.modal-top-filter input.tags').blur(() => {
							if (!self.state.tags)
								$('.modal-top-filter label#tags_label').toggleClass('active');
						});
					}
				});
				closeButton.click(function (event) {
					if (modal.hasClass(expandedClass)) {
						modal.removeClass(expandedClass);
						wrapper.classList.remove(hasExpandedClass);
						document.getElementById('second_section_blog').parentElement.style.height = '100%';
						$('.fixedHeaderContainer').toggleClass('blog_header');
					}
				});
			}
		}();
		Boxlayout.init();
	}
	handleChangeField(key, event) {
		this.setState({ [key]: event.target.value });
	}
	render() {
		const { articles, match } = this.props;
		const { currentPage, todosPerPage, sort, timeframe, categorie, tags } = this.state;

		return (
			<FullPage scrollMode={'normal'}>
				<Slide>
					<section className="active first_section_blog">
						<span className="parallax-layer parallax-layer__1 l_name" data-parallax-direction="plus" data-parallax-deep="1000">Boutaleb<span className="outlined">Boutaleb</span>BoutalebBoutaleb</span>
						<span className="parallax-layer parallax-layer__2 f_name" data-parallax-direction="minus" data-parallax-deep="1000">Zakariae<span className="outlined">Zakariae</span>ZakariaeZakariae</span>
						<div id="social_media">
							<div className="icons_gatherer">
								<a href="https://dribbble.com/boutaleblcoder" className="icon-button dribbble"><i className="fab fa-dribbble"></i><span></span></a>
								<a href="https://www.behance.net/boutaleblcoder/" className="icon-button behance"><i className="fab fa-behance"></i><span></span></a>
								<a href="https://www.linkedin.com/in/zakariae-bou-taleb-657953122/" className="icon-button linkedin"><i className="fab fa-linkedin-in"></i><span></span></a>
								<a href="https://www.instagram.com/boutaleblcoder/" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
								<a href="https://fb.me/boutaleblcoder" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
								<a href="# " className="icon-button scroll">

								</a>
							</div>
						</div>
						<div className="wrapper left_part">
							<div className="caption">
								<p><b>The teacher</b></p>
								<p>My father was an educator, My grandfather was an educator, i was born to educate, and my sons will also educate.</p>
							</div>
						</div>
						<div className="wrapper right_part">
							<div className="caption">
								<p><b>The Coder</b></p>
								<p>Grew up next to a computer, learned to create at a young age, i was born to create to look from all sides and discover hidden meanings.</p>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<section id="second_section_blog" className="second_section_blog">
						{/* Modal */}
						<div className="modal myModal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
							<div id="modal_dialog" className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-body">
										<div className="modal-top">
											<h5 className="modal-title" id="exampleModalLabel">
												Showing&nbsp;
												<strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>
												&nbsp;to&nbsp;
												<strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(articles, (_a) => { return !_a._hide })), function (o) {
												if (timeframe === 'Today')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
												if (timeframe === 'This_Past_Week')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
												if (timeframe === 'This_Past_Month')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
												if (timeframe === 'This_Past_Year')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
												if (timeframe === 'All_Time')
													return true;
											}), (op) => {
												if (!categorie)
													return true;
												else
													return op.categorie === categorie;
											}), (op_bytag) => {
												if (!tags)
													return true;
												else
													return op_bytag.tag.some(x => _.split(_.lowerCase(tags), ' ').some(_s_v => _.lowerCase(x).includes(_s_v)));
											})))}</strong>
												&nbsp;of&nbsp;
												<strong>{_.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide })), function (o) {
												if (timeframe === 'Today')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
												if (timeframe === 'This_Past_Week')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
												if (timeframe === 'This_Past_Month')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
												if (timeframe === 'This_Past_Year')
													return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
												if (timeframe === 'All_Time')
													return true;
											}), (op) => {
												if (!categorie)
													return true;
												else
													return op.categorie === categorie;
											}), (op_bytag) => {
												if (!tags)
													return true;
												else
													return op_bytag.tag.some(x => _.split(_.lowerCase(tags), ' ').some(_s_v => _.lowerCase(x).includes(_s_v)));
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
											<div className="input-field">
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
											<div className="input-field">
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
											<div className="input-field">
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
											<div className="input-field">
												<Autocomplete
													items={_.flattenDeep(_.map(_.filter(articles, (_a) => { return !_a._hide }), 'tag'))}
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
										<h1>Journal</h1>
										<ul id="page">
											{
												_.slice(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide })), function (o) {
													if (timeframe === 'Today')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
													if (timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if (timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if (timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if (timeframe === 'All_Time')
														return true;
												}), (op) => {
													if (!categorie)
														return true;
													else
														return op.categorie === categorie;
												}), (op_bytag) => {
													if (!tags)
														return true;
													else
														return op_bytag.tag.some(x => _.split(_.lowerCase(tags), ' ').some(_s_v => _.lowerCase(x).includes(_s_v)));
												}), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((article, index) => {
													return (
														<li className="article_card article_anchor" data-name={moment(article.createdAt).format("YYYY Do MM")} id="article_card" key={index}>
															<div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index, 1)}>
																<div className="card-body">
																	<figure>{this.handleJSONTOHTMLIMAGE(article.body, index)}</figure>
																	<div className="text">
																		<p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
																		<h4>{article.title}</h4>
																		<p className="categorie">{article.categorie}</p>
																		<ul className="text-muted tags">
																			{
																				article.tag.map((t, i) => {
																					return (
																						<li className="tag_item">{t}</li>
																					)
																				})
																			}
																		</ul>
																		<Link to={`${match.url}/${article._id}`}>
																			<div className="readmore">
																				<button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
																					<div className="line line-1"></div>
																					<div className="line line-2"></div>
																				</button>
																			</div>
																		</Link>
																		<div className="comments_up_down">
																			<p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
																			<p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
																			<p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
																			<p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
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
												([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide })), function (o) {
													if (timeframe === 'Today')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
													if (timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if (timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if (timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if (timeframe === 'All_Time')
														return true;
												}), (op) => {
													if (!categorie)
														return true;
													else
														return op.categorie === categorie;
												}), (op_bytag) => {
													if (!tags)
														return true;
													else
														return op_bytag.tag.some(x => _.split(_.lowerCase(tags), ' ').some(_s_v => _.lowerCase(x).includes(_s_v)));
												}).length / todosPerPage)).keys()]).map(number => {
													return (
														<li
															key={number + 1}
															id={number + 1}
															onClick={this.handleClickPage}
															className={currentPage === number + 1 ? 'current' : ''}
														>
															<p className="shadow_page">.{this._FormatNumberLength(number + 1, 2)}</p>
														</li>
													);
												})
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
						{/* Modal */}
						<div className="wrapper_full">
							<span data-heading="Louder.">Louder.</span>
							<div className="caption">
								<i className="fas fa-chalkboard-teacher"></i>
							</div>
							<div className="articles_slider">
								<div className="articles_caption">
									<h1>Youth to Speek <br /> <strong>Louder.</strong></h1>
									<button id='modal_trigger' type="button">
										<span>
											<span>
												<span className="attr" data-attr-span="View All.">
													View All.
												</span>
											</span>
										</span>
									</button>
								</div>
								<div className="articles_slider_wrapper swiper-container">
									<div className="articles_slider_wrapper_cards swiper-wrapper">
										{
											_.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']).map((article, index) => {
												return (
													<div className="articles_slider_wrapper_cards_item swiper-slide" data-name={moment(article.createdAt).format("YYYY Do MM")} id="articles_slider_wrapper_cards_item" key={index}>
														<div className='article_item'>
															<div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index, 1)}>
																<div className="shadow_title">{_.head(_.words(article.title))}</div>
																<div className="shadow_letter">{_.head(_.head(_.words(article.title)))}</div>
																<div className="card-body">
																	<figure>{this.handleJSONTOHTMLIMAGE(article.body, index)}</figure>
																	<p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
																	<h4>{article.title}</h4>
																	<p className="categorie">{article.categorie}</p>
																	<Link to={`/blog/${article._id}`}>
																		<div className="readmore">
																			<button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
																				<div className="line line-1"></div>
																				<div className="line line-2"></div>
																			</button>
																		</div>
																	</Link>
																	<div className="comments_up_down">
																		<p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
																		<p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
																		<p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
																		<p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
																	</div>
																</div>
															</div>
															<div className="card_shadower"></div>
														</div>
													</div>
												)
											})
										}
									</div>
									<div className="slider-btn btn-l swiper-button-prev"><i className="fas fa-long-arrow-alt-left"></i></div>
									<div className="slider-btn btn-r swiper-button-next"><i className="fas fa-long-arrow-alt-right"></i></div>
								</div>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<Footer />
				</Slide>
			</FullPage>
		)
	}
}

const mapStateToProps = state => ({
	articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
	onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);