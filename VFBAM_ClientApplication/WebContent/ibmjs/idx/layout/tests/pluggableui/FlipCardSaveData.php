<?php
$filename = $_POST['filename'];
$data = $_POST['data'];
$file = "./".$filename;
$len = file_put_contents($file, $data);
if ( $len == false ){
	echo "Save Failed";
}
else{
	echo "Save Success";
}

?>
