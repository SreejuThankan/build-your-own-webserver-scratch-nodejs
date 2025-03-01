import { TCPConnection } from './TCPConnection'
import { TCPListener } from './TCPListener'
import { socketListen, socketAccept } from './server_ops'
import { socketRead, socketWrite } from './socket_ops'

const runServer = async () => {
    const listener: TCPListener = socketListen('127.0.0.1', 1234)
    console.log('Started server locally on port 1234')
    try {
        while (true) {
            console.log('Waiting for the next connection')
            const con: TCPConnection = await socketAccept(listener)
            serverClient(con)
        }
    } catch (ex) {
        console.error('Found an exception running server:', ex)
    } finally {
        listener.close()
    }
}

const serverClient = async (con: TCPConnection): Promise<void> => {
    try {
        console.log('Starting server client for connection', con.socket.remotePort)
        while (true) {
            const data = await socketRead(con)
            if (data.length === 0) {
                console.log('End connection')
                break
            }

            console.log('Data read from socket', data)
            socketWrite(con, data)
            console.log('Wrote data back to socket', data)
        }
    } catch (ex) {
        console.error('Found an exception in server client', ex)
    }
    finally {
        console.log('Destroying connection')
        con.destroy()
    }
}

console.log('Running server now')
runServer()