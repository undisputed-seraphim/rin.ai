<?php
session_start();
include_once( 'config.php' );
	
g::init() or die( "Database connection unsucessful." );

$msg = "Enter your credentials below to login.";
if( isset( $_POST[ 'submit' ] ) )
	if( !g::login( true ) )
		$msg = '<span style="color: red;">Invalid Login</span>.';

/* premade queries for security */
$courses = g::prepare( "select * from mdl1_8block where name = ?" );
$result = $courses->execute( array( "s" => "course_list" ) )->get();

/* print document head, with field for page title */
g::start_content( "Global Admin Panel", "gPanel - Login" );

/* content div is now open, everything here goes into <div id="content"> */
if( g::login() ) {
	$msg = 'Chose an area to the left or below.';
	?><p><?php echo $msg; ?></p>
			<br>
    <?php
} else {
	?><p><?php echo $msg; ?></p>
            <div class="content">
	            <form action="index.php" method="post">
    	        	<input name="e" type="hidden" value="1b6453892473a467d07372d45eb05abc2031647a" />
        	        <div class="form_line">
                    	<div class="item"><label>Username</label></div>
                        <div class="item"><input id="focus" name="c" type="text" /></div>
                    </div>
                    <div class="form_line">
                        <div class="item"><label>Password</label></div>
                        <div class="item"><input name="p" type="password" /></div>
                    </div>
                	<div class="form_line">
                    	<div class="item"></div>
                        <div class="item"><input name="submit" type="submit" value="login" /></div>
                    </div>
	            </form>
            </div><?php
}

/* close content div and print the footer */
g::end_content();

?>