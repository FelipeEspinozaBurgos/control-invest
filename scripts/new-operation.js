// Manejar envío del formulario
$('#formNuevaOperacion').on('submit', function (e) {
    e.preventDefault();

    // Capturar valores del formulario
    const nuevoActivo = $('#activo').val().trim();
    const nuevoTipo = $('#tipo').val();
    const nuevoMonto = parseFloat($('#monto').val());
    const nuevaCantidad = parseFloat($('#cantidad').val());
    const nuevaFecha = new Date().toLocaleString();

    // Validar entrada
    if (!nuevoActivo || !nuevoTipo || isNaN(nuevoMonto) || isNaN(nuevaCantidad)) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
    }

    // Agregar nueva operación al arreglo de transacciones
    transacciones.push({
        activo: nuevoActivo,
        tipo: nuevoTipo,
        monto: nuevoMonto,
        cantidad: nuevaCantidad,
        fecha: nuevaFecha,
    });

    // Reprocesar y actualizar tabla y gráficos
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));
    
    // Actualizar tabla
    $('#tablaTransacciones').DataTable().clear().destroy();
    inicializarTabla(datosProcesados);

    // Actualizar gráficos
    crearGraficos(datosProcesados);

    // Resetear formulario
    $('#formNuevaOperacion')[0].reset();
});
