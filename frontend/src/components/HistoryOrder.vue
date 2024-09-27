<template>
  <div class="container-fluid p-0 d-flex flex-column min-vh-100">
    <Navbar />
    <main class="flex-fill">
      <div class="container">
        <div v-if="isLoading" class="loading-overlay">
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <div v-else>
          <h1 class="text-primary mb-4">Riwayat Transaksi</h1>
          <div v-if="transactions.length === 0">
            <p>Tidak Ada Catatan Transaksi.</p>
          </div>
          <div v-else>
            <div v-for="transaction in transactions" :key="transaction._id" class="transaction-card border p-3 mb-4">
              <h4 class="text-primary">{{ transaction.transaction_code }}</h4>
              <div class="d-flex justify-content-between mt-2">
                <div><strong>Tanggal:</strong> {{ new Date(transaction.transaction_date).toLocaleDateString() }}</div>
                <div><strong>Jenis Pengiriman:</strong> {{ getShippingMethodText(transaction.shipping_method) }}</div>
              </div>

              <div class="transaction-pricing mt-3">
                <div><strong>Harga Barang:</strong> Rp {{ transaction.total_price_item.toLocaleString() }}</div>
                <div><strong>Ongkir:</strong> Rp {{ transaction.shipping_cost.toLocaleString() }}</div>
                <div><strong>Total:</strong> Rp {{ transaction.total_bill.toLocaleString() }}</div>
              </div>

              <div class="mt-3">
                <strong>Status: </strong>
                <span :class="getStatusClass(transaction.status_code)">
                  {{ getStatusText(transaction.status_code) }}
                </span>
              </div>
              <div v-if="transaction.message" class="mt-1">
                <strong>Catatan: </strong> {{ transaction.message }}
              </div>

              <div class="mt-3">
                <button v-if="transaction.image_receipt" class="btn btn-info btn-sm m-1" @click="showImageInPopup(transaction.image_receipt)">Lihat Resep</button>
                <button class="btn btn-info btn-sm m-1" @click="viewDetails(transaction.transaction_code)">Detail</button>
                <a :href="getWhatsAppLink(transaction.transaction_code)" class="btn btn-success btn-sm m-1">Kontak</a>
              </div>
            </div>
          </div>
        </div>

        <br>
        <div v-if="pendingTransactions.length > 0" class="pending-transactions">
          <h3>Transaksi Pending</h3>
          <p class="text-danger"><i>Jika Tombol 'Batal' Tidak ada Klik 'Bayar' pilih pembayaran bebas tanpa membayar cukup pilih metode pembayaran saja, kemudian close refresh halaman</i></p>
          <div v-for="transaction in pendingTransactions" :key="transaction.transaction_code" class="transaction-card border p-3 mb-4">
            <h4 class="text-warning">Kode Transaksi: {{ transaction.transaction_code }}</h4>
            <div class="mt-3">
              <button class="btn btn-warning btn-sm m-1" @click="handlePay(transaction.transaction_token)">Bayar</button>
              <button v-if="transaction.transaction_status === 'pending'" class="btn btn-danger btn-sm m-1" @click="handleCancel(transaction.transaction_code)">Batal</button>
            </div>
          </div>
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
  name: 'HistoryOrderarch',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      transactions: [],
      pendingTransactions: [],
      isLoading: true,
      userData: {}
    };
  },
  mounted() {
    localStorage.removeItem('prevPayment');
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const encodedKey = btoa(clientKey);
    const midtrans = document.createElement('script');
    midtrans.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    midtrans.setAttribute('data-client-key', encodedKey);
    document.head.appendChild(midtrans);
  },
  methods: {
    async loadUserData() {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
      }
    },
    async fetchTransactions() {
      this.isLoading = true;
      try {
        const authToken = localStorage.getItem('authToken');
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction/transactions', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        this.transactions = response.data;
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        this.isLoading = false;
      }
    },
    getShippingMethodText(shippingMethod) {
      switch (shippingMethod) {
        case 'kurirApotikSMD':
          return 'Same Day - Kurir Apotik';
        case 'kurirApotikIST':
          return 'Instan - Kurir Apotik';
        case 'ojekOnline':
          return 'Instan - Grab';
        default:
          return shippingMethod; 
      }
    },
    async fetchPendingTransactions() {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction-token/view-tokens', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        
        const tokens = Array.isArray(response.data) ? response.data : [];
        
        this.pendingTransactions = [];
        const statusChecks = tokens.map(token =>
          axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction-token/check-status/${token.transaction_code}`, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          })
          .then(response => response.data)
          .then(statusData => {
            if (statusData.transaction_status === 'pending') {
              this.pendingTransactions.push({ ...token, transaction_status: statusData.transaction_status });
            } else if (statusData.status_code === '404') {
              this.pendingTransactions.push({ ...token, transaction_status: statusData.transaction_status });
            }
          })
        );
        await Promise.all(statusChecks);
      } catch (error) {
        console.error('Error fetching pending transactions:', error);
      }
    },
    handlePay(transactionToken) {
      window.snap.pay(transactionToken, {
        onSuccess: (result) => {
          this.$router.push('/statuspayment/Transaction-Success');
          localStorage.setItem('prevPayment', transaction_code);
        },
        onPending: (result) => {
          this.$router.push('/statuspayment/Transaction-Pending');
          localStorage.setItem('prevPayment', transaction_code);
        },
        onError: (result) => {
          this.$router.push('/statuspayment/Transaction-Failed');
          localStorage.setItem('prevPayment', transaction_code);
        }
      });
    },
    async handleCancel(transactionCode) {
      const result = await Swal.fire({
        title: 'Anda Yakin?',
        text: 'Anda akan membatalkan pembayaran ini, aksi ini tidak dapat dikembalikan',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Batalkan!',
        cancelButtonText: 'Tidak!'
      });

      if (result.isConfirmed) {
        const authToken = localStorage.getItem('authToken');
        try {
          const response = await axios.post(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction-token/cancel-transaction/${transactionCode}`, {}, {
            headers: {
              Authorization: `Bearer ${authToken}`
            }
          });

          if (response.data.cancelData.status_code === '200') {
            Swal.fire('Dibatalkan', 'Transaksi Ini Berhasil Dibatalkan', 'success')
              .then(() => {
                this.fetchPendingTransactions();
              }); 
          } else {
            Swal.fire('Failed', 'Failed to cancel the transaction.', 'error');
          }
        } catch (error) {
          console.error('Error canceling transaction:', error);
          Swal.fire('Error', 'Failed to cancel the transaction.', 'error');
        }
      }
    },
    getStatusText(statusCode) {
      switch (statusCode) {
        case 1: return 'Proses';
        case 2: return 'Selesai';
        case 3: return 'Batal';
        default: return 'Unknown';
      }
    },
    getStatusClass(statusCode) {
      switch (statusCode) {
        case 1: return 'text-primary';
        case 2: return 'text-success';
        case 3: return 'text-danger';
        default: return 'text-secondary';
      }
    },
    viewDetails(transactionCode) {
      this.$router.push({ name: 'TransactionDetails', params: { transactionCode } });
    },
    getWhatsAppLink(transactionCode) {
      const phoneNumber = '6283140656961';
      const message = `Halo Admin AMP, saya ${this.userData.name_user}\nkode transaksi: ${transactionCode}\n\nIngin Menanyakan status perkembangan transaksi saya.\n\nTerimakasih`;
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    },
    showImageInPopup(imageReceipt) {
      const imageUrl = `https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/receipt/${imageReceipt}`;
      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: 'Gambar Resi',
        showCloseButton: true,
        showConfirmButton: false,
        imageWidth: '100%',
        imageHeight: 'auto',
        backdrop: `
          rgba(0,0,0,0.8)
        `
      });
    }
  },
  async created() {
    await this.loadUserData();
    this.fetchTransactions();
    this.fetchPendingTransactions();
  }
};
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

.transaction-card {
  border: 2px solid #50b1f9;
  border-radius: 8px;
  padding: 15px;
}

.transaction-pricing div {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
  margin-bottom: 5px;
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

.text-primary {
  color: #50b1f9 !important;
}

.text-success {
  color: #28a745 !important;
}

.text-danger {
  color: #dc3545 !important;
}

.text-warning {
  color: #ffc107 !important;
}

.btn-info {
  background-color: #17a2b8;
  border: none;
}

.btn-success {
  background-color: #28a745;
  border: none;
}
</style>
