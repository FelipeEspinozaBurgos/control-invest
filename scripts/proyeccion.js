$(document).ready(async function () {
    // Procesar datos agrupados por activo
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));

    // Mapeo de IDs de activos compatibles con CoinGecko
    const activosCoinGecko = {
        XRP: 'ripple',
        ADA: 'cardano',
        HBAR: 'hedera-hashgraph',
        ONDO: 'ondo-finance',
        XLM: 'stellar',
        DOT: 'polkadot'
    };

    // Obtener precios actuales desde CoinGecko
    const preciosActuales = await obtenerPreciosActuales(Object.values(activosCoinGecko));

    if (Object.keys(preciosActuales).length === 0) {
        console.error("No se pudieron obtener precios actuales.");
        return;
    }

    // Calcular ganancias/pérdidas
    const ganancias = calcularGanancias(datosProcesados, preciosActuales, activosCoinGecko);

    // Crear gráfico de proyección de ganancias
    crearGraficoGanancias(ganancias);
});

// Función para obtener precios actuales desde CoinGecko
async function obtenerPreciosActuales(activos) {
    try {
        const ids = activos.join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=mxn`);
        
        if (!response.ok) {
            throw new Error('Error en la respuesta de la API');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al obtener los precios actuales:', error);
        return {};
    }
}

// Función para calcular ganancias/pérdidas
function calcularGanancias(datosProcesados, preciosActuales, activosCoinGecko) {
    return datosProcesados.map(activo => {
        const idCoinGecko = activosCoinGecko[activo.activo];
        const precioActualMXN = preciosActuales[idCoinGecko]?.mxn || 0;
        const precioPromedioEntrada = activo.totalInversion / activo.totalCantidad;
        const ganancia = (precioActualMXN * activo.totalCantidad) - activo.totalInversion;

        return {
            activo: activo.activo,
            precioPromedioEntrada: precioPromedioEntrada.toFixed(2),
            precioActualMXN: precioActualMXN.toFixed(2),
            ganancia: ganancia.toFixed(2)
        };
    });
}

// Función para crear gráfico de proyección de ganancias
function crearGraficoGanancias(ganancias) {
    const ctx = $('#chartGanancias')[0].getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ganancias.map(g => g.activo),
            datasets: [
                {
                    label: 'Ganancia/Pérdida (MXN)',
                    data: ganancias.map(g => parseFloat(g.ganancia)),
                    backgroundColor: ganancias.map(g => parseFloat(g.ganancia) >= 0 ? 'rgba(54, 162, 235, 0.7)' : 'rgba(255, 99, 132, 0.7)')
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            },
            scales: {
                y: { title: { display: true, text: 'Ganancia/Pérdida (MXN)' } }
            }
        }
    });
}

