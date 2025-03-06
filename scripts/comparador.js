$(document).ready(function () {
    // Procesar datos agrupados por activo
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));

    // Crear gráfico comparativo
    crearGraficoComparador(datosProcesados);

    // Mostrar resumen estadístico por activo
    mostrarResumenEstadistico(datosProcesados);
});

// Función para crear gráfico comparativo
function crearGraficoComparador(datosProcesados) {
    const ctx = $('#chartComparador')[0].getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datosProcesados.map(a => a.activo),
            datasets: [
                {
                    label: 'Inversión Total (MXN)',
                    data: datosProcesados.map(a => a.totalInversion),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2
                },
                {
                    label: 'Cantidad Total',
                    data: datosProcesados.map(a => a.totalCantidad),
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 0.7)',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: { enabled: true }
            },
            scales: {
                r: {
                    angleLines: { display: true },
                    suggestedMin: 0,
                    suggestedMax: Math.max(...datosProcesados.map(a => a.totalInversion)) * 1.2
                }
            }
        }
    });
}

// Función para mostrar resumen estadístico por activo
function mostrarResumenEstadistico(datosProcesados) {
    const tablaBody = $('#tablaResumen tbody');
    tablaBody.empty();

    datosProcesados.forEach(activo => {
        tablaBody.append(`
            <tr>
                <td>${activo.activo}</td>
                <td>$${activo.totalInversion.toFixed(2)} MXN</td>
                <td>${activo.totalCantidad.toFixed(8)}</td>
                <td>${activo.compras.length + activo.ventas.length}</td>
            </tr>
        `);
    });
}
