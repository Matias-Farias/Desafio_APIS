document.getElementById('convertir').addEventListener('click', convertirMoneda);

async function convertirMoneda() {
    const cantidad = document.getElementById('cantidad').value;
    const moneda = document.getElementById('moneda').value;

    if (cantidad === '' || isNaN(cantidad)) {
        alert('Por favor, ingrese una cantidad válida.');
        return;
    }

    try {
        const response = await fetch('https://mindicador.cl/api');
        const data = await response.json();
        let valor;

        if (moneda === 'dolar') {
            valor = data.dolar.valor;
        } else if (moneda === 'euro') {
            valor = data.euro.valor;
        }else if (moneda === 'uf') {
            valor = data.uf.valor;
        }

        const resultado = (cantidad / valor).toFixed(2);
        document.getElementById('resultado').textContent = `Resultado: ${resultado} ${moneda.toUpperCase()}`;

        mostrarGrafico(data[moneda].codigo);
    } catch (error) {
        document.getElementById('resultado').textContent = 'Error al obtener los datos. Intente nuevamente.';
        console.error('Error:', error);
    }
}

async function mostrarGrafico(codigoMoneda) {
    try {
        const response = await fetch(`https://mindicador.cl/api/${codigoMoneda}`);
        const data = await response.json();

        const labels = data.serie.slice(0, 10).map(item => item.fecha.slice(0, 10));
        const valores = data.serie.slice(0, 10).map(item => item.valor);

        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `Valor de los últimos 10 días (${codigoMoneda.toUpperCase()})`,
                    data: valores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error al obtener los datos históricos:', error);
    }
}
