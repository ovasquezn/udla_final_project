const mostrar_index = (req, res) => {
    res.render('auth/index', {
        pagina: 'Empresa'
    })
}

export {
    mostrar_index,
}