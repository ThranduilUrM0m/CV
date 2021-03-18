import React from 'react';
import { FullPage, Slide } from 'react-full-page';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

class ContactMe extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleGradient = this.handleGradient.bind(this);
    }
    componentDidMount() {
        //this.handleGradient();
    }
    handleClick(href) {
        $('html,body').animate({scrollTop: $('#'+href).offset().top}, 200, function() {
            $('#mail_content').focus();
        });
    }
    handleGradient() {
        var colors = new Array(
            [45, 45, 45],
            [40, 40, 40],
            [35, 35, 35],
            [30, 30, 30],
            [25, 25, 25],
            [20, 20, 20]
        );
          
        var step = 0;
        // color table indices for: 
        // current color left
        // next color left
        // current color right
        // next color right
        var colorIndices = [0,1,2,3];
          
        //transition speed
        var gradientSpeed = 0.05;
          
        function updateGradient() {
            
            if ( $===undefined ) return;
            
            var c0_0 = colors[colorIndices[0]];
            var c0_1 = colors[colorIndices[1]];
            var c1_0 = colors[colorIndices[2]];
            var c1_1 = colors[colorIndices[3]];
            
            var istep = 1 - step;
            var r1 = Math.round(istep * c0_0[0] + step * c0_1[0]);
            var g1 = Math.round(istep * c0_0[1] + step * c0_1[1]);
            var b1 = Math.round(istep * c0_0[2] + step * c0_1[2]);
            var color1 = "rgb("+r1+","+g1+","+b1+")";
            
            var r2 = Math.round(istep * c1_0[0] + step * c1_1[0]);
            var g2 = Math.round(istep * c1_0[1] + step * c1_1[1]);
            var b2 = Math.round(istep * c1_0[2] + step * c1_1[2]);
            var color2 = "rgb("+r2+","+g2+","+b2+")";
          
            $('#gradient').css({
                borderColor: "-webkit-gradient(linear, left top, right top, from("+color1+"), to("+color2+"))"
            }).css({
                background: "-moz-linear-gradient(left, "+color1+" 0%, "+color2+" 100%)"
            });
            
            step += gradientSpeed;
            if ( step >= 1 ) {
                step %= 1;
                colorIndices[0] = colorIndices[1];
                colorIndices[2] = colorIndices[3];
                
                //pick two new target color indices
                //do not pick the same as the current one
                colorIndices[1] = ( colorIndices[1] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
                colorIndices[3] = ( colorIndices[3] + Math.floor( 1 + Math.random() * (colors.length - 1))) % colors.length;
            }
        }
          
        setInterval(updateGradient,10);
    }
    render() {
        return (
            <FullPage scrollMode={'normal'}>
				<Slide>
					<section className="first_section_contact">
                        <div className="wrapper_full" id="gradient">
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
                            <div className="text">
                                <div className="scene">
                                    <div className="cube">
                                        <div className="cube__face cube__face--front"></div>
                                        <div className="cube__face cube__face--back"></div>
                                        <div className="cube__face cube__face--right"></div>
                                        <div className="cube__face cube__face--left"></div>
                                        <div className="cube__face cube__face--top"></div>
                                        <div className="cube__face cube__face--bottom"></div>
                                    </div>
                                </div>
                                <div className="email_me">
                                    <h6>For Inquiries</h6>
                                    <button id="reach_out_button" onClick={() => this.handleClick('footer_to')} type="button">
                                        <span>
                                            <span>
                                                <span data-attr-span="Reach Out.">
                                                    Reach Out<b className='pink_dot'>.</b>
                                                </span>
                                            </span>
                                        </span>
                                    </button>
                                </div>
                                <h1 className="talk_to_me">Talk To Me Now.</h1>
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