<template>
  <div class="container-fluid p-0">
    <Navbar />
    <main>
      <section id="banner">
        <div id="carouselExampleIndicators" class="carousel slide" data-ride="carousel">
          <ol class="carousel-indicators">
            <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
            <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
          </ol>
          <div class="carousel-inner">
            <a class="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <div class="carousel-item active">
              <img class="d-block w-100 img-fluid" src="@/assets/logo/BannerDiskon.png" alt="First slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100 img-fluid" src="@/assets/logo/BannerDiskon.png" alt="Second slide">
            </div>
            <div class="carousel-item">
              <img class="d-block w-100 img-fluid" src="@/assets/logo/BannerDiskon.png" alt="Third slide">
            </div>
            <a class="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
      </section>
      <section id="promo">
        <PromoProduct />
      </section>
      <ProductList :limit="limit" :modelValue="offset" @update:modelValue="offset = $event" />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import PromoProduct from '@/components/PromoProduct.vue';
import ProductList from '@/components/ProductList.vue';
import { ref } from 'vue';

export default {
  name: 'Home',
  components: {
    Navbar,
    Footer,
    PromoProduct,
    ProductList
  },
  data() {
    return {
      limit: 6,
      offset: 1
    };
  },
  mounted() {
    localStorage.removeItem('prevPayment');
  },
}
</script>

<style scoped>
main {
  padding: 25px;
  margin-top: 70px;
}

.carousel-inner {
  width: 100%;
  max-width: 1120px;
  margin: auto;
}

.card-product-list {
  border: 2px solid #50b1f9;
  margin-bottom: 15px;
}

.card-img-top {
  height: 200px;
  object-fit: cover;
}
</style>
