
  const productos = !{JSON.stringify(productos)};

  $(document).ready(function() {
    $('#salidasTable').DataTable({
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.11.5/i18n/es-ES.json",
      },
      ordering: true,
    });
  });

  // Evento de búsqueda de producto al presionar Enter
  document.getElementById('codigo_barra').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      const codigoBarra = event.target.value.trim();
      
      // Buscar producto en la lista de productos
      const producto = productos.find(p => p.codigo_barra === codigoBarra);

      if (producto) {
        agregarProductoSeleccionado(producto.id, producto.nombre_producto, producto.unidad);
      } else {
        alert("Producto no encontrado");
      }

      // Limpia el campo de entrada
      event.target.value = '';
    }
  });

  // Función para agregar producto a la lista de selección
  function agregarProductoSeleccionado(productoId, nombreProducto, unidad) {
    const productosSeleccionados = document.getElementById('productosSeleccionados');
    
    // Crear el elemento de lista para el producto seleccionado
    const li = document.createElement('li');
    li.className = 'list-group-item d-flex justify-content-between align-items-center';
    li.textContent = `${nombreProducto} - Unidad: ${unidad}`;

    const cantidadInput = document.createElement('input');
    cantidadInput.type = 'number';
    cantidadInput.name = 'productos[][cantidad]';
    cantidadInput.className = 'form-control form-control-sm ml-2';
    cantidadInput.placeholder = 'Cantidad';
    cantidadInput.required = true;

    const hiddenInput = document.createElement('input');
    hiddenInput.type = 'hidden';
    hiddenInput.name = 'productos[][producto_id]';
    hiddenInput.value = productoId;

    li.appendChild(cantidadInput);
    li.appendChild(hiddenInput);
    productosSeleccionados.appendChild(li);
  }

  // Confirmar y enviar todas las salidas seleccionadas
  function confirmarSalidas() {
    document.getElementById('formSalidas').submit();
  }