/* code from functions/todos-read.js */
const faunadb = require('faunadb')

const {
    FAUNADB_KEY
} = process.env;

const q = faunadb.query
const client = new faunadb.Client({
    secret: FAUNADB_KEY
})

function encode(str) {
    return Buffer.from(str).toString('base64')
}

exports.handler = (event, context, callback) => {
    var title = event.queryStringParameters.title
    var code = event.queryStringParameters.paste
    console.log(`Function 'create' invoked.`)
    return client.query(q.Create(q.Collection('pastes'), {
            data: {
                'title': title,
                'paste': encode(code)
            }
        }))
        .then((response) => {
            console.log("success", response)
            return callback(null, {
                statusCode: 302,
                headers: {
                    Location: "https://paste.brianthe.dev/p?p=" + response.ref.id
                }
            })
        }).catch((error) => {
            console.log("error", error)
            return callback(null, {
                statusCode: 400,
                body: 'Error'
            })
        })
}