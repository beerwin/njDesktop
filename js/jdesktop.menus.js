/**
 * nJDesktop Virtual Desktop menu helper plugin
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

(function(wnd,d,$){
    nJDSK.menuHelper = {
        /**
         * Adds a new menu item to the top menu bar
         * @param string parentId //the id of the parent item. If left empty, a new top level item will be created
         * @param string menuId // the id of the new menu. Required. Cannot be duplicate.
         * @param string menuTitle // The menu link text
         * @param string menuHref // the target location of the link. can be a normal url, empty or '#'
         * @param string menuIcon // menu image url, optional
         * @param function clickCallBack // A callback function when the link is clicked - available only when menuHref is emtpty or '#'
         */
        addMenu:function(parentId,menuId,menuTitle,menuHref,menuIcon,clickCallback){
            if ($.trim(menuId) == ''){
                return;
            }
            var menuParent = $('#topmenu>ul');
            if ($.trim(parentId) !=='')
            {
                var tmpParent = $('#'+parentId);
                if (tmpParent.length > 0)
                {
                    tmpParent2 = tmpParent;
                    tmpParent = tmpParent.find('ul');
                    
                    if (tmpParent.length > 0)
                        menuParent = tmpParent;
                    else{
                        tmpParent2.append('<ul></ul>');
                        menuParent =$('#'+parentId).find('ul');
                    }
                        
                }
            }
            
            var mh = menuHref;
            if ($.trim(mh) == '')
                mh = '#';
            var mi = menuIcon;
            if ($.trim(mi)!='')
            {
                mi = '<img src="'+mi+'" />';
            }
            menuParent.append('<li id="'+menuId+'"><a href="'+mh+'"><span class="menu_icon">'+mi+'</span><span class="menu_title">'+menuTitle+'</span></a></li>');
            $('#'+menuId+'>a').click(function(e){
                
                if (mh == '#')
                {
                    
                    if (typeof(clickCallback) == 'function')
                    {
                        
                        clickCallback();
                        nJDSK.clearActive();
                    }
                }
            });
        }
    }
})(window,document,jQuery);
