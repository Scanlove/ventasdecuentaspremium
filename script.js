// Obtener ventas del localStorage o inicializar array vacío
let ventas = JSON.parse(localStorage.getItem('ventas')) || [];

// Cambiar entre pestañas
function switchTab(tab) {
    document.querySelectorAll('.form-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(tab).style.display = 'block';

    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    if(tab === 'historial') {
        actualizarTabla();
    }
}

// Calcular ganancia en tiempo real
function calcularGananciaPreview() {
    const precioCompra = parseFloat(document.getElementById('precioCompra').value) || 0;
    const precioVenta = parseFloat(document.getElementById('precioVenta').value) || 0;
    const ganancia = precioVenta - precioCompra;
    document.getElementById('gananciaPreview').textContent = ganancia.toFixed(2);
}

// Agregar event listeners para calcular ganancia en tiempo real
document.getElementById('precioCompra').addEventListener('input', calcularGananciaPreview);
document.getElementById('precioVenta').addEventListener('input', calcularGananciaPreview);

// Registrar nueva venta
function registrarVenta() {
    const plataforma = document.getElementById('plataforma').value;
    const tipoCuenta = document.getElementById('tipoCuenta').value;
    const precioCompra = parseFloat(document.getElementById('precioCompra').value);
    const precioVenta = parseFloat(document.getElementById('precioVenta').value);
    const fecha = document.getElementById('fecha').value;

    if(!plataforma || !tipoCuenta || !precioCompra || !precioVenta || !fecha) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const venta = {
        id: Date.now(),
        fecha,
        plataforma,
        tipoCuenta,
        precioCompra,
        precioVenta,
        ganancia: precioVenta - precioCompra
    };

    ventas.push(venta);
    guardarVentas();

    // Limpiar formulario
    document.getElementById('plataforma').value = '';
    document.getElementById('tipoCuenta').value = '';
    document.getElementById('precioCompra').value = '';
    document.getElementById('precioVenta').value = '';
    document.getElementById('fecha').valueAsDate = new Date();
    document.getElementById('gananciaPreview').textContent = '0.00';

    alert('Venta registrada exitosamente');
}

// Guardar ventas en localStorage
function guardarVentas() {
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Actualizar tabla de ventas y resumen
function actualizarTabla() {
    const tbody = document.getElementById('tablaVentas');
    tbody.innerHTML = '';

    let totalInvertido = 0;
    let totalVendido = 0;
    let totalGanancia = 0;

    ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${venta.plataforma}</td>
            <td>${venta.tipoCuenta}</td>
            <td>$${venta.precioCompra.toFixed(2)}</td>
            <td>$${venta.precioVenta.toFixed(2)}</td>
            <td class="${venta.ganancia >= 0 ? 'ganancia-positiva' : 'ganancia-negativa'}">
                $${venta.ganancia.toFixed(2)}
            </td>
            <td>
                <button class="delete-button" onclick="eliminarVenta(${venta.id})">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        
        totalInvertido += venta.precioCompra;
        totalVendido += venta.precioVenta;
        totalGanancia += venta.ganancia;
    });

    // Actualizar cards de resumen
    document.getElementById('totalInvertido').textContent = totalInvertido.toFixed(2);
    document.getElementById('totalVendido').textContent = totalVendido.toFixed(2);
    document.getElementById('gananciaTotal').textContent = totalGanancia.toFixed(2);
}

// Eliminar venta
function eliminarVenta(id) {
    if(confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
        ventas = ventas.filter(venta => venta.id !== id);
        guardarVentas();
        actualizarTabla();
    }
}

// Exportar a Excel (CSV)
function exportarExcel() {
    let csv = 'Fecha,Plataforma,Tipo,Precio Compra,Precio Venta,Ganancia\n';
    ventas.forEach(venta => {
        csv += `${venta.fecha},${venta.plataforma},${venta.tipoCuenta},${venta.precioCompra},${venta.precioVenta},${venta.ganancia}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ventas_streaming.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Establecer fecha actual por defecto al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('fecha').valueAsDate = new Date();
});
