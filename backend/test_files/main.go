package files

const Login = `
<!DOCTYPE html>
<html>
<body>
	<button id="btn">Login</button>
	<script>
		document.getElementById("btn").addEventListener("click", function(){
			location.href = (await (await fetch(
				'/api/public/login',
				{
                    method: 'POST',
					credentials: 'include'  
				}
			)).json()).redirect_url;
		});
	</script>
</body>
</html>
`
