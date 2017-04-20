/**
 * nJDesktop Virtual Desktop
 * Copyright (C) 2012 Nagy Ervin
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by    
 * the Free Software Foundation, either version 3 of the License, or    
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 * -----------------------------------------------------------------------
 * Nagy Ervin
 * nagyervin.bws@gmail.com
 * 
 * License: GPL v.3, see COPYING
 * 
 * If you wish to fork this, please let me know: nagyervin.bws@gmail.com.
 * 
 * Please leave this header intact
 * 
 * -----------------------------------------------------------------------
 * Insert your name below, if you have modified this project. If you wish 
 * that change become part of this project (aka i will endorse it), please 
 * send it to me.
 * 
 * I must remind you, that your changes will be subject to the GPL v.3.
 * 
 */

/* Virtual Desktop system*/
var nJDSK = (function(wnd,d,$){
	return{
		/*These settings can be changed*/
		taskbarHeight: nJDSKStyle.taskbarHeight,
	  	topMenuHeight: nJDSKStyle.topMenuHeight,
	  	widgetWidth: nJDSKStyle.widgetWidth,
	  	iconWidth: nJDSKStyle.iconWidth,
	  	iconMaxHeight: nJDSKStyle.iconMaxHeight,
	  	iconMargin: nJDSKStyle.iconMargin,
	  	iconBorderWeight: nJDSKStyle.iconBorderWeight,
	  	windowPadding: nJDSKStyle.windowPadding,
	  	nextIconPos:{
	  		left:0,
	  		top:0
	  	},
	  	desktopHeight: 0,
	  	desktopWidth: 0,
	  	
	  	/**
	  	 * A window list object (This stores window instances, and several other variables)
	  	 */
	  	
	  	WindowList: {
	  		items:[],
	  		lastZIndex : 1000,
	  		left : 10,
	  		top : 10,
	  		
	  		/**
	  		 * Adds a new window instance to the list
	  		 * @param string id //window id
	  		 * @param object win_object //window instance
	  		 */
	  		add_item:function(id,win_object)
	  		{
	  			this.items.push({window_id:id,window_object:win_object});
	  		},
	  		
	  		/**
	  		 * Removes a window instance
	  		 * @param string id //window id
	  		 */
	  		delete_item:function(id)
	  		{
	  			this.items.splice(this.index_of(id),1);
	  		},
	  		
	  		/**
	  		 * Returns window object index in the list
	  		 * @param string id // window id 
	  		 */
	  		index_of:function(id)
	  		{
	  			for (var i=0;i<this.items.length;i++)
	  			{
	  				if (id==this.items[i].window_id)
	  				{
	  					return i;
	  				}
	  			}
	  		},
	  		
	  		/**
	  		 * Returns window instance by given id
	  		 * @param string id
	  		 */
	  		get_window:function(id)
	  		{
	  			for (var i=0;i<this.items.length;i++)
	  			{
	  				if (id==this.items[i].window_id)
	  				{
	  					return this.items[i].window_object;
	  				}
	  			}
	  		}
	  	},
	  	
	  	/**
	  	 * The heart of the system: the Window class
	  	 * @param int width // window width
	  	 * @param int height // window height
	  	 * @param string title // window title, can contain HTML string
	  	 * @param string toolbar // window toolbar, should contain HTML string, or empty
	  	 * @param string content // window content, HTML
	  	 * @param string id // window id
	  	 * @param bool dialog // creates dialog style window (not resizable)
	  	 * @param bool modal // creates a modal window (no access to other desktop elements)
	  	 * @param bool fullGlass // the content area has no border and is transparent (aka windows 7 windows with translucent client area, such as media player)
	  	 * @param function createCallback //a function to call after window creation
	  	 */
	  	Window: function(width,height,title,toolbar,content,id,dialog,modal,fullGlass,createCallback){
	  		
			/**
			 * Restore standard content area
			 */
			this.removeFullGlass = function()
			{
			$(this.contentArea).removeClass('fullGlass');
			};

			/**
			 * Turn content area backgrounds and borders transparent
			 */
			
			this.setFullGlass = function()
			{
			$(this.contentArea).addClass('fullGlass');
			};
	  	
			this.skipEvent = false;  	  
			this.w_id = id;
			this.windowToolbar = null;
			
			/*
			* Provide basic cascading on window creation
			*/
			
			this.modal = modal;
		
			if ((dialog === false) || typeof(dialog) == 'undefined')
			{
				if ((nJDSK.WindowList.left+25+parseInt(width)) > $(wnd).width()-nJDSK.widgetWidth){
					nJDSK.WindowList.left = 10;
				} else {
					nJDSK.WindowList.left+=25;
				}
				
				if (nJDSK.WindowList.top+25+parseInt(height) > ($(wnd).height()-nJDSK.taskbarHeight-nJDSK.topMenuHeight)){
					nJDSK.WindowList.top = 10;
				} else {
					nJDSK.WindowList.top+=25;
				}
			}
		
			/*
			* Temporary dimensions/screen location storage
			* */
			var l=nJDSK.WindowList.left;
			var t=nJDSK.WindowList.top;
			var w=width;
			var h=height;
		
			/*
			* Update the task bar button status
			* */
			
			if ($('#win_'+id).length == 1){
				$('.taskbarbutton').removeClass('activetsk');
				$('#tskbrbtn_'+id).addClass('activetsk');
				$('#win_'+id).css({'z-index':WindowList.lastZIndex});
				$('#mainmenu').fadeOut('fast');
				nJDSK.WindowList.lastZIndex+=1;
				return;
			}	
	  		
			/*
			* Create the window base div (this will carry all the contents of the window, and also it's id)
			* 
			* */
	  	  
			nJDSK.clearActive();	
		
			this.base = document.createElement('div');
			$('#mainmenu').fadeOut('fast');
			if (this.modal !==true)
			{
				$('#desktop').append(this.base);
			}
			else
			{
				$('body').append('<div id="Winbg_'+id+'" class="modalbg"></div>');
				$('body').append(this.base);
			}

			if (this.modal!=true)
			{
				/*
				* Cascade the window if it's not modal (new windows will be shown with a small offset, 
				* obeying desktop size)
				* */
				$(this.base).css({
				'position':'absolute',
				'top':nJDSK.WindowList.top+'px',
				'left':nJDSK.WindowList.left+'px',
				'width':width+'px',
				'height':height+'px',
				'z-index':nJDSK.WindowList.lastZIndex
				});
			} else
			{
				/*
				* if modal, place window on the screen center
				* */
				$(this.base).css({
					'position':'absolute',
					'top':'50%',
					'left':'50%',
					'width':width+'px',
					'height':height+'px',
					'margin-left':'-'+(width/2)+'px',
					'margin-top':'-'+(height/2)+'px',
					'z-index':99999999
					});
				
			}

			/*
			* Increase last Z index
			* */

			nJDSK.WindowList.lastZIndex+=1;

			/*
			* set up attributes, parts and skinning for the window
			* */

			$(this.base).addClass('window');
			$(this.base).attr('id','win_'+id);
			$('.activeWindow').removeClass('activeWindow');
			$('#win_'+id).addClass('activeWindow');

			/*title bar*/
			this.titlebar = document.createElement('div');
			this.base.appendChild(this.titlebar);
			$(this.titlebar).addClass('titlebar');
			$(this.titlebar).css({'cursor':'default'});
	  	  
			/*title bar text area*/
			this.titleText = document.createElement('span');
			this.titlebar.appendChild(this.titleText);
			$(this.titleText).html(title);

			/*title buttons container*/
			this.titleButtons = document.createElement('div');
			this.titlebar.appendChild(this.titleButtons);
			$(this.titleButtons).addClass('titlebuttons');
			// this.sysIcon = document.createElement('a'); // not implemented yet
	  	  
			/*create title buttons depending on window type (dialog or not)*/
			if (dialog!=true)
			{
				this.minMax = function(){
					
				};
				/*minimize button*/
				this.minimizeBtn = document.createElement('a');
				this.titleButtons.appendChild(this.minimizeBtn);
				$(this.minimizeBtn).attr('href','#');
				$(this.minimizeBtn).html('_');
				$(this.minimizeBtn).addClass('minimizebtn');
				var minThat = this;
				$(this.minimizeBtn).click(function(){
				$('#win_'+id).hide();
				if (typeof(minThat.onMinimize) == 'function')
				{
					minThat.onMinimize('win_'+id);
				}
				});
				
				/*maximize button*/
				this.maximizeBtn = document.createElement('a');
				this.titleButtons.appendChild(this.maximizeBtn);
				$(this.maximizeBtn).attr('href','#');
				$(this.maximizeBtn).html('O');
				$(this.maximizeBtn).addClass('maximizebtn');
				var maxThat = this;
				$(this.maximizeBtn).click(function(){
				$('#win_'+id).addClass('transitioner');  
				if (($('#win_'+id).width()==$('#desktop').width()-nJDSK.windowPadding * 2)&&($('#win_'+id).height()==$('#desktop').height()-nJDSK.windowPadding * 2)){
					$('#win_'+id).animate({'width':w,'height':h,'left':l,'top':t},0,function()
					{
						$('#win_'+id).removeClass('transitioner');
						$('#win_'+id).children('.contentarea').css({
							'height':$('#win_'+id).height()-$('.titlebar').height()-2-$('#win_'+id).find('.statusbar').height()-$('#win_'+id).find('.toolbar').height()-nJDSK.windowPadding * 2
						});
						if ($('#win_'+id+' .mceIframeContainer iframe').get(0)!=undefined){
							$('#win_'+id+' .mceIframeContainer iframe').get(0).style.height = parseInt($('#win_'+id).children('.contentarea').css('height').replace('px'))-$('#win_'+id+' .mceToolbar').get(0).offsetHeight-$('#win_'+id+' .mceStatusbar').get(0).offsetHeight-2+'px';
						}
						
					});
				} else {
					$('#win_'+id).addClass('transitioner');
					w = $('#win_'+id).css('width');
					h = $('#win_'+id).css('height');
					l = $('#win_'+id).css('left');
					t = $('#win_'+id).css('top');
					$('#win_'+id).animate({'width':($('#desktop').width()-nJDSK.windowPadding * 2),'height':($('#desktop').height()-nJDSK.windowPadding * 2),'left':0,'top':0},0,function()
					{
						$('#win_'+id).removeClass('transitioner');
						$('#win_'+id).children('.contentarea').css({
							'height':$('#win_'+id).height()-$('.titlebar').height()-2-$('#win_'+id).find('.statusbar').height()-$('#win_'+id).find('.toolbar').height()-nJDSK.windowPadding * 2
						});

						if ($('#win_'+id+' .mceIframeContainer iframe').get(0)!=undefined){
							$('#win_'+id+' .mceIframeContainer iframe').get(0).style.height = parseInt($('#win_'+id).children('.contentarea').css('height').replace('px'))-$('#win_'+id+' .mceToolbar').get(0).offsetHeight-$('#win_'+id+' .mceStatusbar').get(0).offsetHeight-2+'px';
						}

					});
					if (typeof(maxThat.onMaximize) == 'function')
					{
						maxThat.onMaximize('win_'+id);
					}

				}
				
				$('#win_'+id).children('.contentarea').children('.list_header').css({'top':$(this).scrollTop()+'px'});
				$(this).parents('.window').resize();

				});
				
				/* maximize/restore on title bar doubleclick */
				$(this.titlebar).dblclick(function(){
					// removed duplicate code
					maxThat.maximize();
				});
			}
	  	  
			/*add close function - for the window be removable from outside*/
			this.close=function(){
				/*this line with tinymce should be removed, if you aren't using tinyMCE, as it will cause an error*/
			//$('#win_'+id+' textarea.tinymce').tinymce().remove();
				if (typeof(this.onBeforeClose) == 'function')
				{
					// before close event: can be used to save information, or prevent closing the window
					if (this.onBeforeClose('win_'+id) === false){
						return;
					}
				}
				
				$('#win_'+id).fadeOut('fast',function(){
					$('#win_'+id).remove();
				});
				if (this.modal==true)
				{
					$('#Winbg_'+id).remove();
				}
				$('#tskbrbtn_'+id).hide('fast',function(){
					$(this).remove();
				});
				$('#mainmenu').fadeOut('fast');
				
				/*unregister this window instance*/
				nJDSK.WindowList.delete_item(id);
				
				// After close event: can be used to trigger an action after the window has been closed
				if (typeof(this.onAfterClose) == 'function')
				{
					this.onAfterClose('win_'+id);
				}
			};

	  	  
			/*close button - always visible*/
			this.closeBtn = document.createElement('a');
			this.titleButtons.appendChild(this.closeBtn);
			$(this.closeBtn).attr('href','#');
			$(this.closeBtn).html('X');
			$(this.closeBtn).addClass('closebtn');

			var closeObject = this;

			$(this.closeBtn).click(function(){
				closeObject.close();
	  	  	});
	  	  
			/*make the window resizable, and draggable and add resize handle+drag behaviors*/
			var titlebar = this.titlebar;

			$(wnd).resize(function(){
					$(this.base).draggable({handle:titlebar, containment: "parent" });
					$(this.base).resizable({ containment: "parent" });

			});

			/*make the window draggable all around the screen*/
			$(this.base).draggable({handle:this.titlebar, containment: "parent" });
			if (dialog != true)
			{
				$(this.base).resizable({ containment: "parent" });
			}
	  	  
	  	  
			/*show the base div*/
			$(this.base).fadeIn();

	  	  
			// create the taskbar button
			this.taskbarBtn=document.createElement('div');
			$(this.taskbarBtn).attr('id','tskbrbtn_'+id);
			$(this.taskbarBtn).html(title);
			$(this.taskbarBtn).addClass('taskbarbutton');
			$(this.taskbarBtn).addClass('activetsk');
			document.getElementById('taskbarbuttons').appendChild(this.taskbarBtn);
			$('.taskbarbutton').removeClass('activetsk');
			$('#tskbrbtn_'+id).addClass('activetsk');
			$('#taskbarbuttons').scrollTo($(this.taskbarBtn),'fast');
			var tskbThat = this;
			// add taskbar button behavior
			$(this.taskbarBtn).click(function(){
				if (($('#tskbrbtn_'+id).hasClass('activetsk')) && ($('#win_'+id).is(':visible')))
				{
					$('#win_'+id).hide();
					if (typeof(tskbThat.onMinimize) == 'function')
					{
						tskbThat.onMinimize('win_'+id);
					}
					
					return;
				}
				else
				{
					$('#win_'+id).show();
					if (typeof(tskbThat.onRestore) == 'function')
					{
						tskbThat.onRestore('win_' + id);
					}
				}
				$('.taskbarbutton').removeClass('activetsk');
				$('#tskbrbtn_'+id).addClass('activetsk');
				$('#win_'+id).css({'z-index':nJDSK.WindowList.lastZIndex});
				$('.window').removeClass('activeWindow');
				$('#win_'+id).addClass('activeWindow');
				$('#mainmenu').fadeOut('fast');
				nJDSK.WindowList.lastZIndex+=1;
			});

			// add window behavior on activation
			$(this.base).mousedown(function(){
				$('.taskbarbutton').removeClass('activetsk');
				$('#tskbrbtn_'+id).addClass('activetsk');
				$('.activeWindow').removeClass('activeWindow');
				$('#mainmenu').fadeOut('fast');

				// reveal taskbar button if it's outside the visible taskbar area
				$('#taskbarbuttons').scrollTo($('#tskbrbtn_'+id),'fast');
				
				if (!modal)
				{
					$('#win_'+id).css({'z-index':nJDSK.WindowList.lastZIndex});
					$('#win_'+id).addClass('activeWindow');
					nJDSK.WindowList.lastZIndex+=1;
				}
			});
	  	  
			if (!dialog){
				/*add toolbar area*/
				this.toolbar = document.createElement('div');
				this.base.appendChild(this.toolbar);
				$(this.toolbar).addClass('toolbar');
				$(this.toolbar).html(toolbar);
				if (toolbar == '')
					$(this.toolbar).css({'height':0});
				this.windowToolbar = this.toolbar;

				/*add status bar area*/
				this.statusbar = document.createElement('div');
				this.base.appendChild(this.statusbar);
				$(this.statusbar).addClass('statusbar');
				$(this.statusbar).css({'height':0});
			}

			// add content area this will hold all the stuff
			this.contentArea = document.createElement('div');
			this.base.appendChild(this.contentArea);

			// set up contentarea look and feel
			$(this.contentArea).addClass('contentarea');
			if (dialog)
			{
				$(this.contentArea).addClass('dialog');
			}
	  	  
			if (!dialog){
				$(this.contentArea).css({
					
				'height':$('#win_'+id).height()-$('.titlebar').height()-2-$(this.base).find('.statusbar').height()-$(this.base).find('.toolbar').height()-10
				});
			} 
			else
			{
				$(this.contentArea).css({
				'height':$('#win_'+id).height()-$('.titlebar').height()-2
				});
			}
	  	  
			if (fullGlass === true)
			{
				this.setFullGlass();
			}
	  	  
			// insert the content

			$(this.contentArea).html(content);

			/*
			* window behavior on resize
			* handles embedded tinyMCE editor if available
			* */
			$(this.base).resize(function(){
					
					$(this).children('.contentarea').css({
					'height':$('#win_'+id).height()-$('.titlebar').height()-2-$(this).find('.statusbar').height()-$(this).find('.toolbar').height()-10
					});
					
					if ($('#win_'+id+' .mceIframeContainer iframe').get(0)!=undefined){
					$('#win_'+id+' .mceIframeContainer iframe').get(0).style.height = parseInt($(this).children('.contentarea').css('height').replace('px'))-$('#win_'+id+' .mceToolbar').get(0).offsetHeight-$('#win_'+id+' .mceStatusbar').get(0).offsetHeight-2+'px';
					}
					
					$(this).children('.contentarea').children('.list_header').css({'top':$(this).scrollTop()+'px'});
					
					
					if ((typeof(closeObject.skipEvent) != 'undefined') && (closeObject.skipEvent === true))
					{
						return;
					}
					
					if (typeof(closeObject.onResize) == 'function'){
						closeObject.onResize(closeObject);
					}

			});
	  	  
			// arbitrary resize through program
			this.setDimensions = function(left,top,width,height)
			{
				$(this.base).css({"left" : left + 'px',"top" : top + 'px', 'width' : (width - nJDSK.windowPadding * 2) + 'px', 'height' : (height - nJDSK.windowPadding * 2) + 'px'});
				// trigger resize event
				$(this.base).resize();
			};

			//adds some behavior for standard bws list 
			var awidth = 0;
			$('.list_header div').each(function(){
				awidth += $(this).width()+21;
				$('.list_header').css({"min-width":awidth+'px'});
				$('.list_item').css({"min-width":awidth+'px'});
			});

			$('.contentarea').scroll(function(){
				$(this).children('.list_header').css({'top':$(this).scrollTop()+'px'});
			});


			this.lastSelected=null;
			this.sortColumn=null;

			// adds basic multi select feature for standard BWS list
			$('#win_'+id+' .list_item').click(function(e){
				if ((!e.ctrlKey)&&(!e.shiftKey))
					{
						$('#win_'+id+' .list_item').removeClass('selected');
						$(this).addClass('selected');
					}
					if (e.ctrlKey)
					{
						$(this).toggleClass('selected');
					}
					if (e.shiftKey)
					{
						$(this).toggleClass('selected');
					}
			});

			$('#win_'+id+' .list_item').dblclick(function(e){
				if ($(this).hasClass('folder'))
				{
					$('#'+id+'-folder-ed').text($(this).children('.name_item').text());
					$('#'+id+'-folder').val($(this).children('.id_item').text());
						refresh_page_list(id,$(this).children('.id_item').text());
				}
			});
	  	  
			var minMaxThat = this;

			this.maximize = function(){
			$(minMaxThat.maximizeBtn).click();
			};

			this.minimize = function(){
				$(minMaxThat.minimizeBtn).click();
			};

			this.restore = function(){
				$(minMaxThat.taskbarBtn).click();
			};

			/*facility to change title from outside*/
			this.setTitle = function(ititle)
			{
				$(this.taskbarBtn).html(ititle);
				$(this.titleText).html(ititle);
			};

			// facility to make a window unclosable
			this.noClose = function(){
			$(this.base).find('a.closebtn').remove();  
			};
	  	  
			/*facility to change footer contents.outside*/

			this.setFooter = function(content)
			{
				if (this.statusbar)
				{
					this.skipEvent = true;
					
					$(this.statusbar).css({'height':'auto'});
					
					$(this.statusbar).html(content);
					
					$(this.base).resize();
					
					this.skipEvent = false;
				}
			};
	  		
			this.editor = null;
			this.data = null;

			var windowBase = this.base;
			var windowToolbar = this.windowToolbar;
	  	  
			/**
			 * Toolbar helper plugin
			 */
			this.toolbarHelper = {
					
				/**
				 * Adds a new toolbar icon
				 * @param string row 			The id of the row (if the row doesn't exist, it will be created)
				 * @param string id 			The unique id of the toolbar item(required)
				 * @param string title			The toolbar icon title
				 * @param string image			Toolbar icon url
				 * @param function callback 	The function called on click 
				 */
				addItem: function(row,id,title,image,callback){
				
				// check if row id is given, if not, use default 
				if (row=='')
					row = 'row1';
				// check if row exists
				var xrow = $(windowToolbar).find('.'+row);
				if (xrow.length == 0)
				{
					//if not, create it and select it
					$(windowToolbar).append('<div class="toolbarRow '+row+'"></div>');
					xrow = $(windowToolbar).find('.'+row);
				}
				// check what kind of toolbar item is added
				if (title == 'separator')
					xrow.append('<span class="toolbar-separator"></span>');
				else
					xrow.append('<a class="toolbar" id="'+$(windowBase).attr('id')+'_'+id+'" title="'+title+'" href="#"><img src="'+image+'" /></a>');
				
				// connect the callback function
				if (typeof(callback) == 'function')
				{
					// fixed by Max Rondon (the id selector was wrong)
					$('#'+$(windowBase).attr('id')+'_'+id).click(function(e){
						return callback($(this));
					});
				}
				
				// notify window
				$(windowToolbar).css({"height":'auto'});
				$(windowBase).resize();
			},

			/**
			 * Removes selected toolbar icon
			 * @param string id	The icon id to remove 
			 */
			removeItem: function(id)
			{
				var itemid = '#'+$(windowBase).attr('id')+'_'+id; 
				var iparent = $(itemid).parents('.toolbarRow');
				
				// remove the item
				$(itemid).remove();
				
				// if the row which contained the item is empty, delete it
				if (iparent.find('a.toolbar').length == 0)
					iparent.remove();
				
				// if there are no rows, disable toolbar
				if ($(windowToolbar).find('.toolbarRow').length == 0)
				{
					$(windowToolbar).css({"height":0});
				}
				
				// notify the window
				$(windowBase).resize();
			},

			/**
			 * Add arbitrary content to the toolbar
			 * @param string s The new content HTML
			 */
			setToolbar: function(s)
			{
				// ad new content
				$(windowToolbar).html(s);
				if (s='')
					$(windowToolbar).css({'height':0});
				else
					$(windowToolbar).css({'height':'auto'});
				
				// notify the window
				$(windowBase).resize();
			},

			/**
			 * Clears the toolbar
			 */
			clearToolbar: function()
			{
				// clear the toolbar
				$(windowToolbar).html('');
				
				// notify the window
				$(windowToolbar).css({'height':0});
				$(windowBase).resize();
			}
			};
	  	  
	  	  
			//register the window object and store array index
			this.index = nJDSK.WindowList.add_item(id, this);	
	  	  
			// run callback upon window creation
			if (typeof createCallback == 'function')
			{
				createCallback('win_'+id);
			}
	  		
	  	},
	  	
	  	/**
	  	 * connect callback function
	  	 */
	  	return_confirm_callback_func: function(buttons,index,win)
	  	{
	  		return function()
	  		{
	  			if (buttons[index].callback)
	  			{
	  				buttons[index].callback(win);
	  			}
	  		};
	  	},

	  	/**
	  	 * Confirmation window, using our window class
	  	 */
	  	confirm: function(title,message,buttons)
	  	{
	  		nJDSK.customHeaderDialog('Confirm', title, message, buttons);
	  	},
	  	

	  	/**
	  	 * Custom form dialog
	  	 */
	  	customFormDialog: function(width,height,winTitle,title,message,buttons,modal,isFullGlass,callback)
	  	{
	  		var aWinId = 'w'+nJDSK.uniqid();
	  		var win = new nJDSK.Window(width,height,winTitle,'','<form action="" method="post"><h1>'+title+'</h1>'+message+'<div class="buttonarea"></div></form>',aWinId,true,modal,isFullGlass,callback);
	  		for (var i = 0; i<buttons.length;i++)
	  		{
	  			var btnType = 'button';
	  			if (buttons[i].type == 'submit')
	  				btnType = 'submit';
	  			$('#win_'+aWinId+' .buttonarea').append('<button type="'+btnType+'" class="button '+buttons[i].type+'">'+buttons[i].value+'</button>');
	  			$('#win_'+aWinId+' .buttonarea .'+buttons[i].type).click(nJDSK.return_confirm_callback_func(buttons,i,win));
	  		}
	  		return win;
	  	},
	  	
	  	
	  	/**
	  	 * Custom size dialog
	  	 */
	  	customSizeDialog: function(width,height,winTitle,title,message,buttons,isFullGlass)
	  	{
	  		var aWinId = 'w'+nJDSK.uniqid();
	  		var win = new nJDSK.Window(width,height,winTitle,'','<h1>'+title+'</h1>'+message+'<div class="buttonarea"></div>',aWinId,true,true,isFullGlass);
	  		for (var i = 0; i<buttons.length;i++)
	  		{
	  			$('#win_'+aWinId+' .buttonarea').append('<button type="button" class="button '+buttons[i].type+'">'+buttons[i].value+'</button>');
	  			$('#win_'+aWinId+' .buttonarea .'+buttons[i].type).click(nJDSK.return_confirm_callback_func(buttons,i,win));
	  		}
	  		return win;
	  	},
	  	
	  	
	  	/**
	  	 * Custom dialog
	  	 */
	  	customHeaderDialog: function(winTitle,title,message,buttons,isFullGlass)
	  	{
	  		var aWinId = 'w'+nJDSK.uniqid();
	  		var win = new nJDSK.Window(400,200,winTitle,'','<h1>'+title+'</h1><p>'+message+'</p><div class="buttonarea"></div>',aWinId,true,true,isFullGlass);
	  		for (var i = 0; i<buttons.length;i++)
	  		{
	  			$('#win_'+aWinId+' .buttonarea').append('<button type="button" class="button '+buttons[i].type+'">'+buttons[i].value+'</button>');
	  			$('#win_'+aWinId+' .buttonarea .'+buttons[i].type).click(nJDSK.return_confirm_callback_func(buttons,i,win));
	  		}
	  		return win;
	  	},
	  	
	  	/**
	  	 * Alert dialog
	  	 */
	  	alert: function(title,message,buttons)
	  	{
	  		nJDSK.customHeaderDialog('Alert',title,message,buttons);
	  	},
	  	
	  	/**
	  	 * Generate a unique id for windows
	  	 */
	  	uniqid: function()
	  	{
	  		var newDate = new Date;
	  		return newDate.getTime();
	  	},
	  	
	  	/**
	  	 * Tile windows
	  	 */
	  	
	  	tile: function(){
	  		var windowCount = this.WindowList.items.length;
	  		
	  		if (windowCount > 20)
	  			windowCount = 20;
	  		
	  		var rowCount = 1;
	  		var row1count = 1;
	  		var row2count = 1;
	  		var row3count = 1;
	  		var row4count = 1;
	  		
	  		switch(windowCount)
	  		{
	  			case 2: 
	  				rowCount = 1;
	  				row1count = 2;
	  			break;
	  			case 3:
	  				rowCount = 1;
	  				colCount = 3;
	  				row1count = 3;
	  			break;
	  			case 4:
	  				rowCount = 2;
	  				row1count = 2;
	  				row2count = 2;
	  			break;
	  			case 5:
	  				rowCount = 2;
	  				row1count = 2;
	  				row2count = 3;
	  			break;
	  			case 6:
	  				rowCount = 2;
	  				row1count = 3;
	  				row2count = 3;
	  			break;
	  			case 7:
	  				rowCount = 3;
	  				row1count = 2;
	  				row2count = 3;
	  				row3count = 2;
	  			break;
	  			case 8:
	  				rowCount = 3;
	  				row1count = 2;
	  				row2count = 3;
	  				row3count = 3;
	  			break;
	  			case 9:
	  				rowCount = 3;
	  				row1count = 3;
	  				row2count = 3;
	  				row3count = 3;
	  			break;
	  			case 10:
	  				rowCount = 3;
	  				row1count = 3;
	  				row2count = 4;
	  				row3count = 3;
	  			break;
	  			case 11:
	  				rowCount = 3;
	  				row1count = 3;
	  				row2count = 4;
	  				row3count = 4;
	  			break;
	  			case 12:
	  				rowCount = 3;
	  				row1count = 4;
	  				row2count = 4;
	  				row3count = 4;
	  			break;
	  			case 13:
	  				rowCount = 4;
	  				row1count = 3;
	  				row2count = 3;
	  				row3count = 4;
	  				row4count = 3;
	  			break;
	  			case 14:
	  				rowCount = 4;
	  				row1count = 3;
	  				row2count = 4;
	  				row3count = 4;
	  				row4count = 3;
	  			break;
	  			case 15:
	  				rowCount = 4;
	  				row1count = 3;
	  				row2count = 4;
	  				row3count = 4;
	  				row4count = 4;
	  			break;
	  			case 16:
	  				rowCount = 4;
	  				row1count = 4;
	  				row2count = 4;
	  				row3count = 4;
	  				row4count = 4;
	  			break;
	  			case 17:
	  				rowCount = 4;
	  				row1count = 4;
	  				row2count = 4;
	  				row3count = 5;
	  				row4count = 4;
	  			break;
	  			case 18:
	  				rowCount = 4;
	  				row1count = 4;
	  				row2count = 5;
	  				row3count = 5;
	  				row4count = 4;
	  			break;
	  			case 19:
	  				rowCount = 4;
	  				row1count = 4;
	  				row2count = 5;
	  				row3count = 5;
	  				row4count = 5;
	  			break;
	  			case 20:
	  				rowCount = 4;
	  				row1count = 5;
	  				row2count = 5;
	  				row3count = 5;
	  				row4count = 5;
	  			break;
	  		}
	  		
	  		var rc = 0;
	  		var cc = 0;
	  		
	  		for (var i = 0; i < windowCount; i++)
	  		{
	  			var tw = 0;
	  			var th = 0;
	  			var tt = 0;
	  			var tl = 0;
	  			
	  			if ((windowCount < 4) && (rowCount == 1))
	  			{
	  				th = $('#desktop_iconarea').height();
	  				tw = $('#desktop_iconarea').width() / row1count;
	  				tl = ($('#desktop_iconarea').width() / row1count) * i;
	  				tt = 0;
	  				this.WindowList.items[i].window_object.setDimensions(tl,tt,tw,th);
	  			}
	  			
	  			if (windowCount > 3) 
	  			{
	  				th = $('#desktop_iconarea').height() / rowCount;
	  				if (rc == 0)
	  					tw = $('#desktop_iconarea').width() / row1count;
	  				if (rc == 1)
	  					tw = $('#desktop_iconarea').width() / row2count;
	  				if (rc == 2)
	  					tw = $('#desktop_iconarea').width() / row3count;
	  				if (rc == 3)
	  					tw = $('#desktop_iconarea').width() / row4count;
	  				
	  				if (rc == 0)
	  					tl = ($('#desktop_iconarea').width() / row1count) * cc;
	  				if (rc == 1)
	  					tl = ($('#desktop_iconarea').width() / row2count) * cc;
	  				if (rc == 2)
	  					tl = ($('#desktop_iconarea').width() / row3count) * cc;
	  				if (rc == 3)
	  					tl = ($('#desktop_iconarea').width() / row4count) * cc;
	  				
	  				tt = ($('#desktop_iconarea').height() / rowCount) * rc;
	  				
	  				this.WindowList.items[i].window_object.setDimensions(tl,tt,tw,th);
	  				cc += 1;
	  				if (((rc == 0) && (cc >= row1count)) || 
	  					((rc == 1) && (cc >= row2count)) ||
	  					((rc == 2) && (cc >= row3count)))
	  				{
	  					rc += 1;
	  					cc = 0;
	  				}
	  			}
	  			
	  			
	  		}
	  	},
	  	
	  	cascade: function(){
	  		var wt = 0;
	  		var wl = 0;
	  		
	  		var windowCount = this.WindowList.items.length;
	  		
	  		for (var i = 0; i < windowCount; i++)
	  		{
	  			if ((wl+25+640) > $(wnd).width()-nJDSK.widgetWidth){
					wl = 10;
				} else {
					wl+=25;
				}
				
				if ((wt+25+480) > ($(wnd).height()-nJDSK.taskbarHeight-nJDSK.topMenuHeight)){
					wt = 10;
				} else {
					wt+=25;
				}
				
				this.WindowList.items[i].window_object.setDimensions(wl,wt,640,480);
	  		}
	  	},
	  	
	  	/**
	  	 * idea borrowed From JQuery Desktop http://desktop.sonspring.com/
	  	 * Sets background image for the Desktop environment - can be called at any time
	  	 * @param string bgimage //the background image we wish to use
	  	 */
	  	setBackground: function(bgimage)
	  	{
	  		$('#nJDSKBG').remove();
	  		$('body').prepend('<img id="nJDSKBG" src="'+bgimage+'" />');
	  		
	  	},
	  	
	  	/**
	  	 * idea borrowed From JQuery Desktop http://desktop.sonspring.com/
	  	 * Clears selection
	  	 */
	  	clearActive: function(){
	  		$('.activeIcon').removeClass('activeIcon');
	  		$('.activeMenu').removeClass('activeMenu');
	  		$('#topmenu ul ul').hide();
	  	},
	  	
	  	/**
	  	 * Put desktop system together
	  	 */
	  	init:function(){
	  		$(wnd).resize(function()
	  		{
	  			nJDSK.desktopWidth = $(wnd).width()-nJDSK.widgetWidth;
	  			nJDSK.desktopHeight = $(wnd).height()-nJDSK.taskbarHeight-nJDSK.topMenuHeight;
	  			$('#desktop').css({"height":(nJDSK.desktopHeight)+'px',"width":nJDSK.desktopWidth+'px', "top":nJDSK.topMenuHeight+'px'});
	  			$('#widgets').css({"height":$('#desktop').height()+'px','top':nJDSK.topMenuHeight+'px'});
	  			nJDSK.iconHelper.reArrangeIcons();
	  		});	
		  
	  		//$(d).ready(function(){
  			$('#topmenu').css({"height":nJDSK.topMenuHeight+'px'});
  			$('#taskbar').css({"height":nJDSK.taskbarHeight+'px'});
  			$('#widgets').css({"width":nJDSK.widgetWidth+'px'});
  			$('#desktop').click(function(e){
  				nJDSK.clearActive(e);
  			});
  			$(wnd).resize();
	  		//});
	  		
	  		// Cancel mousedown. Taken from JQuery Desktop http://desktop.sonspring.com/
	        $(d).mousedown(function(ev) {
	          /*var tags = ['a', 'button', 'input', 'select', 'textarea', 'tr', '.contentarea'];

	          if (!$(ev.target).closest(tags).length) {
	            nJDSK.clearActive();
	            ev.stopPropagation();
	          }*/
	        });	  		
	  		
	  		// taken from JQuery Desktop http://desktop.sonspring.com/
	  		$(d).on('click','a',function(e){
	  			var url = $(this).attr('href');
	  			if (url.match(/^#/)){
	  				e.preventDefault();
  					e.stopPropagation();
	  			}
	  			else
	  			{
	  				$(this).attr('target','_blank');
	  			}
	  		
	  		});
	  		
	  		// adapted from JQuery Desktop http://desktop.sonspring.com/
	  		// activate menu
	  		$(d).on('mousedown', '#topmenu>ul>li>a', function() {
	            if ($(this).siblings('ul').is(':hidden')) {
	              nJDSK.clearActive();
	              $(this).parents('li').addClass('activeMenu');
	              $(this).siblings('ul').show();
	            }
	            else {
	            	nJDSK.clearActive();
	            }
	          });
	          
	  		// Transfer focus, if already open.
	        $(d).on('mouseenter', '#topmenu>ul>li>a', function() {
	          if ($('#topmenu>ul>li>ul').is(':visible')) {
	        	  nJDSK.clearActive();
	            $(this).parents('li').addClass('activeMenu');
	            $(this).siblings('ul').show();
	          }
	        });
	        
	        // Show/hide windows on desktop
	        $('a#showdesktop').click(function(e){
	        	nJDSK.clearActive();
	        	if ($('.window').is(':visible'))
	        	{
	        		$('.window').hide();
	        	}
	        	else
	        	{
	        		$('.window').show();
	        	}
	        });
	  		
	  	}
	};
	
})(window, document, jQuery);