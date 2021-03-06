// now normal code
import path       from 'path'
import express   from 'express'
import bodyParser from 'body-parser'
import cors  from 'cors'
import { jwtSecret }   from 'config/constants'
import expressJwt from 'express-jwt'
import passport from 'passport/local'

const publicPath = path.resolve(__dirname, '../public')
const authenticate = expressJwt({
  secret: jwtSecret,
  credentialsRequired: false,
  userProperty: 'user',
})
const app = express()
// we use this to authenticate the specific router
app.set('port', (process.env.PORT || 3333))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(passport.initialize())
app.use(authenticate)
// Additional middleware which will set headers that we need on each request.
app.use(cors())

/***** use require directly help use change only one line :D *****/

// we use normal authentication for universal access
app.use('/auth', require('./routes/auth').default)
// api for client
app.use('/api', require('./routes/api').default)
// GraphQL
app.use('/graphql', require('./routes/graphql').default)

// by default we can serve the public as standalone app
if(process.env.NODE_ENV === 'server' || app.get('port') === 80) {
  app.use(express.static(publicPath))
  app.get('*', (req, res) => {
    res.sendFile(publicPath + '/index.html')
  })
}

app.listen(app.get('port'), () => {
  //eslint-disable-next-line no-console
  console.log('Express is listening on port ' + app.get('port') + '!')
})
