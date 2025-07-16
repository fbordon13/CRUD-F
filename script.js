// Detectar en qué página estamos
const path = window.location.pathname;

import { db } from './firebase-config.js';
import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

// --- CREAR PRODUCTO ---
if (path.includes('create-products.html')) {
  const form = document.querySelector('.product-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = form.nombre.value.trim();
      const precio = parseFloat(form.precio.value);
      const descripcion = form.descripcion.value.trim();
      const estado = form.estado.value;
      try {
        await addDoc(collection(db, 'productos'), {
          nombre,
          precio,
          descripcion,
          estado,
          creado: serverTimestamp()
        });
        form.reset();
        alert('Producto creado exitosamente');
      } catch (err) {
        alert('Error al crear producto: ' + err.message);
      }
    });
  }
}

// --- MOSTRAR PRODUCTOS EN TIEMPO REAL ---
if (path.includes('products.html')) {
  const tbody = document.querySelector('.products-table tbody');
  if (tbody) {
    // Limpiar tbody
    tbody.innerHTML = '';
    // Consulta ordenada por fecha de creación descendente
    const q = query(collection(db, 'productos'), orderBy('creado', 'desc'));
    onSnapshot(q, (snapshot) => {
      tbody.innerHTML = '';
      if (snapshot.empty) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#888;">No hay productos para mostrar.</td></tr>';
        return;
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>-</td>
          <td>${data.nombre}</td>
          <td>$${data.precio.toFixed(2)}</td>
          <td>${data.descripcion}</td>
          <td>${data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}</td>
        `;
        tbody.appendChild(tr);
      });
    });
  }
}
