import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import Fingerprint from 'fingerprintjs';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';

class Coffee extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section className="first_section_coffee">
                        <div className="wrapper_full">
                            <div className="card">
                                <div className="card-body">
                                    <div className="_body">
                                        <h2>Join Us in Our Headquarters for a cup of coffee, or hot chocolate whip cream (No judging), To discuss with us the impact of Web on education and how to build a new educational system, based on technology and advancement.</h2>
                                    </div>
                                </div>
                            </div>
							<div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="#" className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                    <a href="#" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                    <a href="#" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                    <a href="#" className="icon-button scroll">
                                        
                                    </a>
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
  
export default Coffee