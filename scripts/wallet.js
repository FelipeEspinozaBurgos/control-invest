
$(document).ready(function () {
    // Procesar datos
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));

    // Calcular monto total y desglose por activo
    const montoTotal = datosProcesados.reduce((total, activo) => total + activo.totalInversion, 0);
    const desgloseActivos = datosProcesados.map(activo => ({
        activo: activo.activo,
        montoTotal: activo.totalInversion,
        porcentaje: ((activo.totalInversion / montoTotal) * 100).toFixed(2)
    }));

    // Mostrar monto total
    $('#montoTotal').text(`Monto Total de Inversión: $${montoTotal.toFixed(2)} MXN`);

    // Llenar tabla de desglose
    const tablaBody = $('#tablaDesglose tbody');
    desgloseActivos.forEach(activo => {
        tablaBody.append(`
            <tr>
                <td>${activo.activo}</td>
                <td>$${activo.montoTotal.toFixed(2)} MXN</td>
                <td>${activo.porcentaje}%</td>
            </tr>
        `);
    });

    // Crear gráfico de dona
    const ctx = $('#chartDona')[0].getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: desgloseActivos.map(activo => activo.activo),
            datasets: [{
                data: desgloseActivos.map(activo => activo.montoTotal),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 159, 64, 0.7)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return `Monto Total: $${tooltipItem.raw.toFixed(2)} MXN`;
                        }
                    }
                }
            }
        }
    });
});
