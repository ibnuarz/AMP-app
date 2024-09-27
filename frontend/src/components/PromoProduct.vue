<template>
  <section class="container">
    <div class="text-center my-4">
      <h1 class="title">Rekomendasi Diskon Untuk Anda</h1>
    </div>
    <div id="PromoProduct" class="carousel slide" data-ride="carousel">
      <div class="carousel-inner">
        <div v-for="(chunk, index) in chunks" :key="index" :class="['carousel-item', { active: index === 0 }]">
          <div class="d-flex justify-content-center">
            <div class="row justify-content-center">
              <div v-for="product in chunk" :key="product._id" class="col-md-4 mb-4 d-flex justify-content-center">
                <a :href="'/product/' + product._id" style="text-decoration: none;">
                  <div class="card border-primary" style="width: 18rem;">
                    <img :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + product.image_product" class="card-img-top p-1" alt="Product Image">
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
          </div>
        </div>
      </div>
      <a class="carousel-control-prev" href="#PromoProduct" role="button" data-slide="prev">
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a class="carousel-control-next" href="#PromoProduct" role="button" data-slide="next">
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PromoProduct',
  data() {
    return {
      products: [],
      chunks: []
    };
  },
  async created() {
    try {
      const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product');
      this.products = this.getDiscountedProducts(response.data.data);
      this.chunks = this.chunkArray(this.products, 3);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  },
  methods: {
    getDiscountedProducts(products) {
      return products.filter(product => product.discount_product > 0);
    },
    discountedPrice(product) {
      const discountAmount = product.price_product * (product.discount_product / 100);
      return product.price_product - discountAmount;
    },
    chunkArray(array, size) {
      const result = [];
      for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
      }
      return result;
    }
  }
}
</script>

<style scoped>
.carousel-inner {
  width: 100%;
  max-width: 1120px;
  margin: auto;
}

.card {
  border: 1px solid #50b1f9;
  border-radius: 8px;
}
.card-img-top {
  height: 200px;
  object-fit: cover;
}
.title {
  color: #50b1f9;
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
  font-size: 1.0em;
}

.carousel-control-prev,
.carousel-control-next {
  width: 5%;
}

.carousel-control-prev-icon,
.carousel-control-next-icon {
  background-color: #50b1f9;
  border-radius: 50%;
}

@media (max-width: 767.98px) {
  .card {
    width: 100%;
    max-width: 250px;
  }
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
