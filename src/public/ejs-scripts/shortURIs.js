document.getElementById('shortURISForm').addEventListener('submit', async function (event) {
    event.preventDefault()
    const original_uri = getElementById('original_uri').value
    const is_private = getElementById('is_private').checked
    let expires_at = new Date(getElementById('expires_at').value)
    
    const now = new Date()
    const expire_threshold = (expires_at - now)/60000
    
    if ( now > expires_at || expire_threshold < 60 ) {
        return alert("Date cannot be less than an hour from now!")
    }

    expires_at = expires_at.toISOString()

    const response = await fetch('/v1/short-uris', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include",
        body: JSON.stringify( { original_uri, is_private, expires_at })
    })
})