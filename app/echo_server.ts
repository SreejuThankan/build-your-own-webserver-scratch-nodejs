import { DynamicBuffer, bufPush, bufPopAndExtract } from './DynamicBuffer'
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
        const buf: DynamicBuffer = { data: Buffer.alloc(0), length: 0 }
        while (true) {
            const msg: null | Buffer = cutMessage(buf)

            if (!msg) {
                const data = await socketRead(con)
                bufPush(buf, data)
                if (data.length === 0) {
                    console.log('End connection')
                    break
                }
                continue
            }

            const hasQuit = await replyToMessage(con, msg)
            if (hasQuit) break
        }
    } catch (ex) {
        console.error('Found an exception in server client', ex)
    }
    finally {
        console.log('Destroying connection')
        con.destroy()
    }
}

const cutMessage = (buf: DynamicBuffer): null | Buffer => {
    const index = buf.data.subarray(0, buf.length).indexOf('\n')
    if (index < 0) return null
    return bufPopAndExtract(buf, index + 1)
}

const replyToMessage = async (con: TCPConnection, msg: Buffer): Promise<boolean> => {
    if (msg.equals(Buffer.from('quit\n'))) {
        await socketWrite(con, Buffer.from('Bye.\n'))
        return true
    }
    const reply = Buffer.concat([Buffer.from('Echo: '), msg])
    await socketWrite(con, reply)
    return false
}

console.log('Running server now')
runServer()