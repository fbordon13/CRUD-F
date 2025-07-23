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
      const imagenInput = form.imagen;
      let imagenUrl = '';
      if (imagenInput && imagenInput.files && imagenInput.files[0]) {
        const file = imagenInput.files[0];
        // Convertir archivo a base64
        const toBase64 = (file) => new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
            // Quitar el prefijo "data:image/...;base64," para enviar solo el base64
            const base64 = reader.result.split(',')[1];
            resolve(base64);
          };
          reader.onerror = error => reject(error);
        });
        let base64String = '';
        try {
          base64String = await toBase64(file);
        } catch (err) {
          alert('Error al leer la imagen: ' + err.message);
          return;
        }
        const formData = new FormData();
        formData.append('image', base64String);
        try {
          const res = await fetch('https://api.imgbb.com/1/upload?key=ae98e944e03c25c977e846c7c81fd202', {
            method: 'POST',
            body: formData
          });
          const data = await res.json();
          if (data.success) {
            imagenUrl = data.data.url;
          } else {
            alert('Error al subir la imagen: ' + (data.error?.message || 'Desconocido'));
            return;
          }
        } catch (err) {
          alert('Error al subir la imagen: ' + err.message);
          return;
        }
      }
      try {
        await addDoc(collection(db, 'productos'), {
          nombre,
          precio,
          descripcion,
          estado,
          imagenUrl,
          creado: serverTimestamp()
        });
        form.reset();
        // Limpiar previsualización si existe
        const preview = document.getElementById('imagePreview');
        if (preview) {
          preview.innerHTML = '<span>Previsualización de la imagen</span>';
        }
        alert('Producto creado exitosamente');
      } catch (err) {
        alert('Error al crear producto: ' + err.message);
      }
    });
  }
}

// --- MOSTRAR PRODUCTOS EN TIEMPO REAL ---
if (path.includes('products.html')) {
  const productsList = document.getElementById('productsList');
  if (productsList) {
    // Consulta ordenada por fecha de creación descendente
    const q = query(collection(db, 'productos'), orderBy('creado', 'desc'));
    onSnapshot(q, (snapshot) => {
      productsList.innerHTML = '';
      if (snapshot.empty) {
        productsList.innerHTML = '<div class="no-products">No hay productos para mostrar.</div>';
        return;
      }
      snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
          <div class="product-card-image">
            ${data.imagenUrl ? `<img src="${data.imagenUrl}" alt="${data.nombre}">` : '<span style="color:#bbb;font-size:2.2rem;">🖼️</span>'}
          </div>
          <div class="product-card-info">
            <div class="product-card-title">${data.nombre}</div>
            <div class="product-card-price">$${data.precio.toFixed(2)}</div>
            <div class="product-card-desc">${data.descripcion}</div>
            <div class="product-card-status">${data.estado.charAt(0).toUpperCase() + data.estado.slice(1)}</div>
          </div>
        `;
        productsList.appendChild(card);
      });
    });
  }
}
