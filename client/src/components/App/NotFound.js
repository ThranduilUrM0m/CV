import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';

class NotFound extends React.Component {
  	render() {
		return(
			<FullPage>
				<Slide>
					<section className="first_section_404">
						<div id="social_media">
						<div className="icons_gatherer">
                                <a href="https://dribbble.com/iamboutaleb" className="icon-button dribbble"><i className="fab fa-dribbble"></i><span></span></a>
                                <a href="https://www.behance.net/zakariaboutale" className="icon-button behance"><i className="fab fa-behance"></i><span></span></a>
                                <a href="https://www.linkedin.com/in/zakariae-bou-taleb-657953122/" className="icon-button linkedin"><i className="fab fa-linkedin-in"></i><span></span></a>
                                <a href="https://www.instagram.com/iamboutaleb/" className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                <a href="https://fb.me/iamboutaleb" className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
                                <a href="# " className="icon-button scroll">
                                    
                                </a>
                            </div>
                        </div>
						<div className="wrapper_full">
							<div class="clip-each border-style-image"></div>
    						<h1>4<span className="O">O</span>4<span className='dot'>.</span></h1>
							<p>It Seems ther is nothing for u to see here</p>
							<Link to="/">
								<div className="readmore">
									<button data-am-linearrow="tooltip tooltip-bottom" display-name="Let's Take you home">
										<div className="line line-1"></div>
										<div className="line line-2"></div>
									</button>
								</div>
							</Link>
						</div>
					</section>
				</Slide>
			</FullPage>
		)
	}
}

export default NotFound;