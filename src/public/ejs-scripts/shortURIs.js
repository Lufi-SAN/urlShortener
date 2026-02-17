document.getElementById('shortURISForm').addEventListener('submit', async function (event) {
    event.preventDefault()
    const longURI = getElementById('longuri').value

    const response = await fetch('/v1/')
})