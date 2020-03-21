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
import * as $ from "jquery";
import 'bootstrap';
import 'css-doodle';

var _ = require('lodash');

class Footer extends React.Component {
    constructor(props) {
        super(props);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleAlphabet = this._handleAlphabet.bind(this);
    }
    componentDidMount() {
        this._handleMouseMove();
        const self = this;
        const {onLoad} = this.props;
        axios('http://localhost:8800/api/articles')
            .then(function (response) {
                // handle success
                onLoad(response.data);
                self._handleAlphabet();
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
    _handleAlphabet() {
        (function(){
            // setup
          
            var grid = document.querySelector('.letter-grid');
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
                start: 65,
                end: 90
            };
          
            // get the grid's width and height
          
            function getDimensions(){
                var gridRect = grid.getBoundingClientRect();
                gridWidth = gridRect.width;
                gridHeight = gridRect.height;
                //console.log('Grid width: '+gridWidth, '\nGrid height: '+gridHeight);
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
                    grid.appendChild(span);
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
                        grid.classList.add('js-show-letters');
                    }
                }
            }
          
            // get the length of the grid.find('span') jQuery object
            // essentially the current number of letters in the grid at this point
          
            function getCurrentLetters(){
                currentLetters = grid.querySelectorAll('span').length;
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
    render() {
        const { articles } = this.props;
        return (
            <div className="footer">
                <div className="letter-grid"></div>
                <div className="wrapper">
                    <div className="top_shelf">
                        <div className="first_box">
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
                        <div className="second_box">
                            .
                        </div>
                        <div className="third_box">
                            .
                        </div>
                        <div className="fourth_box">
                            .
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
                                    <span>Marjane 1, 2<sup>e</sup> tranche, #51, Meknès, Maroc</span>
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
                                            <input className="validate form-group-input username" id="username" type="text" name="username" required="required"/>
                                            <label htmlFor='username'>your name</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                        <div className="input-field col s6">
                                            <input className="validate form-group-input location" id="location" type="text" name="location" required="required"/>
                                            <label htmlFor='location'>your location</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s6">
                                            <input className="validate form-group-input email" id="email" type="text" name="email" required="required"/>
                                            <label htmlFor='email'>your email</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                        <div className="input-field col s6">
                                            <input className="validate form-group-input phone" id="phone" type="text" name="phone" required="required"/>
                                            <label htmlFor='phone'>your phone</label>
                                            <div className="form-group-line"></div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <textarea className="validate form-group-input materialize-textarea content" id="content" name="content" required="required"/>
                                            <label htmlFor='content'>what can i do for you ?</label>
                                            <div className="form-group-line textarea_line"></div>
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="input-field col s12">
                                            <button className="pull-right" type="submit">
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
                                    <a href="#">Instagram</a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#">Facebook</a>
                                </li>
                                <li className="list-inline-item">
                                    <a href="#">Github</a>
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