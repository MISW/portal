package files

const Login = `
<!DOCTYPE html>
<html>
<body>
	<button id="btn">Login</button>
	<script>
		document.getElementById("btn").addEventListener("click", function(){
			location.href = (await fetch(
				'/api/public/login',
				{
					credentials: 'include'  
				}
			)).redirect_url;
		});
	</script>
</body>
</html>
`
