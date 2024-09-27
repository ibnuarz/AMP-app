<template>
  <Navbar />
  <div class="container-fluid d-flex flex-column min-vh-100">
    <main class="flex-fill">
      <section id="product-list" class="container">
        <div class="row mb-4">
          <div class="col-md-12">
            <div class="search-wrapper">
              <input
                type="text"
                class="form-control"
                placeholder="Cari produk..."
                v-model="searchQuery"
                @input="fetchProducts"
              />
              <i class="bi bi-search search-icon"></i>
            </div>
          </div>
        </div>

        <h3 class=""><i>Hasil Pencarian untuk: "{{ searchQuery }}"</i></h3>
        <div class="row justify-content-center">
          <div v-if="filteredProducts.length === 0" class="col-md-12 text-center mt-3">
            <p>Tidak ada produk yang ditemukan.</p>
          </div>
          <div v-for="product in paginatedProducts" :key="product._id" class="col-md-3 mb-4 d-flex justify-content-center m-3">
            <a :href="'/product/' + product._id" style="text-decoration: none;">
              <div class="card border-primary" style="width: 18rem;">
                <img :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + product.image_product" class="card-img-top p-1" alt="Product Image" draggable="false">
                <div class="card-body">
                  <h6 class="card-title text-title">{{ product.name_product }} <span v-if="product.discount_product > 0" class="saved-percentage">Hemat {{ product.discount_product }}%</span></h6>
                  <div class="price-container">
                    <p v-if="product.discount_product > 0" class="discounted-price">Rp {{ discountedPrice(product).toLocaleString() }}</p>
                    <p v-if="product.discount_product > 0" class="original-price">Rp {{ product.price_product.toLocaleString() }}</p>
                    <p v-else class="normal-price">Rp {{ product.price_product.toLocaleString() }}</p>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </div>
        <nav aria-label="Page navigation" v-if="totalPages > 1">
          <ul class="pagination justify-content-center">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)"><i class="bi bi-caret-left-fill"></i></a>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)"><i class="bi bi-caret-right-fill"></i></a>
            </li>
          </ul>
        </nav>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';

export default {
  name: 'Search',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      products: [],
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 4
    };
  },
  computed: {
    filteredProducts() {
      return this.products;
    },
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      return this.filteredProducts.slice(start, start + this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
    }
  },
  async created() {
    this.searchQuery = this.$route.query.q || '';
    if (!this.searchQuery) {
      this.$router.push('/home');
    } else {
      await this.fetchProducts();
    }
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product', {
          params: {
            search: this.searchQuery
          }
        });
        this.products = response.data.data;
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    discountedPrice(product) {
      const discountAmount = product.price_product * (product.discount_product / 100);
      return product.price_product - discountAmount;
    }
  }
};
</script>

<style scoped>
.container-fluid {
  max-width: 100%;
}

.card {
  border: 1px solid #50b1f9;
  border-radius: 8px;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}

.card-title {
  font-size: small;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.text-title {
  color: #50b1f9;
  font-family: 'Poppins', sans-serif;
}

.pagination {
  display: flex;
  justify-content: center;
}

.page-item {
  margin: 0 2px;
}

.page-link {
  font-size: 15px;
  padding: 0.5rem 0.75rem;
}

.page-link i {
  font-size: 10px;
  vertical-align: middle;
}

.page-item.disabled .page-link {
  pointer-events: none;
  color: #6c757d;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
  color: #fff;
}

.container {
  max-width: 1120px;
  margin: auto;
}

.search-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: #50b1f9;
}

.form-control {
  padding-left: 40px;
  border-radius: 50px;
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

.price-container {
  display: flex; 
  align-items: center;
}

.price-container p {
  margin-right: 10px; 
}

.saved-percentage {
  font-size: 0.7em;
  color: #dc3545; 
}
</style>
