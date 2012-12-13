<?php
session_start();
include_once( 'config.php' );
	
g::init() or die( "Database connection unsucessful." );

$msg = "Enter your credentials below to login.";
if( isset( $_POST[ 'submit' ] ) )
	if( !g::login( true ) )
		$msg = '<span style="color: red;">Invalid Login</span>.';

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
        	        <div class="row">
                    	<label class="ralign">Username</label>
                        <input id="focus" name="c" type="text" />
                    </div>
                    <div class="row">
                        <label class="ralign">Password</label>
                        <input name="p" type="password" />
                    </div>
                	<div class="row">
                    	<label>&nbsp;</label>
                        <input name="submit" type="submit" value="login" />
                    </div>
	            </form>
            </div><?php
}

/* close content div and print the footer */
g::end_content();

?>