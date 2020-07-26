import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import 'bootstrap';

class ContactMe extends React.Component {
    render() {
        return(
            <FullPage scrollMode={'full-page'}>
				<Slide>
					<section className="first_section_faq">
                        <div className="wrapper_full">
							<div id="social_media">
                                <div className="icons_gatherer">
                                    <a href="# " className="icon-button dribbble"><i className="fab fa-dribbble"></i><span></span></a>
                                    <a href="# " className="icon-button behance"><i className="fab fa-behance"></i><span></span></a>
                                    <a href="# " className="icon-button linkedin"><i className="fab fa-linkedin-in"></i><span></span></a>
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