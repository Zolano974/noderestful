const optionsquery = {
    handle: (reply) => {
        reply()
            .header('Access-Control-Allow-Origin', '*')
            .header('Access-Control-Allow-Headers', 'Authorization, Content-Type')
    }
}

export default optionsquery;