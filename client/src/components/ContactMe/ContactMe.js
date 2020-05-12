import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import 'bootstrap';

class ContactMe extends React.Component {
    render() {
        return(
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section className="first_section_faq">
                        <div className="wrapper_full">
                            <h2>EMPTY PAGE</h2>
							<div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="# " className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                    <a href="# " className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                    <a href="# " className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                    <a href="# " className="icon-button scroll">
                                        
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
  
export default ContactMe