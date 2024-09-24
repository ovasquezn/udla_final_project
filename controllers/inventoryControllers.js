const showInventory = (req, res) => {
    res.render('inventory', {
        pagina: 'Inventario'
    })
}

export {
    showInventory
}