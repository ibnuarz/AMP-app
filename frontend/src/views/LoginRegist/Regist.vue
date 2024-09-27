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
              <label for="name_user" class="form-label">Nama Lengkap:</label>
              <input
                type="text"
                id="name_user"
                class="form-control"
                v-model="name_user"
                placeholder="Cth: Charlize Scavendish"
                :class="{'is-invalid': !name_userState && name_user.length > 0}"
              />
              <div v-if="!name_user && name_user.length > 0" class="invalid-feedback">Nama wajib diisi</div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="username_user" class="form-label">Username:</label>
                <input
                  type="text"
                  id="username_user"
                  class="form-control"
                  v-model="username_user"
                  placeholder="Cth: Charlize_Scavendish"
                  :class="{'is-invalid': !username_userState && username_user.length > 0}"
                />
                <div v-if="!username_user && username_user.length > 0" class="invalid-feedback">Username wajib diisi</div>
                <div v-if="serverErrors.username_user" class="invalid-feedback">{{ serverErrors.username_user }}</div>
              </div>
              <div class="col-md-6">
                <label for="email_user" class="form-label">Email:</label>
                <input
                  type="email"
                  id="email_user"
                  class="form-control"
                  v-model="email_user"
                  placeholder="Cth: nama@email.com"
                  :class="{'is-invalid': !email_userState && email_user.length > 0}"
                />
                <div v-if="!email_user && email_user.length > 0" class="invalid-feedback">Email wajib diisi</div>
                <div v-if="serverErrors.email_user" class="invalid-feedback">{{ serverErrors.email_user }}</div>
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="phone_user" class="form-label">No Handphone:</label>
                <input
                  type="tel"
                  id="phone_user"
                  class="form-control"
                  v-model="phone_user"
                  placeholder="Cth: 081228567215"
                  :class="{'is-invalid': !phone_userState && phone_user.length > 0}"
                />
                <div v-if="!phone_user && phone_user.length > 0" class="invalid-feedback">No Handphone wajib diisi</div>
              </div>
              <div class="col-md-6">
                <label for="dob_user" class="form-label">Tanggal Lahir:</label>
                <input
                  type="date"
                  id="dob_user"
                  class="form-control"
                  v-model="dob_user"
                  :class="{'is-invalid': !dob_userState && dob_user.length > 0}"
                />
                <div v-if="!dob_user && dob_user.length > 0" class="invalid-feedback">Tanggal Lahir wajib diisi</div>
              </div>
            </div>
  
            <div class="row mb-3">
              <div class="col-md-6">
                <label for="password_user" class="form-label">Password:</label>
                <div class="input-group">
                  <input
                    :type="showPassword ? 'text' : 'password'"
                    id="password_user"
                    class="form-control"
                    v-model="password_user"
                    :class="{'is-invalid': !password_userState && password_user.length > 0}"
                  />
                  <button class="btn btn-outline-primary" type="button" @click="togglePasswordVisibility">
                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                  </button>
                </div>
                <div v-if="!password_user && password_user.length > 0" class="invalid-feedback">Password wajib diisi</div>
                <div class="form-text">Password minimal 6 karakter, meliputi Huruf Kapital, Tanda Baca, dan Angka.</div>
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
                <div v-if="!confirmPassword || confirmPassword !== password_user" class="invalid-feedback">Konfirmasi password tidak sama</div>
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

const name_user = ref('');
const username_user = ref('');
const email_user = ref('');
const phone_user = ref('');
const dob_user = ref('');
const password_user = ref('');
const confirmPassword = ref('');
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const router = useRouter();

const name_userState = ref(true);
const username_userState = ref(true);
const email_userState = ref(true);
const phone_userState = ref(true);
const dob_userState = ref(true);
const password_userState = ref(true);
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
  name_userState.value = !!name_user.value;
  username_userState.value = !!username_user.value;
  email_userState.value = !!email_user.value;
  phone_userState.value = !!phone_user.value;
  dob_userState.value = !!dob_user.value;
  password_userState.value = !!password_user.value && isValidPassword(password_user.value);
  confirmPasswordState.value = confirmPassword.value === password_user.value;
  
  if (
    name_userState.value &&
    username_userState.value &&
    email_userState.value &&
    phone_userState.value &&
    dob_userState.value &&
    password_userState.value &&
    confirmPasswordState.value
  ) {
    isLoading.value = true;
    try {
      const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/auth/register', {
        name_user: name_user.value,
        username_user: username_user.value,
        email_user: email_user.value,
        phone_user: phone_user.value,
        dob_user: dob_user.value,
        password_user: password_user.value,
      });

      if (response.data.success) {
        setTimeout(() => {
          isLoading.value = false;
          router.push({ name: 'Login' });
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


const isValidPassword = (password) => {
  return password.length >= 6 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password);
};

const handleErrors = (error) => {
  serverErrors.value = {};
  generalError.value = '';

  if (error) {
    console.error('Error object:', error);
    if (error.username_user) {
      serverErrors.value.username_user = error.username_user;
    }
    if (error.email_user) {
      serverErrors.value.email_user = error.email_user;
    }
    if (error.phone_user) {
      serverErrors.value.phone_user = error.phone_user;
    }
    if (error.dob_user) {
      serverErrors.value.dob_user = error.dob_user;
    }
    if (error.password_user) {
      serverErrors.value.password_user = error.password_user;
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
i{
  color: #50b1f9 !important;
}
i:hover{
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
