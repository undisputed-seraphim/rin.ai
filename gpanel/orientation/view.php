<?php
session_start();
include_once( '../config.php' );

g::init( "orientation" ) or die( "Database connection unsucessful." );
( g::login() && g::access( r_ORIENTATION_VIEW ) ) or g::redirect();

$results = "";
$b_username = 0;
$b_firstname = 0;

if( isset( $_POST['search'] ) ) {
	$chosen = array();
	$params = array();
	$data = array( "username", "firstname", "lastname" );
	
	g::add_post_data( $chosen, $params, $data );
	//jacobyork7889
	$res = ori::get_moodle_attempt( $chosen, $params );
	$results = '<div class="content">';
	$results .= ori::table_from_results( $res );
	$results .= '</div>';
}

g::start_content( "Orientation - View Attempts", "gPanel - Orientation" );
/* content goes here, html is already inside the <div id="content"> */
$username = g::post_string( "username" );
$firstname = g::post_string( "firstname" );
$lastname = g::post_string( "lastname" );

?>
	<div class="content"><input class="rfloat" type="button" id="advanced" name="advanced" value="Show Advanced..." />
    	<p class="title">Search</p>
    	<form action="view.php" method="post" class="gform">
        	<fieldset><legend>Student Information</legend><div class="inner">
		    	<div class="row">
        	        <label class="ralign">Username</label>
            	    <input type="text" name="username" id="focus" value="<?php echo $username;?>" />
	            </div>
    	        <div class="row">
            	    <label class="ralign">First Name</label>
                	<input type="text" name="firstname" value="<?php echo $firstname;?>" />
	        	</div>
                <div class="row">
	                <label class="ralign">Last Name</label>
                    <input type="text" name="lastname" value="<?php echo $lastname;?>" />
                </div>
            </div></fieldset>
            <fieldset id="advanced_fieldset" class="hidden"><legend>Advanced</legend><div class="inner">
                <div class="row">
	                <label class="ralign">Zelda</label>
   	            	<input type="checkbox" name="zelda" value="1" />
           	    </div>
               	<div class="row">
                    <label class="ralign">Mario</label>
                    <input type="checkbox" name="mario" value="1" />
      	        </div>
            </div></fieldset>
            <div class="inner_lr">
    	        <div class="row">
        	    	<label>&nbsp;</label>
            		<input type="submit" name="search" value="Search" />
	            </div>
            </div>
    	</form>
    </div>
    <?php echo $results; ?>
<?php
g::$javascript .= '<script type="text/javascript">
$("#advanced").bind("onclick", function( e ) {
	$("#advanced_fieldset").toggleClass( "hidden" );
	if( $("#advanced_fieldset").hasClass( "hidden" ) )
		this.prop( "value", "Show Advanced..." );
	else
		this.prop( "value", "Hide Advanced..." );
});
</script>';
g::end_content();
?>