const mostrar_index = (req, res) => {
    res.render('index/index', {
        pagina: 'Grimu'
    })
}

export {
    mostrar_index,
}