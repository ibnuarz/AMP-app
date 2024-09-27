<template>
  <section id="product-list">
    <div class="container">
      <div class="text-center my-4">
        <h1 class="title">Produk Kami</h1>
      </div>
      <div class="row justify-content-center">
        <div v-for="product in paginatedProducts" :key="product._id" class="col-md-3 mb-4 d-flex justify-content-center m-3">
          <a :href="'/product/' + product._id" style="text-decoration: none;">
            <div class="card border-primary" style="width: 18rem;">
              <img :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + product.image_product" class="card-img-top p-1" alt="Product Image">
              <div class="card-body">
                <h6 class="card-title text-title">{{ product.name_product }} <span v-if="product.discount_product > 0" class="saved-percentage">Hemat {{ product.discount_product }}%</span></h6>
                <div class="price-container">
                  <p v-if="product.discount_product > 0" class="discounted-price">
                    Rp {{ discountedPrice(product).toLocaleString() }} 
                  </p>
                  <p v-if="product.discount_product > 0" class="original-price">Rp {{ product.price_product.toLocaleString() }}</p>
                  <p v-else class="normal-price">Rp {{ product.price_product.toLocaleString() }}</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
      <Pagination
        :total="totalProducts"
        :limit="limit"
        :modelValue="modelValue"
        @update:modelValue="updateModelValue"
        :prev-text="'Previous'"
        :next-text="'Next'"
      />
    </div>
  </section>
</template>



<script>
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';

export default {
  name: 'ProductList',
  components: {
    Pagination
  },
  props: {
    limit: {
      type: Number,
      required: true
    },
    modelValue: {
      type: Number,
      required: true,
      default: 1
    }
  },
  data() {
    return {
      products: [],
      totalProducts: 0
    };
  },
  computed: {
    paginatedProducts() {
      const start = (this.modelValue - 1) * this.limit;
      return this.products.slice(start, start + this.limit);
    }
  },
  watch: {
    modelValue: 'fetchProducts'
  },
  methods: {
    async fetchProducts() {
      try {
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product');
        const productsArray = response.data.data || response.data;
        if (Array.isArray(productsArray)) {
          this.products = this.shuffleArray(productsArray.filter(item => item.stock_product > 0));
          this.totalProducts = this.products.length;
        } else {
          console.error('Expected an array but got:', productsArray);
          this.products = [];
          this.totalProducts = 0;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        this.products = [];
        this.totalProducts = 0;
      }
    },
    updateModelValue(newPage) {
      this.$emit('update:modelValue', newPage);
    },
    shuffleArray(array) {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    },
    discountedPrice(product) {
      const discountAmount = product.price_product * (product.discount_product / 100);
      return product.price_product - discountAmount;
    }
  },
  created() {
    this.fetchProducts();
  }
}
</script>

<style scoped>

body {
  font-family: 'Poppins', sans-serif;
}
#product-list {
  padding: 25px;
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
.title {
  color: #50b1f9;
}
.text-title {
  color: #50b1f9;
  font-size: 1.0em;
}

.container {
  max-width: 1120px;
  margin: auto;
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
