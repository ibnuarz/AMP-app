<template>
  <div class="user-data d-flex flex-column h-100">
    <Navbar />
    <main class="flex-grow-1">
      <div class="container">
        <h1>User Data</h1>
        <div class="table-responsive">
          <DataTable
            :data="users"
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
      users: [],
      columns: [
        { title: 'Nama', data: 'name_user' },
        { title: 'Username', data: 'username_user' },
        { title: 'Email', data: 'email_user' },
        { title: 'Telephone', data: 'phone_user' },
        {
          title: 'Aksi',
          data: null,
          render: (data, type, row) => `
            <button class="btn btn-danger btn-sm ml-2" onclick="deleteUser('${row._id}')">Hapus</button>
          `,
        },
      ],
      dataTableOptions: {
        responsive: true,
      },
    };
  },
  created() {
    this.fetchUsers();
    window.deleteUser = this.deleteUser;
  },
  methods: {
    async fetchUsers() {
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataUsers', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.data.success) {
          this.users = response.data.data;
        } else {
          console.error('Failed to fetch users:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    },
    async deleteUser(userId) {
      const result = await Swal.fire({
        title: 'Anda Yakin?',
        text: 'Data User Ini Akan Terhapus Permanen!',
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
          const response = await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataUsers/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          if (response.data.success) {
            Swal.fire('Terhapus!', 'Data User Berhasil Terhapus.', 'success');
            this.fetchUsers();
          } else {
            Swal.fire('Gagal!', `Gagal Menghapus User : ${response.data.message}`, 'error');
          }
        } catch (error) {
          Swal.fire('Error!', 'An error occurred while deleting the user.', 'error');
          console.error('Error deleting user:', error);
        }
      }
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

main {
  flex: 1;
  padding: 25px;
  margin-top: 70px;
}
</style>
