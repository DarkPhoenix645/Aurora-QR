'use strict'
import express from 'express'
import mongoose from 'mongoose'
import requestLogger from './requestLogger.js';

const app = express();
const port = process.env.PORT;
const host = process.env.HOST;

// Server state
let server
let serverStarted = false
let serverClosing = false

// Log errors and shut down server in case of unhandled errors
function unhandledError(err) {
  logger.error(err)

  if (serverClosing) {
    return
  }
  serverClosing = true

  if (serverStarted) {
    server.close(function () {
      process.exit(1)
    })
  }
}

process.on('uncaughtException', unhandledError)
process.on('unhandledRejection', unhandledError)

// Middlewarwe for logging and parsing incoming JSON
app.use(requestLogger)
app.use(express.json());

// Registering routes here ensures that startup related errors are caught
// in the log and are thus debuggable
import routes from "./routes/routes.js"
app.use(routes)

// Handle 404 / 500
app.use(function fourOhFourHandler (req, res, next) {
  res.status(400).json({ "errors": { "message": "Route not found!" } })
})

app.use(function fiveHundredHandler (err, req, res, next) {
  if (err.status >= 500) {
    logger.error(err)
  }
  
  res.status(500).json({ "errors": { "message": "Internal server error" } })
})

// Connect to DB
const dbURI = process.env.DATABASE_LOGIN;
mongoose.connect(dbURI)
  .then(() => console.info(`Connected to DB at URL ${ dbURI }`))
  .catch((err) => console.error(err));

server = app.listen(port, host, (err) => {
  if(err || serverClosing) {
    console.error(err)
    process.exit(1)
  }

  serverStarted = true
  console.info(`Server initialised and running at ${ host }:${ port }`);
});