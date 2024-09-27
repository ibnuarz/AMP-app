<template>
  <div class="container-fluid d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-fill">
      <div class="container my-4">
        <div v-if="product" class="row">
          <div class="col-md-6">
            <img v-if="product" :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + product.image_product" class="img-fluid border-primary" alt="Product Image" draggable="false">
          </div>
          <div class="col-md-6">
            <a class="btn btn-danger mt-2" :href="'/home'">Kembali</a>
            <h1 class="text-primary">{{ product?.name_product }}</h1>
            <p :class="['badge', categoryBadgeClass]">{{ categoryLabel }}</p>
            <div class="price-container">
              <p v-if="product?.discount_product > 0" class="discounted-price">Rp {{ discountedPrice.toLocaleString() }}</p>
              <p v-if="product?.discount_product > 0" class="original-price">Rp {{ product?.price_product.toLocaleString() }}</p>
              <p v-else class="normal-price">Rp {{ product?.price_product.toLocaleString() }}</p>
            </div>
            <hr class="my-4">
            <p><strong>Deskripsi <br></strong> {{ product?.description_product }}</p>
            <p><strong>Komposisi <br></strong> {{ product?.composition_product }}</p>
            <p><strong>Dosisi <br></strong> {{ product?.dose_product }}</p>
            <hr class="my-4">
            <div v-if="showMore" class="mt-3">
              <p><strong>Efek Samping <br></strong> {{ product?.sideeffects_product }}</p>
              <p><strong>Manufaktur <br></strong> {{ product?.manufacture_product }}</p>
            </div>
            <div class="mt-3">
              <a @click="toggleMore" class="text-primary" style="cursor: pointer;">
                {{ showMore ? 'Tutup' : 'Selengkapnya...' }}
              </a>
            </div>

            <div class="d-flex align-items-center my-2">
              <button @click="decreaseQuantity" class="btn btn-outline-primary">-</button>
              <input type="text" v-model="quantity" class="form-control text-center mx-2 input-items-bg" style="width: 50px;" readonly>
              <button @click="increaseQuantity" class="btn btn-outline-primary">+</button>
            </div>

            <button @click="addToCart" class="btn btn-primary mt-2">Masukkan Keranjang</button>
          </div>
        </div>
        
        <!-- Product not found alert -->
        <div v-else class="text-center mt-5">
          <h3 class="text-danger">Produk tidak tersedia</h3>
          <a class="btn btn-danger mt-2" :href="'/home'">Kembali ke home</a>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  name: 'DetailProduct',
  components: {
    Navbar,
    Footer 
  },
  data() {
    return {
      product: null,
      showMore: false,
      quantity: 1, 
    };
  },
  computed: {
    categoryLabel() {
      const categories = {
        1: 'Obat Keras',
        2: 'Obat Bebas',
        3: 'Obat Bebas Terbatas',
        4: 'Obat Narkotika',
        5: 'Fitofarmaka',
        6: 'OHT',
        7: 'Herbal'
      };
      return categories[this.product?.group_product] || 'Unknown';
    },
    categoryBadgeClass() {
      const categoryColors = {
        1: 'bg-danger text-white p-2',
        2: 'bg-success text-white p-2', 
        3: 'bg-warning text-dark p-2',
        4: 'bg-purple text-white p-2',
        5: 'bg-orange text-white p-2',
        6: 'bg-primary text-white p-2',
        7: 'bg-brown text-white p-2'  
      };
      return categoryColors[this.product?.group_product] || 'bg-secondary text-white';
    },
    discountedPrice() {
      if (this.product && this.product.discount_product > 0) {
        const discountAmount = this.product.price_product * (this.product.discount_product / 100);
        return this.product.price_product - discountAmount;
      }
      return this.product?.price_product || 0;
    }
  },
  async created() {
    const productId = this.$route.params.id;
    try {
      const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product/${productId}`);
      this.product = response.data.data;
      if (!this.product) {
        await Swal.fire({
          title: 'Produk Tidak Tersedia',
          text: 'Silakan kembali ke halaman utama.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
      await Swal.fire({
        title: 'Error!',
        text: 'Terjadi kesalahan saat mengambil detail produk.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  },
  methods: {
    toggleMore() {
      this.showMore = !this.showMore;
    },
    increaseQuantity() {
      if (this.product?.discount_product > 0) {
        if (this.quantity < 5) {
          this.quantity++;
        } else {
          Swal.fire({
            title: 'Jumlah Terlalu Banyak!',
            text: 'Produk diskon tidak dapat dibeli lebih dari 5 item.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      } else {
        if (this.quantity < this.product?.stock_product) {
          this.quantity++;
        } else {
          Swal.fire({
            title: 'Stok Tidak Cukup!',
            text: 'Pembelian Anda melebihi jumlah stok yang tersedia.',
            icon: 'warning',
            confirmButtonText: 'OK'
          });
        }
      }
    },
    decreaseQuantity() {
      if (this.quantity > 1) {
        this.quantity--;
      }
    },
    async addToCart() {
      if (this.quantity > this.product?.stock_product) {
        await Swal.fire({
          title: 'Stok Tidak Cukup!',
          text: 'Pembelian Anda melebihi jumlah stok yang tersedia.',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      try {
        const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/cart/add-cart-item', {
          id_product: this.product?._id,
          quantity: this.quantity,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });

        await Swal.fire({
          title: 'Berhasil!',
          text: 'Produk Berhasil Ditambahkan Ke Keranjang',
          icon: 'success',
          confirmButtonText: 'OK'
        });

      } catch (error) {
        console.error('Error adding product to cart:', error);
        await Swal.fire({
          title: 'Error!',
          text: 'Failed to add product to cart. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  }
}
</script>

<style scoped>
main {
  padding: 25px;
  margin-top: 70px;
}
.img-fluid {
  border: 2px solid #50b1f9;
  border-radius: 8px;
}
.text-primary {
  color: #50b1f9;
}
.btn-outline-primary {
  width: 32px;
  background-color: #50b1f9;
  border-color: #50b1f9;
}
.btn-outline-primary:hover {
  background-color: #50b1f9 !important;
  color: #fff;
  border: 1px solid #fff;
}
.input-items-bg {
  background-color: #fff !important;
  color: #50b1f9;
  border: 1px solid #50b1f9;
}
.input-items-bg:hover {
  background-color: #50b1f9 !important;
  color: #fff;
  border: 1px solid #fff;
}
.original-price {
  color: #dc3545;
  text-decoration: line-through;
  font-size: 0.7em; 
}
.discounted-price {
  font-size: 1.0em;
  color: #50b1f9; 
}
.normal-price {
  color: #50b1f9; 
  font-size: 1.0em;
}
.price-container {
  display: flex; 
  align-items: center;
}
.price-container p {
  margin-right: 10px; 
}
</style>
