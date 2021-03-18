import React from 'react';
import axios from 'axios';
import moment from 'moment';
import Footer from '../Footer/Footer';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

var _ = require('lodash');

class Process extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const { onLoad, onLoadProject } = this.props;
        const self = this;
        axios('/api/articles')
            .then(function (response) {
                onLoad(response.data);
                function runAfterElementExists(jquery_selector, callback) {
                    var checker = window.setInterval(function () {
                        if ($(jquery_selector).length) {
                            clearInterval(checker);
                            callback();
                        }
                    }, 200);
                }
                runAfterElementExists(".first_section .card_" + (_.size(_.filter(response.data.articles, { '_hide': false }))), function () {
                    self._handleSlider('slider');
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        axios('/api/projects')
            .then(function (response) {
                onLoadProject(response.data);
                function runAfterElementExists(jquery_selector, callback) {
                    var checker = window.setInterval(function () {
                        if ($(jquery_selector).length) {
                            clearInterval(checker);
                            callback();
                        }
                    }, 200);
                }
                runAfterElementExists(".second_section .card_" + (_.size(_.filter(response.data.projects, { '_hide': false }))), function () {
                    self._handleSlider('slider_projects');
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    componentDidMount() {
        document.getElementById('process').parentElement.style.height = 'initial';
        document.getElementById('process').parentElement.style.minHeight = '170vh';
    }
    render() {
        const { articles, projects } = this.props;
        return (
            <FullPage scrollMode={'normal'}>
                <Slide>
                    <section id="process" className="first_section_process">
                        <div id="social_media">
                            <div className="icons_gatherer">
                                <a href="https://dribbble.com/boutaleblcoder" className="icon-button dribbble"><i className="fab fa-dribbble"></i><span></span></a>
                                <a href="https://www.behance.net/boutaleblcoder/" className="icon-button behance"><i className="fab fa-behance"></i><span></span></a>
                                <a href="https://www.linkedin.com/in/zakariae-bou-taleb-657953122/" className="icon-button linkedin"><i className="fab fa-linkedin-in"></i><span></span></a>
                                <a href="https://www.instagram.com/boutaleblcoder/" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                <a href="https://fb.me/boutaleblcoder" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                <a href="# " className="icon-button scroll">

                                </a>
                            </div>
                        </div>
                        <div className="wrapper_full">
                            <div className="description">
                                <div className="title">
                                    <h1>
                                        A process of pure <b>creativty</b>
                                    </h1>
                                    <h1>
                                        & Dedication<b className="pink_dot">.</b>
                                    </h1>
                                </div>
                                <span className="lorem">
                                    <h5>From <b>Idea</b> to Product</h5>
                                    <h6>With Our range of expertise, we offer you dedication, creativity and willingness to build your Idea to perfection and reach the right hearts !</h6>
                                </span>
                                <button onClick={() => this.handleClick('footer_to')} type="button">
                                    <span>
                                        <span>
                                            <span data-attr-span="Reach Out.">
                                                Reach Out<b className='pink_dot'>.</b>
                                            </span>
                                        </span>
                                    </span>
                                </button>
                            </div>
                            <div className="first_step">
                                <div className="image"></div>
                                <span className="number">01<b className="pink_dot">.</b></span>
                                <span className="title">Choosing a Theme</span>
                                <span className="description">We Search for the right theme to implement your idea : Ecommerce - Portfolio - Blog - Showcase</span>
                            </div>
                            <div className="second_step">
                                <div className="image"></div>
                                <span className="number">02<b className="pink_dot">.</b></span>
                                <span className="title">Implementing Content</span>
                                <span className="description">Once you share with us your content, we implement it in the most efficient design : Photos - Videos - Articles - Text - Logo (And if you don't have it, we give our designer a call)</span>
                            </div>
                            <div className="third_step">
                                <div className="image"></div>
                                <span className="number">03<b className="pink_dot">.</b></span>
                                <span className="title">Delivring your Website</span>
                                <span className="description">After testing and verification, the time to deliver is imminent : Modifications - Complete access to your administrator space - perfect documentation to how your website functions - Presentation</span>
                            </div>
                            <div className="fourth_step">
                                <div className="image"></div>
                                <span className="number">04<b className="pink_dot">.</b></span>
                                <span className="title">Maintaining your Website</span>
                                <dpan className="description">Upon delivery, it is possible to ask for maintenance : Fixing Bugs - Modifying Content - Priority assistance - Annual maintenance</dpan>
                            </div>
                            <div className="encouragement">

                            </div>
                        </div>
                    </section>
                </Slide>
                <Slide>
                    <Footer />
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

export default connect(mapStateToProps, mapDispatchToProps)(Process);