document.getElementById('loginForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/v1/log-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                alert('Log in successful!');
                const data = await response.json()
                window.location.href = data.links["create-uri"].href
            } else {
                alert('Log in failed.');
            }
        });