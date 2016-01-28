<?php
  // Build out URI to reload from form dropdown
  // Need full url for this to work in Opera Mini
  $pageURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";

  if (isset($_POST['sg_uri']) && isset($_POST['sg_section_switcher'])) {
     $pageURL .= $_POST[sg_uri].$_POST[sg_section_switcher];
     header("Location: $pageURL");
  }

  // Display title of each markup samples as a select option
  function listMarkupAsOptions ($type) {
    $files = array();
    $handle=opendir('markup/'.$type);
    while (false !== ($file = readdir($handle))):
        if(stristr($file,'.html')):
            $files[] = $file;
        endif;
    endwhile;

    sort($files);
    foreach ($files as $file):
        $filename = preg_replace("/\.html$/i", "", $file); 
        $title = preg_replace("/\-/i", " ", $filename);
        $title = ucwords($title);
        echo '<option value="#sg-'.$filename.'">'.$title.'</option>';
    endforeach;
  }

  // Display markup view & source
  function showMarkup($type) {
    $files = array();
    $handle=opendir('markup/'.$type);
    while (false !== ($file = readdir($handle))):
        if(stristr($file,'.html')):
            $files[] = $file;
        endif;
    endwhile;

    sort($files);
    foreach ($files as $file):
        $filename = preg_replace("/\.html$/i", "", $file);
        $title = preg_replace("/\-/i", " ", $filename);
        echo '<div class="sg-markup sg-section">';
        echo '<div class="sg-display">';
        echo '<h2 class="sg-h2"><a id="sg-'.$filename.'" class="sg-anchor">'.$title.'</a></h2>';
        include('markup/'.$type.'/'.$file);
        echo '</div>';
        echo '<div class="sg-markup-controls"><a class="sg-btn sg-btn--source" href="#">View Source</a> <a class="sg-btn--top" href="#top">Back to Top</a> </div>';
        echo '<div class="sg-source sg-animated">';
        echo '<a class="sg-btn sg-btn--select" href="#">Get the code</a>';
        echo '<pre class="prettyprint linenums"><code>';
        echo htmlspecialchars(file_get_contents('markup/'.$type.'/'.$file));
        echo '</code></pre>';
        echo '</div>';
        echo '</div>';
    endforeach;
  }
?>

<!DOCTYPE html>
<head>
<meta charset="utf-8">
  <title>Style TCHHN</title>
  <meta name="viewport" content="width=device-width">
  <!-- Style Guide Boilerplate Styles -->
  <link rel="stylesheet" href="css/sg-style.css">
  <link rel="stylesheet" href="css/style.css">
  <!-- Replace below stylesheet with your own stylesheet -->
  <link rel="stylesheet" href="/public/assets/css/main.css">
  <style>
  .icon-search:before {
    content: url(images/mag-glass.png);
  }
  div[class="styled-dropdown"] {
    width: 200px !important;
  }
</style>
<script src="js/vendor/modernizr.custom.min.js"></script>
</head>
<body class="body-home" data-script-component="home">
    
<div id="top" class="sg-header sg-container">
  <h1 class="sg-logo">STYLE GUIDE <span>TCHHN</span></h1>
  <form id="js-sg-nav" action=""  method="post" class="sg-nav">
    <select id="js-sg-section-switcher" class="sg-section-switcher" name="sg_section_switcher">
        <option value="">Jump To Section:</option>
        <optgroup label="Intro">
          <option value="#sg-about">About</option>
          <option value="#sg-colors">Colors</option>
          <option value="#sg-fontStacks">Font-Stacks</option>
        </optgroup>
        <optgroup label="Base Styles">
          <?php listMarkupAsOptions('base'); ?>
        </optgroup>
        <optgroup label="Pattern Styles">
          <?php listMarkupAsOptions('patterns'); ?>
        </optgroup>
    </select>
    <input type="hidden" name="sg_uri" value="<?php echo $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"]; ?>">
    <button type="submit" class="sg-submit-btn">Go</button>
  </form><!--/.sg-nav-->
</div><!--/.sg-header-->

