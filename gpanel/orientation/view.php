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
	<div class="content">
    	<p class="title">Search<span class="br_abs note">inline block</span></p>
    	<form action="view.php" method="post" class="gform">
        	<fieldset><legend>Student Information</legend><div class="inner">
		    	<div class="row">
        	        <label class="ralign">Username</label>
            	    <input type="text" name="username" id="focus" value="<?php echo $username;?>" />
	            </div>
    	        <div class="row">
            	    <label class="ralign">First Name</label>
                	<input type="text" name="firstname" value="<?php echo $firstname;?>" />
                    <label class="ralign">Last Name</label>
                    <input type="text" name="lastname" value="<?php echo $lastname;?>" />
	        	</div>
                <div class="row">
                	<input type="checkbox" name="zelda" value="1" />
                    <label>Zelda</label>
                </div>
                <div class="row">
                    <input type="checkbox" name="mario" value="1" />
                   	<label>Mario</label>
                </div>
    	        <div class="row">
        	    	<label>&nbsp;</label>
            		<input type="submit" name="search" value="Search" />
	            </div>
            </div></fieldset>
    	</form>
    </div>
    <?php echo $results; ?>
<?php
g::end_content();
?>