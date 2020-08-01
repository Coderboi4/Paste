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

exports.handler = (event, context, callback) => {
    var id = event.queryStringParameters.p
    console.log(`Function 'read' invoked. Read id: ${id}`)
    return client.query(q.Get(q.Ref(q.Collection('pastes'), id)))
        .then((response) => {
            console.log("success", response)
            return callback(null, {
                statusCode: 200,
                body: htmlEntities(Buffer.from(response["data"]["paste"], 'base64').toString())
            })
        }).catch((error) => {
            console.log("error", error)
            return callback(null, {
                statusCode: 400,
                body: htmlEntities(Buffer.from("UGFzdGUgbm90IGZvdW5kLg==", 'base64').toString())
            })
        })
}