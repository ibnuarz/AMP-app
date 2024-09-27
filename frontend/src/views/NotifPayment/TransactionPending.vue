<template>
  <div class="container my-5 d-flex justify-content-center align-items-center vh-100">
    <div class="card shadow rounded" style="max-width: 400px; width: 100%;">
      <div class="card-body text-center">
        <h2 class="text-warning">Pembayaran Pending</h2>
        <br>
        <p v-if="prevPayment"><b>{{ prevPayment }}</b></p>
        <p>Maaf, pembayaran Anda masih belum diselesaikan, silakan cek status di menu <i>Riwayat Transaksi</i>.</p>
        <button class="btn btn-warning" @click="confirmNavigation" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          <span v-else>Cek Riwayat Transaksi</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';
import { ref, onMounted } from 'vue';

const router = useRouter();
const loading = ref(false);
const prevPayment = ref(null);

const confirmNavigation = () => {
  Swal.fire({
    title: 'Konfirmasi',
    text: 'Apakah Anda ingin melihat riwayat transaksi?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya',
    cancelButtonText: 'Tidak',
  }).then((result) => {
    loading.value = true;
    if (result.isConfirmed) {
      setTimeout(() => {
        router.push('/history');
        loading.value = false;
      }, 500); 
    } else {
      setTimeout(() => {
        router.push('/home');
        loading.value = false;
      }, 500);
    }
  });
};

onMounted(() => {
  const storedPayment = localStorage.getItem('prevPayment');
  if (storedPayment) {
    prevPayment.value = storedPayment;
  } else {
    Swal.fire({
      title: 'Upss...',
      text: 'Anda belum melakukan transaksi apapun. Silahkan kembali!',
      icon: 'warning',
      confirmButtonText: 'Kembali',
    }).then(() => {
      router.push('/home');
    });
  }
});
</script>

<style scoped>
.card {
  border-radius: 10px;
}
</style>
