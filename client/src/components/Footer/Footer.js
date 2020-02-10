import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import 'whatwg-fetch';
import $ from 'jquery';

var _ = require('lodash');

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this._handleMouseMove = this._handleMouseMove.bind(this);
    }
    componentDidMount() {
        this._handleMouseMove();
        const {onLoad} = this.props;
        axios('http://localhost:8000/api/articles')
            .then(function (response) {
                // handle success
                onLoad(response.data);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
            });
    }
    _handleMouseMove() {
        $('.footer').mousemove(function(e){
            var width = $(this).width() / 2;
            var height = $(this).height() / 2;
            var amountMovedX = ((width - e.pageX) * 1 / 64);
            var amountMovedY = ((height - e.pageY) * 1 / 64);
            
            $('.before').css('right', amountMovedX);
            //$('.before').css('top', amountMovedY);
        });
    }
    render() {
        const { articles } = this.props;
        return (
            <div className="footer">
                <div className="wrapper">
                    <div className="pull-left">
                        <div className="some_text">
                            <h6>Latest Articles!</h6>
                            <ul>
                                {
                                    (_.orderBy(articles, ['createdAt'], ['desc']).slice(0, 3)).map((article, index) => {
                                        return (
                                            <li>
                                                <Link to={`/blog/${article._id}`}>
                                                    <span>{article.title}</span>
                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                    <div className="mail-modal">
                        <div className="before"></div>
                        <div className="modal-inner">

                            <div className="modal-left">
                                <h4>Why don't you reach out?</h4>
                            </div>

                            <div className="modal-content">
                                <form className="mail_form">

                                    <fieldset className="input-field form-group">
                                        <input className="validate form-group-input username" id="username" type="text" name="username" required="required"/>
                                        <label htmlFor='username'>@username</label>
                                        <div className="form-group-line"></div>
                                    </fieldset>

                                    <fieldset className="input-field form-group">
                                        <input className="validate form-group-input objet" id="objet" type="text" name="objet" required="required"/>
                                        <label htmlFor='objet'>Objet</label>
                                        <div className="form-group-line"></div>
                                    </fieldset>

                                    <fieldset className="input-field form-group">
                                        <textarea className="validate form-group-input materialize-textarea content" id="content" name="content" required="required"/>
                                        <label htmlFor='content'>Content</label>
                                        <div className="form-group-line textarea_line"></div>
                                    </fieldset>

                                    <button className="btn btn-primary pull-right" type="submit">Submit</button>
                                </form>
                            </div>

                            <div className="modal-rectangle">
                                <h4>Wanna Visit?</h4>
                            </div>

                            <div className="modal-right">
                                <div className="phone">
                                    <span className="title">Phone</span>
                                    <span className="body">(212)6 54 52 84 92</span>
                                </div>
                                <div className="adresse">
                                    <span className="title">Adresse</span>
                                    <span className="body">Meknès, MOROCCO<br></br>Marjane 1st, 2nd Block</span>
                                </div>
                            </div>

                        </div>
                    </div>
                    <span className="push-left">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <a href="#">Instagram</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#">Facebook</a>
                            </li>
                            <li className="list-inline-item">
                                <i className="far fa-copyright"></i>
                                <span>{moment().format('YYYY')}</span>
                                all rights reserved
                            </li>
                        </ul>
                    </span>
                    <span className="push-right">
                        <ul className="list-inline">
                            <li className="list-inline-item">
                                <a href="#">About Us</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#">Privacy Policy</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#">Legal Notice</a>
                            </li>
                            <li className="list-inline-item">
                                <a href="#">Newsroom</a>
                            </li>
                            <li className="list-inline-item">
                                <span className="name">Zakariae.</span>
                            </li>
                        </ul>
                    </span>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
  articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
  onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
});
export default connect(mapStateToProps, mapDispatchToProps)(Footer);