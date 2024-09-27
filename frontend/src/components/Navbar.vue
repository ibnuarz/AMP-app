<template>
  <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light nav-main p-1">
    <a class="navbar-brand" :href="'/home'">
      <img src="@/assets/logo/amp.png" alt="Logo" class="img-fluid logo-img">
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form v-if="!isOnSearchPage" class="form-inline mx-auto my-2 my-lg-0 search-form" @submit.prevent="redirectToSearch">
        <input v-model="searchQuery" class="form-control mr-sm-2 col-lg-8 search-input" type="search" placeholder="Search" aria-label="Search">
        <button class="btn btn-outline-primary my-2 my-sm-0 search-btn" type="submit">
          <i class="bi bi-search"></i>
        </button>
      </form>

      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" :href="'/cart'"><i class="bi bi-cart4"></i> Keranjang</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/history"><i class="bi bi-clock-history"></i> Riwayat</a>
        </li>
        <li class="nav-item dropdown" v-if="isAuthenticated">
          <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            Halo, {{ userName }}
          </a>
          <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
            <a class="dropdown-item" :href="'/profile'">Profil</a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" @click="logout">Logout</a>
          </div>
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
      searchQuery: ''
    }
  },
  computed: {
    isOnSearchPage() {
      return this.$route.path === '/search';
    },
    isAuthenticated() {
      return !!localStorage.getItem('authToken');
    },
    userName() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      return userData ? userData.username_user : 'User';
    },
    addressUser() {
      const userData = JSON.parse(localStorage.getItem('userData'));
      return userData ? userData.address_user : null;
    },
  },
  methods: {
    redirectToSearch() {
      if (this.searchQuery) {
        this.$router.push({ path: '/search', query: { q: this.searchQuery } });
      }
    },
    logout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      this.$router.push({ name: 'Login' });
    }
  }
}
</script>

<style scoped>
.nav-main {
  background-color: white;
  border-bottom: 2px solid #50b1f9;
  font-family: 'Poppins', sans-serif;
}

.logo-img {
  width: 55px;
  height: auto;
}

.search-form {
  width: 50%;
}

.search-input {
  width: 100%;
}

.nav-link {
  color: #50b1f9;
}

.nav-link .fas {
  margin-right: 5px;
}

.nav-link:hover, .search-btn:hover {
  color: #50b1f9 !important;
}

.search-btn {
  color: #50b1f9;
  border-color: #50b1f9;
}

.search-btn:hover {
  color: white;
}
.btn-outline-primary {
  background-color: #50b1f9;
  border-color: #50b1f9;
}
.btn-outline-primary:hover {
  background-color: #fff !important;
  color: #50b1f9;
  border: 1px solid #50b1f9;
}
.dropdown-menu {
  right: 0;
  left: auto;
}
</style>
