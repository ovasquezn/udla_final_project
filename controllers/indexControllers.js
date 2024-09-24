const showIndex = (req, res) => {
    res.render('index', {
        pagina: 'Empresa'
    })
}

const test = (req, res) => {
    res.render('test', {
        pagina: 'Empresa'
    })
}


export {
    showIndex,
    test,
}