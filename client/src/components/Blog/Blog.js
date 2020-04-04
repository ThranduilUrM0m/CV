import React from 'react';
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { FullPage, Slide } from 'react-full-page';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom';
import 'whatwg-fetch';
import Footer from '../Footer/Footer';
import * as $ from "jquery";
import 'bootstrap';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

var _ = require('lodash');
const top100Films = [
	{ title: 'The Shawshank Redemption', year: 1994 },
	{ title: 'The Godfather', year: 1972 },
	{ title: 'The Godfather: Part II', year: 1974 },
	{ title: 'The Dark Knight', year: 2008 },
	{ title: '12 Angry Men', year: 1957 },
	{ title: "Schindler's List", year: 1993 },
	{ title: 'Pulp Fiction', year: 1994 },
	{ title: 'The Lord of the Rings: The Return of the King', year: 2003 },
	{ title: 'The Good, the Bad and the Ugly', year: 1966 },
	{ title: 'Fight Club', year: 1999 },
	{ title: 'The Lord of the Rings: The Fellowship of the Ring', year: 2001 },
	{ title: 'Star Wars: Episode V - The Empire Strikes Back', year: 1980 },
	{ title: 'Forrest Gump', year: 1994 },
	{ title: 'Inception', year: 2010 },
	{ title: 'The Lord of the Rings: The Two Towers', year: 2002 },
	{ title: "One Flew Over the Cuckoo's Nest", year: 1975 },
	{ title: 'Goodfellas', year: 1990 },
	{ title: 'The Matrix', year: 1999 },
	{ title: 'Seven Samurai', year: 1954 },
	{ title: 'Star Wars: Episode IV - A New Hope', year: 1977 },
	{ title: 'City of God', year: 2002 },
	{ title: 'Se7en', year: 1995 },
	{ title: 'The Silence of the Lambs', year: 1991 },
	{ title: "It's a Wonderful Life", year: 1946 },
	{ title: 'Life Is Beautiful', year: 1997 },
	{ title: 'The Usual Suspects', year: 1995 },
	{ title: 'Léon: The Professional', year: 1994 },
	{ title: 'Spirited Away', year: 2001 },
	{ title: 'Saving Private Ryan', year: 1998 },
	{ title: 'Once Upon a Time in the West', year: 1968 },
	{ title: 'American History X', year: 1998 },
	{ title: 'Interstellar', year: 2014 },
	{ title: 'Casablanca', year: 1942 },
	{ title: 'City Lights', year: 1931 },
	{ title: 'Psycho', year: 1960 },
	{ title: 'The Green Mile', year: 1999 },
	{ title: 'The Intouchables', year: 2011 },
	{ title: 'Modern Times', year: 1936 },
	{ title: 'Raiders of the Lost Ark', year: 1981 },
	{ title: 'Rear Window', year: 1954 },
	{ title: 'The Pianist', year: 2002 },
	{ title: 'The Departed', year: 2006 },
	{ title: 'Terminator 2: Judgment Day', year: 1991 },
	{ title: 'Back to the Future', year: 1985 },
	{ title: 'Whiplash', year: 2014 },
	{ title: 'Gladiator', year: 2000 },
	{ title: 'Memento', year: 2000 },
	{ title: 'The Prestige', year: 2006 },
	{ title: 'The Lion King', year: 1994 },
	{ title: 'Apocalypse Now', year: 1979 },
	{ title: 'Alien', year: 1979 },
	{ title: 'Sunset Boulevard', year: 1950 },
	{ title: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb', year: 1964 },
	{ title: 'The Great Dictator', year: 1940 },
	{ title: 'Cinema Paradiso', year: 1988 },
	{ title: 'The Lives of Others', year: 2006 },
	{ title: 'Grave of the Fireflies', year: 1988 },
	{ title: 'Paths of Glory', year: 1957 },
	{ title: 'Django Unchained', year: 2012 },
	{ title: 'The Shining', year: 1980 },
	{ title: 'WALL·E', year: 2008 },
	{ title: 'American Beauty', year: 1999 },
	{ title: 'The Dark Knight Rises', year: 2012 },
	{ title: 'Princess Mononoke', year: 1997 },
	{ title: 'Aliens', year: 1986 },
	{ title: 'Oldboy', year: 2003 },
	{ title: 'Once Upon a Time in America', year: 1984 },
	{ title: 'Witness for the Prosecution', year: 1957 },
	{ title: 'Das Boot', year: 1981 },
	{ title: 'Citizen Kane', year: 1941 },
	{ title: 'North by Northwest', year: 1959 },
	{ title: 'Vertigo', year: 1958 },
	{ title: 'Star Wars: Episode VI - Return of the Jedi', year: 1983 },
	{ title: 'Reservoir Dogs', year: 1992 },
	{ title: 'Braveheart', year: 1995 },
	{ title: 'M', year: 1931 },
	{ title: 'Requiem for a Dream', year: 2000 },
	{ title: 'Amélie', year: 2001 },
	{ title: 'A Clockwork Orange', year: 1971 },
	{ title: 'Like Stars on Earth', year: 2007 },
	{ title: 'Taxi Driver', year: 1976 },
	{ title: 'Lawrence of Arabia', year: 1962 },
	{ title: 'Double Indemnity', year: 1944 },
	{ title: 'Eternal Sunshine of the Spotless Mind', year: 2004 },
	{ title: 'Amadeus', year: 1984 },
	{ title: 'To Kill a Mockingbird', year: 1962 },
	{ title: 'Toy Story 3', year: 2010 },
	{ title: 'Logan', year: 2017 },
	{ title: 'Full Metal Jacket', year: 1987 },
	{ title: 'Dangal', year: 2016 },
	{ title: 'The Sting', year: 1973 },
	{ title: '2001: A Space Odyssey', year: 1968 },
	{ title: "Singin' in the Rain", year: 1952 },
	{ title: 'Toy Story', year: 1995 },
	{ title: 'Bicycle Thieves', year: 1948 },
	{ title: 'The Kid', year: 1921 },
	{ title: 'Inglourious Basterds', year: 2009 },
	{ title: 'Snatch', year: 2000 },
	{ title: '3 Idiots', year: 2009 },
	{ title: 'Monty Python and the Holy Grail', year: 1975 },
];
class Blog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			scroll_mode: 'full-page',
			currentPage: 1,
          	todosPerPage: 4,
			currentCard: 0,
			position: 0,
			width: 0,
			cardStyle: {
			  	transform: 'translateX(0px)'
			},
			sort: 'Relevant',
			timeframe: 'All_Time',
			categorie: '',
			tags: '',
		};
		this.handleDelete = this.handleDelete.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleJSONTOHTMLIMAGE = this.handleJSONTOHTMLIMAGE.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
		this.handleClick = this.handleClick.bind(this);
        this.handleClickPage = this.handleClickPage.bind(this);
		this.setCard = this.setCard.bind(this);
        this._handleScroll = this._handleScroll.bind(this);
        this._handleMouseMove = this._handleMouseMove.bind(this);
        this._handleModal = this._handleModal.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleShowFilter = this.handleShowFilter.bind(this);
	}
	componentDidMount() {
        const { onLoad } = this.props;
		const self = this;
        this._handleScroll();
		this._handleMouseMove();
		this._handleModal();
        axios('http://localhost:8800/api/articles')
        .then(function (response) {
            // handle success
			onLoad(response.data);
			function runAfterElementExists(jquery_selector, callback){
                var checker = window.setInterval(function() {
                //if one or more elements have been yielded by jquery
                //using this selector
                if ($(jquery_selector).length) {
                    //stop checking for the existence of this element
                    clearInterval(checker);
                    //call the passed in function via the parameter above
                    callback();
                }}, 200); //I usually check 5 times per second
            }
            //this is an example place in your code where you would like to
            //start checking whether the target element exists
            //I have used a class below, but you can use any jQuery selector
            runAfterElementExists(".second_section_blog .article_card", function() {
                let boxWidth = document.getElementById("article_card").clientWidth;
    			self.setState({ width: boxWidth });
			});
			$('.fixedHeaderContainer').addClass('blog_header');
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
		});
	}
	handleDelete(id) {
		const { onDelete } = this.props;
		return axios.delete(`/api/articles/${id}`)
			.then(() => onDelete(id));
	}
	handleEdit(article) {
		const { setEdit } = this.props;
		setEdit(article);
	}
    _handleMouseMove() {
		function Parallax(options){
			options = options || {};
			this.nameSpaces = {
				wrapper: options.wrapper || '.first_section_blog',
				layers: options.layers || '.parallax-layer',
				deep: options.deep || 'data-parallax-deep'
			};
			this.init = function() {
				var self = this,
					parallaxWrappers = document.querySelectorAll(this.nameSpaces.wrapper);
				  for(var i = 0; i < parallaxWrappers.length; i++){
					(function(i){
						parallaxWrappers[i].addEventListener('mousemove', function(e){
							var x = e.clientX,
								y = e.clientY,
								layers = parallaxWrappers[i].querySelectorAll(self.nameSpaces.layers);
							for(var j = 0; j < layers.length; j++){
					(function(j){
					  var deep = layers[j].getAttribute(self.nameSpaces.deep),
						  disallow = layers[j].getAttribute('data-parallax-disallow'),
						  direction = layers[j].getAttribute('data-parallax-direction'),
						  itemX = (disallow && disallow === 'x') ? 0 : x / deep,
						  itemY = (disallow && disallow === 'y') ? 0 : y / deep;
						  itemX = (direction && direction === 'minus') ? -itemX : itemX;
						  itemY = (direction && direction === 'plus') ? -itemY : itemY;
						  if(disallow && disallow === 'both') return;
						  layers[j].style.transform = 'translateX(' + itemX + '%) translateY(' + itemY + '%)';
					})(j);  
							}
						})
					})(i);
				  }
			};
			this.init();
			return this;
		}
		
		window.addEventListener('load', function(){
			new Parallax();
		});
		
		//socials
		let items = document.querySelectorAll(".socials-item-icon"),
			self = this;
		items.forEach((item, index) => {
			item.addEventListener("mousemove", mouseMove);
			item.addEventListener("mouseleave", mouseLeave);
		});
		
		function mouseMove(e) {
			let target = e.target.closest("a"),
				targetData = target.getBoundingClientRect(),
				targetIcon = target.querySelector("i"),
				offset = {
					x: ((e.pageX - (targetData.left + targetData.width / 2)) / 4) * -1,
					y: ((e.pageY - (targetData.top + targetData.height / 2)) / 4) * -1
				};
			target.style.transform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
			target.style.webkitTransform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
			document.querySelectorAll(".socials-item-icon").forEach((e) => {
			if (e !== target) {
				e.style.transform = "translate(" + offset.x / 2 + "px, " + offset.y / 2 + "px) scale(" + 0.9 + ")";
				e.style.webkitTransform = "translate(" + offset.x / 2 + "px, " + offset.y / 2 + "px) scale(" + 0.9 + ")";
			}
		  });
		  targetIcon.style.transform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
		  targetIcon.style.webkitTransform = "translate(" + offset.x + "px," + offset.y + "px) scale(" + 1.1 + ")";
		}
		
		function mouseLeave(e) {
			document.querySelectorAll(".socials-item-icon").forEach((target) => {
				let targetIcon = target.querySelector("i");
				target.style.transform = "translate(0px,0px) scale(1)";
				target.style.webkitTransform = "translate(0px,0px) scale(1)";
				targetIcon.style.transform = "translate(0px,0px) scale(1)";
				targetIcon.style.webkitTransform = "translate(0px,0px) scale(1)";
			});
		}
    }
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
	handleJSONTOHTMLIMAGE(inputDelta, index) {
		function runAfterElementExists(jquery_selector, callback){
			var checker = window.setInterval(function() {
			if (jquery_selector) {
				clearInterval(checker);
				callback();
			}}, 200);
		}
		runAfterElementExists(inputDelta, function() {
			const html = $.parseHTML(inputDelta);
			$('.card_'+index+' figure').html($(html).find('img').first());
		});
	}
	handleClick(type) {
		const { articles } = this.props;
		// get the card's margin-right
		let margin = window.getComputedStyle(document.getElementById("article_card")).marginRight;
		margin = JSON.parse(margin.replace(/px/i, '')); 
	
		const cardWidth = this.state.width; // the card's width
		const cardMargin = margin; // the card's margin
		const cardNumber = articles.length; // the number of cards
		let currentCard = this.state.currentCard; // the index of the current card
		let position = this.state.position; // the position of the cards
	
		// slide cards
		if(type === 'next' && currentCard < cardNumber-3) {
			currentCard++;
			position -= (cardWidth+cardMargin);
		} else if(type === 'prev' && currentCard > 0) {
			currentCard--;
			position += (cardWidth+cardMargin);
		}
		this.setCard(currentCard, position);
	}
	handleClickPage(event) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#second_section_blog").offset().top
		}, 500);
        this.setState({
          	currentPage: Number(event.target.id)
        });
	}
	handleShowFilter(event) {
		var wrapper = $('.modal-top-filter'),
			buttonF = $('#myModal .filter');
		if ( ! wrapper.hasClass('expand') ){
			wrapper.addClass('expand', 500);
			buttonF.addClass('expand', 500);
		} else {
			wrapper.removeClass('expand', 500);
			buttonF.removeClass('expand', 500);
		}
	}
	setCard(currentCard, position) {
		this.setState({
			currentCard: currentCard,
			position: position,
			cardStyle: {
				transform: `translateX(${position}px)`
			}
		})
	}
    _handleScroll(){
        $(window).scroll(function() {
			if ($(this).scrollTop() < 625 || $(document).height() - $(window).height() - $(window).scrollTop() < 100){
                $('.fixedHeaderContainer').addClass('blog_header');
            }
            else{
                $('.fixedHeaderContainer').removeClass('blog_header');
            }
        });
	}
	_handleModal() {
		const self = this;
		var Boxlayout = function() {
			var wrapper = document.getElementById('second_section_blog'),
				element = $('#modal_trigger'),
				modal = $('#myModal'),
				closeButton = $('.modal-close'),
				expandedClass = 'is-expanded',
				hasExpandedClass = 'has-expanded-item';
		  
			return { init : init };
			function init() {
			  	_initEvents();
			}
			function _initEvents() {
				element.click(function() {
					if ( ! modal.hasClass(expandedClass) ) {
						modal.addClass(expandedClass, 500);
						wrapper.classList.add(hasExpandedClass);
						document.getElementById('second_section_blog').parentElement.style.height = 'initial';
						self.setState({
							scroll_mode: 'normal'
						});
					}
				});
				closeButton.click(function(event) {
					if ( modal.hasClass(expandedClass) ) {
						modal.removeClass(expandedClass);
						wrapper.classList.remove(hasExpandedClass);
						document.getElementById('second_section_blog').parentElement.style.height = '100%';
						self.setState({
							scroll_mode: 'full-page'
						});
					}
				});
			}
		}();
		Boxlayout.init();
	}
    handleChangeField(key, event) {
        this.setState({
            [key]: event.target.value,
        });
    }
	render() {
		const { articles, match } = this.props;
		const { scroll_mode, cardStyle, currentPage, todosPerPage, sort, timeframe, categorie, tags } = this.state;
		
		return (
			<FullPage scrollMode={scroll_mode}>
				<Slide>
					<section className="active first_section_blog">
						<span className="parallax-layer parallax-layer__1 l_name" data-parallax-direction="plus" data-parallax-deep="1000">Boutaleb<span className="outlined">Boutaleb</span>BoutalebBoutaleb</span>
						<span className="parallax-layer parallax-layer__2 f_name" data-parallax-direction="minus" data-parallax-deep="1000">Zakariae<span className="outlined">Zakariae</span>ZakariaeZakariae</span>
						<div className="wrapper left_part">
							<div className="caption">
								<p><b>The teacher</b></p>
								<p>My father was an educator, My grandfather was an educator, i was born to educate, and my sons will also educate.</p>
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
						<div className="wrapper right_part">
							<div className="caption">
								<p><b>The Coder</b></p>
								<p>Grew up next to a computer, learned to create at a young age, i was born to create to look from all sides and discover hidden meanings.</p>
							</div>
						</div>
					</section>
				</Slide>
				<Slide>
					<section id="second_section_blog" className="second_section_blog">
						{/* Modal */}
						<div className="modal myModal fade" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
							<div id="modal_dialog" className="modal-dialog" role="document">
								<div className="modal-content">
									<div className="modal-body">
										<div className="modal-top">
											<h5 className="modal-title" id="exampleModalLabel">
												Showing
												<strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
												to
												<strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(articles, ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(articles, ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(articles, ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(articles, ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : articles), function(o) { 
													if(timeframe === 'Today') 
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
													if(timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if(timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if(timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if(timeframe === 'All_Time')
														return true;
													}), (op) => {
														if(!categorie)
															return true;
														else 
															return op.categorie === categorie;
													})))}</strong>
												of
												<strong>{_.toNumber(_.size(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(articles, ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(articles, ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(articles, ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(articles, ['createdAt'], ['desc']) : articles), function(o) { 
													if(timeframe === 'Today') 
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
													if(timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if(timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if(timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if(timeframe === 'All_Time')
														return true;
													}), (op) => {
														if(!categorie)
															return true;
														else 
															return op.categorie === categorie;
													})))}
												</strong> 
												articles.
											</h5>
											<div>
												<span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
												<a title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
											</div>
										</div>
										<div className="modal-top-filter">
											<div className="input-field col s3">
												<select 
													value={sort}
													onChange={(ev) => this.handleChangeField('sort', ev)}
													className="form-group-input sort" 
													id="sort" 
													name="sort"
												>
													<option value="Trending">Trending</option>
													<option value="Relevant">Relevant</option>
													<option value="Most_Liked">Most Liked</option>
													<option value="Recent">Recent</option>
												</select>
												<label htmlFor='sort' className={sort ? 'active' : ''}>sort</label>
												<div className="form-group-line"></div>
											</div>
											<div className="input-field col s3">
												<select 
													value={timeframe}
													onChange={(ev) => this.handleChangeField('timeframe', ev)}
													className="form-group-input timeframe" 
													id="timeframe" 
													name="timeframe"
												>
													<option value="Today">Today</option>
													<option value="This_Past_Week">This Past Week</option>
													<option value="This_Past_Month">This Past Month</option>
													<option value="This_Past_Year">This Past Year</option>
													<option value="All_Time">All Time</option>
												</select>
												<label htmlFor='timeframe' className={timeframe ? 'active' : ''}>timeframe</label>
												<div className="form-group-line"></div>
											</div>
											<div className="input-field col s3">
												<select 
													value={categorie}
													onChange={(ev) => this.handleChangeField('categorie', ev)}
													className="form-group-input categorie" 
													id="categorie" 
													name="categorie"
												>
													<option value=''></option>
													<option value="Education">Education</option>
													<option value="Design">Design</option>
													<option value="Personnel">Community</option>
													<option value="Tutorials">Tutorials</option>
												</select>
												<label htmlFor='categorie' className={categorie ? 'active' : ''}>categorie</label>
												<div className="form-group-line"></div>
											</div>
											<div className="input-field col s3">
												{/* <input 
													className="form-group-input tags" 
													id="tags"
													type="text"
													name="tags"
													value={tags}
													onChange={(ev) => this.handleChangeField('tags', ev)}
												/>
												<label htmlFor='tags'>tags</label>
												<div className="form-group-line"></div> */}
												<Autocomplete
													id="combo-box-demo"
													options={top100Films}
													getOptionLabel={(option) => option.title}
													style={{ width: 300 }}
													renderInput={(params) => <TextField {...params} label="Combo box" variant="outlined" />}
												/>
											</div>
										</div>
										<ul id="page">
											{
												_.filter(_.filter((sort === 'Relevant' ? _.orderBy(articles, ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(articles, ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(articles, ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(articles, ['createdAt'], ['desc']) : articles), function(o) { 
													if(timeframe === 'Today')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'd');
													if(timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if(timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if(timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if(timeframe === 'All_Time')
														return true;
													}), (op) => {
														if(!categorie)
															return true;
														else 
															return op.categorie === categorie;
													}).map((article, index) => {
													return (
														<li className="article_card article_anchor" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="article_card" style={cardStyle} key={index}>
															<div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
																<div className="card-body">
																	<figure>{this.handleJSONTOHTMLIMAGE(article.body, index)}</figure>
																	<div className="text">
																		<p className="categorie">{article.categorie}</p>
																		<h4>{article.title}</h4>
																		<ul className="text-muted tags">
																			{
																				article.tag.map((t, i) => {
																					return (
																						<li className="tag_item">{t}</li>
																					)
																				})
																			}
																		</ul>
																		<Link to={`${match.url}/${article._id}`}>
																			<div className="readmore">
																				<button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
																					<div className="line line-1"></div>
																					<div className="line line-2"></div>
																				</button>
																			</div>
																		</Link>
																		<br/>
																		<div className="comments_up_down">
																			<p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
																			<p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
																			<p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
																			<p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
																		</div>
																		<p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
																	</div>
																</div>
															</div>
														</li>
													)
											  	})
											}
										</ul>
										<ul id="page-numbers">
											{
												([...Array(Math.ceil(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(articles, ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(articles, ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(articles, ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(articles, ['createdAt'], ['desc']) : articles), function(o) { 
													if(timeframe === 'Today') 
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'day');
													if(timeframe === 'This_Past_Week')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'week');
													if(timeframe === 'This_Past_Month')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'month');
													if(timeframe === 'This_Past_Year')
														return moment(new Date(o.createdAt)).isSame(moment(new Date()), 'year');
													if(timeframe === 'All_Time')
														return true;
													}), (op) => {
														if(!categorie)
															return true;
														else 
															return op.categorie === categorie;
													}).length / todosPerPage)).keys()]).map(number => {
													return (
														<li
															key={number+1}
															id={number+1}
															onClick={this.handleClickPage}
															className={currentPage === number+1 ? 'current' : ''}
															>
																<p className="shadow_page">.{this._FormatNumberLength(number+1,2)}</p>
														</li>
													);
												})
											}
										</ul>
									</div>
								</div>
							</div>
						</div>
						{/* Modal */}
						<div className="wrapper_full">
							<div className="caption">
								<p>Trending Now.</p>
								<button id='modal_trigger' type="button">
									<div className="button_border"></div>
									<span>
										<span>
											<span data-attr-span="View All.">
												View All.
											</span>
										</span>
									</span>
								</button>
							</div>
							<div className="cards-slider">
								<div className="slider-btns">
									<button className="slider-btn btn-l" onClick={() => this.handleClick('prev')}><i className="fas fa-long-arrow-alt-left"></i></button>
									<button className="slider-btn btn-r" onClick={() => this.handleClick('next')}><i className="fas fa-long-arrow-alt-right"></i></button>
								</div>
								<div className="data-container">
									{
										_.orderBy(articles, ['view'], ['desc']).map((article, index) => {
											return (
												<div className="article_card article_anchor" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="article_card" style={cardStyle} key={index}>
													<div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
														<div className="shadow_title">{_.head(_.words(article.title))}</div>
														<div className="shadow_letter">{_.head(_.head(_.words(article.title)))}</div>
														<div className="card-body">
															<h2>{article.title}</h2>
															<p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
															<p className="categorie">{article.categorie}</p>
															<ul className="text-muted tags">
																{
																	article.tag.map((t, i) => {
																		return (
																			<li className="tag_item">{t}</li>
																		)
																	})
																}
															</ul>
															<Link to={`${match.url}/${article._id}`}>
																<div className="readmore">
																	<button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
																		<div className="line line-1"></div>
																		<div className="line line-2"></div>
																	</button>
																</div>
															</Link>
															<br/>
															<div className="comments_up_down">
																<p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
																<p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
																<p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
																<p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
															</div>
														</div>
													</div>
													<div className="card_shadower"></div>
												</div>
											)
										})
									}
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

const mapStateToProps = state => ({
  	articles: state.home.articles,
});

const mapDispatchToProps = dispatch => ({
	onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
	onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
	setEdit: article => dispatch({ type: 'SET_EDIT', article }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Blog);