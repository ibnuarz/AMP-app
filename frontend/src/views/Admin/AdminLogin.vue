<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="card shadow rounded" style="max-width: 400px; width: 100%;">
        <div class="card-body">
          <h4 class="card-title text-center mb-4">Admin Login</h4>
          <form @submit.prevent="login">
            <div class="mb-3">
              <label for="username" class="form-label">Username</label>
              <input 
                type="text" 
                id="username" 
                class="form-control" 
                v-model="username_admin" 
                required
              />
            </div>
            <div class="mb-3">
              <label for="password" class="form-label">Password</label>
              <div class="input-group">
                <input 
                  :type="passwordVisible ? 'text' : 'password'" 
                  id="password" 
                  class="form-control" 
                  v-model="password_admin" 
                  required
                />
                <button 
                  class="btn btn-outline-primary" 
                  type="button" 
                  @click="togglePasswordVisibility"
                >
                  <i :class="passwordVisible ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
              </div>
            </div>
            <br>
            <div class="d-grid mb-3">
              <button type="submit" class="btn btn-primary">Login</button>
            </div>
            <div class="text-center mt-3">
              <p>Belum punya akun? <router-link to="/admin/regist" class="text-primary">Daftar</router-link></p>
            </div>
            <div v-if="generalError" class="alert alert-danger mt-3">
              {{ generalError }}
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { ref } from 'vue';
  import axios from 'axios';
  const username_admin = ref('');
  const password_admin = ref('');
  const passwordVisible = ref(false);
  const generalError = ref('');
  const isLoading = ref(false);
  const router = useRouter();
  const login = async () => {
    isLoading.value = true;
    try {
      const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/login', {
        username_admin: username_admin.value,
        password_admin: password_admin.value,
      });
      if (response.data.success) {
        const authTokenAdmin = response.data.authTokenAdmin;
        sessionStorage.setItem('authTokenAdmin', authTokenAdmin);
        sessionStorage.setItem('adminData', JSON.stringify(response.data.data));
        setTimeout(() => {
          router.push({ name: 'HomeAdmin' });
          isLoading.value = false;
        }, 1500);
      } else {
        generalError.value = 'Login failed';
        isLoading.value = false;
      }
    } catch (error) {
      generalError.value = error.response.data.message;
      isLoading.value = false;
    }
  };
  
  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
  };
  </script>
  
  <style scoped>
  .card {
    border-radius: 10px;
  }
  
  .card-body {
    padding: 2rem;
  }
  
  .btn-primary {
    background-color: #50b1f9;
    border: none;
  }
  
  .d-grid {
    display: grid;
  }
  
  .text-primary {
    color: #50b1f9;
  }

i{
  color: #50b1f9 !important;
}
i:hover{
  color: #fff !important;
}
.btn-outline-primary:hover {
  color: #fff !important;
}

  
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
    color: #50b1f9;
  }
  </style>
  