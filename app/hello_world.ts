type Message = {
    hello: string,
    world: string
}


const supplier = async(): Promise<Message> => {
    return {
        hello: 'Hello',
        world: 'World'
    }
}

const printer = async(supplier: Promise<Message>) : Promise<void> => {
    const message = await supplier
    console.log(`Message delivered ${message.hello} ${message.world}!`)
}

printer(supplier())
