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
	
	$b_username = g::post_b( "c_username" );
	$b_firstname = g::post_b( "c_firstname" );
	
	if( $b_username ) {
		$chosen[] = "username";
		$params[] = array( "s" => g::clean_data( $_POST['username'] ) );
	}
	if( $b_firstname ) {
		$chosen[] = "firstname";
		$params[] = array( "s" => g::clean_data( $_POST['firstname'] ) );
	}
	//jacobyork7889
	$res = ori::get_moodle_attempt( $chosen, $params );	
	if( $res )
		$results = ori::table_from_results( $res );
}

g::start_content( "Orientation - View Attempts", "gPanel - Orientation" );
/* content goes here, html is already inside the <div id="content"> */
$username = isset( $_POST['username'] ) ? g::clean_data( $_POST['username'] ) : "";
$firstname = isset( $_POST['firstname'] ) ? g::clean_data( $_POST['firstname'] ) : "";
$c_username = $b_username ? ' checked="checked"' : '';
$c_firstname = $b_firstname ? ' checked="checked"' : '';

?>
	<div class="content">
    	<p class="title">Search by:</p>
    	<form action="view.php" method="post">
	    	<div class="form_line">
    	    	<div class="item">
                	<input type="checkbox" name="c_username" id="c_username" value="u" <?php echo $c_username; ?>/>
                    <label for="c_username">Username</label>
                </div>
                <div class="item">
                	<input type="text" name="username" value="<?php echo $username;?>" />
                </div>
            </div>
            <div class="form_line">
                <div class="item">
                	<input type="checkbox" name="c_firstname" id="c_firstname" value="u" <?php echo $c_firstname; ?>/>
                    <label for="c_firstname">First name</label>
                </div>
	            <div class="item">
                	<input type="text" name="firstname" value="<?php echo $firstname;?>" />
                </div>
        	</div>
    	    <div class="form_line">
            	<div class="form_item"><input type="submit" name="search" value="Search" /></div>
        	</div>
    	</form>
    </div>
    <div class="content">
	    <p class="title">Results</p>
    	<div><?php echo $results; ?></div>
    </div>
<?php
g::end_content();
?>