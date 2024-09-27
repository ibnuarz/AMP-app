<template>
  <div class="edit-admin-container">
    <Navbar />
    <main class="flex-grow-1">
      <div class="container">
        <form @submit.prevent="updateAdmin" class="form">
          <div class="d-flex justify-content-between align-items-center mb-2">
                <h1>Edit Admin</h1>
                <a class="btn btn-danger" :href="'/admin/dataadmin'">Kembali</a>
            </div>
          <div class="form-group">
            <label for="name_admin">Nama</label>
            <input
              type="text"
              id="name_admin"
              v-model="admin.name_admin"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="username_admin">Username</label>
            <input
              type="text"
              id="username_admin"
              v-model="admin.username_admin"
              class="form-control"
              disabled
            />
          </div>
          <div class="form-group">
            <label for="email_admin">Email</label>
            <input
              type="email"
              id="email_admin"
              v-model="admin.email_admin"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="phone_admin">Telephone</label>
            <input
              type="text"
              id="phone_admin"
              v-model="admin.phone_admin"
              class="form-control"
              required
            />
          </div>
          <div class="form-group">
            <label for="dob_admin">Tanggal Lahir</label>
            <input
              type="date"
              id="dob_admin"
              v-model="admin.dob_admin"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label for="role">Role</label>
            <select
              id="role"
              v-model="admin.role"
              class="form-control"
              required
            >
              <option value="admin">Admin</option>
              <option value="superadmin">Superadmin</option>
            </select>
          </div>
          <div class="form-group">
            <label for="password_admin">Password (kosongkan jika tidak mau diubah)</label>
            <input
              type="password"
              id="password_admin"
              v-model="admin.password_admin"
              class="form-control"
            />
          </div>
          <button type="submit" class="btn btn-primary">Update Admin</button>
        </form>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Admin/Navbar.vue';
import Footer from '@/components/Admin/Footer.vue';
import Swal from 'sweetalert2';
import axios from 'axios';

export default {
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      admin: {
        name_admin: '',
        username_admin: '',
        email_admin: '',
        phone_admin: '',
        dob_admin: '',
        role: '',
        password_admin: '',
      },
    };
  },
  async created() {
    this.fetchAdmin();
  },
  methods: {
    async fetchAdmin() {
      try {
        const adminId = this.$route.params.id;
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataAdmins/${adminId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });
        if (response.data.success) {
          this.admin = response.data.data;
          this.admin.password_admin = '';
        } else {
          console.error('Failed to fetch admin:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching admin:', error);
      }
    },
    async updateAdmin() {
      try {
        const adminId = this.$route.params.id;
        const token = sessionStorage.getItem('authTokenAdmin');
        const updateData = { ...this.admin };
        if (!updateData.password_admin.trim()) {
          delete updateData.password_admin;
        }

        const response = await axios.put(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataAdmins/${adminId}`, updateData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        if (response.data.success) {
          await Swal.fire({
            title: 'Success!',
            text: 'Admin has been updated successfully.',
            icon: 'success',
            confirmButtonText: 'OK'
          });
          this.$router.push('/admin/dataadmin');
        } else {
          console.error('Failed to update admin:', response.data.message);
          await Swal.fire({
            title: 'Error!',
            text: `Failed to update admin: ${response.data.message}`,
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      } catch (error) {
        console.error('Error updating admin:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'There was an issue updating the admin. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    },
  },
};
</script>

<style>
.edit-admin-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 25px;
}

.form {
  max-width: 600px;
  margin: 0 auto;
}

.btn-primary {
  margin-top: 20px;
}
</style>
