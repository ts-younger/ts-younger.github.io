<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>task定位与居中</title>
<style>

body {padding:0; margin:0; } 
/*这些是专用FIREFOX写的，注意IE7也认识*/ 
html,body{ height:100%;} 
.main{text-align:center; width:100%; height:100%; display:table;} 
.mainbody{ display:table-cell;vertical-align:middle;background: #ccc}


</style>
</head>
<body>
	<div class='main'>
		<div class="mainbody">
			<p>this is test.</p>
			<p>this is test.</p>
			<p>this is test.</p>

			<p>this is test.</p>

			<p>this is test.</p>
			<p>this is test.</p>
			<p>this is test.</p>
			<p>this is test.</p>

			<p>this is test.</p>

			<p>this is test.</p>
			<p>this is test.</p>

			<p>this is test.</p>

			<p>this is test.</p>

		</div>
	</div>
</body>
</html>
