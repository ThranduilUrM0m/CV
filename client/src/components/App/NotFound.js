import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import * as $ from "jquery";

class NotFound extends React.Component {
  	render() {
		return(
			<FullPage>
				<Slide>
					<section className="first_section_404">
						<div id="social_media">
                            <div className="icons_gatherer">
                                <a href="# " className="icon-button github"><i className="fab fa-github"></i><span></span></a>
                                <a href="# " className="icon-button instagram"><i className="fab fa-instagram"></i><span></span></a>
                                <a href="# " className="icon-button facebook"><i className="icon-facebook"></i><span></span></a>
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