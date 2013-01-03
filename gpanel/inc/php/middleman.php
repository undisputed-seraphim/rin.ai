<?php
	/**
	 * Middle Man for IOS
	 *
	 * Post your public key to this file and 
	 * this file will cURL the data or the error messeage to your app
	 * in JSON key:value format  
	 *
	 * This file needs to placed on a secure webserver.	
	 * created by Richard Robinson rorobinson@ecpi.edu
	 */
if($_POST['e']){
	$app_prk = '7488b072f817428c95041dedfae7d3c2'; //Add your private key here.
	$app_id = '4'; //Add your app id here.
	$app_pubk = $_POST['e'];
	$user = $_POST['c'];
	$pass = $_POST['p'];

	$ch = curl_init( "https://auth.ecpi.edu/auth/" );
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_POSTFIELDS, "e=".$app_pubk."&c=".$user."&p=".$pass."&i=".$app_id."&u=".$app_prk."");
	//curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 10);
	//curl_setopt($ch, CURLOPT_TIMEOUT, 10);
	curl_setopt($ch, CURLOPT_HEADER, false);
	curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

	$_SESSION['ecpiuser'] = curl_exec($ch);
	curl_close($ch);
}
?>