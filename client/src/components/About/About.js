import React from 'react';
import axios from 'axios';
import Footer from '../Footer/Footer';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import * as $ from "jquery";
import 'bootstrap';

var _ = require('lodash');

class About extends React.Component {
    constructor(props){
        super(props);
        this.typewriting = this.typewriting.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    componentDidMount() {
        const { onLoad } = this.props;
        this.typewriting();
        axios('/api/articles')
        .then(function (response) {
            // handle success
            onLoad(response.data);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
        $('.fixedHeaderContainer').removeClass('blog_header');
    }
    typewriting() {
        var TxtType = function(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.tick();
            this.isDeleting = false;
        };
    
        TxtType.prototype.tick = function() {
            var i = this.loopNum % this.toRotate.length;
            var fullTxt = this.toRotate[i];
    
            if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
            } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
            }
    
            this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';
    
            var that = this;
            var delta = 200 - Math.random() * 100;
    
            if (this.isDeleting) { delta /= 2; }
    
            if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
            }
    
            setTimeout(function() {
            that.tick();
            }, delta);
        };
    
        var elements = document.getElementsByClassName('typewrite');
        for (var i=0; i<elements.length; i++) {
            var toRotate = elements[i].getAttribute('data-type');
            var period = elements[i].getAttribute('data-period');
            if (toRotate) {
                new TxtType(elements[i], JSON.parse(toRotate), period);
            }
        }
        // INJECT CSS
        var css = document.createElement("style");
        css.type = "text/css";
        css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #000}";
        document.body.appendChild(css);
    }
    handleClick(href) {
        $('html,body').animate({scrollTop: $('#'+href).offset().top}, 200, function() {
            $('#mail_content').focus();
        });
    }
    render() {
		const { articles } = this.props;
        return(
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section className="first_section_about">
                        <div id="social_media">
                            <div className="icons_gatherer">
                                <a href="# " className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                <a href="# " className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                <a href="# " className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                <a href="# " className="icon-button scroll">
                                    
                                </a>
                            </div>
                        </div>
                        <span className="shadowHi"></span>
                        <div className="wrapper_full">
                            <div className="artsy">
                                
                            </div>
                            <div className="type">
                                <p className="text-muted">by A Partisan du <b>"Less Is More"</b></p>
                                <button onClick={() => this.handleClick('footer_to')} type="button">
                                    <span>
                                        <span>
                                            <span data-attr-span="Reach Out.">
                                                Reach Out.
                                            </span>
                                        </span>
                                    </span>
                                </button>
                                <div className="title">
                                    <h1>
                                        <span>I'm</span>
                                    </h1>
                                    <h1>
                                        <div className="typewrite" data-period="2000" data-type='[ "Zakariae.", "Boutaleb.", "A developer.", "A Teacher." ]'>
                                            <span className="wrap"></span>
                                        </div>
                                    </h1>
                                </div>
                                <span className="lorem">
                                    <p>I'm an elemantary teacher indeed, & I'm also a multidisciplinary developer who learned to design at a very young age, to yarn people's stories visually, & now i specialize in responsive web apps and websites.</p>
                                    <p>I concentrate on needs in order to come up with a product to be remembered.</p>
                                    <p>I am now a <b>Freelancer</b> and if you would like to know more about me,</p>
                                    <p>How about you read something i wrote for you ?</p>
                                </span>
                                <Link 
                                    to={
                                        {
                                            pathname: '/blog/'+_.get(_.find(articles, {'title': 'about me'}), 'title'), 
                                            state : _.find(articles, {'title': 'about me'})
                                        }
                                    }
                                >
                                    <div className="readmore">
                                        <button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
                                            <div className="line line-1"></div>
                                            <div className="line line-2"></div>
                                        </button>
                                    </div>
                                </Link>
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
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
});

export default connect(mapStateToProps, mapDispatchToProps)(About);
