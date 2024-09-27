<template>
    <div class="transaction-data d-flex flex-column h-100">
      <Navbar />
      <main class="flex-grow-1">
        <div class="container">
          <h1>
            Detail Order <a class="btn btn-warning" :href="'/admin/datatransaction'">Kembali</a>
          </h1>
          <br>
          <div class="table-responsive-lg">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>Nama Produk</th>
                  <th>Jumlah</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in transactionDetails" :key="item._id">
                  <td>{{ item.product_name }}</td>
                  <td>{{ item.quantity }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Admin/Navbar.vue';
  import Footer from '@/components/Admin/Footer.vue';
  import axios from 'axios';
  
  export default {
    components: {
      Navbar,
      Footer,
    },
    data() {
      return {
        transactionDetails: [],
      };
    },
    created() {
      this.fetchTransactionDetails();
    },
    methods: {
      async fetchTransactionDetails() {
        const transactionCode = this.$route.params.transaction_code;
        const token = sessionStorage.getItem('authTokenAdmin');
        try {
          const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactions/detail/${transactionCode}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: 'application/json',
            },
          });
          this.transactionDetails = response.data; 
        } catch (error) {
          console.error('Error fetching transaction details:', error);
        }
      },
      formatCurrency(value) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
      },
    },
  };
  </script>
  
  <style>
  .transaction-data {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding: 25px;
  }
  </style>
  