const mostrar_index = (req, res) => {
    res.render('index/index', {
        pagina: 'Grimu',
        csrfToken: req.csrfToken()
    })
}

export {
    mostrar_index,
}