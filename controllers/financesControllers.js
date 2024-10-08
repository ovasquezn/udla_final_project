const mostrar_banco = (req, res) => {
    res.render('finanzas/banco', {
        pagina: 'Banco',
        pagina_activa: 'banco'
    })
}

const mostrar_facturas = (req, res) => {
    res.render('finanzas/facturas', {
        pagina: 'Facturas',
        pagina_activa: 'facturas'
    })
}

const mostrar_gastos = (req, res) => {
    res.render('finanzas/gastos', {
        pagina: 'Gastos',
        pagina_activa: 'gastos'
    })
}

const mostrar_proveedores = (req, res) => {
    res.render('finanzas/proveedores', {
        pagina: 'Proveedores',
        pagina_activa: 'proveedores'
    })
}

export { 
    mostrar_banco,
    mostrar_facturas,
    mostrar_gastos,
    mostrar_proveedores
};