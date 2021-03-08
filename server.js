var access_token = ''
var hasAuthorized = false
module.exports = access_token

const express = require('express')
const graphql = require('express-graphql').graphqlHTTP
const { schema, resolvers } = require('./schema')
const cors = require('cors')

const { openSpotify, authorize } = require('./spotify-api')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.get('/', function (req, res, next){
  openSpotify(res);
});

app.get('/callback', function (req, res, next){
  if(req.query.error) {
    console.log("ERROR");
  } else {
    if(!hasAuthorized){
      hasAuthorized = true;
      authorize(req.query.code)
        .then(response => {
          res.redirect('http://localhost:4200')
        })
    }
  }
});

app.use(cors({origin: 'http://localhost:4200'}))

app.use(
  '/graphql',
  graphql({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  }),
)

app.listen(4000)