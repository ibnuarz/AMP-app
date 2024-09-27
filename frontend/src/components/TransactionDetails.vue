<template>
  <div class="container-fluid p-0 d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-fill">
      <div class="container">
        <h2>Transaction Details <a class="btn btn-primary m-2" :href="'/history'">Kembali</a></h2>
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else>
          <div class="row">
            <div class="col-md-12">
              <div v-if="cartItems.length === 0">
                <p>Tidak ada item untuk transaksi ini.</p>
              </div>
              <div v-else>
                <div class="table-responsive">
                  <table class="table table-striped">
                    <thead>
                      <tr>
                        <th>Produk</th>
                        <th>Jumlah</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in cartItems" :key="item._id">
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.quantity }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

const route = useRoute();
const cartItems = ref([]);
const isLoading = ref(true);
const transactionCode = route.params.transactionCode;

const fetchCartItems = async () => {
  isLoading.value = true;
  try {
    const authToken = localStorage.getItem('authToken');
    const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/cart/items/${transactionCode}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    cartItems.value = response.data;
  } catch (error) {
    console.error('Error fetching cart items:', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchCartItems();
});
</script>

<style scoped>
.container-fluid {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 25px;
  margin-top: 70px;
}

.table th, .table td {
  text-align: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
