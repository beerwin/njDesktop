/**
 * nJDesktop Virtual Desktop demo application JS
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

var nJDSKApp = (function(w,d,$){
	return{
		/**
		 * Creates the top menus (This is the demo for the built-in menu helper plugin)
		 */
		createMenus:function(){
			/*addMenu params: parent, id, title, href, icon, function(optional)*/
			nJDSK.menuHelper.addMenu('','linksmenu','Links','#','');
			/*This menu item creates a dialog when clicked*/
			nJDSK.menuHelper.addMenu('linksmenu','linksmenu-1','Link with icon and callback','#','images/icons/silk/link.png',function(){
				nJDSK.customHeaderDialog(
						'Callback for Links &gt; Link with icon and callback',
						'Callback',
						'This dialog popped up after you clicked on that menu item',
						[
						 	{
						 		type:'ok_yes',
						 		value:'OK',
						 		callback:function(win)
						 		{
						 			win.close();
						 		}
						 	},
						 	{
						 		type:'no_cancel',
						 		value:'Cancel',
						 		callback:function(win)
						 		{
						 			win.close();
						 		}
						 	}
						]
				);
				return false;
			});
			/*dummy menus to fill up the menu*/
			nJDSK.menuHelper.addMenu('','othermenu','Other','#','');
			nJDSK.menuHelper.addMenu('othermenu','othermenu-1','Other SubMenu item','#','');
			nJDSK.menuHelper.addMenu('othermenu','othermenu-2','Other SubMenu item','#','');
			
			// demo menus for nJDSK extra functions
			nJDSK.menuHelper.addMenu('','windowmenu','Window','#','');
			// tile menu
			nJDSK.menuHelper.addMenu('windowmenu','tile-1','Tile','#','',function(){
				nJDSK.tile();
				return false;
			});
			// cascade menu
			nJDSK.menuHelper.addMenu('windowmenu','cascade-1','Cascade','#','',function(){
				nJDSK.cascade();
				return false;
			});
		},
		
		// Pad string function for the updateClock function (demo widget)
		// added by gyorgysagi@gmail.com
		padDigits: function(number, digits) {
		    return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
		},
		
		// This is the clock updater function for the demo widget
		updateClock:function(x_id){
			var wdgDate = new Date();
			hours = wdgDate.getHours();
			minutes = wdgDate.getMinutes();
			year = wdgDate.getFullYear();
			month = wdgDate.getMonth()+1;
			day = wdgDate.getDate();
			$('#'+x_id+' .widget-content').html('<div class="wdg_clock">'+this.padDigits(hours,2)+':'+this.padDigits(minutes,2)+'</div><div class="wdg_cal">'+this.padDigits(month,2)+'/'+this.padDigits(day,2)+'/'+year);
			setTimeout("nJDSKApp.updateClock('"+x_id+"')",60000);
		},
		
		// create icons on the desktop, load the menu and the widgets
		init: function()
		{
			// load top menu (see top)
			nJDSKApp.createMenus();
			
			// Create an icon (params: id, title, icon image, click callback)
			nJDSK.iconHelper.addIcon('iconTest','About','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				
				// create an about box by using a dialog (dialog params: window title, dialog heading, dialog content, buttons array(button type(css class), text, click function ))
				nJDSK.customHeaderDialog(
					'About',
					'About nJDesktop',
					'Created by Nagy Ervin<br />Colorful HQ background image by <a href="http://www.superhqwallpapers.com/2012/02/07/hq-random-backgrounds/colorful-hq-background-1920x1200/">Super Hq Wallpapers</a><br />Menu Silk Icons by <a href="http://famfamfam.com/">FAMFAMFAM</a>',
					[
					 	{
					 		type:'ok_yes',
					 		value:'OK',
					 		callback:function(win){
					 			win.close();
					 		}
					 	}
					]
				);
				
				return false;
			});
			
			// this icon creates a normal resizable window
			nJDSK.iconHelper.addIcon('resIcon','Normal Resizable window','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				// get some html text via ajax
				$.get('xct.html?ver='+nJDSK.uniqid(),function(msg){
					// windows can be created in an ajax callback function (params: width, height, title, toolbar content, content, id [, window is a dialog, window is a modal, window is glassy, callback function upon creation])
					var newWindow = new nJDSK.Window(640,480,'A window with text','',msg, nJDSK.uniqid());
					// add text to window footer (window footer is optional)
					newWindow.setFooter('This is a dynamic footer');
				});
				
				return false;
			});
			
			// this icon creates a "Glassy" dialog (content and button area is translucent)
			nJDSK.iconHelper.addIcon('iconTest2','About Glassy','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				
				nJDSK.customHeaderDialog(
					'Test',
					'This is a test',
					'Test content',
					[
					 	{
					 		type:'ok_yes',
					 		value:'OK',
					 		callback:function(win){
					 			win.close();
					 		}
					 	}
					],
					true
				);
				
				return false;
			});
			
			// this icon creates a glassy resizable window (content area is translucent)
			nJDSK.iconHelper.addIcon('resIconGlassy','Glassy Resizable window','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				$.get('xct.html',function(msg){
					var newWindow = new nJDSK.Window(640,480,'A Glassy window with text','',msg, nJDSK.uniqid());
					newWindow.setFooter('This is a dynamic footer');
					newWindow.setFullGlass();
				});
				
				return false;
			});

			
			// this icon creates a glassy resizable window (content area is translucent)
			nJDSK.iconHelper.addIcon('resIconFormWindow','Basic HTML Form elements','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				$.get('form.html',function(msg){
					var newWindow = new nJDSK.Window(640,520,'Form elements','',msg, nJDSK.uniqid());
					// create a radio button group
					$('#radio').buttonset();
					// checkbox
					$('#item4').button();
					// Select menu
					$('#item2').selectmenu({width:150});
					newWindow.setFooter('This is a dynamic footer');
					// find the form in the new window. We can use the window's base property, it holds the window's main wrapper div
					$(newWindow.base).find('#test_form').submit(function(e){
						e.preventDefault();
						// we close the window with submit button
						newWindow.close();
						
						// and show an alert
						nJDSK.alert(
								'Form submitted',
								'The form has been submitted.',
								[
								 	{
								 		type:'ok_yes',
								 		value:'OK',
								 		callback:function(win){
								 			win.close();
								 		}
								 	}
								 ]
							);
						return false;
					});
				});
				
				return false;
			});
			
			
			// this icon creates a window with a toolbar
			nJDSK.iconHelper.addIcon('resIconX','Resizable window with toolbar items','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				$.get('xct.html?ver='+nJDSK.uniqid(),function(msg){
					// create window
					var newWindow = new nJDSK.Window(640,480,'A window with text and toolbar','',msg, nJDSK.uniqid());
					// add toolbar items (params: toolbar row(Yes, you cn use multiple rows), id, title, icon, click function)
					// This is a built-in helper plugin
					newWindow.toolbarHelper.addItem(
							'row1',
							'UpDir',
							'UpDir',
							'images/icons/silk/arrow_up.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Arrow Up has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
							}
							
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'Refresh',
							'Refresh',
							'images/icons/silk/arrow_refresh.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Arrow Refresh has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
								
							}
							
					);
					// separator
					newWindow.toolbarHelper.addItem(
							'row1',
							'',
							'separator'
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'resIconX_AddNew',
							'Add New',
							'images/icons/silk/page.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Page button has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
							
							}
							
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'Edit',
							'Edit',
							'images/icons/silk/page_edit.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Page Edit has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
								
							}
							
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'Delete',
							'Delete',
							'images/icons/silk/page_delete.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Page Delete has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
								
							}
							
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'',
							'separator'
					);
					newWindow.toolbarHelper.addItem(
							'row1',
							'CreateFolder',
							'Create Folder',
							'images/icons/silk/folder_add.png',
							function(sender)
							{
								nJDSK.alert(
									'Message',
									'Folder Add has been clicked',
									[
									 	{
									 		type:'ok_yes',
									 		value:'OK',
									 		callback:function(win){
									 			win.close();
									 		}
									 	}
									]);
								
							}
							
					);
					newWindow.setFooter('This is a dynamic footer');
				});
				
				return false;
			});
			
			nJDSK.iconHelper.addIcon('resIconX1','Text','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				$.get('text.html?ver='+nJDSK.uniqid(),function(msg){
					var newWindow = new nJDSK.Window(640,480,'A window with text','',msg, nJDSK.uniqid());
					newWindow.setFooter('This is a dynamic footer');
				});
				
				return false;
			});
			
			// this icon creates a window with events
			nJDSK.iconHelper.addIcon('resIconEvents','Window with events','images/bws_logo2k9.png',function(e){
				e.preventDefault();
				$.get('xct.html',function(msg){
					var newWindow = new nJDSK.Window(640,480,'Window with events','',msg, nJDSK.uniqid(),false,false,false,function(){
						alert('Created');
					});
					newWindow.setFooter('This is a dynamic footer');
					
					newWindow.onBeforeClose=function(win_id){
						return confirm('Close?');
					};
					newWindow.onAfterClose=function(win_id){
						alert('Closed');
					};
					
					newWindow.onMinimize = function(win_id){
						alert('Minimized');
					}

					newWindow.onMaximize = function(win_id){
						alert('Maximized');
					}

					newWindow.onRestore = function(win_id){
						alert('Restored');
					}
					
					newWindow.onResize=function(win){
					  win.setFooter($(win.base).width()+':'+$(win.base).height());
					};
				});
				
				return false;
			});			
			
			// add a widget (params: widget id, widget title, widget content, widget init function)
			nJDSK.widgets.addItem('wdgClock','Clock','<div class="wdg-clock"></div>',function(id){

				var x_id = id;
				
				nJDSKApp.updateClock(x_id);
				
				setTimeout("nJDSKApp.updateClock('"+x_id+"')",60000);
				
			});
			
			nJDSK.widgets.addItem('wdgThemes','Themes','<div class="wdg-themes"></div>',function(id){
				var l1 = $('<a></a>').appendTo($('#wdgThemes .widget-content')).html('Redmond').addClass('theme-link').attr('href','?theme=redmond').attr('target','_self');
				if ('redmond' == nJDSKCurrentTheme)
				{
					l1.addClass('currentTheme');
				}
				var l2 = $('<a></a>').appendTo($('#wdgThemes .widget-content')).html('BWS Light').addClass('theme-link').attr('href','?theme=bwslight').attr('target','_self');
				if ('bwslight' == nJDSKCurrentTheme)
				{
					l2.addClass('currentTheme');
				}
			});
		}
	};
})(window, document, jQuery);

$(document).ready(function(){
	// initialize desktop
	nJDSK.init();
	// load and initialize our demo app
	nJDSKApp.init();
	// load optional background image for the desktop environment
	nJDSK.setBackground('images/colorful-hq-background-1920x1200.jpg');
});