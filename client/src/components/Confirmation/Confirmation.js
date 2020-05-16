import React from 'react';
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import { Link } from 'react-router-dom';
import * as $ from "jquery";

class Confirmation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_msg: ''
        }
        this.confirmation = this.confirmation.bind(this);
    }
    componentDidMount() {
        let self = this;
        this.confirmation(self.props.match.params.token_id);
    }
    async confirmation(token) {
		let self = this;
        await API.confirmation({ token })
        .then((res) => {
            self.setState({
                modal_msg: res.data.text
            }, () => {
                $('#confirmation_modal').modal('toggle');
            });
        })
        .catch((error) => {
            self.setState({
                modal_msg: error.response.data.text
            }, () => {
                $('#confirmation_modal').modal('toggle');
            });
        });
    }
    render() {
        const { modal_msg } = this.state;
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
							<div className="_verification_message">
                                { modal_msg }
                            </div>
						</div>
					</section>
				</Slide>
			</FullPage>
        )
    }
}

export default Confirmation;