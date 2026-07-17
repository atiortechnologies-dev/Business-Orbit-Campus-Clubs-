export function renderErrorPage(): string {
  return `
<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Something went wrong</title>

<style>
*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
font-family:Arial,Helvetica,sans-serif;
display:flex;
justify-content:center;
align-items:center;
height:100vh;
background:#f8fafc;
color:#1f2937;
}

.container{
text-align:center;
padding:40px;
max-width:500px;
}

h1{
font-size:2rem;
margin-bottom:15px;
}

p{
font-size:1rem;
margin-bottom:30px;
color:#6b7280;
}

button{
padding:12px 22px;
border:none;
background:#2563eb;
color:white;
font-size:16px;
cursor:pointer;
border-radius:8px;
transition:.3s;
}

button:hover{
background:#1d4ed8;
}
</style>

</head>

<body>

<div class="container">

<h1>Oops!</h1>

<p>
Something went wrong while loading the application.
Please try refreshing the page.
</p>

<button onclick="window.location.reload()">
Reload Page
</button>

</div>

</body>

</html>
`;
}