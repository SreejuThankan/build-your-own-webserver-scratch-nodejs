export type DynamicBuffer = {
    data: Buffer
    length: number
}

export function bufPush(buf: DynamicBuffer, data: Buffer): void {
    const newLen = buf.length + data.length
    if (newLen > buf.data.length) {
        let capacity = Math.max(buf.data.length, 32)
        while (capacity < newLen) {
            capacity *= 2
        }
        const newBuffer = Buffer.alloc(capacity)
        buf.data.copy(newBuffer, 0, 0)
        buf.data = newBuffer
    }
    data.copy(buf.data, buf.length, 0)
    buf.length = newLen
}

export function bufPopAndExtract(buf: DynamicBuffer, length: number): Buffer {
    const extracted = Buffer.from(buf.data.subarray(0, length))
    buf.data.copyWithin(0, length, buf.length)
    buf.length -= length
    return extracted
}