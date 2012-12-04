<?php
session_start();
include_once( 'config.php' );

g::init() or die( "Database connection unsucessful." );

if( g::login() )
	$msg = 'Chose an area to the left or below.';
else if( isset( $_POST[ 'submit' ] ) ) {
	$loggedin = g::login( true );
	if( !$loggedin )
		$msg = '<span style="color: red;">Invalid Login</span>.';
	else
		$msg = 'Chose an area to the left or below.';
} else
	$msg = "Enter your credentials below to login.";

/* premade queries for security */
$courses = g::prepare( "select * from mdl1_8block where name = ?" );
$result = $courses->execute( array( "s" => "course_list" ) )->get();

/* print document head, with field for page title */
g::print_head( "Global Admin Panel" );

/* print page header with field for page description */
g::print_header( "gPanel - Login" );

/* print nav for current page with field for which app */
g::print_nav();

/* content div is now open, everything here goes into <div id="content"> */
if( g::login() ) {
	?><p><?php echo $msg; ?></p>
			<br>
    <?php
} else {
	?><p><?php echo $msg; ?></p>
			<br>
            <br>
            <div class="content">
	            <form action="index.php" method="post">
    	        	<input name="e" type="hidden" value="1b6453892473a467d07372d45eb05abc2031647a" />
        	        <div class="form_line">
                    	<div class="form_left"><label>Username</label></div>
                        <div class="form_right"><input id="focus" name="c" type="text" /></div>
                    </div>
                    <div class="form_line">
                        <div class="form_left"><label>Password</label></div>
                        <div class="form_right"><input name="p" type="password" /></div>
                    </div>
                	<div class="form_line">
                    	<div class="form_left"></div>
                        <div class="form_right"><input name="submit" type="submit" value="login" /></div>
                    </div>
	            </form>
            </div><?php
}

/* close content div and print the footer */
g::print_footer();

?>