import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import Fingerprint from 'fingerprintjs';
import * as $ from "jquery";
import 'bootstrap';
import 'whatwg-fetch';
import API from '../../utils/API';

var _ = require('lodash');

class Coffee extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            author: '',
            body: '',
            is_private: false,
            fingerprint: '',
            upvotes: [],
            downvotes: [],
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        const { onLoadTestimony } = this.props;
        const self = this;

        axios('/api/testimonies')
        .then((response) => {
            onLoadTestimony(response.data);
            var f = new Fingerprint().get();
            self.setState({
                fingerprint : f.toString()
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
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
    handleSubmit(){
        const { onSubmitTestimony, testimonyToEdit, onEditTestimony } = this.props;
        const { body, author, is_private, fingerprint, upvotes, downvotes } = this.state;
        const self = this;

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
                .then(function() {
                    self.setState({ 
                        author: '',
                        body: '',
                        is_private: false,
                        upvotes: [],
                        downvotes: [],
                    })
                }).catch(error => {
                    console.log(error.response)
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
                .then(function() {
                    self.setState({ 
                        author: '',
                        body: '',
                        is_private: '',
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
        const { body, author, is_private } = this.state;
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
                                                _.orderBy(testimonies, ['view'], ['desc']).map((testimony, index) => {
                                                    return (
                                                        <div className={"card card_" + index} data-index={index+1}>
                                                            <div className="shadow_title">{_.head(_.words(testimony.body))}</div>
                                                            <div className="card-body">
                                                                <div className="top_row">
                                                                    <h6 className="author">by <b>{testimony.author}</b></h6>
                                                                    <p className="text-muted fromNow">{moment(new Date(testimony.updatedAt)).fromNow()}</p>
                                                                    <div className="up_down">
                                                                        <p className="text-muted upvotes"><b>{_.size(_.get(testimony, 'upvotes'))}</b> <button onClick={this.handleSubmitupvotes}><i className="fas fa-thumbs-up"></i></button> </p>
                                                                        <p className="text-muted downvotes"><b>{_.size(_.get(testimony, 'downvotes'))}</b> <button onClick={this.handleSubmitdownvotes}><i className="fas fa-thumbs-down"></i></button> </p>
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
                                                                            <button className="dropdown-item" type="button">Edit</button>
                                                                            <div className="dropdown-divider"></div>
                                                                            <button className="dropdown-item" type="button">Delete</button>
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
    testimonies: state.home.testimonies,
    testimonyToEdit: state.home.testimonyToEdit,
});

const mapDispatchToProps = dispatch => ({
    onLoadTestimony: data => dispatch({ type: 'TESTIMONY_PAGE_LOADED', data }),
	onSubmitTestimony: data => dispatch({ type: 'SUBMIT_TESTIMONY', data }),
    onEditTestimony: data => dispatch({ type: 'EDIT_TESTIMONY', data }),
	onDeleteTestimony: id => dispatch({ type: 'DELETE_TESTIMONY', id }),
	setEditTestimony: testimony => dispatch({ type: 'SET_EDIT_TESTIMONY', testimony }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Coffee) 