
const activosCoinGecko = {
    XRP: 'ripple',
    ADA: 'cardano',
    HBAR: 'hedera-hashgraph',
    ONDO: 'ondo-finance',
    XLM: 'stellar',
    DOT: 'polkadot'
};
$(document).ready(async function () {
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));
    const preciosActuales = await obtenerPreciosActuales(datosProcesados.map(activo => activosCoinGecko[activo.activo]));

    if (Object.keys(preciosActuales).length === 0) {
        console.error("No se pudieron obtener precios actuales.");
        return;
    }

    actualizarTablaPrecios(datosProcesados, preciosActuales);
    crearGraficoComparacion(datosProcesados, preciosActuales);
    mostrarPreciosTiempoReal(preciosActuales);
});

async function obtenerPreciosActuales(activos) {
    try {
        const ids = activos.filter(Boolean).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=mxn,usd`);
        return await response.json();
    } catch (error) {
        console.error('Error al obtener los precios actuales:', error);
        return {};
    }
}

function actualizarTablaPrecios(datosProcesados, preciosActuales) {
    const tablaBody = $('#tablaPrecios tbody');
    tablaBody.empty();

    datosProcesados.forEach(activo => {
        const idCoinGecko = activosCoinGecko[activo.activo];
        const precioActualMXN = preciosActuales[idCoinGecko]?.mxn || 0;
        const precioPromedioEntrada = activo.totalInversion / activo.totalCantidad || 0;
        const diferencia = ((precioActualMXN - precioPromedioEntrada) / precioPromedioEntrada) * 100 || 0;

        tablaBody.append(`
            <tr>
                <td>${activo.activo}</td>
                <td>$${precioActualMXN.toFixed(2)} MXN</td>
                <td>$${precioPromedioEntrada.toFixed(2)} MXN</td>
                <td>${diferencia.toFixed(2)}%</td>
            </tr>
        `);
    });
}

function crearGraficoComparacion(datosProcesados, preciosActuales) {
    const ctx = $('#chartComparacion')[0].getContext('2d');
    const datos = {
        labels: datosProcesados.map(a => a.activo),
        entrada: datosProcesados.map(a => a.totalInversion / a.totalCantidad || 0),
        actual: datosProcesados.map(a => preciosActuales[activosCoinGecko[a.activo]]?.mxn || 0)
    };

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: datos.labels,
            datasets: [
                {
                    label: 'Precio Promedio Entrada (MXN)',
                    data: datos.entrada,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                },
                {
                    label: 'Precio Actual (MXN)',
                    data: datos.actual,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)'
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' },
            },
            scales: {
                y: { title: { display: true, text: 'Precio (MXN)' } }
            }
        }
    });
}

function mostrarPreciosTiempoReal(preciosActuales) {
    const contenedor = $('#preciosTiempoReal');
    contenedor.empty();
    contenedor.append('<h3>Precios en Tiempo Real</h3>');
    
    for (const [id, precios] of Object.entries(preciosActuales)) {
        contenedor.append(`
            <p>${id.toUpperCase()}: $${precios.mxn.toFixed(2)} MXN / $${precios.usd.toFixed(2)} USD</p>
        `);
    }
}

