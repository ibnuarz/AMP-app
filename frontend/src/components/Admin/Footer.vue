<template>
    <footer class="bg-light text-center text-lg-start mt-auto">
      <div class="container p-4">
        <p class="mb-0">Apotek Medika Prima &copy; {{ currentYear }}</p>
      </div>
    </footer>
  </template>
  
  <script>
  export default {
    name: 'Footer',
    data() {
      return {
        currentYear: new Date().getFullYear()
      };
    }
  };
  </script>
  
  <style scoped>
  footer {
    padding: 1rem;
  }
  </style>
  