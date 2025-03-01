import * as net from 'net'
import {TCPConnection} from './TCPConnection'

export function socketInit(id: string, socket: net.Socket): TCPConnection {
    const con: TCPConnection = {
        id: id, socket: socket, err: null, ended: false, reader: null, destroy: () => {
            socket.end()
            socket.destroy()
        }
    }

    console.log('New socket connection', id)

    socket.on('data', (data: Buffer)=> {
        if (!con.reader) {
            console.log('Ignoring socket that has no reader')
            return
        }

        con.socket.pause()

        con.reader!.resolve(data)

        con.reader = null
    })

    socket.on('end', () => {
        con.ended = true
        if (con.reader) {
            con.reader.resolve(Buffer.from(''))
            con.reader = null
        }
    })

    socket.on('error', (err: Error) => {
        con.err = err
        if (con.reader) {
            con.reader.reject(err)
            con.reader = null
        }
    })

    return con
}

export function socketRead(con: TCPConnection): Promise<Buffer> {
    console.assert(!con.reader)

    return new Promise((resolve, reject) => {
        if (con.err) {
            reject(con.err)
            return
        }

        if (con.ended) {
            resolve(Buffer.from(''))
            return
        }

        con.reader = {resolve: resolve, reject: reject}
        con.socket.resume()
    })
}

export function socketWrite(con: TCPConnection, data: Buffer): Promise<void> {
    console.assert(data.length > 0)

    return new Promise((resolve, reject) => {
        if (con.err) {
            reject(con.err)
            return
        }
        
        con.socket.write(data, (err? : Error) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}