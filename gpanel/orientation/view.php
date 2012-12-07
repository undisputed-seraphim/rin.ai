<?php
session_start();
include_once( '../config.php' );

g::init( "orientation" ) or die( "Database connection unsucessful." );
( g::login() && g::access( r_ORIENTATION_VIEW ) ) or g::redirect();

$db = new db( ORI_DB_HOST, ORI_DB_USER, ORI_DB_PASS, ORI_DB_NAME );
$db->connected or die( "Could not connect to orientation database." );

$results = "";
if( isset( $_POST['search'] ) ) {
	$by_username = $db->prepare(
		'SELECT g.userid, u.username, concat(u.firstname, " ", u.lastname) AS "fullname", '.
			'u.email, i.itemname AS item, i.itemtype AS itemtype, '.
			'g.finalgrade AS grades, g.timecreated, '.
			'DATE_FORMAT( FROM_UNIXTIME( g.timemodified ), "%W, %M %d, %Y, %h:%i %p" ) as timemodified '.
		'FROM mdl_grade_grades g '.
			'JOIN mdl_user u ON u.id = g.userid '.
			'JOIN mdl_grade_items i ON g.itemid = i.id '.
			'JOIN mdl_course c ON i.courseid = c.id '.
		'WHERE c.fullname = "ECPI Online Student Orientation" AND i.itemtype != "category" '.
			'AND u.username = ? '.
		'ORDER BY u.lastname, item DESC' );
//jacobyork7889
	$r_by_username = $by_username->execute( array( "s" => $_POST['username'] ) );
	$results = $r_by_username;
}

g::start_content( "Orientation - View Attempts", "gPanel - Orientation" );
/* content goes here, html is already inside the <div id="content"> */
$username = isset( $_POST['username'] ) ? $_POST['username'] : "";
?>
	<div class="content">
    	<p class="title">Search by:</p>
    	<form action="view.php" method="post">
	    	<div class="form_line">
        		<div class="item"><input type="radio" name="choice" value="u" /></div>
    	    	<div class="item"><label>Username</label></div>
	            <div class="item"><input type="text" name="username" value="<?php echo $username;?>" /></div>
        	</div>
    	    <div class="form_line">
	        	<div class="form_item"></div>
            	<div class="form_item"><input type="submit" name="search" value="Search" /></div>
        	</div>
    	</form>
	    <div><?php g::print_results( $results, array( "username", "fullname", "item", "grades", "timemodified" ) );?></div>
    </div>
<?php
g::end_content();
?>