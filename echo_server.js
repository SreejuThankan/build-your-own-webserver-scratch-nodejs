import * as net from "net"

let server = net.createServer({allowHalfOpen: true})


const onNewConnection = (socket) => {
    console.log('New Connection', socket.remoteAddress, socket.remotePort)

    socket.on('error', (err) => {
        console.log('Error on socket', err)
        server.close()
    })

    socket.on('end', () => {
        console.log('End of socket connection received')
    })

    socket.on('data', (data) => {
        console.log('Data received: ', data)
        
        setTimeout(() => {
            socket.write(data)
            console.log('Wrote data back', data)
        }, 3000)

        if (data.includes('q')) {
            console.log('Found q in data, now closing connection')
            socket.end()
            socket.destroy()
        }
    })
}

server.on('connection', onNewConnection)
server.on('error', (err) => {
    console.log('Error on server', err)
    throw err
})

server.listen({host: '127.0.0.1', port: 1234})

console.log('Started server locally on port 1234')