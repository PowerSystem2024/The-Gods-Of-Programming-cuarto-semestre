// Test de conectividad con el backend
console.log('Testing backend connection...');

// Probar conexión directa
fetch('http://localhost:5000/api/products')
  .then(response => {
    console.log('Backend Response Status:', response.status);
    console.log('Backend Response Headers:', response.headers);
    return response.json();
  })
  .then(data => {
    console.log('Backend Response Data:', data);
    console.log('Products found:', data?.data?.products?.length || 0);
  })
  .catch(error => {
    console.error('Backend Connection Error:', error);
  });