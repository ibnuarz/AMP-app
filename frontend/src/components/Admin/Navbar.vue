<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <a class="navbar-brand" href="#">ADMIN DASHBOARD</a>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav mr-auto">
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/home">Dashboard</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/dataproduct">Data Produk</router-link>
        </li>
        <li class="nav-item">
          <router-link class="nav-link" to="/admin/datauser">Data User</router-link>
        </li>
        <li class="nav-item" v-if="isSuperAdmin">
          <router-link class="nav-link" to="/admin/dataadmin">Data Admin</router-link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Data Transaksi
          </a>
          <div class="dropdown-menu" aria-labelledby="navbarDropdown">
            <router-link class="dropdown-item" to="/admin/datatransaction">Cek / Ubah Status</router-link>
            <div class="dropdown-divider"  v-if="isSuperAdmin"></div>
            <router-link class="dropdown-item" to="/admin/validatetoken" v-if="isSuperAdmin">Validasi Token Pembayaran</router-link>
          </div>
        </li>
      </ul>
      <ul class="navbar-nav ml-auto">
        <li class="nav-item mr-3 mt-2">
          <p>Welcome, {{ adminData.name_admin }}</p>
        </li>
        <li class="nav-item mt-1">
          <button class="btn btn-danger" @click="logout">Logout</button>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      adminData: JSON.parse(sessionStorage.getItem('adminData')),
    };
  },
  computed: {
    isSuperAdmin() {
      return this.adminData && this.adminData.role === 'superadmin';
    },
  },
  methods: {
    logout() {
      sessionStorage.removeItem('authTokenAdmin');
      sessionStorage.removeItem('adminData');
      this.$router.push('/admin/login');
    },
  },
};
</script>

<style scoped>
.bg-amp {
  background-color: #50b1f9 !important;
}
</style>
