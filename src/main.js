const fs = require('fs')
const core = require('@actions/core')
const exec = require('./exec')
const Tail = require('tail').Tail

const run = (callback) => {
  const path = 'client.ovpn'
  const config = core.getInput('config').trim()

  if (!config) {
    throw new Error('config file content is required!')
  }

  fs.writeFileSync(path, config)

  // prepare log file
  fs.writeFileSync('openvpn.log', '')
  const tail = new Tail('openvpn.log')

  try {
    exec(`sudo openvpn --config ${path} --daemon --log openvpn.log --writepid openvpn.pid`)
  } catch (error) {
    core.error(fs.readFileSync('openvpn.log', 'utf8'))
    tail.unwatch()
    throw error
  }

  tail.on('line', (data) => {
    core.info(data)
    if (data.includes('Peer Connection Initiated with')) {
      tail.unwatch()
      clearTimeout(timer)
      const pid = fs.readFileSync('openvpn.pid', 'utf8').trim()
      core.info(`VPN connected successfully. Daemon PID: ${pid}`)
      callback(pid)
    }
  })

  const timer = setTimeout(() => {
    core.setFailed('VPN connection failed.')
    tail.unwatch()
  }, 15000)
}

module.exports = run
