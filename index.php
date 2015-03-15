<!DOCTYPE html>
<html>
<head>
<!-- 

 * nJDesktop Virtual Desktop basic HTML structure
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

 -->
<?php

	if (isset($_GET['theme']) && trim($_GET['theme']) != '')
	{
		$theme = $_GET['theme'];
		if ((stripos($theme, '://') === false) && (stripos($theme, '..') === false) && (stripos($theme,'/') === false))
		{
			$theme = $_GET['theme'];
		}
		else
		{
			$theme = 'redmond';
		}
	}
	else
	{
		$theme = 'redmond';
	}

?>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Desktop</title>
<link href="css/jdesktop.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/jquery-ui/jquery-ui.min.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/jquery-ui/jquery-ui.structure.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/jquery-ui/jquery-ui.theme.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/jdesktop.forms.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/jdesktop.text.css" rel="stylesheet" />
<link href="themes/<?php echo $theme; ?>/style.css" rel="stylesheet" />
<!--[if IE]>
<link href="css/jdesktop.ie.all.css" rel="stylesheet" type="text/css" />  
<![endif]-->
<!--[if lte IE 8]>
<link href="css/jdesktop.ie.css" rel="stylesheet" type="text/css" />  
<![endif]-->
<script>nJDSKCurrentTheme = '<?php echo $theme;?>';</script>
</head>
<body>
	
	<div id="wrapper">
		<div id="desktop">
			<div id="desktop_iconarea"></div>
		</div>
		<div id="widgets"></div>
		<div id="topmenu">
			<ul></ul>
		</div>
		<div id="taskbar">
			<a id="showdesktop" href="#" title="Show desktop">Menu</a>
			<div class="separator"></div>
			<div class="taskbarbuttons" id="taskbarbuttons"></div>
			<div class="separator"></div>
		</div>
	</div>
	<script src="js/vendor/jquery-1.11.2.min.js"></script>
	<script src="js/vendor/jquery-ui.min.js"></script>
	<script src="js/vendor/jquery.ui.selectmenu.js"></script>
	<script src="js/vendor/jquery.scrollTo-min.js"></script>
	<script src="themes/<?php echo $theme; ?>/theme.js"></script>
	<script src="js/jdesktop.js"></script>
	<script src="js/jdesktop.widgets.js"></script>
	<script src="js/app.js"></script>
</body>
</html>