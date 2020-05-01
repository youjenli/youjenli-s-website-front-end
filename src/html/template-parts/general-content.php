<?php 
    /* 這個樣板負責載入實現 spa 的程式碼 */ 
    
    require('parameters.php');
?>
<div id="react-root"></div>
<script type="text/javascript" src="<?php echo get_theme_file_uri( $pathOfMainJsOutputFile ); ?>"></script>
<script src="https://cdn.jsdelivr.net/npm/es6-promise@4/dist/es6-promise.auto.min.js"></script>
<?php // 以上函式庫是用來自動偵測執行環境是否支援 es6 promise 函式庫並視情況產生實作。 ?>