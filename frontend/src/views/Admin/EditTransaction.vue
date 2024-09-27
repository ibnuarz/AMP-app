<template>
  <div class="edit-transaction-container">
    <Navbar />
    <main class="flex-grow-1">
      <div class="container">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h1>Edit Transaksi</h1>
          <a class="btn btn-danger" :href="'/admin/datatransaction'">Kembali</a>
        </div>
        <form @submit.prevent="updateTransaction">
          <div class="form-group">
            <label for="transactionCode">Transaction Code</label>
            <input v-model="transaction.transaction_code" type="text" class="form-control" id="transactionCode" required disabled/>
          </div>
          <div class="form-group">
            <label for="transactionDate">Transaction Date</label>
            <input
              v-model="transaction.transaction_date"
              type="text"
              class="form-control"
              id="transactionDate"
              disabled
              placeholder="yyyy-MM-dd HH:mm:ss"
            />
          </div>
          <div class="form-group">
            <label for="role">Status</label>
            <select
              id="statuscode"
              v-model="transaction.status_code"
              class="form-control"
              required
            >
              <option value="1">Verifikasi</option>
              <option value="2">Berhasil/Terkirim</option>
              <option value="3">Batal</option>
            </select>
          </div>
          <div class="form-group">
            <label for="message">Pesan (catatan untuk status)</label>
            <textarea
              id="message"
              v-model="transaction.message"
              class="form-control"
              required
            ></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Update</button>
        </form>
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
      transaction: {
        transaction_code: '',
        transaction_date: '',
        status_code: '',
        message: ''
      },
    };
  },
  created() {
    this.fetchTransaction();
  },
  methods: {
    async fetchTransaction() {
      const transactionId = this.$route.params.id;
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactions/${transactionId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.data.success) {
          this.transaction = response.data.data;
        } else {
          console.error('Failed to fetch transaction:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching transaction:', error);
      }
    },
    async updateTransaction() {
      const transactionId = this.$route.params.id;
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.put(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactions/${transactionId}`, this.transaction, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.data.success) {
          this.$router.push('/admin/datatransaction');
        } else {
          console.error('Failed to update transaction:', response.data.message);
        }
      } catch (error) {
        console.error('Error updating transaction:', error);
      }
    },
  },
};
</script>

<style>
.edit-transaction-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
  padding: 25px;
}

.form {
  max-width: 600px;
  margin: 0 auto;
}

.btn-primary {
  margin-top: 20px;
}
</style>
