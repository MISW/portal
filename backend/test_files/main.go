package files

const Login = `
<!DOCTYPE html>
<html>
<body>
	<button id="btn">Login</button>
	<script>
		document.getElementById("btn").addEventListener("click", async function(){
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

const Callback = `
<!DOCTYPE html>
<html>
<body>
	<button id="btn">Login</button>
	<script>
		const urlParams = new URLSearchParams(window.location.search);

		const code = urlParams.get('code');
		const state = urlParams.get('state');

		fetch(
			"/api/public/callback",
			{
				credentials: "include",
				method: "POST",
				body: {code, state},
			}
		)
	</script>
</body>
</html>
`
