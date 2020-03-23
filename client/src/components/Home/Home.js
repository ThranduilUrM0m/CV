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
} from 'react-router-dom';
import { Form } from '../Article';
import { Form_Project } from '../Project';
import 'whatwg-fetch';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

var _ = require('lodash');

class Home extends React.Component {
    constructor(props) {
        super(props);
        this._handleSlider = this._handleSlider.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
    }
    componentDidMount() {
        const { onLoad, onLoadProject } = this.props;
        this._handleScroll();
        const self = this;
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

        axios('/api/projects')
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

        this._handleMouseMove();
        $('.fixedHeaderContainer').removeClass('blog_header');
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
        $('.first_section').mousemove(function(e){
            var width = $(this).width() / 2;
            var height = $(this).height() / 2;
            var amountMovedX = ((width - e.pageX) * -1 / 12);
            var amountMovedY = ((height - e.pageY) * -1 / 12);
        
            $('.fa-moon').css('marginLeft', amountMovedX);
            $('.fa-moon').css('marginTop', amountMovedY);
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
            $('.second_section .image').append("<div class='border_effect'></div>")
		});
	}
    _handleScroll(){
        $(window).scroll(function() {
            if ($(document).height() - $(window).height() - $(window).scrollTop() < 100){
                $('.fixedHeaderContainer').addClass('blog_header');
            }
            else{
                $('.fixedHeaderContainer').removeClass('blog_header');
            }
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
                        </div>
                        <div className="wrapper right_part">
                            <i className="fas fa-moon"></i>
                            <div className="pulsing_dots">
                                <div className="p1"></div>
                                <div className="p2"></div>
                                <div className="p3"></div>
                            </div>
                            <div id="slider">
                                {
                                    (_.orderBy(articles, ['view'], ['desc']).slice(0, 10)).map((article, index) => {
                                        return (
                                            <div className={"card card_" + index} data-title={_.head( article.title.split(" ") )} data-index={index+1}>
                                                <div className="shadow_title">{_.head( article.title.split(" ") )}.</div>
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
                            <div className="pulsing_dots">
                                <div className="p1"></div>
                                <div className="p2"></div>
                                <div className="p3"></div>
                            </div>
                            <div className="some_text">
                                <h1 data-text="works." className="display-1">works.</h1>
                                <p>Hi,<br/>I'm Boutaleb Zakariae. <br/>a Web <b className='web'>developer.</b></p>
                            </div>
                        </div>
                        <div className="wrapper right_part">
                            <div id="slider_projects">
                                {
                                    (_.orderBy(projects, ['view'], ['desc']).slice(0, 10)).map((project, index) => {
                                        return (
                                            <div className={"card card_" + index} data-title={project.title} data-index={index+1}>
                                                <div className="card-body">
                                                    <Link to={`${project.link_to}`}>
                                                        <div className='image'>
                                                            { this.handleJSONTOHTML(project.image) }
                                                        </div>
                                                    </Link>
                                                    <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <button>
                                <span>
                                    <span>
                                        <span data-attr-span="Hire Me.">
                                            Hire Me.
                                        </span>
                                    </span>
                                </span>
                            </button>
                        </div>
                    </section>
                </Slide>
                <Slide>
                    <section className="third_section">
                        <div className="wrapper">
                            <div className="card">
                                <div className="card-body">
                                    <div className="column column_1">
                                        <div className="head">
                                            <i className="fas fa-file-code"></i>
                                            <span>Front-end Developer</span>
                                        </div>
                                        <div className="content">
                                            <h7>Languages i'm fluent at</h7>
                                            <ul className="text-muted tags">
                                                <li className="tag_item">_Lodash</li>
                                                <li className="tag_item">JQuery</li>
                                                <li className="tag_item">Sass</li>
                                                <li className="tag_item">Css</li>
                                                <li className="tag_item">HTML</li>
                                                <li className="tag_item">ReactJS</li>
                                            </ul>
                                            <h7>Tools i use</h7>
                                            <ul className="text-muted tags">
                                                <li className="tag_item">Bootstrap</li>
                                                <li className="tag_item">Css Grid</li>
                                                <li className="tag_item">Illustrator</li>
                                                <li className="tag_item">Photohsop</li>
                                                <li className="tag_item">Pen & Paper</li>
                                                <li className="tag_item">Visual Studio Code</li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="column column_2">
                                        <div className="head">
                                            <i className="fas fa-icons"></i>
                                            <span>Design.</span>
                                        </div>
                                        <div className="content">
                                            <div></div>
                                        </div>
                                    </div>
                                    <div className="column column_3">
                                        <div className="head">
                                            <i className="fab fa-js"></i>
                                            <span>Back-end Developer</span>
                                        </div>
                                        <div className="content">
                                            <h7>Languages i'm fluent at</h7>
                                            <ul className="text-muted tags">
                                                <li className="tag_item">JSON</li>
                                                <li className="tag_item">NoSQL</li>
                                                <li className="tag_item">JavaScript</li>
                                                <li className="tag_item">NPM</li>
                                                <li className="tag_item">Yarn</li>
                                                <li className="tag_item">NodeJS</li>
                                                <li className="tag_item">React Native</li>
                                            </ul>
                                            <h7>Tools i use</h7>
                                            <ul className="text-muted tags">
                                                <li className="tag_item">Git</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <h1 data-text="SKILLS." className="display-1">SKILLS.</h1>
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