import * as net from 'net'
import { TCPConnection } from './TCPConnection'
import { TCPListener } from './TCPListener'
import { socketInit } from './socket_ops'
import { randomInt, randomUUID } from 'crypto'

export function socketListen(host: string, port: number): TCPListener {
    const server = net.createServer({ allowHalfOpen: true, pauseOnConnect: true })
    const listener: TCPListener = {
        err: null, server: server, close: () => server.close()
    }
    server.on('error', (err: Error) => {
        listener.err = err
        console.error('Closing server after error', err)
        server.close()
    })

    server.listen({host: host, port: port})

    return listener
}

export function socketAccept(listener: TCPListener): Promise<TCPConnection> {
    return new Promise((resolve, reject) => {
        if (!listener.server) {
            reject(new Error('No server initialised'))
            return
        }

        if (listener.err) {
            reject(listener.err)
            return
        }

        listener.server!.on('connection', (socket: net.Socket) => {
            const id = `${randomInt(100000)}`
            console.log('New connection', socket.remoteAddress, socket.remotePort)
            try {
                const con = socketInit(id, socket)
                resolve(con)
            } catch (ex) {
                reject(ex)
            }
        })
    })
}

