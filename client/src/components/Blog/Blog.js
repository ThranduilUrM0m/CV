import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class Blog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentCard: 0,
			position: 0,
			cardStyle: {
			  	transform: 'translateX(0px)'
			},
			width: 0,
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
		this.handleClick = this.handleClick.bind(this);
		this.setCard = this.setCard.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
	}
	componentDidMount() {
        const { onLoad } = this.props;
		const self = this;
        this._handleScroll();
        this._handleMouseMove();
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
            //this is an example place in your code where you would like to
            //start checking whether the target element exists
            //I have used a class below, but you can use any jQuery selector
            runAfterElementExists(".second_section_blog .article_card", function() {
                let boxWidth = document.getElementById("article_card").clientWidth;
    			self.setState({ width: boxWidth });
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
	}
	handleDelete(id) {
		const { onDelete } = this.props;
		return axios.delete(`/api/articles/${id}`)
			.then(() => onDelete(id));
	}
	handleEdit(article) {
		const { setEdit } = this.props;
		setEdit(article);
	}
    _handleMouseMove() {
		function Parallax(options){
			options = options || {};
			this.nameSpaces = {
				wrapper: options.wrapper || '.first_section_blog',
				layers: options.layers || '.parallax-layer',
				deep: options.deep || 'data-parallax-deep'
			};
			this.init = function() {
				var self = this,
					parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
				  for(var i = 0; i < parallaxWrappers.length; i++){
					(function(i){
						parallaxWrappers[i].addEventListener('mousemove', function(e){
							var x = e.clientX,
								y = e.clientY,
								layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
							for(var j = 0; j < layers.length; j++){
					(function(j){
					  var deep = layers[j].getAttribute(self.nameSpaces.deep),
						  disallow = layers[j].getAttribute('data-parallax-disallow'),
						  direction = layers[j].getAttribute('data-parallax-direction'),
						  itemX = (disallow && disallow === 'x') ? 0 : x / deep,
						  itemY = (disallow && disallow === 'y') ? 0 : y / deep;
						  itemX = (direction && direction === 'minus') ? -itemX : itemX;
						  itemY = (direction && direction === 'plus') ? -itemY : itemY;
						  if(disallow && disallow === 'both') return;
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
		
		window.addEventListener('load', function(){
			new Parallax();
		});
		
		
		//socials
		let items = document.querySelectorAll(".socials-item-icon"),
			self = this;
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
			if (e !== target) {
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
	handleJSONTOHTML(inputDelta) {
		function randomIntFromInterval(min, max) { // min and max included 
			return Math.floor(Math.random() * (max - min + 1) + min);
		}
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
			$('h6.body_article').children('p').filter(':not(:first-of-type):not(:nth-child(2)):not(:nth-child(3))').hide();
			$('.shadow_letter').map(function() {
				$(this).css({
					"left": randomIntFromInterval(-15, 200)+"%",
					"top": randomIntFromInterval(-50, 50)+"%"
				});;
			});
		});
	}
	// func: click the slider buttons
	handleClick(type) {
		const { articles } = this.props;
		// get the card's margin-right
		let margin = window.getComputedStyle(document.getElementById("article_card")).marginRight;
		margin = JSON.parse(margin.replace(/px/i, '')); 
	
		const cardWidth = this.state.width; // the card's width
		const cardMargin = margin; // the card's margin
		const cardNumber = articles.length; // the number of cards
		let currentCard = this.state.currentCard; // the index of the current card
		let position = this.state.position; // the position of the cards
	
		// slide cards
		if(type === 'next' && currentCard < cardNumber-1) {
			currentCard++;
			position -= (cardWidth+cardMargin);
		} else if(type === 'prev' && currentCard > 0) {
			currentCard--;
			position += (cardWidth+cardMargin);
		}
		this.setCard(currentCard, position);
	}
	setCard(currentCard, position) {
		this.setState({
			currentCard: currentCard,
			position: position,
			cardStyle: {
				transform: `translateX(${position}px)`
			}
		})
	}
    _handleScroll(){
        $(window).scroll(function() {
			if ($(this).scrollTop() < 625 || $(document).height() - $(window).height() - $(window).scrollTop() < 100){
                $('.fixedHeaderContainer').addClass('blog_header');
            }
            else{
                $('.fixedHeaderContainer').removeClass('blog_header');
            }
        });
    }
	render() {
		const { articles } = this.props;
		const { match } = this.props;
		const { cardStyle } = this.state;
		return (
			<FullPage>
				<Slide>
					<section className="active first_section_blog">
						<span className="parallax-layer parallax-layer__1 l_name" data-parallax-direction="plus" data-parallax-deep="1000">Boutaleb<span className="outlined">Boutaleb</span>BoutalebBoutaleb</span>
						<span className="parallax-layer parallax-layer__2 f_name" data-parallax-direction="minus" data-parallax-deep="1000">Zakariae<span className="outlined">Zakariae</span>ZakariaeZakariae</span>
						<div className="wrapper left_part">
							<div className="caption">
								<p><b>The teacher</b></p>
								<p>My father was an educator, My grandfather was an educator, i was born to educate, and my sons will also educate.</p>
							</div>
							<div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="#" className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                    <a href="#" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                    <a href="#" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                    <a href="#" className="icon-button scroll">
                                        
                                    </a>
                                </div>
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
					<section className="second_section_blog">
						<div className="wrapper_full">
							<div className="caption">Latest Talks.</div>
							<div className="cards-slider">
								<div className="slider-btns">
									<button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}><i className="fas fa-long-arrow-alt-left"></i></button>
									<button className="slider-btn btn-r" onClick={() => this.handleClick('next')}><i className="fas fa-long-arrow-alt-right"></i></button>
								</div>
								<div className="data-container">
									{
										_.orderBy(articles, ['createdAt'], ['desc']).map((article, index) => {
											return (
												<div className="article_card article_anchor" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="article_card" style={cardStyle} key={index}>
													<div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
														<div className="shadow_title">{_.head(_.words(article.title))}</div>
														<div className="shadow_letter">{_.head(_.head(_.words(article.title)))}</div>
														<div className="card-body">
															<h2>{article.title}</h2>
															<p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
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
															<br/>
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
											)
										})
									}
								</div>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<Footer/>
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
	onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
	setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);