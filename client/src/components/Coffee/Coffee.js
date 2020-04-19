import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import Footer from '../Footer/Footer';
import Fingerprint from 'fingerprintjs';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class Coffee extends React.Component {
    constructor(props){
        super(props);

        var f = new Fingerprint().get();
        this.state = {
            author: '',
            body: '',
            is_private: false,
            fingerprint: f.toString(),
            upvotes: [],
            downvotes: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSubmitupvotesTestimony = this.handleSubmitupvotesTestimony.bind(this);
        this.handleSubmitdownvotesTestimony = this.handleSubmitdownvotesTestimony.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleEdit = this.handleEdit.bind(this);
    }
    componentDidMount() {
        const { onLoadTestimony } = this.props;

        axios('/api/testimonies')
        .then((response) => {
            onLoadTestimony(response.data);
        });
    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.testimonyToEdit) {
            this.setState({
                body: nextProps.testimonyToEdit.body,
                author: nextProps.testimonyToEdit.author,
                is_private: nextProps.testimonyToEdit.is_private,
                fingerprint: nextProps.testimonyToEdit.fingerprint,
                upvotes: nextProps.testimonyToEdit.upvotes,
                downvotes: nextProps.testimonyToEdit.downvotes,
            });
        }
    }
	handleSubmitupvotesTestimony(testimony, event) {
        var f = new Fingerprint().get();
        let self = this;
        let target = event.target;
        if( _.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === f.toString()}) ) ) {
            function setEditFunction() {
                // Get the current 'global' time from an API using Promise
                return new Promise((resolve, reject) => {
                    setTimeout(function() {
                        self.handleEdit(testimony);
                        true ? resolve('Success') : reject('Error');
                    }, 2000);
                })
            }
            setEditFunction()
                .then(() => {
                    self.setState(state => ({
                        upvotes: [...state.upvotes, {upvoter: f.toString()}],
                    }), () => {
                        if( !_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === f.toString()}) ) ) {
                            let _downvotes = _.takeWhile(self.state.downvotes, function(o) { return o.downvoter != f.toString(); });
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
                    });
                    return true;
                })
                .catch(err => console.log('There was an error:' + err));
        } else {
            function setEditFunction() {
                // Get the current 'global' time from an API using Promise
                return new Promise((resolve, reject) => {
                    setTimeout(function() {
                        self.handleEdit(testimony);
                        true ? resolve('Success') : reject('Error');
                    }, 2000);
                })
            }
            setEditFunction()
                .then(() => {
                    let _upvotes = _.takeWhile(self.state.upvotes, function(o) { return o.upvoter != f.toString(); });
                    self.setState(state => ({
                        upvotes: _upvotes,
                    }), () => {
                        self.handleSubmit();
                        $(target).closest("div").removeClass('active');
                    });
                    return true;
                })
                .catch(err => console.log('There was an error:' + err));
        }
	}
	handleSubmitdownvotesTestimony(testimony, event) {
        var f = new Fingerprint().get();
        let self = this;
        let target = event.target;
        if( _.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === f.toString()}) ) ) {
            function setEditFunction() {
                // Get the current 'global' time from an API using Promise
                return new Promise((resolve, reject) => {
                    setTimeout(function() {
                        self.handleEdit(testimony);
                        true ? resolve('Success') : reject('Error');
                    }, 2000);
                })
            }
            setEditFunction()
                .then(() => {
                    self.setState(state => ({
                        downvotes: [...state.downvotes, {downvoter: f.toString()}],
                    }), () => {
                        if( !_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === f.toString()}) ) ) {
                            let _upvotes = _.takeWhile(self.state.upvotes, function(o) { return o.upvoter != f.toString(); });
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
                    });
                    return true;
                })
                .catch(err => console.log('There was an error:' + err));
        } else {
            function setEditFunction() {
                // Get the current 'global' time from an API using Promise
                return new Promise((resolve, reject) => {
                    setTimeout(function() {
                        self.handleEdit(testimony);
                        true ? resolve('Success') : reject('Error');
                    }, 2000);
                })
            }
            setEditFunction()
                .then(() => {
                    let _downvotes = _.takeWhile(self.state.downvotes, function(o) { return o.downvoter != f.toString(); });
                    self.setState(state => ({
                        downvotes: _downvotes,
                    }), () => {
                        self.handleSubmit();
                        $(target).closest("div").removeClass('active');
                    });
                    return true;
                })
                .catch(err => console.log('There was an error:' + err));
        }
    }
    handleDelete(id) {
        const { onDeleteTestimony } = this.props;
        return axios.delete(`/api/testimonies/${id}`).then(() => onDeleteTestimony(id));
    }
    handleEdit(testimony) {
        const { setEditTestimony } = this.props;
        setEditTestimony(testimony);
    }
    handleSubmit(){
        const { onSubmitTestimony, testimonyToEdit, onEditTestimony } = this.props;
        const { body, author, is_private, fingerprint, upvotes, downvotes } = this.state;

        if(!testimonyToEdit) {
            return axios.post('/api/testimonies', {
                body,
                author,
                is_private,
                fingerprint,
                upvotes,
                downvotes,
            })
                .then((res) => onSubmitTestimony(res.data))
                .then(() => {
                    this.setState({ 
                        author: '',
                        body: '',
                        is_private: false,
                        upvotes: [],
                        downvotes: [],
                    })
                });
        } else {
            return axios.patch(`/api/testimonies/${testimonyToEdit._id}`, {
                body,
                author,
                is_private,
                fingerprint,
                upvotes,
                downvotes,
            })
                .then((res) => onEditTestimony(res.data))
                .then(() => {
                    this.setState({ 
                        author: '',
                        body: '',
                        is_private: false,
                        upvotes: [],
                        downvotes: [],
                    })
                });
        }
    }
    handleChange(key, event) {
        this.setState({
            [key]: event.target.value,
        });
    }
    render() {
        const { testimonyToEdit, testimonies } = this.props;
        const { body, author, is_private, fingerprint } = this.state;
        return(
            <FullPage>
				<Slide>
                    {/* U might wanna think about replies */}
					<section className="active first_section_coffee">
                        <div className="wrapper_full">
							<div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="#" className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                    <a href="#" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                    <a href="#" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                    <a href="#" className="icon-button scroll">
                                        
                                    </a>
                                </div>
                            </div>
                            <div className="card card_buymecoffee">
                                <div className="card-body">
                                    <h3>Have a <strong>Mint Tea</strong> with me !</h3>
                                    <p className="text-muted">Thank you, feel free to show your support, leave a comment !</p>
                                    <span className="coffee_buyout">
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <div>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                    <span></span>
                                                </div>
                                            </div>
                                        </div>
                                    </span>
                                    <div className="mail_form">
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input 
                                                    className="validate form-group-input author" 
                                                    id="author" 
                                                    type="text" 
                                                    name="author" 
                                                    required="required"
                                                    value={author}
                                                    onChange={(ev) => this.handleChange('author', ev)}
                                                />
                                                <label htmlFor='author' className={author ? 'active' : ''}>username*</label>
                                                <div className="form-group-line"></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12 textarea">
                                                <textarea 
                                                    className="validate form-group-input materialize-textarea body" 
                                                    id="body" 
                                                    name="body" 
                                                    required="required"
                                                    value={body} 
                                                    onChange={(ev) => this.handleChange('body', ev)}
                                                />
                                                <label htmlFor='body' className={body ? 'active' : ''}>Baby Don't hurt me ...</label>
                                                <div className="form-group-line textarea_line"></div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="input-field col s12">
                                                <input
                                                    className="validate form-group-input is_private" 
                                                    id="is_private" 
                                                    type="checkbox"
                                                    name="is_private" 
                                                    required="required"
                                                    value={is_private}
                                                    onChange={(ev) => this.handleChange('is_private', ev)}
                                                />
                                                <label className="is_private" htmlFor="is_private">Private Message ?</label>
                                                <button 
                                                    className="pull-right" 
                                                    type="submit"
                                                    name='btn_login' 
                                                    onClick={this.handleSubmit}
                                                >
                                                    <span>
                                                        <span>
                                                            <span data-attr-span={testimonyToEdit ? 'Update.' : 'Submit.'}>
                                                                {testimonyToEdit ? 'Update' : 'Submit'}.
                                                            </span>
                                                        </span>
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card card_coffesbought">
                                <div className="card-body">
                                    <div id="testimonies-modal" className="testimonies-modal">
                                        <div className="modal-inner">
                                            <div className="modal-content">
                                            {
                                                _.orderBy(_.filter(testimonies, { 'is_private': false }), ['view'], ['desc']).map((testimony, index) => {
                                                    return (
                                                        <div className={"card card_" + index} data-index={index+1}>
                                                            <div className="shadow_title">{_.head(_.words(testimony.body))}</div>
                                                            <div className="card-body">
                                                                <div className="top_row">
                                                                    <h6 className="author">by <b>{testimony.author}</b></h6>
                                                                    <p className="text-muted fromNow">{moment(new Date(testimony.createdAt)).fromNow()}</p>
                                                                    <div className="up_down">
                                                                        <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === fingerprint}) ) ? '' : 'active'}`}>
                                                                            <b>{_.size(_.get(testimony, 'upvotes'))}</b> 
                                                                            <button onClick={(ev) => this.handleSubmitupvotesTestimony(testimony, ev)}>
                                                                                <i className="fas fa-thumbs-up"></i>
                                                                            </button>
                                                                        </div>
                                                                        <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === fingerprint}) ) ? '' : 'active'}`}>
                                                                            <b>{_.size(_.get(testimony, 'downvotes'))}</b>
                                                                            <button onClick={(ev) => this.handleSubmitdownvotesTestimony(testimony, ev)}>
                                                                                <i className="fas fa-thumbs-down"></i>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="middle_row">
                                                                    <h5>{testimony.body}</h5>
                                                                </div>
                                                                <div className="bottom_row">
                                                                    <div className="crud">
                                                                        <i className="fas fa-ellipsis-v dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown"></i>
                                                                        <div className="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                                                                            <button className="dropdown-item" type="button">Reply</button>
                                                                            <button onClick={() => this.handleEdit(testimony)}  className="dropdown-item">Edit</button>
                                                                            <div className="dropdown-divider"></div>
                                                                            <button onClick={() => this.handleDelete(testimony._id)} className="dropdown-item">Delete</button>
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
    testimonyToEdit: state.home.testimonyToEdit,

    testimonies: state.home.testimonies,
});

const mapDispatchToProps = dispatch => ({
    onSubmitTestimony: data => dispatch({ type: 'SUBMIT_TESTIMONY', data }),
    onEditTestimony: data => dispatch({ type: 'EDIT_TESTIMONY', data }),

    onLoadTestimony: data => dispatch({ type: 'TESTIMONY_PAGE_LOADED', data }),
	onDeleteTestimony: id => dispatch({ type: 'DELETE_TESTIMONY', id }),
	setEditTestimony: testimony => dispatch({ type: 'SET_EDIT_TESTIMONY', testimony }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Coffee) 