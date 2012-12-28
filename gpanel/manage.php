<?php
session_start();
include_once( 'config.php' );

g::init() or die( "Database connection unsucessful." );
( g::login() && g::access( "r_MANAGE" ) ) or g::redirect();

$add_focus = '';
$search_focus = ' id="focus"';
$custom_roles = " hidden";
$add_username = "";

$search_username = "";
$results = "";

/* if user wanted to add a user */
if( isset( $_POST['add'] ) ) {
	$add_focus = ' id="focus"';
	$search_focus = '';
	if( g::add_user( "username" ) ) {
		$add_msg = g::heads_up( "success", "User added." );
		unset( $_POST );
	} else {
		$add_msg = g::heads_up( "error", "User was not added or already existed." );
		$add_username = g::post_string( "username" );
		if( $_POST['as'] == "custom" )
			$custom_roles = "";
	}
} else $add_msg = g::heads_up( "desc", "Create a user with the selected role." );

/* if user wanted to search for a user */
if( isset( $_POST['search'] ) ) {
	$results = g::get_user_roles( "username" );
	if( $results === false ) {
		$results = "";
		$search_msg = g::heads_up( "error", "User not found." );
	} else {
		$search_msg = g::heads_up( "success", "User found." );
	}
} else $search_msg = g::heads_up( "desc", "Search for a user to modify their permissions." );

$opts = array();
foreach( role::$roles as $name => $text )
	$opts[] = array( "value" => $name, "text" => $name );
$opts[] = array( "value" => "custom", "text" => "Custom..." );
if( count( $opts ) === 1 )
	$custom_roles = "";
$select_role = html::select( array( "name" => "as", "id" => "as" ), $opts );

/* print document head, with field for page title */
g::start_content( "Global Admin Panel", "gPanel - Manage User Roles" );

echo '<div class="content">'.$add_msg.
	'<div class="spacer">&nbsp;</div>
	<form class="gform" action="manage.php" method="post">
		<fieldset><legend>Add User</legend><div class="inner">
			<div class="row">
				<label class="ralign">Username</label>
				<input type="text" name="username" value="'.$add_username.'" '.$add_focus.' />
			</div>
			<div class="row">
				<label class="ralign">Role</label>
				'.$select_role.'
			</div>
			<div id="custom_roles" class="row'.$custom_roles.'">
				<label class="ralign">Permissions</label>
				<fieldset><div class="inner">
					<div class="row">
						<span class="item">
							'.html::checkbox( array( "id" => "r_ALL", "name" => "r_ALL" ), "add" ).'
							<label for="r_ALL" class="info" title="Full access. WARNING: requires override.">All</label>
						</span>
						<span class="item">
							'.html::checkbox( array( "id" => "r_LOGIN", "name" => "r_LOGIN" ), "add", true ).'
							<label for="r_LOGIN" class="info" title="Allows logging in to gPanel">Login</label>
						</span>
						<span class="item">
							'.html::checkbox( array( "id" => "r_VIEW", "name" => "r_VIEW" ), "add", true ).'
							<label for="r_VIEW" class="info" title="Allows for viewing pages">View</label>
						</span>
						<span class="item">
							'.html::checkbox( array( "id" => "r_MANAGE", "name" => "r_MANAGE" ), "add" ).'
							<label for="r_MANAGE" class="info" title="Allows adding/editing of users">Manage</label>
						</span><br/>
					</div>
				</div></fieldset>
			</div>
			<div class="row">
				<label class="ralign">&nbsp;</label>
				<input type="submit" name="add" value="Add" />
			</div>
		</div></fieldset>
	</form>
</div>';

echo '<div class="content">'.$search_msg.'
	<div class="spacer">&nbsp;</div>
	<form class="gform" action="manage.php" method="post">
		<fieldset><legend>Find User</legend><div class="inner">
			<div class="row">
				<label class="ralign">Username</label>
				<input type="text" name="username" id="focus" value="'.$search_username.'" />
			</div>
			<div class="row">
				<label class="ralign"></label>
				<input type="submit" name="search" value="Search" />
		</div></fieldset>'.$results.'
	</form>
</div>';


/* close content div and print the footer */
g::$javascript .= '
$("#as").bind("onchange", function(e) {
	if( this.value() == "custom" )
		$("#custom_roles").removeClass( "hidden" );
	else
		$("#custom_roles").addClass( "hidden" );
});
ajax( "'.WEB_ROOT.'/inc/php/ajax.php?action=", test );

function test( data ) {
	console.log( "data", data == "" );
}

';
g::end_content();

?>