import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import API from '../../utils/API';
import * as $ from "jquery";
import 'bootstrap';
import 'css-doodle';

var _ = require('lodash');

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mail_username : '',
            mail_location: '',
            mail_email: '',
            mail_phone: '',
            mail_content: '',
            window_height: '',
            window_width: '',
        }
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleAlphabet = this._handleAlphabet.bind(this);
        this.send_mail = this.send_mail.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentDidMount() {
        const { onLoad, onLoadProject } = this.props;
        let self = this;
        this._handleMouseMove();

        axios('/api/articles')
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

        self.setState({
            window_height: $(window).height(),
            window_width: $(window).width()
        }, () => {
            self._handleAlphabet();
        });

        //upon resizinng window, recheck the alphabets
        $(window).resize(function() {
            self.setState({
                window_height: $(window).height(),
                window_width: $(window).width()
            }, () => {
                self._handleAlphabet();
            });
        });
    }
    _handleMouseMove() {
        $('.footer').mousemove(function(e){
            var width = $(this).width() / 2;
            //var height = $(this).height() / 2;
            var amountMovedX = ((width - e.pageX) * 1 / 64);
            //var amountMovedY = ((height - e.pageY) * 1 / 64);
            
            $('.before').css('right', amountMovedX);
            //$('.before').css('top', amountMovedY);
        });
    }
    _handleAlphabet() {
        const { window_height, window_width } = this.state;
        (function(){
            // setup
          
            var gridWidth;
            var gridHeight;
            var letterWidth = 30; // @todo: make this dynamic
            var letterHeight = 30; // @todo: make this dynamic
            var totalLetters;
            var letterArray = [];
            var currentLetters = 0;
            var resizeCount = 0;
          
            // the unicode values that we want to loop through (A-Z)
            // http://www.codingforums.com/showpost.php?s=ca38992f8716f43d325c12be6fc0198b&p=843844&postcount=3
          
            var charCodeRange = {
                start: 48,
                end: 49
            };
          
            // get the grid's width and height
          
            function getDimensions(){
                gridWidth = window_width;
                gridHeight = window_height;
            }
          
            // get the total possible letters needed to fill the grid
            // and store that in totalLetters
          
            function getTotalLetters(){
                var multiplierX = gridWidth / letterWidth;
                var multiplierY = gridHeight / letterHeight; 
                totalLetters = Math.round((multiplierX * multiplierY));
                //console.log('multiplierX: '+multiplierX, '\nmultiplierY: '+multiplierY, '\ntotalLetters: '+totalLetters);
            }
          
            // loop through the unicode values and push each character into letterArray
          
            function populateLetters() {
                for (var i = charCodeRange.start; i <= charCodeRange.end; i++) {
                    letterArray.push(String.fromCharCode(i));
                }
            }
          
            // a function to loop a given number of times (value), each time
            // appending a letter from the letter array to the grid
          
            function drawLetters(value){
                var text;
                var span;
                var count = 0;
          
                for (var letter=0; letter <= value; letter++) {
                    text = document.createTextNode(letterArray[count]);
                    span = document.createElement('span');
                    span.appendChild(text);
                    $('.letter-grid').append(span);
                    count++;
                
                    // if our count equals the length of our letter array, then that
                    // means we've reached the end of the array (Z), so we set count to 
                    // zero again in order to start from the beginning of the array (A).
                    // we keep looping over the letter array 'value' number of times.
                
                    if (count === letterArray.length) {
                        count = 0;
                    }
                
                    // if our for counter var (letter) equals the passed in value argument
                    // then we've finished our loop and we throw a class onto the grid element
                    
                    if (letter === value) {
                        $('.letter-grid').addClass('js-show-letters');
                    }
                }
            }
          
            // get the length of the grid.find('span') jQuery object
            // essentially the current number of letters in the grid at this point
          
            function getCurrentLetters(){
                currentLetters = $('.letter-grid').find('span').length;
            }
          
            function init() {
                populateLetters();
                getDimensions();
                getTotalLetters();
                drawLetters(totalLetters);
                getCurrentLetters();
            }
          
            function onResize() {
                resizeCount++;
                getDimensions();
                getTotalLetters();
          
                // here we're looking to see if the current number of letters in the grid
                // (currentLetters) is less than the total possible letters
                // if so, we figure out how many need to be added to fill it up, then draw them
                
                if (currentLetters < totalLetters) {
                    var difference = totalLetters - currentLetters;
                    drawLetters(difference);
                }
              
                // update currentLetters with the current number of letters in the grid
                
                getCurrentLetters();
            }
          
            init();
          
            // do everything we've done so far, except on window resize using debounce to 
            // ensure that resize isn't going nuts firing all this code constantly
          
            window.addEventListener('resize', _.debounce(onResize, 100));
        })();
    }
    async send_mail() {
        const { mail_username, mail_location, mail_email, mail_phone, mail_content } = this.state;
        if (!mail_username || mail_username.length === 0) return;
        if (!mail_email || mail_email.length === 0) return;
        if (!mail_content || mail_content.length === 0) return;
        try {
            const { data } = await API.send_mail({ mail_username, mail_location, mail_email, mail_phone, mail_content });
            $('#mailSentModal').modal('toggle');
            $('#mailSentModal .modal-close').click(() => {
                this.setState({
                    mail_username : '',
                    mail_location: '',
                    mail_email: '',
                    mail_phone: '',
                    mail_content: '',
                });
            });
        } catch (error) {
            console.error(error);
        }
    }
    handleChange(event) {
        this.setState({
            [event.target.id]: event.target.value
        });
    }
    render() {
        const { articles, projects } = this.props;
        return (
            <div className="footer" id="footer_to">
                <div className="modal fade" id="mailSentModal" tabIndex="-1" role="dialog" aria-labelledby="mailSentModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-body">
                                <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                <h5 className="modal-title" id="mailSentModalLabel">Voilà!</h5>
                                <div>Your mail was sent, we thank you for trusting us, we'll reach out to you before you even know it.</div>
                                <div>How about you joins us, not only you can give a feedback to the post you're reading, but you can discover much more about out community.</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="letter-grid"></div>
                <div className="wrapper">
                    <div className="top_shelf">
                        <div className="first_box">
                            <h6>Latest.</h6>
                            <ul>
                                {
                                    (_.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['createdAt'], ['desc']).slice(0, 3)).map((article, index) => {
                                        return (
                                            <li key={index}>
                                                <Link 
                                                    to={
                                                        {
                                                            pathname: '/blog/'+article.title, 
                                                            state : {article}
                                                        }
                                                    }
                                                >
                                                    <span>{article.title}</span>
                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="second_box">
                            <h6>Most viewed.</h6>
                            <ul>
                                {
                                    (_.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['view'], ['desc']).slice(0, 3)).map((article, index) => {
                                        return (
                                            <li key={index}>
                                                <Link 
                                                    to={
                                                        {
                                                            pathname: '/blog/'+article.title, 
                                                            state : {article}
                                                        }
                                                    }
                                                >
                                                    <span>{article.title}</span>
                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="third_box">
                            <h6>Most commented.</h6>
                            <ul>
                                {
                                    (_.orderBy(_.filter(articles, (_a) => { return !_a._hide }), ['comment'], ['desc']).slice(0, 3)).map((article, index) => {
                                        return (
                                            <li key={index}>
                                                <Link 
                                                    to={
                                                        {
                                                            pathname: '/blog/'+article.title, 
                                                            state : {article}
                                                        }
                                                    }
                                                >
                                                    <span>{article.title}</span>
                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                </Link>
                                            </li>
                                        )
                                    })
                                }
                            </ul>
                        </div>
                        <div className="fourth_box">
                            <h6>Latest Projects.</h6>
                            <ul>
                                {
                                    (_.orderBy(_.filter(projects, (_p) => { return !_p._hide }), ['createdAt'], ['asc']).slice(0, 3)).map((project, index) => {
                                        return (
                                            <li key={index}>
                                                <a href={project.link_to} target="_blank" rel="noopener noreferrer">
                                                    <span>{project.title}</span>
                                                    <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
                                                </a>
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
                                <div>
                                    <h5>Other ways to get in touch</h5>
                                </div>
                                <div>
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Meknès, Maroc</span>
                                </div>
                                <div>
                                    <i className="fas fa-phone"></i>
                                    <span>(+212) 6 54 52 84 92</span>
                                </div>
                                <div>
                                    <i className="fas fa-envelope"></i>
                                    <span>zakariaeboutaleb@gmail.com</span>
                                </div>
                            </div>
                            <div className="modal-content">
                                <form className="mail_form">
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input 
                                                className="validate form-group-input mail_username" 
                                                id="mail_username" 
                                                type="text" 
                                                name="mail_username" 
                                                required="required"
                                                value={this.state.mail_username} 
                                                onChange={this.handleChange}
                                            />
                                            <label htmlFor='mail_username'>username*</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                        <div className="input-field col s6">
                                            <input 
                                                className="validate form-group-input mail_location" 
                                                id="mail_location" 
                                                type="text" 
                                                name="mail_location"
                                                value={this.state.mail_location} 
                                                onChange={this.handleChange}
                                            />
                                            <label htmlFor='mail_location'>address</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input 
                                                className="validate form-group-input mail_email" 
                                                id="mail_email" 
                                                type="text" 
                                                name="mail_email" 
                                                required="required"
                                                value={this.state.mail_email} 
                                                onChange={this.handleChange}
                                            />
                                            <label htmlFor='mail_email'>email*</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                        <div className="input-field col s6">
                                            <input 
                                                className="validate form-group-input mail_phone" 
                                                id="mail_phone" 
                                                type="text" 
                                                name="mail_phone" 
                                                value={this.state.mail_phone} 
                                                onChange={this.handleChange}
                                            />
                                            <label htmlFor='mail_phone'>phone</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea 
                                                className="validate form-group-input materialize-textarea mail_content" 
                                                id="mail_content" 
                                                name="mail_content" 
                                                required="required"
                                                value={this.state.mail_content} 
                                                onChange={this.handleChange}
                                            />
                                            <label htmlFor='mail_content'>what can i do for you ?</label>
                                            <div className="form-group-line textarea_line"></div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="input-field col s12">
                                            <button 
                                                className="pull-right" 
                                                type="submit"
                                                name='btn_login' 
                                                onClick={this.send_mail}
                                            >
                                                <span>
                                                    <span>
                                                        <span data-attr-span="Submit.">
                                                            Submit.
                                                        </span>
                                                    </span>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="low_shelf">
                        <span className="push-left">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <a href="# ">Instagram</a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="# ">Facebook</a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="# ">Github</a>
                                </li>
                                <li className="list-inline-item">
                                    <i className="far fa-copyright"></i>
                                    <span>{moment().format('YYYY')}</span> - With <i className="fas fa-heart"></i> from Zakariae boutaleb.
                                </li>
                            </ul>
                        </span>
                        <span className="push-right">
                            <ul className="list-inline">
                                <li className="list-inline-item">
                                    <a href="# ">Legal Notice</a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="# ">Newsroom</a>
                                </li>
                                <li className="list-inline-item">
                                    <span className="name">Zakariae.</span>
                                </li>
                            </ul>
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    articles: state.home.articles,
    projects: state.home.projects,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Footer);