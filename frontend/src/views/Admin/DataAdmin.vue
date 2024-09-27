<template>
  <div v-if="isAuthorized" class="user-data d-flex flex-column h-100">
    <Navbar />
    <main class="flex-grow-1">
      <div class="container">
        <h1>Admin Data</h1>
        <div class="table-responsive">
          <DataTable
            :data="admins"
            :columns="columns"
            class="table table-striped"
            :options="dataTableOptions"
          />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Admin/Navbar.vue';
import Footer from '@/components/Admin/Footer.vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import Swal from 'sweetalert2';
import axios from 'axios';

DataTable.use(DataTablesCore);

export default {
  components: {
    Navbar,
    Footer,
    DataTable,
  },
  data() {
    return {
      admins: [],
      columns: [
        { title: 'Nama', data: 'name_admin' },
        { title: 'Username', data: 'username_admin' },
        { title: 'Email', data: 'email_admin' },
        { title: 'Telephone', data: 'phone_admin' },
        {
          title: 'Aksi',
          data: null,
          render: (data, type, row) => `
            <button class="btn btn-warning btn-sm m-1" onclick="editAdmin('${row._id}')">Edit</button>
            <button class="btn btn-danger btn-sm m-1" onclick="deleteAdmin('${row._id}')">Hapus</button>
          `,
        },
      ],
      dataTableOptions: {
        responsive: true,
      },
      isAuthorized: false,
    };
  },
  async created() {
    try {
      const userData = JSON.parse(sessionStorage.getItem('adminData'));
      if (userData && userData.role === 'superadmin') {
        this.isAuthorized = true;
        this.fetchAdmins();
        window.editAdmin = this.editAdmin;
        window.deleteAdmin = this.deleteAdmin;
      } else {
        await Swal.fire({
          icon: 'warning',
          title: 'Akses Ditolak',
          text: 'Role Anda tidak untuk mengakses halaman ini',
          confirmButtonText: 'Kembali',
        });
        this.$router.push('/admin/home');
      }
    } catch (error) {
      console.error('Error checking authorization:', error);
    }
  },
  methods: {
    async fetchAdmins() {
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataAdmins', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.data.success) {
          this.admins = response.data.data;
        } else {
          console.error('Failed to fetch admins:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    },
    
    async deleteAdmin(adminId) {
      const result = await Swal.fire({
        title: 'Anda Yakin?',
        text: 'Data Admin Ini Akan Terhapus Permanen!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Tidak!',
      });

      if (result.isConfirmed) {
        try {
          const token = sessionStorage.getItem('authTokenAdmin');
          const response = await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataAdmins/${adminId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (response.data.success) {
            Swal.fire('Terhapus!', 'Data Admin Berhasil Terhapus.', 'success');
            this.fetchAdmins();
          } else {
            Swal.fire('Gagal!', `Gagal Menghapus Admin: ${response.data.message}`, 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred while deleting the admin.', 'error');
          console.error('Error deleting admin:', error);
        }
      }
    },
    
    editAdmin(adminId) {
      this.$router.push(`/admin/editadmin/${adminId}`);
    },
  },
};
</script>

<style>
.user-data {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.btn {
  color: #fff !important;
}

main {
  flex: 1;
  padding: 25px;
  margin-top: 70px;
}
</style>
