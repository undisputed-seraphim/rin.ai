<?php
session_start();
include_once( '../config.php' );

g::init( "orientation" ) or die( "Database connection unsucessful." );
( g::login() && g::access( "r_ORI_VIEW" ) ) or g::redirect();

$results = "";

if( isset( $_POST['search'] ) ) {
	$chosen = array();
	$params = array();
	
	$data = array( "username", "firstname", "lastname" );
	g::add_post_data( $chosen, $params, $data );
	
	if( isset( $_POST['limit'] ) )
		if( $_POST['limit'] !== ori::$limit )
			if( is_numeric( g::clean_data( $_POST['limit'] ) ) )
				ori::$limit = g::clean_data( $_POST['limit'] );
			
	//jacobyork7889
	$res = ori::get_attempts( $chosen, $params );
	$results = '<div class="content">'.$res.'</div>';
}

g::start_content( "Orientation - View Attempts", "gPanel - Orientation" );
/* content goes here, html is already inside the <div id="content"> */
$username = g::post_string( "username" );
$firstname = g::post_string( "firstname" );
$lastname = g::post_string( "lastname" );

?>
	<div class="content"><input class="rfloat" type="button" id="advanced" name="advanced" value="Show Advanced..." />
    	<p class="title">Search</p>
    	<form action="<?php echo WEB_ROOT; ?>orientation/" method="post" class="gform">
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
            <div id="advanced_fieldset" class="hidden">
	            <div class="spacer">&nbsp;</div>
    	        <fieldset><legend>Advanced</legend><div class="inner">
        	        <div class="row">
	        	        <label class="ralign">Result Limit</label>
   	            		<input type="text" name="limit" value="<?php echo ori::$limit;?>" />
	           	    </div>
    	        </div></fieldset>
            </div>
            <div class="spacer">&nbsp;</div>
            <div class="inner_lr">
    	        <div class="row">
        	    	<label>&nbsp;</label>
            		<input type="submit" name="search" value="Search" />
	            </div>
            </div>
    	</form>
        <!--<div class="separator"></div>
        <div class="content_footer">
	        <div class="legend">
    	    	<table>
        	    	<tr>
            	        <td><p>Pass</p><div class="pass">&nbsp;</div></td>
                	    <td>Fail<div class="fail">&nbsp;</div></td>
                    	<td>Incomplete<div class="blank">&nbsp;</div></td>
	                </tr>
    	        </table>
            </div>
        </div>-->
    </div>
    <?php echo $results; ?>
<?php
g::$javascript .= '
$("#advanced").bind("onclick", function( e ) {
	$("#advanced_fieldset").toggleClass( "hidden" );
	if( $("#advanced_fieldset").hasClass( "hidden" ) )
		this.attribute( "value", "Show Advanced..." );
	else
		this.attribute( "value", "Hide Advanced..." );
});
';
g::end_content();
?>