const normalizarTransaccion = (tx) => ({
    activo: tx.Cantidad.split('-').pop().trim(),
    tipo: 'compra', // Supuesto inicial
    monto: parseFloat(tx['Monto-inversión']),
    cantidad: parseFloat(tx.Cantidad.split('-')[0]),
    fecha: new Date(tx.Fecha.replace(/(\d{2}) (\w{3}) (\d{4})/, '$1 $2 $3'))
});



const agruparPorActivo = (transacciones) => {
    return transacciones.reduce((acc, tx) => {
        const key = tx.activo;
        if (!acc[key]) {
            acc[key] = {
                compras: [],
                ventas: [],
                totalInversion: 0,
                totalCantidad: 0
            };
        }
        
        acc[key][tx.tipo === 'compra' ? 'compras' : 'ventas'].push(tx);
        acc[key].totalInversion += tx.monto;
        acc[key].totalCantidad += tx.cantidad;
        
        return acc;
    }, {});
};

const transacciones = [
    { activo: "XRP", tipo: "compra", monto: 200, cantidad: 4.550636, fecha: "28/02/25 12:35:16" },
    { activo: "XRP", tipo: "compra", monto: 50, cantidad: 1.141552, fecha: "28/02/25 12:42:02" },
    { activo: "XRP", tipo: "compra", monto: 100, cantidad: 2.277733, fecha: "28/02/25/12:56:10" },

    { activo: "HBAR", tipo: "compra", monto: 30, cantidad: 6.93191068, fecha: "28/02/25/1:00:10" },

    { activo: "ONDO", tipo: "compra", monto: 20, cantidad: 0.91508671, fecha: "28/02/25/1:01:10" },

    { activo: "XRP", tipo: "compra", monto:1.74 , cantidad: 0.04, fecha: "28 feb 2025, 1:25:31 p.m." },
    { activo: "XRP", tipo: "compra", monto: 100, cantidad: 2.283099, fecha: "28 feb 2025, 3:20:31 p.m." },
    { activo: "XRP", tipo: "compra", monto:6.26 , cantidad: 0.143683, fecha: "28 feb 2025, 3:22:53 p.m." },
    { activo: "XRP", tipo: "compra", monto: 100, cantidad: 2.293052, fecha: "28 feb 2025, 3:24:10 p.m." },
    { activo: "XRP", tipo: "compra", monto: 41.99, cantidad: 0.963104, fecha: "28 feb 2025, 3:24:10 p.m." },

    { activo: "ONDO", tipo: "compra", monto: 30, cantidad: 1.4494182, fecha: "28 feb 2025, 3:32:0 p.m." },

    { activo: "ADA", tipo: "compra", monto: 20, cantidad: 1.49596, fecha: "28 feb 2025, 9:06:10 p.m." },

    { activo: "XRP", tipo: "venta", monto: -169.74, cantidad: -3.757856, fecha: "28 feb 2025, 5:07:45 p.m." },

    { activo: "ONDO", tipo: "compra", monto: 30, cantidad: 1.38381356, fecha: "28 feb 2025, 2:15:35 a.m." },
    { activo: "ONDO", tipo: "compra", monto: 30, cantidad: 1.42317773, fecha: "28 feb 2025, 8:59:07 a.m." },
    
    { activo: "XLM", tipo: "compra", monto: 20, cantidad: 3.0194864, fecha: "28 feb 2025, 9:02:38 a.m." },

    { activo: "DOT", tipo: "compra", monto: 103.3, cantidad: 0.99292174, fecha: "28 feb 2025, 8:59:07 a.m." },

    { activo: "XRP", tipo: "compra", monto: 40.795, cantidad: 0.714775, fecha: "28 feb 2025, 10:13:39 p.m." },
    
    { activo: "XRP", tipo: "compra", monto: 20, cantidad: 0.358245, fecha: "28 feb 2025, 10:18:58 p.m." },


    
    
];
// INVERSION INICIAL _ $780.00MXN






const ordenarTransacciones = (grupos) => {
    return Object.entries(grupos)
        .sort((a, b) => b[1].totalInversion - a[1].totalInversion)
        .map(([activo, datos]) => ({
            activo,
            ...datos,
            compras: datos.compras.sort((a, b) => b.monto - a.monto),
            ventas: datos.ventas.sort((a, b) => b.monto - a.monto)
        }));
};

