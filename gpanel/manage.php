<?php
session_start();
include_once( 'config.php' );

g::init() or die( "Database connection unsucessful." );
( g::login() && g::access( r_MANAGE ) ) or g::redirect();

$custom_roles = " hidden";
$username = "";
/* if user wanted to add a user */
if( isset( $_POST['add'] ) ) {
	if( g::add_user( "add_username" ) ) {
		$add_msg = g::heads_up( "success", "User added." );
	} else {
		$add_msg = g::heads_up( "error", "User was not added or already existed." );
		$username = g::post_string( "add_username" );
		if( $_POST['as'] == "custom" )
			$custom_roles = "";
	}
} else $add_msg = g::heads_up( "desc", "Create a user with the selected roles." );

/* print document head, with field for page title */
g::start_content( "Global Admin Panel", "gPanel - Manage User Roles" );

echo '<div class="content">'.$add_msg.
	'<div class="spacer">&nbsp;</div>
	<form class="gform" action="manage.php" method="post">
		<fieldset><legend>Add User</legend><div class="inner">
			<div class="row">
				<label class="ralign">Username</label>
				<input type="text" name="add_username" value="'.$username.'" />
			</div>
			<div class="row">
				<label class="ralign">Role</label>
				<select id="as" name="as">
					<option value="ori_viewer"'.g::selected( "as", "ori_viewer" ).'>Orientation Viewer</option>
					<option value="root"'.g::selected( "as", "root" ).'>root</option>
					<option value="custom"'.g::selected( "as", "custom" ).'>Custom...</option>
				</select>
			</div>
			<div id="custom_roles" class="row'.$custom_roles.'">
				<label class="ralign">Permissions</label>
				<fieldset><div class="inner">
					<div class="row">
						<span class="item"><input type="checkbox" id="r_ALL" name="r_ALL" value="1" />
						<label for="r_ALL" class="info" title="Full access. WARNING: requires override.">All</label></span>
						<span class="item"><input type="checkbox" id="r_LOGIN" name="r_LOGIN" value="1" checked="checked" />
						<label for="r_LOGIN" class="info" title="Allows logging in to gPanel">Login</label></span>
						<span class="item"><input type="checkbox" id="r_VIEW" value="1" checked="checked" />
						<label for="r_VIEW" class="info" title="Allows for viewing pages">View</label></span>
						<span class="item"><input type="checkbox" id="r_MANAGE" value="1" />
						<label for="r_MANAGE" class="info" title="Allows adding/editing of users">Manage</label></span><br/>
						<span class="item"><input type="checkbox" id="r_LOGIN" value="1" checked="checked" />
						<label for="r_LOGIN">Test</label></span>
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

echo '<div class="content">
	<p class="title">Edit User Permissions</p>
	'.g::heads_up( "desc", "Search for a user to modify their roles." ).'
	</div>';


/* close content div and print the footer */
g::$javascript .= '
$("#as").bind("onchange", function(e) {
	if( this.value() == "custom" )
		$("#custom_roles").removeClass( "hidden" );
	else
		$("#custom_roles").addClass( "hidden" );
});
';
g::end_content();

?>