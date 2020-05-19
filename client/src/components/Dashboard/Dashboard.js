import React from "react";
import axios from 'axios';
import Swiper from 'swiper';
import moment from 'moment';
import { Form } from '../Article';
import { FormProject } from '../Project';
import Calendar from './Calendar';
import Account from './Account';
import Autocomplete from 'react-autocomplete';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import API from "../../utils/API";
import { FullPage, Slide } from 'react-full-page';
import Clock from 'react-live-clock';
import 'whatwg-fetch';
import * as $ from "jquery";
import jQuery from 'jquery';
import 'bootstrap';

var _ = require('lodash');

//user has role normal so wut now
class Dashboard extends React.Component {
  	constructor(props) {
        super(props);
        
		this.state = {
            _user: {},
            _users: [],
            _user_toEdit_username: '',
            _user_toEdit_roles: '',
            currentPage: 1,
          	todosPerPage: 6,
			currentCard: 0,
			position: 0,
			width: 0,
            tags: '',
            title: '',
            title_projects: '',
			sort: 'Relevant',
			timeframe: 'All_Time',
            categorie: '',
            _article: {},
            _project: {},
            _testimony: {},
            modal_msg: '',
        };

		this.disconnect = this.disconnect.bind(this);
		this.get_users = this.get_users.bind(this);
		this.get_user = this.get_user.bind(this);
		this.send_user = this.send_user.bind(this);
        this._handleDrag = this._handleDrag.bind(this);
		this.handleJSONTOHTML = this.handleJSONTOHTML.bind(this);
		this.handleJSONTOHTMLIMAGE = this.handleJSONTOHTMLIMAGE.bind(this);
		this._FormatNumberLength = this._FormatNumberLength.bind(this);
        this.handleClickPage = this.handleClickPage.bind(this);
        this._handleModal = this._handleModal.bind(this);
        this._handleTimeFit = this._handleTimeFit.bind(this);
        this.handleShowFilter = this.handleShowFilter.bind(this);
        
		this.handleAddArticle = this.handleAddArticle.bind(this);
		this.handleEditArticle = this.handleEditArticle.bind(this);
        this.handleDeleteArticle = this.handleDeleteArticle.bind(this);
        
		this.handleAddProject = this.handleAddProject.bind(this);
		this.handleEditProject = this.handleEditProject.bind(this);
        this.handleDeleteProject = this.handleDeleteProject.bind(this);
        
		this.handleEditTestimony = this.handleEditTestimony.bind(this);
        this.handleDeleteTestimony = this.handleDeleteTestimony.bind(this);
        
		this.handleEditUser = this.handleEditUser.bind(this);
        this.handleDeleteUser = this.handleDeleteUser.bind(this);
        
		this.handleChange = this.handleChange.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleChangeFieldUser = this.handleChangeFieldUser.bind(this);
	}
	componentDidMount() {
		const { onLoad, onLoadProject, onLoadTestimony } = this.props;
		let self = this;

        document.getElementById('first_section_dashboard').parentElement.style.height = 'initial';
        document.getElementById('first_section_dashboard').parentElement.style.minHeight = '100%';

		axios('/api/articles')
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
            runAfterElementExists(".first_section_dashboard .articles_slider_wrapper_cards_item", function() {
				self._handleDrag('articles_slider_wrapper');
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

        axios('/api/projects')
        .then(function (response) {
            // handle success
            onLoadProject(response.data);
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
            runAfterElementExists(".first_section_dashboard .projects_slider_wrapper_cards_item", function() {
				self._handleDrag('projects_slider_wrapper');
			});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
        
        axios('/api/testimonies')
        .then(function (response) {
            // handle success
            onLoadTestimony(response.data);
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
            runAfterElementExists(".first_section_dashboard .testimonies_slider_wrapper_cards_item", function() {
				self._handleDrag('testimonies_slider_wrapper');
			});
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        .then(function () {
            // always executed
        });
		
		//to get the user object
        this.get_user();

		//when hovered on the nav
		$('.nav').hover(
			function() {
			  	$('.wrapper_full .after').css(
					'left', '35%'
				);
			}, function() {
				$('.wrapper_full .after').css(
				  	'left', '5rem'
			  	);
			}
		);

		//control the tabs
		$('.tab-pane').addClass('animated');
        $('.tab-pane').addClass('faster');
        $('.nav_link').click((event) => {

            let _li_parent = $(event.target).parent().parent();
            let _li_target = $($(event.target).attr('href'));
            let _link_target = $(event.target);

            $('.tab-pane').not(_li_target).addClass('fadeOutRight');
            $('.tab-pane').not(_li_target).removeClass('fadeInLeft');
            $(".nav li").not(_li_parent).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('active');
            $('.tab-pane').not(_li_target).removeClass('show');
            $(".nav_link").not(_link_target).removeClass('active');
            $('.nav_link').not(_link_target).removeClass('show');

            $(_li_target).removeClass('fadeOutRight');
            $(_li_target).addClass('fadeInLeft');
            $(_li_parent).addClass('active');
            $(_li_target).addClass('active');
            $(_li_target).addClass('show');
            $(_link_target).addClass('active');
            $(_link_target).addClass('show');

        });
        
		this._handleModal('_article_modal_trigger', '_all_article_modal_view');
		this._handleModal('_project_modal_trigger', '_all_project_modal_view');
        this._handleModal('_testimony_modal_trigger', '_all_testimony_modal_view');

        this._handleTimeFit();
	}
    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.userToEdit) {
            this.setState({
                _user_toEdit_username: nextProps.userToEdit.username,
                _user_toEdit_roles: nextProps.userToEdit.roles,
            });
        }
    }
	disconnect() {
		API.logout();
		window.location = "/login";
    }
    async get_users() {
        const self = this;
        const { _user } = this.state;
        if(_.includes(_user.roles, 'admin')) {
            await API.get_users()
            .then((res) => {
                self.setState({
                    _users: res.data.users,
                });
            })
            .catch((err) => {
                console.error(err);
            });
        } else {
            self.setState(prevState => ({
                _users: [...prevState._users, _user]
            }));
        }
    }
	async get_user() {
        const self = this;
        await API.get_user(localStorage.getItem('email'))
            .then((res) => {
                self.setState({
                    _user: res.data.user,
                }, () => {
                    self.get_users();
                });
            })
            .catch((err) => {
                console.error(err);
            });
    }
    async send_user() {
        let self = this;
        const { _user_toEdit_username, _user_toEdit_roles } = this.state;
        
        try {
            await API.update_roles({ _user_toEdit_username, _user_toEdit_roles })
            .then((res) => {
                self.setState({
                    modal_msg: res.data.text
                }, () => {
                    self.get_users();
                    $('#edit_modal').modal('toggle');
                })
            })
            .catch((error) => {
                self.setState({
					modal_msg: error.response.data.text
				}, () => {
					$('#edit_modal_error_roles').modal('toggle');
				});
            });
        } catch (error) {
            self.setState({
				modal_msg: JSON.stringify(error)
			}, () => {
				$('#edit_modal_error_roles').modal('toggle');
			});
        }
    }
    handleEditUser(user) {
        const { setEditUser } = this.props;
        setEditUser(user);
    }
    handleDeleteUser(_id) {

    }
	_handleDrag(source) {
        if(source !== 'testimonies_slider_wrapper')
            var mySwiper = new Swiper ('.'+source+'.swiper-container', {
                // Optional parameters
                effect: 'coverflow',
                direction: 'horizontal',
                grabCursor: true,
                slidesPerView: 1.25,
                centeredSlides: false,
                centeredSlidesBounds: false,
                paginationClickable: true,
                centerInsufficientSlides: false,
                spaceBetween: 0,
                autoResize: false,
                observer: true,
                watchOverflow: true,
                variableWidth : true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 0,
                    modifier: 3,
                    slideShadows: false
                },
                simulateTouch: true,
                // If we need pagination
                pagination: {
                    el: '.'+source+' .swiper-pagination',
                    dynamicBullets: true,
                }
            });
        else
            var mySwiperTestimonies = new Swiper ('.'+source+'.swiper-container', {
                // Optional parameters
                effect: 'coverflow',
                direction: 'vertical',
                loop: false,
                slideToClickedSlide: true,
                slidesPerView: 2.5,
                grabCursor: true,
                centeredSlides: false,
                paginationClickable: true,
                centerInsufficientSlides: true,
                spaceBetween: 0,
                autoResize: false,
                observer: true,
                watchOverflow: true,
                freeMode:false,
                freeModeSticky:true,
                coverflowEffect: {
                    rotate: 0,
                    stretch: 0,
                    depth: 0,
                    modifier: 3,
                    slideShadows: false
                },
                simulateTouch: true,
                // If we need pagination
                pagination: {
                    el: '.'+source+' .swiper-pagination',
                    dynamicBullets: true,
                },
                scrollbar: '.'+source+' .swiper-scrollbar',
            });
    }
    handleAddArticle() {
        const { setEdit } = this.props;
        setEdit();
    }
    handleEditArticle(article) {
        const { setEdit } = this.props;
        setEdit(article);
    }
    handleDeleteArticle(_id) {
        const { onDelete } = this.props;
		return axios.delete(`/api/articles/${_id}`)
			.then(() => onDelete(_id));
    }
    handleAddProject() {
        const { setEditProject } = this.props;
        setEditProject();
    }
    handleEditProject(project) {
        const { setEditProject } = this.props;
        setEditProject(project);
    }
    handleDeleteProject(_id) {
        const { onDeleteProject } = this.props;
		return axios.delete(`/api/projects/${_id}`)
			.then(() => onDeleteProject(_id));
    }
    handleEditTestimony(testimony) {
        const { setEditTestimony } = this.props;
        setEditTestimony(testimony);
    }
    handleDeleteTestimony(_id) {
        const { onDeleteTestimony } = this.props;
		return axios.delete(`/api/testimonies/${_id}`)
			.then(() => onDeleteTestimony(_id));
    }
	handleChange(event) {
		this.setState({
			[event.target.id]: event.target.value
		});
    }
    handleJSONTOHTML(inputDelta) {
		function runAfterElementExists(jquery_selector, callback){
			var checker = window.setInterval(function() {
			if (jquery_selector) {
				clearInterval(checker);
				callback();
			}}, 200);
		}
		runAfterElementExists(inputDelta, function() {
			const html = $.parseHTML(inputDelta);
			$('h6.body_article').html(html);
		});
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
	_FormatNumberLength(num, length) {
		var r = "" + num;
		while (r.length < length) {
			r = "0" + r;
		}
		return r;
	}
	handleClickPage(event) {
		$([document.documentElement, document.body]).animate({
			scrollTop: $("#_all_article_modal_view").offset().top
		}, 500);
        this.setState({
          	currentPage: Number(event.target.id)
        });
	}
	handleShowFilter(event) {
		var wrapper = $('.modal-top-filter'),
			buttonF = $('#_all_article_modal_view .filter');
		if ( ! wrapper.hasClass('expand') ){
			wrapper.addClass('expand', 500);
			buttonF.addClass('expand', 500);
		} else {
			wrapper.removeClass('expand', 500);
			buttonF.removeClass('expand', 500);
		}
	}
    handleChangeField(key, event) {
        this.setState({ [key]: event.target.value });
    }
    handleChangeFieldUser(key, event) {
        this.setState({
            [key]: event.target.value,
        });
    }
	_handleModal(trigger, modal_target) {
		const self = this;
		var Boxlayout = function() {
			var wrapper = document.getElementById('first_section_dashboard'),
				element = $('#'+trigger),
				modal = $('#'+modal_target),
				closeButton = $('#'+modal_target+' .modal-close'),
				expandedClass = 'is-expanded',
				hasExpandedClass = 'has-expanded-item';
		  
			return { init : init };
			function init() {
			  	_initEvents();
			}
			function _initEvents() {
				element.click(function() {
					if ( !modal.hasClass(expandedClass) ) {
						modal.addClass(expandedClass, 500);
						wrapper.classList.add(hasExpandedClass);
						//to edit the focus of the tags input in filter modal, because the label is not directly after it, it's after the autocomplete object
						$('.modal-top-filter input.tags').focus(() => {
							$('.modal-top-filter label#tags_label').toggleClass('active');
						});
						$('.modal-top-filter input.tags').blur(() => {
							if(!self.state.tags)
								$('.modal-top-filter label#tags_label').toggleClass('active');
						});
					}
				});
				closeButton.click(function(event) {
					if ( modal.hasClass(expandedClass) ) {
						modal.removeClass(expandedClass);
                        wrapper.classList.remove(hasExpandedClass);
                        self.setState({
                            currentPage: 1,
                            todosPerPage: 6,
                            currentCard: 0,
                            position: 0,
                            width: 0,
                            tags: '',
                            sort: 'Relevant',
                            timeframe: 'All_Time',
                            categorie: '',
                        })
					}
				});
			}
		}();
		Boxlayout.init();
    }
    _handleTimeFit() {
        (function(window, $) {
            "use strict";
            var counter = 0,
              $headCache = $('head'),
              oldBigText = window.BigText,
              oldjQueryMethod = $.fn.bigtext,
              BigText = {
                DEBUG_MODE: false,
                DEFAULT_MIN_FONT_SIZE_PX: null,
                DEFAULT_MAX_FONT_SIZE_PX: 528,
                GLOBAL_STYLE_ID: 'bigtext-style',
                STYLE_ID: 'bigtext-id',
                LINE_CLASS_PREFIX: 'bigtext-line',
                EXEMPT_CLASS: 'bigtext-exempt',
                noConflict: function(restore)
                {
                  if(restore) {
                    $.fn.bigtext = oldjQueryMethod;
                    window.BigText = oldBigText;
                  }
                  return BigText;
                },
                supports: {
                  wholeNumberFontSizeOnly: (function() {
                    if( !( 'getComputedStyle' in window ) ) {
                      return true;
                    }
                    var test = $('<div/>').css({
                        position: 'absolute',
                        'font-size': '14.1px'
                      }).insertBefore( $('script').eq(0) ),
                      computedStyle = window.getComputedStyle( test[0], null );
          
                    var ret = computedStyle && computedStyle.getPropertyValue( 'font-size' ) === '14px';
                    test.remove();
                    return ret;
                  })()
                },
                init: function() {
                  if(!$('#'+BigText.GLOBAL_STYLE_ID).length) {
                    $headCache.append(BigText.generateStyleTag(BigText.GLOBAL_STYLE_ID, ['.bigtext * { white-space: nowrap; } .bigtext > * { display: block; }',
                                                    '.bigtext .' + BigText.EXEMPT_CLASS + ', .bigtext .' + BigText.EXEMPT_CLASS + ' * { white-space: normal; }']));
                  }
                },
                bindResize: function(eventName, resizeFunction) {
                  var timeoutId;
                  $(window).unbind(eventName).bind(eventName, function() {
                    if( timeoutId ) {
                      clearTimeout( timeoutId );
                    }
                    timeoutId = setTimeout( resizeFunction, 100 );
                  });
                },
                getStyleId: function(id)
                {
                  return BigText.STYLE_ID + '-' + id;
                },
                generateStyleTag: function(id, css)
                {
                  return $('<style>' + css.join('\n') + '</style>').attr('id', id);
                },
                clearCss: function(id)
                {
                  var styleId = BigText.getStyleId(id);
                  $('#' + styleId).remove();
                },
                generateCss: function(id, linesFontSizes, lineWordSpacings, minFontSizes)
                {
                  var css = [];
          
                  BigText.clearCss(id);
          
                  for(var j=0, k=linesFontSizes.length; j<k; j++) {
                    css.push('#' + id + ' .' + BigText.LINE_CLASS_PREFIX + j + ' {' +
                      (minFontSizes[j] ? ' white-space: normal;' : '') +
                      (linesFontSizes[j] ? ' font-size: ' + linesFontSizes[j] + 'px;' : '') +
                      (lineWordSpacings[j] ? ' word-spacing: ' + lineWordSpacings[j] + 'px;' : '') +
                      '}');
                  }
          
                  return BigText.generateStyleTag(BigText.getStyleId(id), css);
                },
                jQueryMethod: function(options)
                {
                  BigText.init();
          
                  options = $.extend({
                    minfontsize: BigText.DEFAULT_MIN_FONT_SIZE_PX,
                    maxfontsize: BigText.DEFAULT_MAX_FONT_SIZE_PX,
                    childSelector: '',
                    resize: true
                  }, options || {});
          
                  this.each(function()
                  {
                    var $t = $(this).addClass('bigtext'),
                      maxWidth = $t.width(),
                      id = $t.attr('id'),
                      $children = options.childSelector ? $t.find( options.childSelector ) : $t.children();
          
                    if(!id) {
                      id = 'bigtext-id' + (counter++);
                      $t.attr('id', id);
                    }
          
                    if(options.resize) {
                      BigText.bindResize('resize.bigtext-event-' + id, function()
                      {
                        // TODO only call this if the width has changed.
                        BigText.jQueryMethod.call($('#' + id), options);
                      });
                    }
          
                    BigText.clearCss(id);
          
                    $children.addClass(function(lineNumber, className)
                    {
                      // remove existing line classes.
                      return [className.replace(new RegExp('\\b' + BigText.LINE_CLASS_PREFIX + '\\d+\\b'), ''),
                          BigText.LINE_CLASS_PREFIX + lineNumber].join(' ');
                    });
          
                    var sizes = BigText.calculateSizes($t, $children, maxWidth, options.maxfontsize, options.minfontsize);
                    $headCache.append(BigText.generateCss(id, sizes.fontSizes, sizes.wordSpacings, sizes.minFontSizes));
                  });
          
                  return this.trigger('bigtext:complete');
                },
                testLineDimensions: function($line, maxWidth, property, size, interval, units, previousWidth)
                {
                  var width;
                  previousWidth = typeof previousWidth === 'number' ? previousWidth : 0;
                  $line.css(property, size + units);
          
                  width = $line.width();
          
                  if(width >= maxWidth) {
              // console.log(width, ' previous: ' + previousWidth, property + ' at ' + interval, 'prior: ' + (parseFloat(size) - interval), 'new:' + parseFloat(size));
                    $line.css(property, '');
          
                    if(width === maxWidth) {
                      return {
                        match: 'exact',
                        size: parseFloat((parseFloat(size) - 0.1).toFixed(3))
                      };
                    }
          
                    // Since this is an estimate, we calculate how far over the width we went with the new value.
                    // If this is word-spacing (our last resort guess) and the over is less than the under, we keep the higher value.
                    // Otherwise, we revert to the underestimate.
                    var under = maxWidth - previousWidth,
                      over = width - maxWidth;
          
                    return {
                      match: 'estimate',
                      size: parseFloat((parseFloat(size) - (property === 'word-spacing' && previousWidth && ( over < under ) ? 0 : interval)).toFixed(3))
                    };
                  }
          
                  return width;
                },
                calculateSizes: function($t, $children, maxWidth, maxFontSize, minFontSize)
                {
                  var $c = $t.clone(true)
                    .addClass('bigtext-cloned')
                    .css({
                      fontFamily: $t.css('font-family'),
                      textTransform: $t.css('text-transform'),
                      wordSpacing: $t.css('word-spacing'),
                      letterSpacing: $t.css('letter-spacing'),
                      position: 'absolute',
                      left: BigText.DEBUG_MODE ? 0 : -9999,
                      top: BigText.DEBUG_MODE ? 0 : -9999
                    })
                    .appendTo(document.body);
          
                  // font-size isn't the only thing we can modify, we can also mess with:
                  // word-spacing and letter-spacing. WebKit does not respect subpixel
                  // letter-spacing, word-spacing, or font-size.
                  // TODO try -webkit-transform: scale() as a workaround.
                  var fontSizes = [],
                    wordSpacings = [],
                    minFontSizes = [],
                    ratios = [];
          
                  $children.css('float', 'left').each(function() {
                    var $line = $(this),
                      // TODO replace 8, 4 with a proportional size to the calculated font-size.
                      intervals = BigText.supports.wholeNumberFontSizeOnly ? [8, 4, 1] : [8, 4, 1, 0.1],
                      lineMax,
                      newFontSize;
          
                    if($line.hasClass(BigText.EXEMPT_CLASS)) {
                      fontSizes.push(null);
                      ratios.push(null);
                      minFontSizes.push(false);
                      return;
                    }
          
                    // TODO we can cache this ratio?
                    var autoGuessSubtraction = 32, // font size in px
                      currentFontSize = parseFloat($line.css('font-size')),
                      ratio = ( $line.width() / currentFontSize ).toFixed(6);
          
                    newFontSize = parseInt( maxWidth / ratio, 10 ) - autoGuessSubtraction;
          
                    outer: for(var m=0, n=intervals.length; m<n; m++) {
                      inner: for(var j=1, k=10; j<=k; j++) {
                        if(newFontSize + j*intervals[m] > maxFontSize) {
                          newFontSize = maxFontSize;
                          break outer;
                        }
          
                        lineMax = BigText.testLineDimensions($line, maxWidth, 'font-size', newFontSize + j*intervals[m], intervals[m], 'px', lineMax);
                        if(typeof lineMax !== 'number') {
                          newFontSize = lineMax.size;
          
                          if(lineMax.match === 'exact') {
                            break outer;
                          }
                          break inner;
                        }
                      }
                    }
          
                    ratios.push(maxWidth / newFontSize);
          
                    if(newFontSize > maxFontSize) {
                      fontSizes.push(maxFontSize);
                      minFontSizes.push(false);
                    } else if(!!minFontSize && newFontSize < minFontSize) {
                      fontSizes.push(minFontSize);
                      minFontSizes.push(true);
                    } else {
                      fontSizes.push(newFontSize);
                      minFontSizes.push(false);
                    }
                  }).each(function(lineNumber) {
                    var $line = $(this),
                      wordSpacing = 0,
                      interval = 1,
                      maxWordSpacing;
          
                    if($line.hasClass(BigText.EXEMPT_CLASS)) {
                      wordSpacings.push(null);
                      return;
                    }
          
                    // must re-use font-size, even though it was removed above.
                    $line.css('font-size', fontSizes[lineNumber] + 'px');
          
                    for(var m=1, n=3; m<n; m+=interval) {
                      maxWordSpacing = BigText.testLineDimensions($line, maxWidth, 'word-spacing', m, interval, 'px', maxWordSpacing);
                      if(typeof maxWordSpacing !== 'number') {
                        wordSpacing = maxWordSpacing.size;
                        break;
                      }
                    }
          
                    $line.css('font-size', '');
                    wordSpacings.push(wordSpacing);
                  }).removeAttr('style');
          
                  if( !BigText.DEBUG_MODE ) {
                    $c.remove();
                  } else {
                    $c.css({
                      'background-color': 'rgba(255,255,255,.4)'
                    });
                  }
          
                  return {
                    fontSizes: fontSizes,
                    wordSpacings: wordSpacings,
                    ratios: ratios,
                    minFontSizes: minFontSizes
                  };
                }
              };
          
            $.fn.bigtext = BigText.jQueryMethod;
            window.BigText = BigText;
          
        })(this, jQuery);
        $('#bigtext').bigtext();
    }
	render() {
        //if user choose to update than close nd add, he'll eventually be updating, so wtf
		const { _user, _users, title, title_projects, sort, timeframe, categorie, _article, _testimony, currentPage, todosPerPage, tags, _user_toEdit_username, _user_toEdit_roles, modal_msg } = this.state;
        const { articles, projects, testimonies } = this.props;
		return (
			<FullPage scrollMode={'normal'}>
				<Slide>
					<section id="first_section_dashboard" className="first_section_dashboard">
						<div className="wrapper_full">
							<div className="nav nav-pills flex-column">
								<ul className="settings_dashboard">
									<li><a href="/" className="nav_link">Home</a></li>
									<li><a href="#1a" className="nav_link active" data-toggle="tab">Dashboard</a></li>
									<li><a href="#2a" className="nav_link" data-toggle="tab">Settings</a></li>
								</ul>
                                <div className="hello">
									<p>Hello,</p>
									<h3>{_user.username}</h3>
								</div>
								<div className="timeanddatenow">
									<h1 id="bigtext" className="datenow">
                                        <Clock
                                            className='_day_name'
                                            format={'dddd'}
                                        />
                                        <Clock
                                            className='_day_number'
                                            format={'Do'}
                                        />
                                        <Clock
                                            className='_month_name'
                                            format={'MMMM'}
                                        />
                                        <Clock
                                            className='_year_number'
                                            format={'YYYY'}
                                        />
									</h1>
									<div className="timenow">
										<Clock
											format={'hh:mm A'}
											ticking={true}
										/>
									</div>
								</div>
                            </div>
							<div className="after"></div>
							
                            <div className="tab-content clearfix">
								<div className="dashboard_pane tab-pane active" id="1a">
                                    <div className="top_roof">
                                        <div className="left_roof">
                                            <h2>Dashboard</h2>
                                            <div className="name">{_user.email}</div>
                                        </div>
                                        <a href="# " className="logout" onClick={() => this.disconnect()}><p className="text-muted">logout.</p><i className="fas fa-door-open"></i></a>
                                    </div>
									<ul className="cards">
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_articles_pane _pane">
                                                        <div className="_articles_header _header">
                                                            <div className="title_search input-field">
                                                                <Autocomplete
                                                                    items={_.map(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), 'title')}
                                                                    getItemValue={(item) => item}
                                                                    inputProps={{ id: 'title', className: 'form-group-input title', name: 'title' }}
                                                                    shouldItemRender={(item, title) => item.toLowerCase().indexOf(title.toLowerCase()) > -1}
													                renderItem={(item, isHighlighted) =>
                                                                        <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                            {item}
                                                                        </div>
                                                                    }
                                                                    value={title}
                                                                    onChange={(ev) => this.setState({ title: ev.target.value })}
                                                                    onSelect={(title) => this.setState({ title })}
                                                                />
                                                                <label id="title_label" htmlFor='title' className={title ? 'active' : ''}>Search</label>
                                                                <div className='form-group-line'></div>
                                                            </div>
                                                            <div className="card__title">Articles</div>
                                                            <div className="dropdown">
                                                                <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </span>
                                                                <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton">
                                                                    <button className="dropdown-item show_more _show_articles btn-primary" id='_article_modal_trigger' data-toggle="modal" data-target="#_all_article_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    {(() => {
                                                                        if(!_.isEmpty(_user.roles)) {
                                                                            return (
                                                                                <button className="dropdown-item add _add_article btn-primary" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleAddArticle()}><i className="fas fa-plus"></i></button>
                                                                            )
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="_articles_content _content">
                                                            <div className="_articles_data data-container">
																<div className="articles_slider_wrapper swiper-container">
																	<div className="articles_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author })), function(o) { 
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
                                                                                }), (op_byTitle) => {
                                                                                    if(!title)
                                                                                        return true;
                                                                                    else
                                                                                        return _.includes(op_byTitle.title.toLowerCase(), title.toLowerCase());
                                                                                }).map((article, index) => {
                                                                                return (
                                                                                    <div className="articles_slider_wrapper_cards_item swiper-slide" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="articles_slider_wrapper_cards_item" key={index}>
                                                                                        <div className='article_item swiper-slide_item'>
                                                                                            <div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <h2>{article.title}</h2>
                                                                                                    <p className="text-muted author">by <b>{article.author}</b>, {moment(new Date(article.createdAt)).fromNow()}</p>
                                                                                                    <p className="categorie">{article.categorie}</p>
                                                                                                    <p className="categorie"><i className={article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                                    <br/>
                                                                                                    <div className="dropdown">
                                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                                            {(() => {
                                                                                                                if(_.includes(_user.roles, 'admin') || _user.username === article.author) {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleEditArticle(article)}><i className="fas fa-edit"></i></a>
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteArticle(article._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()}
                                                                                                            <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view"><i className="fas fa-expand-alt"></i></a>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(article.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        <p className="text-muted comments"><b>{_.size(article.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                                        <p className="text-muted upvotes"><b>{_.size(article.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className="text-muted downvotes"><b>{_.size(article.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="articles_slider_pagination swiper-pagination"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_projects_pane _pane">
                                                        <div className="_projects_header _header">
                                                            <div className="title_search input-field">
                                                                <Autocomplete
                                                                    items={_.map(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), 'title')}
                                                                    getItemValue={(item) => item}
                                                                    inputProps={{ id: 'title_projects', className: 'form-group-input title_projects', name: 'title_projects' }}
                                                                    shouldItemRender={(item, title_projects) => item.toLowerCase().indexOf(title_projects.toLowerCase()) > -1}
													                renderItem={(item, isHighlighted) =>
                                                                        <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                            {item}
                                                                        </div>
                                                                    }
                                                                    value={title_projects}
                                                                    onChange={(ev) => this.setState({ title_projects: ev.target.value })}
                                                                    onSelect={(title_projects) => this.setState({ title_projects })}
                                                                />
                                                                <label id="title_projects_label" htmlFor='title_projects' className={title_projects ? 'active' : ''}>Search</label>
                                                                <div className='form-group-line'></div>
                                                            </div>
                                                            <div className="card__title">Projects</div>
                                                            <div className="dropdown">
                                                                <span className="dropdown-toggle" id="dropdownMenuButton_projects" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                </span>
                                                                <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton_projects">
                                                                    <button className="dropdown-item show_more _show_projects btn-primary" id='_project_modal_trigger' data-toggle="modal" data-target="#_all_project_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    {(() => {
                                                                        if(!_.isEmpty(_user.roles)) {
                                                                            return (
                                                                                <button className="dropdown-item add _add_project btn-primary" data-toggle="modal" data-target="#_project_modal"  onClick={() => this.handleAddProject()}><i className="fas fa-plus"></i></button>
                                                                            )
                                                                        }
                                                                    })()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="_projects_content _content">
                                                            <div className="_projects_data data-container">
																<div className="projects_slider_wrapper swiper-container">
																	<div className="projects_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author })), function(o) { 
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
                                                                                }), (op_byTitle) => {
                                                                                    if(!title)
                                                                                        return true;
                                                                                    else
                                                                                        return _.includes(op_byTitle.title.toLowerCase(), title_projects.toLowerCase());
                                                                                }).map((project, index) => {
                                                                                return (
                                                                                    <div className="projects_slider_wrapper_cards_item swiper-slide" data-name={ moment(project.createdAt).format("YYYY Do MM") } id="projects_slider_wrapper_cards_item" key={index}>
                                                                                        <div className='project_item swiper-slide_item'>
                                                                                            <div className={"col card card_" + index} data-title={_.snakeCase(project.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <h2>{project.title}</h2>
                                                                                                    <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
                                                                                                    <p className="categorie"><i className={project._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                                    <br/>
                                                                                                    <div className="dropdown">
                                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton_project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                                        </span>
                                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_project">
                                                                                                            {(() => {
                                                                                                                if(_.includes(_user.roles, 'admin') || _user.username === project.author) {
                                                                                                                    return (
                                                                                                                        <>
                                                                                                                            <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_project_modal" onClick={() => this.handleEditProject(project)}><i className="fas fa-edit"></i></a>
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteProject(project._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        </>
                                                                                                                    )
                                                                                                                }
                                                                                                            })()}
                                                                                                            <a className="dropdown-item _view" href={project.link_to} target="_blank" rel="noopener noreferrer"><i className="fas fa-expand-alt"></i></a>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(project.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        <p className="text-muted comments"><b>{_.size(project.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                                        <p className="text-muted upvotes"><b>{_.size(project.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className="text-muted downvotes"><b>{_.size(project.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="projects_slider_pagination swiper-pagination"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_calendat_pane _pane">
                                                        <div className="_calendar_content _content">
                                                            <Calendar/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="cards__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_testimonies_pane _pane">
                                                        <div className="_testimonies_content _content">
                                                            <div className="_testimonies_head">
                                                                <h6>Testimonies</h6>
                                                                <div className="dropdown">
                                                                    <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                    </span>
                                                                    <div className="dropdown-menu _filter_form" aria-labelledby="dropdownMenuButton_testimonies">
                                                                        <button className="dropdown-item show_more _show_testimonies btn-primary" id='_testimony_modal_trigger' data-toggle="modal" data-target="#_all_testimony_modal_view"><i className="fas fa-expand-arrows-alt"></i></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="_testimonies_data data-container">
																<div className="testimonies_slider_wrapper swiper-container">
																	<div className="testimonies_slider_wrapper_cards swiper-wrapper">
																		{
																			_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') })), function(o) { 
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
                                                                                })).map((testimony, index) => {
                                                                                return (
                                                                                    <div className="testimonies_slider_wrapper_cards_item swiper-slide" data-name={ moment(testimony.createdAt).format("YYYY Do MM") } id="testimonies_slider_wrapper_cards_item" key={index}>
                                                                                        <div className={`testimony_item swiper-slide_item ${!testimony.is_private ? '' : 'is_private'}`}>
                                                                                            <div className={"col card card_testimonies card_" + index} data-title={_.snakeCase(testimony.title)} data-index={_.add(index,1)}>
                                                                                                <div className="card-body">
                                                                                                    <div className="_heads_up">
                                                                                                        <div className="intel">
                                                                                                            <p className="text-muted author">by </p>
                                                                                                            <p className="text-muted author">{testimony.author}</p>
                                                                                                            <p className="text-muted author">{moment(new Date(testimony.createdAt)).fromNow()}</p>
                                                                                                        </div>
                                                                                                        <div className="dropdown">
                                                                                                            <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                                                <i className="fas fa-ellipsis-h"></i>
                                                                                                            </span>
                                                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_testimonies">
                                                                                                                {(() => {
                                                                                                                    if(_.includes(_user.roles, 'admin') || _user.username === testimony.author) {
                                                                                                                        return (
                                                                                                                            <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteTestimony(testimony._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                                        )
                                                                                                                    }
                                                                                                                })()}
                                                                                                                <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_testimony : testimony}); }} data-id={testimony._id} data-toggle="modal" data-target="#_testimony_modal"><i className="fas fa-expand-alt"></i></a>
                                                                                                            </div>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <div className="_testy_body">
                                                                                                        <h6>{testimony.body}</h6>
                                                                                                    </div>
                                                                                                    <div className="comments_up_down">
                                                                                                        <p className="text-muted views"><b>{_.size(testimony.view)}</b><i className="fas fa-eye"></i></p>
                                                                                                        
                                                                                                        <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                                                                        <p className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.upvotes)}</b><i className="fas fa-thumbs-up"></i></p>
                                                                                                        <p className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.downvotes)}</b><i className="fas fa-thumbs-down"></i></p>
                                                                                                    </div>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })
																		}
																	</div>
																	<div className="testimonies_slider_pagination swiper-pagination"></div>
                                                                    <div className="testimonies_slider_scrollbar swiper-scrollbar"></div>
																</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
								</div>
								<div className="settings_pane tab-pane" id="2a">
                                    <div className="top_roof">
                                        <div className="left_roof">
                                            <h2>Settings</h2>
                                            <div className="name">{_user.email}</div>
                                        </div>
                                        <a href="# " className="logout" onClick={() => this.disconnect()}><p className="text-muted">logout.</p><i className="fas fa-door-open"></i></a>
                                    </div>
                                    <ul className="forms">
                                        <li className="forms__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_account_pane _pane">
                                                        <div className="_account_content _content">
                                                            <div className="_account_head">
                                                                <h4>Account Settings.</h4>
                                                                <p className="text-muted">Here you can change the email address you use and password</p>
                                                            </div>
                                                            <div className="_account_data data_container">
                                                                <Account/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li className="forms__item">
                                            <div className="card">
                                                <div className="card__content">
                                                    <div className="_accoutns_pane _pane">
                                                        <div className="_accounts_content _content">
                                                            <div className="_accounts_head">
                                                                <h4>Accounts.</h4>
                                                            </div>
                                                            <div className="_accounts_data data_container">
                                                                <table className="accounts_list table table-striped">
                                                                    <thead>
                                                                        <tr className="accounts_list_header">
                                                                            <th>Username</th>
                                                                            <th>Email</th>
                                                                            <th>Fingerprint</th>
                                                                            <th>Created At</th>
                                                                            <th>Roles</th>
                                                                            <th className="_empty"></th>
                                                                            <th className="_empty"></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {
                                                                        _.orderBy(_users, ['createdAt'], ['desc']).map((_u, index) => {
                                                                            return (
                                                                                <tr className={`user_card user_anchor ${_u._id === _user._id ? 'active' : ''}`}>
                                                                                    <td>{_u.username}</td>
                                                                                    <td>{_u.email}</td>
                                                                                    <td>{_u.fingerprint}</td>
                                                                                    <td>{moment(_u.createdAt).format('MMM DD, YYYY')}</td>
                                                                                    <td>{_.isEmpty(_u.roles) ? 'pending...' : _u.roles}</td>
                                                                                    <td className="dropdown">
                                                                                        <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                            <i className="fas fa-ellipsis-h"></i>
                                                                                        </span>
                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                            {(() => {
                                                                                                if(_.includes(_user.roles, 'admin')) {
                                                                                                    return (
                                                                                                        <a className="dropdown-item" href="" data-toggle="modal" data-target="#_user_modal" onClick={() => this.handleEditUser(_u)}>Edit User.</a>
                                                                                                    )
                                                                                                }
                                                                                            })()}
                                                                                            <a className="dropdown-item" href="" onClick={() => this.handleDeleteUser(_u._id)}>Delete User.</a>
                                                                                        </div>
                                                                                    </td>
                                                                                </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
							</div>
                            
                            <div className="_article_modal modal _modal fade" id="_article_modal" tabIndex="-1" role="dialog" aria-labelledby="_article_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <Form />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_article_modal_view modal _modal fade" id="_article_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_article_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <div className="card">
                                                <div className="shadow_title">{_.head(_.words(_article.body))}</div>
                                                <div className="card-body">
                                                    <div className="top_row">
                                                        <h6 className="author">by <b>{_article.author}</b></h6>
                                                        <p className="text-muted fromNow">{moment(new Date(_article.createdAt)).fromNow()}</p>
                                                        <i className="fas fa-circle dot"></i>
									                    <p className="text-muted views"><i className={_article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i><b>{_article._hide ? 'Not Visible to audience.' : 'Visible to audience.'}</b></p>
                                                        <div className="up_down">
                                                            <p className="text-muted comments"><b>{_.size(_article.view)}</b><i className="fas fa-eye"></i></p>
                                                            <p className="text-muted comments"><b>{_.size(_.get(_article, 'comment'))}</b><i className="fas fa-comment-alt"></i></p>
									                        <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(_article, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_article, 'upvotes'))}</b> 
                                                                <i className="fas fa-thumbs-up"></i>
                                                            </div>
                                                            <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(_article, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_article, 'downvotes'))}</b>
                                                                <i className="fas fa-thumbs-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="middle_row">
                                                        <h6 className="text-muted body body_article">
                                                            {
                                                                this.handleJSONTOHTML(_article.body)
                                                            }
                                                        </h6>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_article_modal_view _all_view modal _modal fade" id="_all_article_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_article_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }) ))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        })))}
                                                    </strong> 
                                                    &nbsp;articles.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
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
                                                    <Autocomplete
                                                        items={_.flattenDeep(_.map(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), 'tag'))}
                                                        getItemValue={(item) => item}
                                                        inputProps={{ id: 'tags', className: 'form-group-input tags', name: 'tags' }}
                                                        shouldItemRender={(item, tags) => item.toLowerCase().indexOf(tags.toLowerCase()) > -1}
                                                        renderItem={(item, isHighlighted) =>
                                                            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                {item}
                                                            </div>
                                                        }
                                                        value={tags}
                                                        onChange={(ev) => this.setState({ tags: ev.target.value })}
                                                        onSelect={(tags) => this.setState({ tags })}
                                                    />
                                                    <label id="tags_label" htmlFor='tags' className={tags ? 'active' : ''}>tags</label>
                                                    <div className='form-group-line'></div>
                                                </div>
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else {
                                                                return op_bytag.tag.some(x => x.includes(tags));
                                                            }
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((article, index) => {
                                                        return (
                                                            <li className="article_card _card article_anchor" data-name={ moment(article.createdAt).format("YYYY Do MM") } id="article_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(article.title)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <figure>{this.handleJSONTOHTMLIMAGE(article.body, index)}</figure>
                                                                        <div className="text">
                                                                            <div className="cat_drop">
                                                                                <p className="categorie">{article.categorie}</p>
                                                                                <p className="categorie"><i className={article._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                                <div className="dropdown">
                                                                                    <span className="dropdown-toggle" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                                    </span>
                                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                                                        {(() => {
                                                                                            if(_.includes(_user.roles, 'admin') || _user.username === article.author) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_article_modal" onClick={() => this.handleEditArticle(article)}><i className="fas fa-edit"></i></a>
                                                                                                        <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteArticle(article._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                    </>
                                                                                                )
                                                                                            }
                                                                                        })()}
                                                                                        <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view"><i className="fas fa-expand-alt"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <h4>{article.title}</h4>
                                                                            <ul className="text-muted tags">
                                                                                {
                                                                                    article.tag.map((t, i) => {
                                                                                        return (
                                                                                            <li key={'__'+i} className="tag_item">{t}</li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <Link to={'#'} onClick={() => { this.setState({_article : article}); }} data-id={article._id} data-toggle="modal" data-target="#_article_modal_view">
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author }), ['createdAt'], ['desc']) : _.filter(articles, (_a) => { return !_a._hide || _.includes(_user.roles, 'admin') || _user.username === _a.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
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
                            
                            <div className="_project_modal modal _modal fade" id="_project_modal" tabIndex="-1" role="dialog" aria-labelledby="_project_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <FormProject />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_project_modal_view _all_view modal _modal fade" id="_all_project_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_project_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        }) ))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
                                                        })))}
                                                    </strong> 
                                                    &nbsp;projects.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
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
                                                    <Autocomplete
                                                        items={_.flattenDeep(_.map(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), 'tag'))}
                                                        getItemValue={(item) => item}
                                                        inputProps={{ id: 'tags', className: 'form-group-input tags', name: 'tags' }}
                                                        shouldItemRender={(item, tags) => item.toLowerCase().indexOf(tags.toLowerCase()) > -1}
                                                        renderItem={(item, isHighlighted) =>
                                                            <div className={`item ${isHighlighted ? 'item-highlighted' : ''}`}>
                                                                {item}
                                                            </div>
                                                        }
                                                        value={tags}
                                                        onChange={(ev) => this.setState({ tags: ev.target.value })}
                                                        onSelect={(tags) => this.setState({ tags })}
                                                    />
                                                    <label id="tags_label" htmlFor='tags' className={tags ? 'active' : ''}>tags</label>
                                                    <div className='form-group-line'></div>
                                                </div>
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else {
                                                                return op_bytag.tag.some(x => x.includes(tags));
                                                            }
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((project, index) => {
                                                        return (
                                                            <li className="project_card _card project_anchor" data-name={ moment(project.createdAt).format("YYYY Do MM") } id="project_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(project.title)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <figure>{this.handleJSONTOHTMLIMAGE(project.body, index)}</figure>
                                                                        <div className="text">
                                                                            <div className="cat_drop">
                                                                                <h4>{project.title}</h4>
                                                                                <div className="dropdown">
                                                                                    <span className="dropdown-toggle" id="dropdownMenuButton_project" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                        <i className="fas fa-ellipsis-h"></i>
                                                                                    </span>
                                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_project">
                                                                                        {(() => {
                                                                                            if(_.includes(_user.roles, 'admin') || _user.username === project.author) {
                                                                                                return (
                                                                                                    <>
                                                                                                        <a href="# " className="dropdown-item edit" data-toggle="modal" data-target="#_project_modal" onClick={() => this.handleEditProject(project)}><i className="fas fa-edit"></i></a>
                                                                                                        <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteProject(project._id)}><i className="far fa-trash-alt"></i></a>
                                                                                                    </>
                                                                                                )
                                                                                            }
                                                                                        })()}
                                                                                        <a className="dropdown-item _view" href={project.link_to} target="_blank" rel="noopener noreferrer"><i className="fas fa-expand-alt"></i></a>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <p className="categorie"><i className={project._hide ? 'far fa-eye-slash' : 'far fa-eye'}></i></p>
                                                                            <ul className="text-muted tags">
                                                                                {
                                                                                    project.tag.map((t, i) => {
                                                                                        return (
                                                                                            <li key={'_'+i} className="tag_item">{t}</li>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </ul>
                                                                            <a href={project.link_to} target="_blank" rel="noopener noreferrer">
                                                                                <div className="readmore">
                                                                                    <button data-am-linearrow="tooltip tooltip-bottom" display-name="Read More">
                                                                                        <div className="line line-1"></div>
                                                                                        <div className="line line-2"></div>
                                                                                    </button>
                                                                                </div>
                                                                            </a>
                                                                            <br/>
                                                                            <div className="comments_up_down">
                                                                                <p className="text-muted views"><b>{_.size(project.view)}</b><i className="fas fa-eye"></i></p>
                                                                                <p className="text-muted comments"><b>{_.size(project.comment)}</b> <i className="fas fa-comment-alt"></i></p>
                                                                                <p className="text-muted upvotes"><b>{_.size(project.upvotes)}</b> <i className="fas fa-thumbs-up"></i></p>
                                                                                <p className="text-muted downvotes"><b>{_.size(project.downvotes)}</b> <i className="fas fa-thumbs-down"></i></p>
                                                                            </div>
                                                                            <p className="text-muted author">by <b>{project.author}</b>, {moment(new Date(project.createdAt)).fromNow()}</p>
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author }), ['createdAt'], ['desc']) : _.filter(projects, (_p) => { return !_p._hide || _.includes(_user.roles, 'admin') || _user.username === _p.author })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
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

                            <div className="_testimony_modal modal _modal fade" id="_testimony_modal" tabIndex="-1" role="dialog" aria-labelledby="_testimony_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <div className="card">
                                                <div className="shadow_title">{_.head(_.words(_testimony.body))}</div>
                                                <div className="card-body">
                                                    <div className="top_row">
                                                        <h6 className="author">by <b>{_testimony.author}</b></h6>
                                                        <p className="text-muted fromNow">{moment(new Date(_testimony.createdAt)).fromNow()}</p>
                                                        <div className="up_down">
                                                            <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': _testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                            <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(_testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_testimony, 'upvotes'))}</b> 
                                                                <i className="fas fa-thumbs-up"></i>
                                                            </div>
                                                            <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(_testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                <b>{_.size(_.get(_testimony, 'downvotes'))}</b>
                                                                <i className="fas fa-thumbs-down"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="middle_row">
                                                        <h5>{_testimony.body}</h5>
                                                    </div>
                                                    {(() => {
                                                        if(_testimony.is_private === true) {
                                                            return (
                                                                <p className="is_private">Private.</p>
                                                            )
                                                        }
                                                    })()}
                                                    {
                                                        _.orderBy(_.reject(_.filter(testimonies, (_t) => { return !_t.is_private || _testimony.author === _user.username }), { parent_id: null }), ['view'], ['desc']).map((testimony_reply, index_reply) => {
                                                            if(testimony_reply.parent_id === _testimony._id)
                                                                return (
                                                                    <div className={"card card_" + index_reply} data-index={index_reply+1}>
                                                                        <div className="shadow_title">{_.head(_.words(testimony_reply.body))}</div>
                                                                        <div className="card-body">
                                                                            <div className="top_row">
                                                                                <h6 className="author">by <b>{testimony_reply.author}</b></h6>
                                                                                <p className="text-muted fromNow">{moment(new Date(testimony_reply.createdAt)).fromNow()}</p>
                                                                                <div className="up_down">
                                                                                    <div className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony_reply, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                                        <b>{_.size(_.get(testimony_reply, 'upvotes'))}</b> 
                                                                                        <i className="fas fa-thumbs-up"></i>
                                                                                    </div>
                                                                                    <div className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony_reply, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}>
                                                                                        <b>{_.size(_.get(testimony_reply, 'downvotes'))}</b>
                                                                                        <i className="fas fa-thumbs-down"></i>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="middle_row">
                                                                                <h5>{testimony_reply.body}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="_all_testimony_modal_view _all_view modal _modal fade" id="_all_testimony_modal_view" tabIndex="-1" role="dialog" aria-labelledby="_all_testimony_modal_viewLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <div className="modal-top">
                                                <h5 className="modal-title" id="exampleModalLabel">
                                                    Showing&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + 1}</strong>  
                                                    &nbsp;to&nbsp;
                                                    <strong>{((currentPage * todosPerPage) - todosPerPage) + _.toNumber(_.size(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['comment'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['view'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['upvotes'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['createdAt'], ['desc']).slice(((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') })), function(o) { 
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
                                                        })))}</strong>
                                                    &nbsp;of&nbsp;
                                                    <strong>{_.toNumber(_.size(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') })), function(o) { 
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
                                                        })))}
                                                    </strong> 
                                                    &nbsp;testimonies.
                                                </h5>
                                                <div>
                                                    <span className="filter" onClick={(event) => this.handleShowFilter(event)}><i className="fas fa-sliders-h"></i></span>
                                                    <a href="# " title="Close" className="modal-close" id="modal-close" data-dismiss="modal">Close</a>
                                                </div>
                                            </div>
                                            <div className="modal-top-filter">
                                                <div className="input-field col s6">
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
                                                <div className="input-field col s6">
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
                                            </div>
                                            <ul id="page">
                                                {
                                                    _.slice(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') || _.includes(_user.roles, 'admin') }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') })), function(o) { 
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
                                                        }), ((currentPage * todosPerPage) - todosPerPage), (currentPage * todosPerPage)).map((testimony, index) => {
                                                        return (
                                                            <li className="testimony_card _card testimony_anchor" data-name={ moment(testimony.createdAt).format("YYYY Do MM") } id="testimony_card" key={index}>
                                                                <div className={"col card card_" + index} data-title={_.snakeCase(testimony.author)} data-index={_.add(index,1)}>
                                                                    <div className="card-body">
                                                                        <div className="_heads_up">
                                                                            <div className="intel">
                                                                                <p className="text-muted author">by </p>
                                                                                <p className="text-muted author">{testimony.author}</p>
                                                                                <p className="text-muted author">{moment(new Date(testimony.createdAt)).fromNow()}</p>
                                                                            </div>
                                                                            <div className="dropdown">
                                                                                <span className="dropdown-toggle" id="dropdownMenuButton_testimonies" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                                    <i className="fas fa-ellipsis-h"></i>
                                                                                </span>
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton_testimonies">
                                                                                    {(() => {
                                                                                        if(_.includes(_user.roles, 'admin') || _user.username === testimony.author) {
                                                                                            return (
                                                                                                <a href="# " className="dropdown-item delete" onClick={() => this.handleDeleteTestimony(testimony._id)}><i className="far fa-trash-alt"></i></a>
                                                                                            )
                                                                                        }
                                                                                    })()}
                                                                                    <a href="# " className="dropdown-item _view" onClick={() => { this.setState({_testimony : testimony}); }} data-id={testimony._id} data-toggle="modal" data-target="#_testimony_modal"><i className="fas fa-expand-alt"></i></a>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {(() => {
                                                                            if(testimony.is_private === true) {
                                                                                return (
                                                                                    <p className="is_private">Private.</p>
                                                                                )
                                                                            }
                                                                        })()}
                                                                        <div className="_testy_body">
                                                                            <h4>{testimony.body}</h4>
                                                                        </div>
                                                                        <div className="comments_up_down">
                                                                            <p className="text-muted views"><b>{_.size(testimony.view)}</b><i className="fas fa-eye"></i></p>
                                                                            
                                                                            <p className="text-muted replies"><b>{_.size(_.filter(testimonies, {'parent_id': testimony._id}))}</b><i className="fas fa-reply-all"></i></p>
                                                                            <p className={`text-muted upvotes ${_.isUndefined( _.find(_.get(testimony, 'upvotes'), (upvote) => {return upvote.upvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.upvotes)}</b><i className="fas fa-thumbs-up"></i></p>
                                                                            <p className={`text-muted downvotes ${_.isUndefined( _.find(_.get(testimony, 'downvotes'), (downvote) => {return downvote.downvoter === _user.fingerprint}) ) ? '' : 'active'}`}><b>{_.size(testimony.downvotes)}</b><i className="fas fa-thumbs-down"></i></p>
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
                                                    ([...Array(Math.ceil(_.filter(_.filter(_.filter((sort === 'Relevant' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['comment'], ['desc']) : sort === 'Trending' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['view'], ['desc']) : sort === 'Most_Likes' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['upvotes'], ['desc']) : sort === 'Recent' ? _.orderBy(_.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') }), ['createdAt'], ['desc']) : _.filter(testimonies, (_t) => { return !_t.is_private || _t.author === _user.username || _.includes(_user.roles, 'admin') })), function(o) { 
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
                                                        }), (op_bytag) => {
                                                            if(!tags)
                                                                return true;
                                                            else 
                                                                return _.includes(op_bytag.tag, tags);
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
						
                            <div className="_user_modal modal fade" id="_user_modal" tabIndex="-1" role="dialog" aria-labelledby="_user_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <h5 className="modal-title" id="_user_modalLabel">Changing roles for {_user_toEdit_username}!</h5>
                                            <div className="wrapper_form_user">
                                                <div className="row">
                                                    <div className="input-field col s12">
                                                        <select 
                                                            value={_user_toEdit_roles}
                                                            onChange={(ev) => this.handleChangeFieldUser('_user_toEdit_roles', ev)}
                                                            className="form-group-input _user_toEdit_roles" 
                                                            id="_user_toEdit_roles" 
                                                            name="_user_toEdit_roles"
                                                        >
                                                            <option value=""></option>
                                                            <option value="Write">Write</option>
                                                            <option value="Admin">Admin</option>
                                                        </select>
                                                        <label htmlFor='_user_toEdit_roles' className={_user_toEdit_roles ? 'active' : ''}>Roles</label>
                                                        <div className="form-group-line"></div>
                                                    </div>
                                                </div>
                                                <button onClick={(ev) => this.send_user(_user_toEdit_username)} className="btn btn-primary float-right">Update.</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                                    
                            <div className="modal fade" id="edit_modal" tabIndex="-1" role="dialog" aria-labelledby="edit_modalLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <h5 className="modal-title" id="edit_modalLabel">Hey!</h5>
                                            <div>Your Informations has been updated, we've sent you details to your email, we love you.</div>
                                            <div><small>Thanks {localStorage.getItem('username')}</small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal fade" id="edit_modal_error_roles" tabIndex="-1" role="dialog" aria-labelledby="edit_modal_error_rolesLabel" aria-hidden="true">
                                <div className="modal-dialog" role="document">
                                    <div className="modal-content">
                                        <div className="modal-body">
                                            <a href="# " title="Close" className="modal-close" data-dismiss="modal">Close</a>
                                            <h5 className="modal-title" id="edit_modal_error_rolesLabel">Hey!</h5>
                                            <div>{ modal_msg }</div>
                                            <div><small>Thanks {localStorage.getItem('username')}</small></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
					</section>
				</Slide>
			</FullPage>
		);
	}
}

const mapStateToProps = state => ({
    articles: state.home.articles,
    projects: state.home.projects,
    testimonies: state.home.testimonies,
    
    userToEdit: state.home.userToEdit,
});

const mapDispatchToProps = dispatch => ({
    onLoad: data => dispatch({ type: 'HOME_PAGE_LOADED', data }),
    onDelete: id => dispatch({ type: 'DELETE_ARTICLE', id }),
    setEdit: article => dispatch({ type: 'SET_EDIT', article }),
    
    setEditUser: user => dispatch({ type: 'SET_EDIT_USER', user }),
    
    onLoadProject: data => dispatch({ type: 'PROJECT_PAGE_LOADED', data }),
    onDeleteProject: id => dispatch({ type: 'DELETE_PROJECT', id }),
    setEditProject: project => dispatch({ type: 'SET_EDIT_PROJECT', project }),
    
    onLoadTestimony: data => dispatch({ type: 'TESTIMONY_PAGE_LOADED', data }),
    onDeleteTestimony: id => dispatch({ type: 'DELETE_TESTIMONY', id }),
	setEditTestimony: testimony => dispatch({ type: 'SET_EDIT_TESTIMONY', testimony }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);