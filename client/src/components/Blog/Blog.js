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
import Swiper from 'swiper';
import Footer from '../Footer/Footer';
import $ from 'jquery';
import jQuery from 'jquery';

var _ = require('lodash');

class ReadMoreLink extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<Link to={this.props.readmore_link}>
				<button>
					<span>
						<span>
							<span data-attr-span="Read More About it">Read More About it</span>
						</span>
					</span>
				</button>
			</Link>
		)
	}
}
class ArticleCard extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return (
			<li className="article_card article_anchor row" data-name={ moment(this.props.single_article.createdAt).format("YYYY Do MM") }>
				<div className={"col card card_" + this.props.single_article.index} data-title={_.snakeCase(this.props.single_article.title)} data-index={_.add(this.props.single_article.index,1)}>
					<div className="shadow_title">{_.head(_.words(this.props.single_article.title))}</div>
					<div className="shadow_letter">{_.head(_.head(_.words(this.props.single_article.title)))}</div>
					<div className="card-body">
						<h2>{this.props.single_article.title}</h2>
						<p className="text-muted author">by <b>{this.props.single_article.author}</b>, {moment(new Date(this.props.single_article.createdAt)).fromNow()}</p>
						<ReadMoreLink readmore_link={`${this.props.url}/${this.props.single_article._id}`}/>
						<br/>
						<div className="comments_up_down">
							<p className="text-muted views"><b>{_.size(this.props.single_article.view)}</b><i className="fas fa-eye"></i></p>
							<p className="text-muted comments"><b>{_.size(this.props.single_article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
							<p className="text-muted upvotes"><b>{_.size(this.props.single_article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
							<p className="text-muted downvotes"><b>{_.size(this.props.single_article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
						</div>
						<ul className="text-muted tags">
							{
								this.props.single_article.tag.map((t, i) => {
									return (
										<li className="tag_item">{t}</li>
									)
								})
							}
						</ul>
					</div>
				</div>
				<div className="col card">
					<div className="body_to_preview">
						<img src={$($(JSON.parse(this.props.single_article.body)).find('img')[0]).attr('src')}/>
						<span className="index_article">{this.props.FormatNumberLengthIndex}.</span>
					</div>
				</div>
			</li>
		)
	}
}
class ArticleCards extends React.Component {
	constructor(props) {
		super(props);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
	}
	componentDidMount() {
		var swiper = new Swiper('.data-container', {
			direction: 'vertical',
			spaceBetween: 30,
			effect: 'fade',
			loop: true,
			mousewheel: {
				invert: false,
			},
			pagination: {
				el: '#pagination-demo1',
				clickable: true,
			},
		});
	}
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
	render () {
		return (
			<>
				<div className="data-container">
					<ul className="articles_list">
						{
							_.orderBy(this.props.articles_props, ['createdAt'], ['desc']).map((article, index) => {
								return (
									<ArticleCard url={this.props.url} single_article={article} FormatNumberLengthIndex={this._FormatNumberLength(index+1, 2)}/>
								)
							})
						}
					</ul>
					<div id="pagination-demo1"></div>
				</div>
			</>
		)
	}
}

class Blog extends React.Component {
	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this._handleTimeLine = this._handleTimeLine.bind(this);
	}
	componentDidMount() {
        const {onLoad} = this.props;
		axios('http://localhost:8800/api/articles')
			.then((res) => onLoad(res.data));

		document.getElementById('articles_blog').parentElement.style.height = 'initial';
		//this._handleTimeLine();
	}
	handleDelete(id) {
		const { onDelete } = this.props;
		return axios.delete(`http://localhost:8800/api/articles/${id}`)
			.then(() => onDelete(id));
	}
	handleEdit(article) {
		const { setEdit } = this.props;
		setEdit(article);
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
	_handleTimeLine() {
		function sticky_relocate_left() {
			var window_top = $(window).scrollTop();
			var div_top = $('#articles_blog').offset().top;
			if (window_top > div_top) {
				$('#pagination-demo1').addClass('mobile-sticky');
			} else {
				$('#pagination-demo1').removeClass('mobile-sticky');
			}
		}

		function sumSection(){
			return $(".timeline").height();
		}

		function setDimensionBar(){
			let _height = ($('.timeline').height() * $('.article_anchor').height()) / $('.articles_list').height();
			$(".bar").css({
			  "height": _height + "px"
			})
		}
		
		function addBehaviours(){
			let sections = $(".article_anchor");
			$.each($(".node"), function(i, element){
				$(element).on("click", function(e){
					e.preventDefault();
					let scroll = $(sections[i]).offsetRelative(".articles_list").top;
					$('html, body').animate({
						scrollTop: scroll
					}, 500);
				})
			})
		}
		
		(function($){
			$.fn.offsetRelative = function(top){
				var $this = $(this);
				var $parent = $this.offsetParent();
				var offset = $this.position();
				if(!top) return offset; // Didn't pass a 'top' element 
				else if($parent.get(0).tagName == "BODY") return offset; // Reached top of document
				else if($(top,$parent).length) return offset; // Parent element contains the 'top' element we want the offset to be relative to 
				else if($parent[0] == $(top)[0]) return offset; // Reached the 'top' element we want the offset to be relative to 
				else { // Get parent's relative offset
					var parent_offset = $parent.offsetRelative(top);
					offset.top += parent_offset.top;
					offset.left += parent_offset.left;
					return offset;
				}
			};
			$.fn.positionRelative = function(top){
				return $(this).offsetRelative(top);
			};
		}(jQuery));

		function arrangeNodes(){
			//$(".node").remove();
			$.each($(".article_anchor"), function(i, element){
				let name = $(element).data("name");
				let node = $("<li class='node'><span>"+name+"</span></li>");
				$(".timeline").append(node);
				let _top = ($(".timeline").height()/$(".articles_list").height()) * $(element).offsetRelative(".articles_list").top;
				$(node).css({
					"top": _top
				})
			})
			addBehaviours();
		}
		
		function runAfterElementExists(jquery_selector, callback){
			var checker = window.setInterval(function() {
			if (jquery_selector) {
				clearInterval(checker);
				callback();
			}}, 200);
		}

		runAfterElementExists('.article_anchor', function() {
			$(window).on("scroll", function(){
				var window_top = $(window).scrollTop();
				var div_top = $('#articles_blog').offset().top;
				
				if (window_top > div_top) {

					let _top = window.scrollY - $('.first_section_blog').parent().height();
					let _top_given = ($('.timeline').height() * _top) / $('.second_section_blog').height();

					let _where_it_is = ($('#pagination-demo1').offset().top - $('.first_section_blog').parent().height());
					let _where_to_stop = $('.second_section_blog').height() - $('.timeline').height();

					if(_where_it_is < _where_to_stop) {
						$(".timeline").css({
							"top": ($('#pagination-demo1').offset().top - $('.first_section_blog').parent().height()) + "px"
						});
						$(".bar").css({
							"top": _top_given + "px"
						});
					}

				}
			});
			$(window).on("resize", function(){
				arrangeNodes()
				setDimensionBar()
			});
			$(window).scroll(sticky_relocate_left);
			arrangeNodes();
			setDimensionBar();
			sticky_relocate_left();
		});
	}
	render() {
		const { articles } = this.props;
		const { match } = this.props;
		return (
			<FullPage scrollMode={'normal'}>
				<Slide>
					<section className="active first_section_blog">
						<div className="wrapper_full">
							<div id="box">
								<h2>{_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'title')}</h2>
								<p className="text-muted author">by <b>{_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'author')}</b>, {moment(new Date(_.get(_.head(_.orderBy(articles, ['createdAt'], ['desc'])), 'createdAt'))).fromNow()}</p>
								<h6 className="text-muted body body_article">
									{
										this.handleJSONTOHTML((_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'body')))
									}
								</h6>
								<div className="comments_up_down">
									<p className="text-muted views"><b>{_.size(_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'view'))}</b><i className="fas fa-eye"></i></p>
									<p className="text-muted comments"><b>{_.size(_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'comment'))}</b><i className="fas fa-comment-alt"></i></p>
									<p className="text-muted upvotes"><b>{_.size(_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'upvotes'))}</b><i className="fas fa-thumbs-up"></i></p>
									<p className="text-muted downvotes"><b>{_.size(_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), 'downvotes'))}</b><i className="fas fa-thumbs-down"></i></p>
								</div>
								<Link to={`${match.url}/${_.get(_.head(_.orderBy(articles, ['upvotes'], ['desc'])), '_id')}`}>
									<div className="readmore">
										<button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
											<div className="line line-1"></div>
											<div className="line line-2"></div>
										</button>
									</div>
								</Link>
							</div>
							<div id="social_media">
								<div className="icons_gatherer">
									<a href="#" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
									<a href="#" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
									<a href="#" className="icon-button scroll">
										<span className="scroll-icon">
											<span className="scroll-icon__wheel-outer">
												<span className="scroll-icon__wheel-inner"></span>
											</span>
										</span>
									</a>
								</div>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<section id='articles_blog' className="second_section_blog">
						<ul className="timeline">
							<li className="bar"></li>
						</ul>
        				<ArticleCards url={match.url} articles_props={articles}/>
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