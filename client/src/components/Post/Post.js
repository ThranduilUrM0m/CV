import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import Fingerprint from 'fingerprintjs';
import { Form } from '../Article';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class Comments extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			this.props.comment.map((comment, index) => {
				return (
					<div className={"card card_" + index} data-index={index+1}>
						<div className="shadow_title">{_.head(_.words(comment.body))}</div>
						<div className="card-body">
							<h5>{comment.body}</h5>
							<p className="text-muted author">by <b>{comment.author}</b>, {moment(new Date(comment.date)).fromNow()}</p>
						</div>
					</div>
				)
			})
		)
	}
}

class Post extends React.Component {
    constructor(props) {
		super(props);

		this.state = {
			_id: '',
            title: '',
            body: '',
            author: '',
            tag: [],
            tagInput: '',
			comment: [],
			comment_author: '',
			comment_body: '',
			comment_changed: false,
			upvotes: [],
			upvotes_changed: false,
			downvotes: [],
			downvotes_changed: false,
			view: [],
			view_changed: false,
		}
		
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		
		this.handleChangeField = this.handleChangeField.bind(this);
		this.handleSubmitComment = this.handleSubmitComment.bind(this);
		this.handleSubmitupvotes = this.handleSubmitupvotes.bind(this);
		this.handleSubmitdownvotes = this.handleSubmitdownvotes.bind(this);
		this.handleSubmitviews = this.handleSubmitviews.bind(this);
		
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
	}
	componentDidMount() {
        const { onLoad } = this.props;
		const { match } = this.props;
		axios('http://localhost:8800/api/articles')
			.then((res) => onLoad(res.data))
			.then((res) => {
				this.handleEdit(_.find(res.data.articles, {'_id': match.params.postId}));
				this.handleSubmitviews();
				this.setState(state => ({
					_id: match.params.postId
				}));
			});
		document.getElementById('articles_post').parentElement.style.height = 'initial';
		document.getElementById('comments_post').parentElement.style.height = 'initial';
		this._handleMouseMove();
        $('.fixedHeaderContainer').removeClass('blog_header');
	}
	componentWillReceiveProps(nextProps) {
        if(nextProps.articleToEdit) {
            this.setState({
                title: nextProps.articleToEdit.title,
                body: nextProps.articleToEdit.body,
                author: nextProps.articleToEdit.author,
                tag: nextProps.articleToEdit.tag,
                tagInput: nextProps.articleToEdit.tagInput,
				comment: nextProps.articleToEdit.comment,
				comment_body: nextProps.articleToEdit.comment_body,
                upvotes: nextProps.articleToEdit.upvotes,
                downvotes: nextProps.articleToEdit.downvotes,
				view: nextProps.articleToEdit.view,
            });
        }
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
	componentDidUpdate () {
		const { onEdit } = this.props;
		const { _id, title, body, author, tag, comment, upvotes, downvotes, view } = this.state;
		const self = this;
		
		if(_id) {
			if(this.state.comment_changed || this.state.upvotes_changed || this.state.downvotes_changed || this.state.view_changed){
				return axios.patch(`http://localhost:8800/api/articles/${_id}`, {
					title,
					body,
					author,
					tag,
					comment,
					upvotes,
					downvotes,
					view,
				})
					.then((res) => onEdit(res.data))
					.then(function() {
						self.setState({ 
							comment_changed: false,
							upvotes_changed: false,
							downvotes_changed: false,
							view_changed: false,
						})
					});
			}
		}
	}
	handleSubmitComment() {
        const { comment_author, comment_body } = this.state;
		if(comment_author && comment_body) {
			this.setState(state => ({
				comment: [...state.comment, {author: comment_author, body: comment_body, date: moment().format()}],
				comment_author: '',
				comment_body: '',
				comment_changed: true,
			}));
		} else {
			$('#exampleModal_comment').modal('show');
		}
	}
	handleSubmitupvotes() {
		var fingerprint = new Fingerprint().get();

		if( localStorage.getItem('email') ){
			if( _.isUndefined(_.find(this.state.upvotes, {'upvoter': localStorage.getItem('email')})) ) {
				this.setState(state => ({
					upvotes: [...state.upvotes, {upvoter: localStorage.getItem('email')}],
					upvotes_changed: true,
				}));
				if( !_.isUndefined(_.find(this.state.downvotes, {'downvoter': localStorage.getItem('email')})) ) {
					let _new_downvote = _.takeWhile(this.state.downvotes, function(o) { return o.downvoter != localStorage.getItem('email'); });
					this.setState(state => ({
						downvotes: _new_downvote,
						downvotes_changed: true,
					}));
					$('p.downvotes').removeClass('active');
				}
				$('p.upvotes').addClass('active');
			} else {
				let _new_upvote = _.takeWhile(this.state.upvotes, function(o) { return o.upvoter != localStorage.getItem('email'); });
				this.setState(state => ({
					upvotes: _new_upvote,
					upvotes_changed: true,
				}));
				$('p.upvotes').removeClass('active');
			}
		} else {
			if(_.isUndefined(_.find(this.state.upvotes, {'upvoter': fingerprint.toString()}))) {
				this.setState(state => ({
					upvotes: [...state.upvotes, {upvoter: fingerprint.toString()}],
					upvotes_changed: true,
				}));
				if( !_.isUndefined(_.find(this.state.downvotes, {'downvoter': fingerprint.toString()})) ) {
					let _new_downvote = _.takeWhile(this.state.downvotes, function(o) { return o.downvoter != fingerprint.toString(); });
					this.setState(state => ({
						downvotes: _new_downvote,
						downvotes_changed: true,
					}));
					$('p.downvotes').removeClass('active');
				}
				$('p.upvotes').addClass('active');
			} else {
				let _new_upvote = _.takeWhile(this.state.upvotes, function(o) { return o.upvoter != fingerprint.toString(); });
				this.setState(state => ({
					upvotes: _new_upvote,
					upvotes_changed: true,
				}));
				$('p.upvotes').removeClass('active');
			}
		}
	}
	handleSubmitdownvotes() {
		var fingerprint = new Fingerprint().get();

		if( localStorage.getItem('email') ){
			if( _.isUndefined(_.find(this.state.downvotes, {'downvoter': localStorage.getItem('email')})) ) {
				this.setState(state => ({
					downvotes: [...state.downvotes, {downvoter: localStorage.getItem('email')}],
					downvotes_changed: true,
				}));
				if( !_.isUndefined(_.find(this.state.upvotes, {'upvoter': localStorage.getItem('email')})) ) {
					let _new_upvote = _.takeWhile(this.state.upvotes, function(o) { return o.upvoter != localStorage.getItem('email'); });
					this.setState(state => ({
						upvotes: _new_upvote,
						upvotes_changed: true,
					}));
					$('p.upvotes').removeClass('active');
				}
				$('p.downvotes').addClass('active');
			} else {
				let _new_downvote = _.takeWhile(this.state.downvotes, function(o) { return o.downvoter != localStorage.getItem('email'); });
				this.setState(state => ({
					downvotes: _new_downvote,
					downvotes_changed: true,
				}));
				$('p.downvotes').removeClass('active');
			}
		} else {
			if(_.isUndefined(_.find(this.state.downvotes, {'downvoter': fingerprint.toString()}))) {
				this.setState(state => ({
					downvotes: [...state.downvotes, {downvoter: fingerprint.toString()}],
					downvotes_changed: true,
				}));
				if( !_.isUndefined(_.find(this.state.upvotes, {'upvoter': fingerprint.toString()})) ) {
					let _new_upvote = _.takeWhile(this.state.upvotes, function(o) { return o.upvoter != fingerprint.toString(); });
					this.setState(state => ({
						upvotes: _new_upvote,
						upvotes_changed: true,
					}));
					$('p.upvotes').removeClass('active');
				}
				$('p.downvotes').addClass('active');
			} else {
				let _new_downvote = _.takeWhile(this.state.downvotes, function(o) { return o.downvoter != fingerprint.toString(); });
				this.setState(state => ({
					downvotes: _new_downvote,
					downvotes_changed: true,
				}));
				$('p.downvotes').removeClass('active');
			}
		}
	}
	handleSubmitviews() {
		var fingerprint = new Fingerprint().get();

		//look for downvotes nd upvotes
		if( localStorage.getItem('email') ) {
			if( !_.isUndefined(_.find(this.state.upvotes, {'upvoter': localStorage.getItem('email')})) ) {
				$('p.upvotes').addClass('active');
			}
			if( !_.isUndefined(_.find(this.state.downvotes, {'downvoter': localStorage.getItem('email')})) ) {
				$('p.downvotes').addClass('active');
			}
			if(_.isUndefined(_.find(this.state.view, {'viewer': localStorage.getItem('email')}))) {
				this.setState(state => ({
					view: [...state.view, {viewer: localStorage.getItem('email'), _yes_or_no: true}],
					view_changed: true,
				}));
			}
		} else {
			if( !_.isUndefined(_.find(this.state.upvotes, {'upvoter': fingerprint.toString()})) ) {
				$('p.upvotes').addClass('active');
			}
			if( !_.isUndefined(_.find(this.state.downvotes, {'downvoter': fingerprint.toString()})) ) {
				$('p.downvotes').addClass('active');
			}
			if(_.isUndefined(_.find(this.state.view, {'viewer': fingerprint.toString()}))) {
				this.setState(state => ({
					view: [...state.view, {viewer: fingerprint.toString(), _yes_or_no: true}],
					view_changed: true,
				}));
			}
		}
	}
	handleChangeField(key, event) {	
		const val = event.target.value;
		this.setState(state => ({
			[key]: val,
		}));
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
		});
	}
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
	_handleMouseMove() {
        $('.first_section_post').mousemove(function(e){
            var width = $(this).width() / 2;
            var height = $(this).height() / 2;
            var amountMovedX = ((width - e.pageX) * 1 / 16);
            var amountMovedY = ((height - e.pageY) * 1 / 16);
            
            $('.first_section_post .shadow_letter').css('right', amountMovedX);
            $('.first_section_post .shadow_letter').css('top', amountMovedY);
        });
	}
    render() {
		const { articles } = this.props;
        const { match } = this.props;
		const { title, body, author, tag, comment, comment_author, comment_body, upvotes, downvotes, view } = this.state;
		
		return (
            <FullPage scrollMode={'normal'}>
				{/* <Slide>
                    <Form />
                </Slide> */}
				<Slide>
					<section id='articles_post' className="active first_section_post">
						<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
							<div className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-body">
										<a title="Close" className="modal-close" data-dismiss="modal">Close</a>
										<h5 className="modal-title" id="exampleModalLabel">Voilà!</h5>
										<div>How about you joins us, not only you can give a feedback to the post you're reading, but you can discover much more about out community.</div>
										<div><small>Here</small></div>
										<a className="togglebtn">👉 Sign In If you don't have an Account</a>
									</div>
								</div>
							</div>
						</div>
						<div className="modal fade" id="exampleModal_comment" tabIndex="-1" role="dialog" aria-labelledby="exampleModal_commentLabel" aria-hidden="true">
							<div className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-body">
										<a title="Close" className="modal-close" data-dismiss="modal">Close</a>
										<div>👉 Please provide your name and the content of ur msg.</div>
									</div>
								</div>
							</div>
						</div>
						<div className="wrapper_full">
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item"><a href="/">home</a></li>
									<li className="breadcrumb-item"><a href="/blog">blog</a></li>
									<li className="breadcrumb-item active" aria-current="page">{_.get(_.find(articles, {'_id': match.params.postId}), 'title')}</li>
								</ol>
							</nav>
							<div className="shadow_title">{_.head(_.words(_.get(_.find(articles, {'_id': match.params.postId}), 'title')))}.</div>
							<div className="shadow_letter">{this._FormatNumberLength(_.indexOf(_.orderBy(articles, ['createdAt'], ['asc']), _.find(articles, {'_id': match.params.postId}))+1, 2)}.</div>
							<div id="box">
								<h1>{_.get(_.find(articles, {'_id': match.params.postId}), 'title')}</h1>
								<p className="text-muted author">by <b>{_.get(_.find(articles, {'_id': match.params.postId}), 'author')}</b>, {moment(new Date(_.get(_.find(articles, {'_id': match.params.postId}), 'createdAt'))).fromNow()}</p>
								<h6 className="text-muted body body_article">
									{
										this.handleJSONTOHTML(_.get(_.find(articles, {'_id': match.params.postId}), 'body'))
									}
								</h6>
								<div className="comments_up_down">
									<p className="text-muted views"><b>{_.size(_.get(_.find(articles, {'_id': match.params.postId}), 'view'))}</b><i className="fas fa-eye"></i></p>
									<p className="text-muted comments"><b>{_.size(_.get(_.find(articles, {'_id': match.params.postId}), 'comment'))}</b> <a href="#comments-modal"><i className="fas fa-comment-alt"></i></a> </p>
									<p className="text-muted upvotes"><b>{_.size(_.get(_.find(articles, {'_id': match.params.postId}), 'upvotes'))}</b> <button onClick={this.handleSubmitupvotes}><i className="fas fa-thumbs-up"></i></button> </p>
									<p className="text-muted downvotes"><b>{_.size(_.get(_.find(articles, {'_id': match.params.postId}), 'downvotes'))}</b> <button onClick={this.handleSubmitdownvotes}><i className="fas fa-thumbs-down"></i></button> </p>
								</div>
							</div>
							<div className="beforeorafter">
								<a className="before_article">
									{
									_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': match.params.postId}))-1], 'title', _.get(_.last(_.orderBy(articles, ['view'], ['desc'])), 'title'))
									}.
								</a>
								<a className="after_article">
									{
									_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': match.params.postId}))+1], 'title', _.get(_.head(_.orderBy(articles, ['view'], ['desc'])), 'title'))
									}.
								</a>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<section id='comments_post' className="second_section_post">
						<div className="wrapper_full">
							<div className="comment-modal">
								<div className="modal-inner">
									<div className="modal-content">
										
										<div className="row">
											<div className="input-field col s12">
												<textarea 
													onChange={(ev) => this.handleChangeField('comment_body', ev)}
													value={comment_body}
													className="validate form-group-input materialize-textarea comment_body" 
													id="comment_body" 
													name="comment_body" 
													required="required"/>
												<label htmlFor='comment_body'>what can i do for you ?</label>
												<div className="form-group-line textarea_line"></div>
											</div>
										</div>

										<div className="row">
											<div className="input-field col s6">
												<input 
													onChange={(ev) => this.handleChangeField('comment_author', ev)}
													value={comment_author}
													className="validate form-group-input comment_author" 
													id="comment_author" 
													type="text" 
													name="comment_author" 
													required="required"/>
												<label htmlFor='comment_author'>your name</label>
												<div className="form-group-line"></div>
											</div>
											<div className="input-field col s6">
												<button onClick={this.handleSubmitComment} className="btn btn-primary pull-right" type="submit">
													<span>
														<span>
															<span data-attr-span="Leave a Comment.">
																Leave a Comment.
															</span>
														</span>
													</span>
												</button>
											</div>
										</div>
										

										<div id="comments-modal" className="comments-modal">
											<div className="modal-inner">
												<div className="modal-content">
												{
													_.isEmpty(_.get(_.find(articles, {'_id': match.params.postId}), 'comment')) ? null : <Comments comment={_.get(_.find(articles, {'_id': match.params.postId}), 'comment')}/>
												}
												</div>
											</div>
										</div>
									</div>
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
	articleToEdit: state.home.articleToEdit,
});

const mapDispatchToProps = dispatch => ({
	onSubmit: data => dispatch({ type: 'SUBMIT_ARTICLE', data }),
	onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
	onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
	onEdit: data => dispatch({ type: 'EDIT_ARTICLE', data }),
	setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);