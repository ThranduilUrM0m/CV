import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import Fingerprint from 'fingerprintjs';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class Post extends React.Component {
    constructor(props) {
		super(props);

        var f = new Fingerprint().get();
		this.state = {
			_id: '',
			title: '',
			body: '',
			author: '',
			categorie: '',
			tag: [],
			comment: [],
			_comment_id_ifEditing: null,
			_comment_parent_id: null,
			_comment_author: '',
			_comment_body: '',
			_comment_fingerprint: f.toString(),
			_comment_upvotes: [],
			_comment_downvotes: [],
			upvotes: [],
			downvotes: [],
			view: [],
			createdAt: '',
			fingerprint: f.toString(),
		}

        this.handleEdit = this.handleEdit.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitViews = this.handleSubmitViews.bind(this);
        this.handleSubmitUpvotes = this.handleSubmitUpvotes.bind(this);
        this.handleSubmitDownvotes = this.handleSubmitDownvotes.bind(this);
        this.handleSubmitComments = this.handleSubmitComments.bind(this);
        this.handleSubmitupvotesComment = this.handleSubmitupvotesComment.bind(this);
        this.handleReply = this.handleReply.bind(this);
        this.handleEditComment = this.handleEditComment.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
		
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
	}
	componentDidMount() {
		document.getElementById('articles_post').parentElement.style.height = 'initial';
		document.getElementById('comments_post').parentElement.style.height = 'initial';
		this._handleMouseMove();
		this._handleScroll();

		const { onLoad, match } = this.props;
		const self = this;
		axios('/api/articles')
			.then((res) => {
				function setEditFunction() {
					// Get the current 'global' time from an API using Promise
					return new Promise((resolve, reject) => {
						setTimeout(function() {
							onLoad(res.data);
							self.handleEdit(_.find(res.data.articles, {'_id': self.props.location.state.article._id}));
							true ? resolve('Success') : reject('Error');
						}, 2000);
					})
				}
				setEditFunction()
					.then(() => {
						self.handleSubmitViews();
						return true;
					})
					.catch(err => console.log('There was an error:' + err));
			});
	}
	componentWillReceiveProps(nextProps) {
        if(nextProps.articleToEdit) {
			this.setState({
				_id: nextProps.articleToEdit._id,
                title: nextProps.articleToEdit.title,
                body: nextProps.articleToEdit.body,
				author: nextProps.articleToEdit.author,
				categorie: nextProps.articleToEdit.categorie,
                tag: nextProps.articleToEdit.tag,
				comment: nextProps.articleToEdit.comment,
                upvotes: nextProps.articleToEdit.upvotes,
                downvotes: nextProps.articleToEdit.downvotes,
				view: nextProps.articleToEdit.view,
				createdAt: nextProps.articleToEdit.createdAt,
			});
        }
	}
    handleEdit(article) {
		const { setEdit } = this.props;
        setEdit(article);
	}
	handleSubmit(){
        const { onEdit } = this.props;
		const { _id, title, body, author, categorie, tag, comment, upvotes, downvotes, view } = this.state;
		
        return axios.patch(`/api/articles/${_id}`, {
			title,
			body,
			author,
			categorie,
			tag,
			comment,
			upvotes,
			downvotes,
			view,
		})
			.then((res) => onEdit(res.data));
	}
	handleSubmitViews() {
		const f = new Fingerprint().get();
		const { view } = this.state;
		const self = this;

		if( _.isUndefined( _.find(view, (v) => {return v.viewer === f.toString()}) ) ) {
			self.setState(state => ({
				view: [...state.view, {viewer: f.toString()}],
			}), () => {
				self.handleSubmit();
			})
		}
	}
	handleSubmitUpvotes(event) {
		const { upvotes, downvotes } = this.state;
        var f = new Fingerprint().get();
        let target = event.target;
		let self = this;
		
		if( _.isUndefined( _.find(upvotes, (u) => {return u.upvoter === f.toString()}) ) ) {
			self.setState(state => ({
				upvotes: [...state.upvotes, {upvoter: f.toString()}],
			}), () => {
				if( !_.isUndefined( _.find(downvotes, (d) => {return d.downvoter === f.toString()}) ) ) {
					let _downvotes = _.takeWhile(downvotes, function(d) { return d.downvoter !== f.toString(); });
					self.setState({
						downvotes: _downvotes,
					}, () => {
						self.handleSubmit();
					});
					$(target).closest("div").parent().find('div.downvotes').removeClass('active');
				} else {
					self.handleSubmit();
				}
				$(target).closest("div").addClass('active');
			})
		} else {
			let _upvotes = _.takeWhile(upvotes, function(u) { return u.upvoter !== f.toString(); });
			self.setState(state => ({
				upvotes: _upvotes,
			}), () => {
				self.handleSubmit();
				$(target).closest("div").removeClass('active');
			})
		}
	}
	handleSubmitDownvotes(event) {
		const { downvotes, upvotes } = this.state;
        var f = new Fingerprint().get();
        let target = event.target;
		let self = this;
		
		if( _.isUndefined( _.find(downvotes, (d) => {return d.downvoter === f.toString()}) ) ) {
			self.setState(state => ({
				downvotes: [...state.downvotes, {downvoter: f.toString()}],
			}), () => {
				if( !_.isUndefined( _.find(upvotes, (u) => {return u.upvoter === f.toString()}) ) ) {
					let _upvotes = _.takeWhile(upvotes, function(u) { return u.upvoter !== f.toString(); });
					self.setState({
						upvotes: _upvotes,
					}, () => {
						self.handleSubmit();
					});
					$(target).closest("div").parent().find('div.upvotes').removeClass('active');
				} else {
					self.handleSubmit();
				}
				$(target).closest("div").addClass('active');
			})
		} else {
			let _downvotes = _.takeWhile(downvotes, function(d) { return d.downvoter !== f.toString(); });
			self.setState(state => ({
				downvotes: _downvotes,
			}), () => {
				self.handleSubmit();
				$(target).closest("div").removeClass('active');
			})
		}
	}
	handleSubmitComments() {
		const { _comment_id_ifEditing, comment ,_comment_parent_id, _comment_author, _comment_body, _comment_fingerprint, _comment_upvotes, _comment_downvotes } = this.state;
		const self = this;
		let _edited_comment = [];

		if(_comment_author && _comment_body) {
			if(_comment_id_ifEditing !== null) {
				_edited_comment = comment;
				function setEditFunction() {
					// Get the current 'global' time from an API using Promise
					return new Promise((resolve, reject) => {
						setTimeout(function() {
							_edited_comment = _.map(_edited_comment, (_c) => {
								if(_c._id === _comment_id_ifEditing) {
									_c.author = _comment_author;
									_c.body = _comment_body;
									_c.fingerprint = _comment_fingerprint;
									_c.upvotes = _comment_upvotes;
									_c.downvotes = _comment_downvotes;
								}
								return _c;
							});
							true ? resolve('Success') : reject('Error');
						}, 2000);
					})
				}
				setEditFunction()
					.then(() => {
						self.setState(prevState => ({
							comment : _edited_comment
						}), () => {
							function setEditFunction() {
								// Get the current 'global' time from an API using Promise
								return new Promise((resolve, reject) => {
									setTimeout(function() {
										self.handleSubmit();
										true ? resolve('Success') : reject('Error');
									}, 2000);
								})
							}
							setEditFunction()
								.then(() => {
									self.setState({
										_comment_parent_id: null,
										_comment_author: '',
										_comment_body: '',
										_comment_upvotes: [],
										_comment_downvotes: [],
									})
									return true;
								})
						});
						return true;
					})
					.catch(err => console.log('There was an error:' + err));
			} else {
				self.setState(state => ({
					comment: [...state.comment, {
						parent_id: _comment_parent_id,
						author: _comment_author,
						body: _comment_body,
						fingerprint: _comment_fingerprint,
						_createdAt: moment().format(),
						upvotes: _comment_upvotes,
						downvotes: _comment_downvotes,
					}],
				}), () => {
					function setEditFunction() {
						// Get the current 'global' time from an API using Promise
						return new Promise((resolve, reject) => {
							setTimeout(function() {
								self.handleSubmit();
								true ? resolve('Success') : reject('Error');
							}, 2000);
						})
					}
					setEditFunction()
						.then(() => {
							self.setState({
								_comment_parent_id: null,
								_comment_author: '',
								_comment_body: '',
								_comment_upvotes: [],
								_comment_downvotes: [],
							})
							return true;
						})
						.catch(err => console.log('There was an error:' + err));
				});
			}
		} else {
			$('#exampleModal_comment').modal('show');
		}
	}
	handleSubmitupvotesComment(in_comment, event) {
		const { comment } = this.state;
		var f = new Fingerprint().get();
		let self = this;
		let _edited_comment = [];
		
		if( _.isUndefined( _.find(_.get(_.find(comment, {'_id': in_comment._id}), 'upvotes'), (_up) => {return _up.upvoter === f.toString()}) ) ) {
			function setEditFunction() {
				// Get the current 'global' time from an API using Promise
				return new Promise((resolve, reject) => {
					setTimeout(function() {
						_edited_comment = comment;
						_edited_comment = _.map(_edited_comment, (_c) => {
							if(_c._id === in_comment._id) {
								_c.upvotes.push({
									upvoter: f.toString()
								});
								if(!_.isUndefined(_.find(_c.downvotes, {'downvoter': f.toString()}))) {
									_c.downvotes = _.takeWhile(_c.downvotes, function(d) { return d.downvoter !== f.toString(); });
								}
							}
							return _c;
						});
						true ? resolve('Success') : reject('Error');
					}, 2000);
				})
			}
			setEditFunction()
				.then(() => {
					self.setState(prevState => ({
						comment : _edited_comment
					}), () => {
						self.handleSubmit();
					});
					return true;
				})
				.catch(err => console.log('There was an error:' + err));
		} else {
			function setEditFunction() {
				return new Promise((resolve, reject) => {
					setTimeout(function() {
						_edited_comment = comment;
						_edited_comment = _.map(_edited_comment, (_c) => {
							if(_c._id === in_comment._id) {
								_c.upvotes = _.takeWhile(_c.upvotes, function(u) { return u.upvoter !== f.toString(); });
							}
							return _c;
						});
						true ? resolve('Success') : reject('Error');
					}, 2000);
				})
			}
			setEditFunction()
				.then(() => {
					self.setState(prevState => ({
						comment : _edited_comment
					}), () => {
						self.handleSubmit();
					});
					return true;
				})
				.catch(err => console.log('There was an error:' + err));
		}
	}
	handleSubmitdownvotesComment(in_comment, event) {
		const { comment } = this.state;
		var f = new Fingerprint().get();
		let self = this;
		let _edited_comment = [];
		
		if( _.isUndefined( _.find(_.get(_.find(comment, {'_id': in_comment._id}), 'downvotes'), (_do) => {return _do.downvoter === f.toString()}) ) ) {
			function setEditFunction() {
				// Get the current 'global' time from an API using Promise
				return new Promise((resolve, reject) => {
					setTimeout(function() {
						_edited_comment = comment;
						_edited_comment = _.map(_edited_comment, (_c) => {
							if(_c._id === in_comment._id) {
								_c.downvotes.push({
									downvoter: f.toString()
								});
								if(!_.isUndefined(_.find(_c.upvotes, {'upvoter': f.toString()}))) {
									_c.upvotes = _.takeWhile(_c.upvotes, function(u) { return u.upvoter !== f.toString(); });
								}
							}
							return _c;
						});
						true ? resolve('Success') : reject('Error');
					}, 2000);
				})
			}
			setEditFunction()
				.then(() => {
					self.setState(prevState => ({
						comment : _edited_comment
					}), () => {
						self.handleSubmit();
					});
					return true;
				})
				.catch(err => console.log('There was an error:' + err));
		} else {
			function setEditFunction() {
				return new Promise((resolve, reject) => {
					setTimeout(function() {
						_edited_comment = comment;
						_edited_comment = _.map(_edited_comment, (_c) => {
							if(_c._id === in_comment._id) {
								_c.downvotes = _.takeWhile(_c.downvotes, function(d) { return d.downvoter !== f.toString(); });
							}
							return _c;
						});
						true ? resolve('Success') : reject('Error');
					}, 2000);
				})
			}
			setEditFunction()
				.then(() => {
					self.setState(prevState => ({
						comment : _edited_comment
					}), () => {
						self.handleSubmit();
					});
					return true;
				})
				.catch(err => console.log('There was an error:' + err));
		}
	}
	handleReply(_id) {
        this.setState({
            _comment_parent_id: _id
        }, () => {
            $('textarea._comment_body').focus();
        });
	}
	handleEditComment(in_comment) {
		this.setState({
            _comment_id_ifEditing: in_comment._id,
			_comment_parent_id: in_comment.parent_id,
			_comment_author: in_comment.author,
			_comment_body: in_comment.body,
			_comment_fingerprint: in_comment.fingerprint,
			_comment_upvotes: in_comment.upvotes,
			_comment_downvotes: in_comment.downvotes,
        }, () => {
            $('textarea._comment_body').focus();
        });
	}
	handleDeleteComment(_in_id) {
		const self = this;
		const { comment } = this.state;

		self.setState(state => ({
			comment: _.takeWhile(comment, (_c) => {return _c._id !== _in_id}),
		}), () => {
			self.handleSubmit();
		});
	}
    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
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
    _handleScroll(){
        $(window).scroll(function() {
            if ($(document).height() - $(window).height() - $(window).scrollTop() === 0){
                $('.fixedHeaderContainer').addClass('blog_header');
            }
            else{
                $('.fixedHeaderContainer').removeClass('blog_header');
            }
        });
	}
	
    render() {
		const { articles } = this.props;
        const { _id, title, body, author, comment, _comment_author, _comment_body, _comment_fingerprint, upvotes, downvotes, view, createdAt, fingerprint } = this.state;
		
		return (
            <FullPage scrollMode={'normal'}>
				{/* <Slide>
                    <Form />
                </Slide> */}
				<Slide>
					<section id='articles_post' className="active first_section_post">
						<div className="modal fade" id="exampleModal_comment" tabIndex="-1" role="dialog" aria-labelledby="exampleModal_commentLabel" aria-hidden="true">
							<div className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-body">
										<a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
										<div><span role="img" aria-label="sheep">👉</span> Please provide your name and the content of ur msg.</div>
									</div>
								</div>
							</div>
						</div>
						<div className="wrapper_full">
							<nav aria-label="breadcrumb">
								<ol className="breadcrumb">
									<li className="breadcrumb-item"><a href="/">home</a></li>
									<li className="breadcrumb-item"><a href="/blog">blog</a></li>
									<li className="breadcrumb-item active" aria-current="page">{title}</li>
								</ol>
							</nav>
							<div className="shadow_title">{_.head(_.words(title))}.</div>
							<div className="shadow_letter">{this._FormatNumberLength(_.indexOf(_.orderBy(articles, ['createdAt'], ['desc']), _.find(articles, {'_id': _id})), 2)}.</div>
							<div id="box">
								<h1>{title}</h1>
								<p className="text-muted author">by <b>{author}</b>, {moment(new Date(createdAt)).fromNow()}</p>
								<h6 className="text-muted body body_article">
									{
										this.handleJSONTOHTML(body)
									}
								</h6>
								<div className="comments_up_down">
									<p className="text-muted views"><b>{_.size(view)}</b><i className="fas fa-eye"></i></p>
									<p className="text-muted comments"><b>{_.size(comment)}</b> <a href="#comments-modal"><i className="fas fa-comment-alt"></i></a> </p>
									<div className={`text-muted upvotes ${_.isUndefined( _.find(upvotes, (upvote) => {return upvote.upvoter === fingerprint}) ) ? '' : 'active'}`}><b>{_.size(upvotes)}</b> <button onClick={(event) => this.handleSubmitUpvotes(event)}><i className="fas fa-thumbs-up"></i></button> </div>
									<div className={`text-muted downvotes ${_.isUndefined( _.find(downvotes, (downvote) => {return downvote.downvoter === fingerprint}) ) ? '' : 'active'}`}><b>{_.size(downvotes)}</b> <button onClick={(event) => this.handleSubmitDownvotes(event)}><i className="fas fa-thumbs-down"></i></button> </div>
								</div>
							</div>
							<div className="beforeorafter">
								<a href={_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': _id}))-1], '_id', _.get(_.last(_.orderBy(articles, ['view'], ['desc'])), '_id'))} className="before_article">
									{
									_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': _id}))-1], 'title', _.get(_.last(_.orderBy(articles, ['view'], ['desc'])), 'title'))
									}.
								</a>
								<a href={_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': _id}))+1], '_id', _.get(_.last(_.orderBy(articles, ['view'], ['desc'])), '_id'))} className="after_article">
									{
									_.get(_.orderBy(articles, ['view'], ['desc'])[_.indexOf(_.orderBy(articles, ['view'], ['desc']), _.find(articles, {'_id': _id}))+1], 'title', _.get(_.head(_.orderBy(articles, ['view'], ['desc'])), 'title'))
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
													onChange={(ev) => this.handleChangeField('_comment_body', ev)}
													value={_comment_body}
													className="validate form-group-input materialize-textarea _comment_body" 
													id="_comment_body" 
													name="_comment_body" 
													required="required"/>
												<label htmlFor='_comment_body' className={_comment_body ? 'active' : ''}>Leave a comment.</label>
												<div className="form-group-line textarea_line"></div>
											</div>
										</div>
										<div className="row">
											<div className="input-field col s6">
												<input 
													onChange={(ev) => this.handleChangeField('_comment_author', ev)}
													value={_comment_author}
													className="validate form-group-input _comment_author" 
													id="_comment_author" 
													type="text" 
													name="_comment_author" 
													required="required"/>
												<label htmlFor='_comment_author' className={_comment_author ? 'active' : ''}>your name</label>
												<div className="form-group-line"></div>
											</div>
											<div className="input-field col s6">
												<button onClick={(event) => this.handleSubmitComments(event)} className="btn btn-primary pull-right" type="submit">
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
														_.orderBy(_.filter(comment, { parent_id: null }), ['upvotes'], ['desc']).map((_c, _i) => {
															return (
																<div className={"card card_" + _i} data-index={_i+1}>
																	<div className="shadow_title">{_.head(_.words(_c.body))}</div>
																	<div className="card-body">
																		<div className="top_row">
																			<h6 className="author">by <b>{_c.author}</b></h6>
																			<p className="text-muted fromNow">{moment(new Date(_c._createdAt)).fromNow()}</p>
																			<div className="up_down">
																				<div className={`text-muted upvotes ${_.isUndefined( _.find(_c.upvotes, (_up) => {return _up.upvoter === _comment_fingerprint}) ) ? '' : 'active'}`}>
																					<b>{_.size(_c.upvotes)}</b> 
																					<button onClick={(event) => this.handleSubmitupvotesComment(_c, event)}>
																						<i className="fas fa-thumbs-up"></i>
																					</button>
																				</div>
																				<div className={`text-muted downvotes ${_.isUndefined( _.find(_c.downvotes, (_do) => {return _do.downvoter === _comment_fingerprint}) ) ? '' : 'active'}`}>
																					<b>{_.size(_.get(_c, 'downvotes'))}</b>
																					<button onClick={(ev) => this.handleSubmitdownvotesComment(_c, ev)}>
																						<i className="fas fa-thumbs-down"></i>
																					</button>
																				</div>
																			</div>
																		</div>
																		<div className="middle_row">
																			<h5>{_c.body}</h5>
																		</div>
																		<div className="bottom_row">
																			<div className="crud">
																				<i className="fas fa-ellipsis-v dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"></i>
																				<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
																					<button onClick={() => this.handleReply(_c._id)} className="dropdown-item" type="button">Reply</button>
																					{
																						_c.fingerprint === _comment_fingerprint 
																						? <>
																							<button onClick={() => this.handleEditComment(_c)} className="dropdown-item">Edit</button>
																							<div className="dropdown-divider"></div>
																							<button onClick={() => this.handleDeleteComment(_c._id)} className="dropdown-item">Delete</button>
																						</>
																						: ''
																					}
																				</div>
																			</div>
																		</div>
																		{
																			_.orderBy(_.reject(comment, { parent_id: null }), ['upvotes'], ['desc']).map((_c_reply, _i_reply) => {
																				if(_c_reply.parent_id === _c._id)
																					return (
																						<div className={"card card_" + _i_reply} data-index={_i_reply+1}>
																							<div className="shadow_title">{_.head(_.words(_c_reply.body))}</div>
																							<div className="card-body">
																								<div className="top_row">
																									<h6 className="author">by <b>{_c_reply.author}</b></h6>
																									<p className="text-muted fromNow">{moment(new Date(_c_reply.createdAt)).fromNow()}</p>
																									<div className="up_down">
																										<div className={`text-muted upvotes ${_.isUndefined( _.find(_c_reply.upvotes, (_up_reply) => {return _up_reply.upvoter === _comment_fingerprint}) ) ? '' : 'active'}`}>
																											<b>{_.size(_c_reply.upvotes)}</b> 
																											<button onClick={(ev) => this.handleSubmitupvotesComment(_c_reply, ev)}>
																												<i className="fas fa-thumbs-up"></i>
																											</button>
																										</div>
																										<div className={`text-muted downvotes ${_.isUndefined( _.find(_c_reply.downvotes, (_do_reply) => {return _do_reply.downvoter === _comment_fingerprint}) ) ? '' : 'active'}`}>
																											<b>{_.size(_c_reply.downvotes)}</b>
																											<button onClick={(ev) => this.handleSubmitdownvotesComment(_c_reply, ev)}>
																												<i className="fas fa-thumbs-down"></i>
																											</button>
																										</div>
																									</div>
																								</div>
																								<div className="middle_row">
																									<h5>{_c_reply.body}</h5>
																								</div>
																								<div className="bottom_row">
																									<div className="crud">
																										<i className="fas fa-ellipsis-v dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"></i>
																										<div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
																											{
																												_c_reply.fingerprint === _comment_fingerprint 
																												? <>
																													<button onClick={() => this.handleEditComment(_c_reply)} className="dropdown-item">Edit</button>
																													<div className="dropdown-divider"></div>
																													<button onClick={() => this.handleDeleteComment(_c_reply._id)} className="dropdown-item">Delete</button>
																												</>
																												: ''
																											}
																										</div>
																									</div>
																								</div>
																							</div>
																						</div>
																					)
																			})
																		}
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