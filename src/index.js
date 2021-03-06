import { app } from './server'
import config from './config'

/**
 * @desc Normalize a port into a number, string, or false.
 * @param {string} val
 * @return {string|number|boolean} returns port number, or named pipes or false
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(
  config.port || '3000')
app.set('port', port)

/**
 * Listen on provided port, on all network interfaces.
 */
app.listen(port, async () => {
  await console.log(`Server is up on port ${port}!`)
})
