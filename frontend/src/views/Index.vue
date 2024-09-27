<template>
  <div>
    <nav class="navbar fixed-top navbar-expand-lg navbar-light bg-light">
      <div class="container">
        <a class="navbar-brand" href="#">Apotek Medika Prima</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link" href="#welcome">Beranda</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#keunggulanKami">Tentang</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <main class="container mt-5 pt-5">
      <section id="welcome">
        <div class="row align-items-center welcome">
          <div class="col-md-6 text-center">
            <img src="@/assets/logo/amp.png" alt="Logo" class="img-fluid logo-img">
          </div>
          <div class="col-md-6 text-center text-md-left">
            <div class="welcome-message">
              <h3>Salam Hangat dari Apotek Medika Prima</h3>
              <p>Selamat datang, tempat Anda mendapatkan solusi kesehatan terbaik dengan pelayanan prima. Apotek Medika Prima berdedikasi untuk memberikan layanan farmasi yang handal, aman, dan terpercaya bagi seluruh masyarakat.</p>
              <router-link to="/home" class="btn btn-primary m-1">Belanja Sekarang</router-link>
              <router-link to="/regist" class="btn btn-primary m-1">Daftar</router-link>
            </div>
          </div>
        </div>
      </section>

      <section id="keunggulanKami" class="mt-5">
        <div class="container">
          <h3 class="text-center mb-5">Keunggulan Kami</h3>
          <div class="row">
            <div class="col-lg-4 mb-4" v-for="(advantage, index) in advantages" :key="index">
              <div class="text-center border border-secondary rounded shadow-sm feature-card box-advantage p-2">
                <i :class="advantage.icon" class="fs-1 text-primary"></i>
                <h5 class="mt-3">{{ advantage.title }}</h5>
                <p class="text-muted">{{ advantage.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <footer class="bg-dark text-light text-center py-4 mt-5">
      <div class="container">
        <p class="mb-1">&copy; 2024 Apotek Medika Prima. All Rights Reserved.</p>
        <ul class="list-inline">
          <li class="list-inline-item">
            <a href="https://www.instagram.com/apotekmedikaprima/" target="_blank" class="text-light">
              <i class="bi bi-instagram"></i>
            </a>
          </li>
          <li class="list-inline-item">
            <a href="mailto:medikaprima19@gmail.com" class="text-light">
              <i class="bi bi-envelope-fill"></i>
            </a>
          </li>
          <li class="list-inline-item">
            <a href="https://wa.me/6282221302073" class="text-light">
              <i class="bi bi-whatsapp"></i>
            </a>
          </li>
        </ul>
      </div>
    </footer>
  </div>
</template>


<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'Home',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      advantages: [
        {
          icon: 'bi bi-speedometer2',
          title: 'Layanan Cepat',
          description: 'Kami menyediakan layanan cepat dan efisien untuk memastikan Anda mendapatkan apa yang Anda butuhkan tanpa menunggu lama.'
        },
        {
          icon: 'bi bi-shield-check',
          title: 'Keamanan Terjamin',
          description: 'Keamanan produk dan layanan kami adalah prioritas utama. Setiap produk kami telah melalui proses pemeriksaan ketat.'
        },
        {
          icon: 'bi bi-award',
          title: 'Kualitas Terbaik',
          description: 'Kami hanya menyediakan produk dengan kualitas terbaik dari merek-merek terpercaya. Setiap produk memenuhi standar tinggi.'
        },
        {
          icon: 'bi bi-truck',
          title: 'Pengiriman Cepat',
          description: 'Kami menawarkan layanan pengiriman cepat dan aman, memastikan produk sampai tepat waktu. dan privasi aman'
        },
        {
          icon: 'bi bi-cash',
          title: 'Pembayaran Aman',
          description: 'Keamanan dalam proses pembayaran adalah hal yang penting. dengan menggunakan middle payment terpercaya dan mudah.'
        },
        {
          icon: 'bi bi-tags',
          title: 'Murah dan Banyak Promo',
          description: 'Kualitas produk yang bagus tidak membuat kami kurang memberikan diskon dan harga yang jauh lebih murah.'
        },
      ]
    };
  }
}
</script>

<style scoped>
main {
  margin-top: 80px; 
}

footer {
  background-color: #50b1f9 !important;
  color: white;
}



.box-advantage {
  border: solid 1px #50b1f9 !important;
}

footer .list-inline-item a {
  color: #f8f9fa;
  margin: 0 10px;
  font-size: 1.5rem;
}

.feature-card i {
  font-size: 2rem;
}

.btn-outline-primary {
  margin-right: 10px;
}

.nav-link {
  color: #fff;
}

.btn-primary {
  background-color: #50b1f9;
  border-color: #50b1f9;
}
</style>