<div class="sg-body sg-container">
  <div class="sg-info">               
    <!-- <div class="sg-about sg-section">
      <h2 class="sg-h2"><a id="sg-about" class="sg-anchor">About</a></h2>
      <p>Comments and documentation about your style guide. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Necessitatibus nobis enim labore facilis consequuntur! Veritatis neque est suscipit tenetur temporibus enim consequatur deserunt perferendis. Neque nemo iusto minima deserunt amet.</p>
    </div> --><!--/.sg-about-->
    
    <div class="sg-colors sg-section">
      <h2 class="sg-h2"><a id="sg-colors" class="sg-anchor">PrimaryColors</a></h2>
        <div class="sg-color sg-color--a"><span class="sg-color-swatch"><span class="sg-animated">#002d56</span></span></div>
        <div class="sg-color sg-color--b"><span class="sg-color-swatch"><span class="sg-animated">#0077c0</span></span></div>
        <div class="sg-color sg-color--c"><span class="sg-color-swatch"><span class="sg-animated">#eb8a21</span></span></div>
        <div class="sg-color sg-color--d"><span class="sg-color-swatch"><span class="sg-animated">#f8ba1b</span></span></div>
        <div class="sg-color sg-color--e"><span class="sg-color-swatch"><span class="sg-animated">#ffd457</span></span></div>
        <div class="sg-color sg-color--f"><span class="sg-color-swatch"><span class="sg-animated">#f0f2f3</span></span></div>

        <h2 class="sg-h2"><a id="sg-colors" class="sg-anchor">SecondaryColors</a></h2>
        <div class="sg-color sg-color--g"><span class="sg-color-swatch"><span class="sg-animated">#ffeebb</span></span></div>
        <div class="sg-color sg-color--h"><span class="sg-color-swatch"><span class="sg-animated">#ffde75</span></span></div>
        <div class="sg-color sg-color--i"><span class="sg-color-swatch"><span class="sg-animated">#f8971d</span></span></div>
        <div class="sg-color sg-color--j"><span class="sg-color-swatch"><span class="sg-animated">#e87d1e</span></span></div>
        <div class="sg-color sg-color--k"><span class="sg-color-swatch"><span class="sg-animated">#a0c4da</span></span></div>
        <div class="sg-color sg-color--l"><span class="sg-color-swatch"><span class="sg-animated">#80a1b6</span></span></div>
        <div class="sg-color sg-color--m"><span class="sg-color-swatch"><span class="sg-animated">#b9e0f7</span></span></div>
        <div class="sg-color sg-color--n"><span class="sg-color-swatch"><span class="sg-animated">#4fb3cf</span></span></div>
        <div class="sg-color sg-color--o"><span class="sg-color-swatch"><span class="sg-animated">#babcbe</span></span></div>
        <div class="sg-color sg-color--p"><span class="sg-color-swatch"><span class="sg-animated">#efe9e5</span></span></div>
        <div class="sg-color sg-color--q"><span class="sg-color-swatch"><span class="sg-animated">#455560</span></span></div>
        <div class="sg-color sg-color--r"><span class="sg-color-swatch"><span class="sg-animated">#261c02</span></span></div>

        <div class="sg-markup-controls"><a class="sg-btn--top" href="#top">Back to Top</a></div>
    </div><!--/.sg-colors-->
    
    <div class="sg-font-stacks sg-section">
      <h2 class="sg-h2"><a id="sg-fontStacks" class="sg-anchor">Font Stacks</a></h2>
      <p class="sg-font sg-font-primary">"PT Sans", arial, sans-serif;</p>
<!--       <p class="sg-font sg-font-secondary">Georgia, Times, "Times New Roman", serif;</p>
 -->      <div class="sg-markup-controls"><a class="sg-btn--top" href="#top">Back to Top</a></div>
    </div><!--/.sg-font-stacks-->
  </div><!--/.sg-info-->    

  <div class="sg-base-styles">    
    <h1 class="sg-h1">Base Styles</h1>
    <?php showMarkup('base'); ?>
  </div><!--/.sg-base-styles-->

  <div class="sg-pattern-styles">
    <h1 class="sg-h1">Pattern Styles</h1>
    <?php showMarkup('patterns'); ?>
    </div><!--/.sg-pattern-styles-->
  </div><!--/.sg-body-->

  <!-- LOAD APPROPRIATE JQUERY FROM CDN WITH FALLBACK -->
<!--[if gte IE 9]><!-->
<script src="http://code.jquery.com/jquery-2.0.3.min.js"></script>
<!--<![endif]-->
<!--[if lt IE 9]>
<script src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<![endif]-->
<script>('jQuery' in window) || document.write(unescape("%3Cscript src='/js/vendor/jquery-1.10.2.min.js'%3E%3C/script%3E"));</script>

<!-- IE POLYFILLS -->
<!--[if lt IE 10]>
<script src="/js/vendor/jquery.placeholder.js"></script>
<![endif]-->
<!--[if lt IE 8]>
<script src="/js/vendor/IE8.js"></script>
<![endif]-->

<!-- SCRIPTS -->
<script src="js/app.js"></script>
<script src="js/vendor/jquery.uDropdown.js"></script>


  <script src="js/sg-plugins.js"></script>
  <script src="js/sg-scripts.js"></script>

</body>
</html>