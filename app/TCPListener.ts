import * as net from 'net'
import { TCPConnection } from './TCPConnection'

export type TCPListener = {
    err: null | Error
    server: null | net.Server
    close: () => void
}