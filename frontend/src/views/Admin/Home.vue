<template>
  <div class="admin-home d-flex flex-column h-100">
    <Navbar />
    <div class="content flex-grow-1">
      <div class="row mt-4">
        <div class="col-md-4">
          <div class="card bg-success text-white mb-3">
            <div class="card-header">Transaksi Selesai</div>
            <div class="card-body">
              <h5 class="card-title">{{ completedTransactions }}</h5>
              <p class="card-text">Jumlah transaksi yang selesai.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-warning text-white mb-3">
            <div class="card-header">Transaksi Proses</div>
            <div class="card-body">
              <h5 class="card-title">{{ ongoingTransactions }}</h5>
              <p class="card-text">Jumlah transaksi yang sedang diproses.</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card bg-danger text-white mb-3">
            <div class="card-header">Transaksi Batal</div>
            <div class="card-body">
              <h5 class="card-title">{{ canceledTransactions }}</h5>
              <p class="card-text">Jumlah transaksi yang dibatalkan.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    Footer
  },
  data() {
    return {
      adminData: JSON.parse(sessionStorage.getItem('adminData')),
      completedTransactions: 0,
      ongoingTransactions: 0,
      canceledTransactions: 0
    };
  },
  created() {
    this.fetchTransactionStats();
  },
  methods: {
    async fetchTransactionStats() {
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        
        if (response.data.success) {
          const transactions = response.data.data;
          this.completedTransactions = transactions.filter(t => t.status_code === 2).length;
          this.ongoingTransactions = transactions.filter(t => t.status_code === 1).length;
          this.canceledTransactions = transactions.filter(t => t.status_code === 3).length;
        } else {
          console.error('Failed to fetch transactions:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching transaction stats:', error);
      }
    },
  },
};
</script>

<style>
.admin-home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  padding: 20px;
}

.card {
  margin-bottom: 20px;
}

.text-title{
  color: #50b1f9;
}
</style>
