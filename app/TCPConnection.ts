import * as net from 'net'

export type TCPConnection = {
    id: string
    socket: net.Socket
    err: null|Error
    ended: boolean
    reader: null | {
        resolve: (value: Buffer) => void,
        reject: (reason: Error) => void,
    }
    destroy: () => void
}