$(document).ready(function () {
    const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));

    // Inicializar la tabla con los datos procesados
    inicializarTabla(datosProcesados);

    // Crear gráficos basados en los datos procesados
    crearGraficos(datosProcesados);

    $('#formNuevaOperacion').on('submit', function (e) {
        e.preventDefault();
    
    });
});

const inicializarTabla = (datos) => { 
    $('#tablaTransacciones').DataTable({
        data: datos.flatMap(grupo => [
            ...grupo.compras.map(tx => ({
                activo: grupo.activo,
                tipo: 'Compra',
                monto: tx.monto.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'}),
                cantidad: tx.cantidad.toFixed(8),
                fecha: tx.fecha.toLocaleString()
            })),
            ...grupo.ventas.map(tx => ({
                activo: grupo.activo,
                tipo: 'Venta',
                monto: tx.monto.toLocaleString('es-MX', {style: 'currency', currency: 'MXN'}),
                cantidad: tx.cantidad.toFixed(8),
                fecha: tx.fecha.toLocaleString()
            }))
        ]),
        columns: [
            { data: 'activo' },
            { data: 'tipo' },
            { data: 'monto' },
            { data: 'cantidad' },
            { data: 'fecha' }
        ],
        order: [[0, 'desc']],
        createdRow: (row, data) => {
            $(row).addClass(data.tipo.toLowerCase());
        }
    });
};

const crearGraficos = (gruposOrdenados) => {
    const ctx = document.createElement('canvas');
    $('#graficos').empty().append(ctx);
        new Chart(ctx.getContext('2d'), {
        type: 'bar',
        data: {
            labels: gruposOrdenados.map(g => g.activo),
            datasets: [{
                label: 'Inversión Total',
                data: gruposOrdenados.map(g => g.totalInversion),
                backgroundColor: 'rgba(54, 162, 235, 0.8)'
            }, {
                label: 'Cantidad Total',
                data: gruposOrdenados.map(g => g.totalCantidad),
                backgroundColor: 'rgba(255, 159, 64, 0.8)',
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    type: 'linear',
                    position: 'left',
                    title: { display: true, text: 'Inversión (MXN)' }
                },
                y1: {
                    type: 'linear',
                    position: 'right',
                    title: { display: true, text: 'Cantidad de Activos' },
                    grid: { drawOnChartArea: false }
                }
            }
        }
    });
};

const memoizedCalculations = (() => {
    const cache = new Map();
    
    return {
        getTotalInversion: (activo) => {
            if (!cache.has(activo)) {
                cache.set(activo, calcularTotalInversion(activo));
            }
            return cache.get(activo);
        },
        clearCache: () => cache.clear()
    };
})();

const inicializarTablaVirtualizada = (datos) => {
    const tabla = $('#tablaTransacciones').DataTable({
        scrollY: '400px',
        scroller: true,
        deferRender: true,
    });
};

const sanitizarMonto = (valor) => {
    const num = parseFloat(valor.replace(/[^0-9.-]/g, ''));
    return isNaN(num) ? 0 : Math.abs(num);
};

const validarTransaccion = (tx) => {
    const errors = [];
    if (typeof tx.monto !== 'number') errors.push('Monto inválido');
    if (!(tx.fecha instanceof Date)) errors.push('Fecha inválida');
    if (errors.length > 0) console.error(`Error en transacción: ${errors.join(', ')}`);
    return errors.length === 0;
};

const aplicarAccesibilidad = () => {
    $('table').attr('role', 'grid');
    $('th').attr('scope', 'col');
    $('tr').each((i, row) => {
        $(row).find('td').attr('role', 'gridcell');
    });
};


const datosProcesados = ordenarTransacciones(agruparPorActivo(transacciones));

// Resumen por activo
const resumen = datosProcesados.map(activo => ({
    Activo: activo.activo,
    'Inversión Total': activo.totalInversion ? `$${activo.totalInversion.toFixed(2)} MXN` : '$0.00 MXN',
    'Cantidad Total': activo.totalCantidad ? activo.totalCantidad.toFixed(8) : '0.00000000',
    'N° Operaciones': (activo.compras?.length || 0) + (activo.ventas?.length || 0)
}));


console.table(resumen);

const datosChart = {
    labels: resumen.map(a => a.Activo),
    datasets: [{
        label: 'Distribución de Inversión',
        data: resumen.map(a => parseFloat(a['Inversión Total'].replace(/[^0-9.]/g, ''))),
        backgroundColor: [-
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)',
            'rgba(153, 102, 255, 0.7)',
            'rgba(255, 159, 64, 0.7)'
        ]
    }]
};
