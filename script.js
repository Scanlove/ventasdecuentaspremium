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

// Registrar nueva venta
function registrarVenta() {
    const plataforma = document.getElementById('plataforma').value;
    const tipoCuenta = document.getElementById('tipoCuenta').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const fecha = document.getElementById('fecha').value;

    if(!plataforma || !tipoCuenta || !precio || !fecha) {
        alert('Por favor, complete todos los campos');
        return;
    }

    const venta = {
        id: Date.now(), // Identificador único para cada venta
        fecha,
        plataforma,
        tipoCuenta,
        precio
    };

    ventas.push(venta);
    guardarVentas();

    // Limpiar formulario
    document.getElementById('plataforma').value = '';
    document.getElementById('tipoCuenta').value = '';
    document.getElementById('precio').value = '';
    document.getElementById('fecha').valueAsDate = new Date();

    alert('Venta registrada exitosamente');
}

// Guardar ventas en localStorage
function guardarVentas() {
    localStorage.setItem('ventas', JSON.stringify(ventas));
}

// Actualizar tabla de ventas
function actualizarTabla() {
    const tbody = document.getElementById('tablaVentas');
    tbody.innerHTML = '';

    let total = 0;

    ventas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).forEach(venta => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${new Date(venta.fecha).toLocaleDateString()}</td>
            <td>${venta.plataforma}</td>
            <td>${venta.tipoCuenta}</td>
            <td>$${venta.precio.toFixed(2)}</td>
            <td>
                <button class="delete-button" onclick="eliminarVenta(${venta.id})">
                    Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
        total += venta.precio;
    });

    document.getElementById('totalVentas').textContent = total.toFixed(2);
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
    let csv = 'Fecha,Plataforma,Tipo,Precio\n';
    ventas.forEach(venta => {
        csv += `${venta.fecha},${venta.plataforma},${venta.tipoCuenta},${venta.precio}\n`;
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
