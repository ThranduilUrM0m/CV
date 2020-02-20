import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Footer from '../Footer/Footer';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'
import SVG from 'svg.js';
import dev_prod from '../../dev_prod.svg';
import tounarouz from '../../TOUNAROUZ.svg';
import { Form } from '../Article';
import { Form_Project } from '../Project';
import 'whatwg-fetch';
import $ from 'jquery';
import jQuery from 'jquery';

var _ = require('lodash');
require('svg.pathmorphing.js');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._handleSlider = this._handleSlider.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
    }
    componentDidMount() {
        const { onLoad, onLoadProject } = this.props;
        const self = this;
        axios('http://localhost:8800/api/articles')
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
            runAfterElementExists(".first_section .card_"+(response.data.articles.length-1), function() {
                self._handleSlider('slider');
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        axios('http://localhost:8800/api/projects')
        .then(function (response) {
            // handle success
            onLoadProject(response.data);

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
            runAfterElementExists(".second_section .card_"+(response.data.projects.length-1), function() {
                self._handleSlider('slider_projects');
            });
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });

        var draw = SVG('angle_to_angle').attr({ 'viewBox':"0 0 100 100", 'preserveAspectRatio':"none" });

        var path = draw.path('M 0 100 L 0 50 C 40 40 60 80 100 70 L 100 100 Z');
        path.fill('#6dd0de');
        path.stroke({ color: '#6dd0de', width: 1, linecap: 'round', linejoin: 'round' });
        path.animate(2000, '<>', 1000).plot('M 0 100 L 0 50 C 30 30 50 70 100 70 L 100 100 Z').loop(true, true);

        var path_2 = draw.path('M 0 100 L 0 55 C 40 50 60 80 100 75 L 100 100 Z');
        path_2.fill('#9de0e9');
        path_2.stroke({ color: '#9de0e9', width: 1, linecap: 'round', linejoin: 'round' });
        path_2.animate(2000, '<>', 1000).plot('M 0 100 L 0 55 C 50 60 50 70 100 75 L 100 100 Z').loop(true, true);

        var path_3 = draw.path('M 0 100 L 0 65 C 40 65 60 80 100 80 L 100 100 Z');
        path_3.fill('#fff');
        path_3.stroke({ color: '#fff', width: 1, linecap: 'round', linejoin: 'round' });
        path_3.animate(2000, '<>').plot('M 0 100 L 0 65 C 30 55 70 90 100 80 L 100 100 Z').loop(true, true);

        this._handleMouseMove();
    }
    _handleSlider(source) {
        function FormatNumberLength(num, length) {
            var r = "" + num;
            while (r.length < length) {
                r = "0" + r;
            }
            return r;
        }
        (function($) {
            $.fn.jooSlider = function(options) {
                var opt = {
                    auto: true,
                    speed: 2000
                };
                if (options) {
                    $.extend(opt, options);
                }
                var container = $(this);
                var Slider = function() {
                    //===========
                    // Variables
                    //===========
                    var block = false; // Empêcher le clique multiple
                    var height = container.find('.card').height(); // Hauteur des images
                    container.find('.card').wrap('<div class="img-wrap"></div>');
                    this.imgs = container.find('.img-wrap');
                    this.imgCount = (this.imgs.length) - 1;
                    /* Caption */
                    this.imgs.each(function(){
                        var caption = $(this).find('.card').data('index');
                        caption = FormatNumberLength(JSON.parse(caption), 2);
                        $(this).append('<p class="index_card">'+caption+'.</p>');
                    });
                    /* Controls */
                    container.append('<div id="controls"><a id="next">next.</a><a id="curr">curr.</a><a id="prev">prev.</a></div>');
                    this.navNext = container.find('#next');
                    this.navPrev = container.find('#prev');
                    /* Navigation */
                    container.after('<ol class="nav carousel-indicators'+container.attr('id')+'"></ol>');
                    var nav = $(".nav.carousel-indicators"+container.attr('id'));
                    this.imgs.each(function(){
                        var caption = $(this).find('img').attr('title');
                        nav.append('<li></li>');
                    });
                    this.bullets = nav.find("li");
                    
                    //==========
                    // Méthodes
                    //==========
                    /*
                     *   Méthode qui retourne l'index de la div.current
                     */
                    this.getCurrentIndex = function() {
                        return this.imgs.filter('.current').index();
                    };
                    /*
                     *   Méthode qui anime le slide de haut en bas ou de bas en haut
                     */
                    this.goNext = function(index) {
                        /* Images */
                        this.imgs.filter(".current").stop().animate({ // Monte l'image current
                            "top": -height + "px"
                        }, function() {
                            $(this).hide();
                        });
                        this.imgs.removeClass("current"); // Supprime classe current
                        container.find('#curr').text(this.imgs.eq(index).find('.shadow_title').text());

                        //if the index one is the last one, u need to go to the first one again, sinn just +1
                        if(this.imgs.last().index() != index)
                            container.find('#next').text(this.imgs.eq(index+1).find('.shadow_title').text());
                        else
                            container.find('#next').text(this.imgs.first().find('.shadow_title').text());

                        //if the index one is the first one, u need to go to the last one again, sinn just -1
                        if(index != 0) 
                            container.find('#prev').text(this.imgs.eq(index-1).find('.shadow_title').text());
                        else
                            container.find('#prev').text(this.imgs.last().find('.shadow_title').text());

                        this.imgs.eq(index).css({ // Monte la suivante et attribut la classe current
                            "top": height + "px"
                        }).show().stop().animate({
                            "top": "0px"
                        }, function() {
                            block = false;
                        }).addClass("current");
                        /* Bullets */
                        this.bullets.removeClass("current").eq(index).addClass("current");
                    }; //////////////////////// END GO NEXT
                    this.goPrev = function(index) {
                        /* Images */
                        this.imgs.filter(".current").stop().animate({
                            "top": height + "px"
                        }, function() {
                            $(this).hide();
                            block = false;
                        });
                        this.imgs.removeClass("current");
                        container.find('#curr').text(this.imgs.eq(index).find('.shadow_title').text());

                        //if the index one is the last one, u need to go to the first one again, sinn just +1
                        if(this.imgs.last().index() != index)
                            container.find('#next').text(this.imgs.eq(index+1).find('.shadow_title').text());
                        else
                            container.find('#next').text(this.imgs.first().find('.shadow_title').text());

                        //if the index one is the first one, u need to go to the last one again, sinn just -1
                        if(index != 0) 
                            container.find('#prev').text(this.imgs.eq(index-1).find('.shadow_title').text());
                        else
                            container.find('#prev').text(this.imgs.last().find('.shadow_title').text());
                        this.imgs.eq(index).css({
                            "top": -height + "px"
                        }).show().stop().animate({
                            "top": "0px"
                        }, function() {
                        }).addClass("current");
                        /* Bullets */
                        this.bullets.removeClass("current").eq(index).addClass("current");
                    }; //////////////////////// END GO PREV
                    this.next = function() {
                        var index = this.getCurrentIndex();
                        if (index < this.imgCount) {
                            if (block !== true) {
                                this.goNext(index + 1); // Go next
                            }
                        } else {
                            if (block !== true) {
                                this.goNext(0); // If last go first 
                            }
                        }
                        block = true;
                    }; //////////////////////// END NEXT
                    this.prev = function() {
                        var index = this.getCurrentIndex();
                        if (index > 0) {
                            if (block !== true) {
                                this.goPrev(index - 1); // Go previous 
                            }
                        } else {
                            if (block !== true) {
                                this.goPrev(this.imgCount); // If first go last     
                            }
                        }
                        block = true;
                    }; //////////////////////// END PREV
                    /*
                     *   Méthode qui initialise l'objet
                     */
                    this.init = function() {
                        this.imgs.hide().first().addClass('current').show();
                        container.find('#curr').text(this.imgs.first().find('.shadow_title').text());
                        container.find('#next').text(this.imgs.first().next().find('.shadow_title').text());
                        container.find('#prev').text(this.imgs.last().find('.shadow_title').text());
                        this.bullets.first().addClass("current");
                    };
                }; // End Slider Object
                var slider = new Slider();
                slider.init();
                //==========
                //  EVENTS
                //==========
                /* Click */
                slider.navNext.click(function(e) { // Click next button
                    e.preventDefault();
                    clearInterval(interval);
                    interval = setInterval(timer, opt.speed);
                    slider.next();
                });
                slider.navPrev.click(function(e) { // Click previous button
                    e.preventDefault();
                    slider.prev();
                    clearInterval(interval);
                    interval = setInterval(timer, opt.speed);
                });
                slider.bullets.click(function(e) { // Click numbered bullet
                    e.preventDefault();
                    var imgIndex = slider.getCurrentIndex();
                    var bulletIndex = $(this).index();
                    if (imgIndex < bulletIndex) {
                        slider.goNext(bulletIndex);
                    } else {
                        slider.goPrev(bulletIndex);
                    }
                    clearInterval(interval);
                    interval = setInterval(timer, opt.speed);
                });
                /* Interval */
                var interval = setInterval(timer, opt.speed);
                if (opt.auto === true) {
                    var timer = function() {
                        slider.next();
                    };
                }
                container.hover(function() {
                    clearInterval(interval);
                }, function() {
                    clearInterval(interval);
                    interval = setInterval(timer, opt.speed);
                });
                return this;
            };
        })(jQuery);
        $("#"+source).jooSlider({
            auto: false,
            speed: 4000
        });
    }
    _handleMouseMove() {
        $('.second_section').mousemove(function(e){
            var width = $(this).width() / 2;
            var height = $(this).height() / 2;
            var amountMovedX = ((width - e.pageX) * -1 / 12);
            var amountMovedY = ((height - e.pageY) * -1 / 12);
        
            var amountMovedX2 = ((width - e.pageX) / 8);
            var amountMovedY2 = ((height - e.pageY) / 8);
        
            $('.shapes1').css('marginLeft', amountMovedX);
            $('.shapes1').css('marginTop', amountMovedY);
        
            $('.shapes2').css('marginLeft', amountMovedX2);
            $('.shapes2').css('marginTop', amountMovedY2);
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
			$('.second_section .image').html(html);
		});
	}
    render() {
        const { articles, projects } = this.props;
        return (
            <FullPage>
                {/* <Slide>
                    <Form />
                </Slide> */}
                {/* <Slide>
                    <Form_Project />
                </Slide> */}
                <Slide>
                    <section className="active first_section">
                        <div className="wrapper left_part">
                            <div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="#" className="icon-button github"><i className="fab fa-github"></i><span></span></a>
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
                            <img className="dev_prod img-fluid" src={dev_prod} alt="dev_prod"/>
                        </div>
                        <div className="wrapper right_part">
                            <div id="slider">
                                {
                                    (_.orderBy(articles, ['view'], ['desc']).slice(0, 10)).map((article, index) => {
                                        return (
                                            <div className={"card card_" + index} data-title={article.title} data-index={index+1}>
                                                <div className="shadow_title">{article.title}</div>
                                                <div className="card-body">
                                                    <Link to={`/blog/${article._id}`}>
                                                        <button>
                                                            <span>
                                                                <span>
                                                                    <span data-attr-span="Read More About it">
                                                                        Read More About it
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </button>
                                                    </Link>
                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </section>
                </Slide>
                <Slide>
                    <section className="second_section">
                        <div className="wrapper left_part">
                            <div id="circle_yellow"></div>
                            <div id="circle_green"></div>
                            <div id="circle_blue"></div>
                            <div id="angle_to_angle"></div>
                            <div className="some_text">
                                <h1 className="display-4">WORKS.</h1>
                            </div>
                            <div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="#" className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                    <a href="#" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                    <a href="#" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper right_part">
                            <div id="slider_projects">
                                {
                                    (_.orderBy(projects, ['view'], ['desc']).slice(0, 10)).map((project, index) => {
                                        return (
                                            <div className={"card card_" + index} data-title={project.title} data-index={index+1}>
                                                <div className="shadow_title">{project.title}</div>
                                                <div className="card-body">
                                                    <div className='image'>{ this.handleJSONTOHTML(project.image) }</div>
                                                    <Link to={`/blog/${project._id}`}>
                                                        <button>
                                                            <span>
                                                                <span>
                                                                    <span data-attr-span="Read More About it">
                                                                        Read More About it
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </button>
                                                    </Link>
                                                    <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </section>
                </Slide>
                <Slide>
                    <section className="third_section">
                        <div className="wrapper_full">
                            <div className="top_side">
                                <div className="card some_text">
                                    <div className="card-body">
                                        <h1 className="display-2">Doodles</h1>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="some_text">
                                            <h4>Schools</h4>
                                            <p>This is a place where you get to motivate your students, <br/> bring out their creative part, <br/> where you don't need to worry about organizing or statistics again.</p>
                                        </div>
                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                <button className="cta-btn">Learn How +</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <div className="some_text">
                                            <h4>The people</h4>
                                            <p>This is a simple plateform, <br/> where you connect with who we may call the younger version of you, <br/> tell him what you want the younger version of you to hear.</p>
                                        </div>
                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                <button className="cta-btn">Learn How +</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bottom_side">
                                <div className="card">
                                    <div className="card-body">
                                        
                                        <blockquote className="blockquote text-right some_text">
                                            <h5>Our Moto!</h5>
                                            <p className="mb-0">“No one is born hating another person because of the color of his skin, or his background, or his religion. People must learn to hate, and if they can learn to hate, they can be taught to love, for love comes more naturally to the human heart than its opposite.”</p>
                                            <footer className="blockquote-footer">Nelson Mandela, Long Walk to Freedom</footer>
                                        </blockquote>

                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                {
                                                    _.split('H-A-R-D-W-O-R-K-K-I-N-D-N-E-S-S-C-R-E-A-T-I-V-I-T-Y', '-', 26).map((letter, index) => {
                                                        return (
                                                            <p className={index < 8 ? "letter_hardwork" : index < 16 ? "letter_kindness" : "letter_creativity"}>{letter}</p>
                                                        )
                                                        
                                                    })
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">

                                        <blockquote className="blockquote text-right some_text">
                                            <h5>Projects</h5>
                                            <p className="mb-0">We not only connect kids around the world and from far, far away rural schools, we also help them build their legacy for the generations to follow</p>
                                        </blockquote>

                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                <fieldset className="tasks-list">
                                                    
                                                </fieldset>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        
                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                <blockquote className="blockquote text-right some_text">
                                                    <h5>Stories</h5>
                                                    <p className="mb-0">“WHEN GIVEN THE CHOICE BETWEEN BEING RIGHT OR BEING KIND, CHOOSE KIND.”</p>
                                                    <footer className="blockquote-footer">R.J. Palacio, Wonder</footer>
                                                </blockquote>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        
                                        <blockquote className="blockquote text-right some_text">
                                            <h6>Great Speakers This Week!</h6>
                                            <ul>
                                                {
                                                    (_.orderBy(articles, ['createdAt'], ['desc']).slice(0, 4)).map((article, index) => {
                                                        return (
                                                            <li>
                                                                <span>{article.title}</span>
                                                                <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                            </li>
                                                        )
                                                    })
                                                }
                                            </ul>
                                        </blockquote>
                                        <div className="overlay__content">
                                            <div className="overlay__content-inner">
                                                {/* put an image */}
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
    projects: state.home.projects,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);