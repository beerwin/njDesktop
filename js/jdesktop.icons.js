/**
 * nJDesktop Virtual Desktop widget helper plugin
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
    nJDSK.iconHelper = {
        /**
         * Add icon
         * @param string iconId		the id for the new icon
         * @param string iconTitle	the icon title
         * @param string iconImage	url for icon image
         * @param function callback	click function
         */
        addIcon: function(iconId,iconTitle,iconImage,callback){
            
            $('#desktop #desktop_iconarea').append('<a class="icon" id="'+iconId+'" style="display:none"><img src="'+iconImage+'" /><span>'+iconTitle+'</span></a>');
            if (nJDSK.nextIconPos.top+nJDSK.iconMaxHeight+(nJDSK.iconMargin*2)+(nJDSK.iconBorderWeight*2) < nJDSK.desktopHeight)
            {
                $('#'+iconId).css({'left':nJDSK.nextIconPos.left+'px','top':nJDSK.nextIconPos.top+'px'});
            }
            else
            {
                nJDSK.nextIconPos.top = 0;
                nJDSK.nextIconPos.left = nJDSK.nextIconPos.left+nJDSK.iconWidth+(nJDSK.iconMargin*2)+(nJDSK.iconBorderWeight*2);
                $('#'+iconId).css({'left':nJDSK.nextIconPos.left+'px','top':nJDSK.nextIconPos.top+'px'});
            }

            if (typeof(callback) == 'function')
            {
                $('#'+iconId).dblclick(function(e){return callback(e);});
            }
            
            nJDSK.nextIconPos.top=nJDSK.nextIconPos.top+nJDSK.iconMaxHeight+nJDSK.iconMargin*2+nJDSK.iconBorderWeight*2;
            
            var icn = $('#'+iconId);
            icn.show();
            icn.mousedown(function(e){
                nJDSK.clearActive();
                icn.addClass('activeIcon');
            });
            
            icn.click(function(e){
                e.stopPropagation();
            });
            icn.draggable({containment: "parent"});
        },
        
        /**
         * Deletes selected icon
         * @param string iconId	The icon ID
         */
        removeIcon: function(iconId)
        {
            $('#'+iconId).remove();
        },
        
        /**
         * Rearranges icons - currently used by the resize function
         */
        reArrangeIcons: function(){
            nJDSK.nextIconPos.left = 0;
            nJDSK.nextIconPos.top = 0;
            $('#desktop_iconarea .icon').each(function(){
                
                if (nJDSK.nextIconPos.top+nJDSK.iconMaxHeight+(nJDSK.iconMargin*2)+(nJDSK.iconBorderWeight*2) < nJDSK.desktopHeight)
                {
                    $(this).css({'left':nJDSK.nextIconPos.left+'px','top':nJDSK.nextIconPos.top+'px'});
                }
                else
                {
                    nJDSK.nextIconPos.top = 0;
                    nJDSK.nextIconPos.left = nJDSK.nextIconPos.left+nJDSK.iconWidth+(nJDSK.iconMargin*2)+(nJDSK.iconBorderWeight*2);
                    $(this).css({'left':nJDSK.nextIconPos.left+'px','top':nJDSK.nextIconPos.top+'px'});
                }
                
                nJDSK.nextIconPos.top=nJDSK.nextIconPos.top+nJDSK.iconMaxHeight+nJDSK.iconMargin*2+nJDSK.iconBorderWeight*2;
                
            });
        }
    }
})(window,document,jQuery);