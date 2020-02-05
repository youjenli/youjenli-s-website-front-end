<?php 
    /* 這個樣板負責載入實現 spa 的程式碼 */ 
    
    require('parameters.php');
?>
<div id="react-root"></div>
<script type="text/javascript" src="<?php echo get_theme_file_uri( path_join($pathOfJsSrcFiles, 'index.js') ); ?>"></script>
<?php //https://developer.wordpress.org/reference/functions/path_join/ ?>