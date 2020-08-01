/* code from functions/todos-read.js */
const faunadb = require('faunadb')

const {
    FAUNADB_KEY
} = process.env;

const q = faunadb.query
const client = new faunadb.Client({
    secret: FAUNADB_KEY
})

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function paste(title, code, paste_id) {
    return '<!DOCTYPE html><html><head><title>Paste</title><link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/kognise/water.css@latest/dist/dark.min.css"><meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" type="image" href="https://openmoji.org/data/color/svg/1F4DD.svg" /><!-- Primary Meta Tags --><title>📝 Paste - Free Text Storage</title><meta name="title" content="📝 Paste - Free Text Storage"><meta name="description" content="Free and open-source Pastebin alternative. Fully anonymous, no registration needed."><!-- Open Graph / Facebook --><meta property="og:type" content="website"><meta property="og:url" content="https://paste.deathlyf.com/"><meta property="og:title" content="📝 Paste - Free Text Storage"><meta property="og:description" content="Free and open-source Pastebin alternative. Fully anonymous, no registration needed."><meta property="og:image" content="https://raw.githubusercontent.com/deathlyface/Paste/master/images/banner.png"><!-- Twitter --><meta property="twitter:card" content="summary_large_image"><meta property="twitter:url" content="https://paste.deathlyf.com/"><meta property="twitter:title" content="📝 Paste - Free Text Storage"><meta property="twitter:description" content="Free and open-source Pastebin alternative. Fully anonymous, no registration needed."><meta property="twitter:image" content="https://raw.githubusercontent.com/deathlyface/Paste/master/images/banner.png"></head><body><h1>&#x1f4dd; Paste - Text Storage</h1><p>Free and open source Pastebin alternative.</p><h2 id="paste">Paste: ' + htmlEntities(title) + '</h2><textarea readonly id="paste_code">' + htmlEntities(Buffer.from(code, 'base64').toString()) + '</textarea><h2 id="share">Share this paste!</h2><h3>QR Code</h3><img alt="qr-code" src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://paste.deathlyf.com/p?p=' + paste_id + '"><h3>Links</h3><label for="paste_link">Paste Link</label><input readonly id="paste_link" value="https://paste.deathlyf.com/p?p=' + paste_id + '"><label for="paste_link">Raw Link</label><input readonly id="raw_link" value="https://paste.deathlyf.com/r?p=' + paste_id + '"><h2 id="thanks">Thanks to:</h2><ul><li><a rel="noopener" target="_blank" href="https://netlify.com">Netlify</a></li><li><a rel="noopener" target="_blank" href="https://fauna.com">FaunaDB</a></li><li><a rel="noopener" target="_blank" href="https://watercss.kognise.dev/">kognise/water.css</a></li></ul><footer>&copy; 2020 <a rel="noopener" target="_blank" href="https://deathlyf.com">deathlyf.com</a> | <a>Privacy Policy</a> | <a rel="noopener" target="_blank" href="https://github.com/deathlyface/paste">GitHub</a></footer></body></html>'
}

exports.handler = (event, context, callback) => {
    var id = event.queryStringParameters.p
    console.log(`Function 'read' invoked. Read id: ${id}`)
    return client.query(q.Get(q.Ref(q.Collection('pastes'), id)))
        .then((response) => {
            console.log("success", response)
            return callback(null, {
                statusCode: 200,
                body: paste(response["data"]["title"], response["data"]["paste"], id)
            })
        }).catch((error) => {
            console.log("error", error)
            return callback(null, {
                statusCode: 400,
                body: paste("Error", "UGFzdGUgbm90IGZvdW5kLg==", "272631222891446792")
            })
        })
}