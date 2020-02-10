import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import 'whatwg-fetch';
import { pagination } from 'paginationjs';
import Fingerprint from 'fingerprintjs';
import Footer from '../Footer/Footer';
import $ from 'jquery';

class Projects extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return(
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section className="first_section_projects">
                        <div className="wrapper_full">
                            <h2>SMALL GESTURES</h2>
							<div id="social_media">
								<div className="icons_gatherer">
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
                    </section>
				</Slide>
				<Slide>
					<Footer/>
				</Slide>
            </FullPage>
        )
    }
}
  
export default Projects