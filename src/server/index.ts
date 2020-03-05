let server = require('./server')
server.start()

if (module.hot) {
  module.hot.accept(['./server', '~/graph'], async () => {
    // replace request handler of server
    try{
      await server.stop()
      server = require('./server')
      await server.start()
    }catch(err){
      console.log('HMR Error: ' + err?.message)
    }
  })
}
