<template>
    <div class="container d-flex justify-content-center align-items-center vh-100">
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-else class="card shadow rounded" style="max-width: 600px; width: 100%;">
        <div class="card-body">
          <h2 class="text-center mb-4">Buat Akun Baru</h2>
          <form @submit.prevent="register" id="registration-form">
            <div class="mb-3">
              <label for="name_admin" class="form-label">Nama Lengkap:</label>
              <input
                type="text"
                id="name_admin"
                class="form-control"
                v-model="name_admin"
                placeholder="Cth: Charlize Scavendish"
                :class="{'is-invalid': !name_adminState && name_admin.length > 0}"
              />
              <div v-if="!name_admin && name_admin.length > 0" class="invalid-feedback">Nama wajib diisi</div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="username_admin" class="form-label">Username:</label>
                <input
                  type="text"
                  id="username_admin"
                  class="form-control"
                  v-model="username_admin"
                  placeholder="Cth: Charlize_Scavendish"
                  :class="{'is-invalid': !username_adminState && username_admin.length > 0}"
                />
                <div v-if="!username_admin && username_admin.length > 0" class="invalid-feedback">Username wajib diisi</div>
                <div v-if="serverErrors.username_admin" class="invalid-feedback">{{ serverErrors.username_admin }}</div>
              </div>
              <div class="col-md-6">
                <label for="email_admin" class="form-label">Email:</label>
                <input
                  type="email"
                  id="email_admin"
                  class="form-control"
                  v-model="email_admin"
                  placeholder="Cth: nama@email.com"
                  :class="{'is-invalid': !email_adminState && email_admin.length > 0}"
                />
                <div v-if="!email_admin && email_admin.length > 0" class="invalid-feedback">Email wajib diisi</div>
                <div v-if="serverErrors.email_admin" class="invalid-feedback">{{ serverErrors.email_admin }}</div>
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="phone_admin" class="form-label">No Handphone:</label>
                <input
                  type="tel"
                  id="phone_admin"
                  class="form-control"
                  v-model="phone_admin"
                  placeholder="Cth: 081228567215"
                  :class="{'is-invalid': !phone_adminState && phone_admin.length > 0}"
                />
                <div v-if="!phone_admin && phone_admin.length > 0" class="invalid-feedback">No Handphone wajib diisi</div>
              </div>
              <div class="col-md-6">
                <label for="dob_admin" class="form-label">Tanggal Lahir:</label>
                <input
                  type="date"
                  id="dob_admin"
                  class="form-control"
                  v-model="dob_admin"
                  :class="{'is-invalid': !dob_adminState && dob_admin.length > 0}"
                />
                <div v-if="!dob_admin && dob_admin.length > 0" class="invalid-feedback">Tanggal Lahir wajib diisi</div>
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="password_admin" class="form-label">Password:</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password_admin"
                    class="form-control"
                    v-model="password_admin"
                    :class="{'is-invalid': !password_adminState && password_admin.length > 0}"
                  />
                  <button class="btn btn-outline-primary" type="button" @click="togglePasswordVisibility">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="!password_admin && password_admin.length > 0" class="invalid-feedback">Password wajib diisi</div>
                <div class="form-text">Password minimal 6 karakter.</div>
              </div>
  
              <div class="col-md-6">
                <label for="confirm-password" class="form-label">Konfirmasi Password:</label>
                <div class="input-group">
                  <input
                    :type="showConfirmPassword ? 'text' : 'password'"
                    id="confirm-password"
                    class="form-control"
                    v-model="confirmPassword"
                    :class="{'is-invalid': !confirmPasswordState && confirmPassword.length > 0}"
                  />
                  <button class="btn btn-outline-primary" type="button" @click="toggleConfirmPasswordVisibility">
                    <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="!confirmPassword || confirmPassword !== password_admin" class="invalid-feedback">Konfirmasi password tidak sama</div>
              </div>
            </div>
  
            <div class="text-center mt-4">
              <button type="submit" class="btn btn-primary">Daftar</button>
            </div>
            <div class="text-center mt-2">
              Sudah mempunyai akun? <router-link to="/login" class="text-primary">Login</router-link>
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
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const name_admin = ref('');
  const username_admin = ref('');
  const email_admin = ref('');
  const phone_admin = ref('');
  const dob_admin = ref('');
  const password_admin = ref('');
  const confirmPassword = ref('');
  const showPassword = ref(false);
  const showConfirmPassword = ref(false);
  const router = useRouter();
  
  const name_adminState = ref(true);
  const username_adminState = ref(true);
  const email_adminState = ref(true);
  const phone_adminState = ref(true);
  const dob_adminState = ref(true);
  const password_adminState = ref(true);
  const confirmPasswordState = ref(true);
  
  const serverErrors = ref({});
  const generalError = ref('');
  const isLoading = ref(false);
  
  const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
  };
  
  const toggleConfirmPasswordVisibility = () => {
    showConfirmPassword.value = !showConfirmPassword.value;
  };
  
  const register = async () => {
    name_adminState.value = !!name_admin.value;
    username_adminState.value = !!username_admin.value;
    email_adminState.value = !!email_admin.value;
    phone_adminState.value = !!phone_admin.value;
    dob_adminState.value = !!dob_admin.value;
    password_adminState.value = !!password_admin.value && password_admin.value.length >= 6; // Changed password validation
    confirmPasswordState.value = confirmPassword.value === password_admin.value;
  
    if (
      name_adminState.value &&
      username_adminState.value &&
      email_adminState.value &&
      phone_adminState.value &&
      dob_adminState.value &&
      password_adminState.value &&
      confirmPasswordState.value
    ) {
      isLoading.value = true;
      try {
        const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/regist', {
          name_admin: name_admin.value,
          username_admin: username_admin.value,
          email_admin: email_admin.value,
          phone_admin: phone_admin.value,
          dob_admin: dob_admin.value,
          password_admin: password_admin.value,
          role: 'admin'
        });
  
        if (response.data.success) {
          setTimeout(() => {
            isLoading.value = false;
            router.push({ name: 'AdminLogin' });
          }, 2000);
        } else {
          handleErrors(response.data.error);
          isLoading.value = false;
        }
      } catch (error) {
        generalError.value = error.response.data.message;
        isLoading.value = false;
      }
    }
  };
  
  const handleErrors = (error) => {
    serverErrors.value = {};
    generalError.value = '';
  
    if (error) {
      console.error('Error object:', error);
      if (error.username_admin) {
        serverErrors.value.username_admin = error.username_admin;
      }
      if (error.email_admin) {
        serverErrors.value.email_admin = error.email_admin;
      }
      if (error.phone_admin) {
        serverErrors.value.phone_admin = error.phone_admin;
      }
      if (error.dob_admin) {
        serverErrors.value.dob_admin = error.dob_admin;
      }
      if (error.password_admin) {
        serverErrors.value.password_admin = error.password_admin;
      }
      if (error.general) {
        generalError.value = error.general;
      }
    }
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
  
  .text-primary {
    color: #50b1f9;
  }
  
  .alert {
    margin-top: 1rem;
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
  
  i {
    color: #50b1f9 !important;
  }
  
  i:hover {
    color: #fff !important;
  }
  
  .btn-outline-primary:hover {
    color: #fff !important;
  }
  
  .spinner-border {
    width: 3rem;
    height: 3rem;
    border-width: 0.3em;
    color: #50b1f9;
  }
  </style>
  