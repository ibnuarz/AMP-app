<template>
  <div class="page-container">
    <Navbar />
    <main>
      <div class="container my-4">
        <h1 class="text-primary mb-4">Keranjang Belanja</h1>

      <div v-if="cartItems.length > 0" class="row">
        <div class="col-md-12">
          <label for="userAddress" class="form-label">Alamat Pengiriman : <router-link to="/profile">Edit Alamat</router-link>
          <i><small v-if="!updatedUser.address_user" class="form-text text-danger">
            <i class="bi bi-info-circle"></i> Anda belum memiliki alamat. Silahkan isi terlebih dahulu untuk lanjut ke checkout, 
            <router-link to="/profile">disini</router-link>.
          </small></i>
        </label>
        <textarea id="userAddress" class="form-control" rows="3" v-model="userData.address_user" disabled></textarea>
        </div>
        
        
        <div class="col-md-12">
          <p class="text-danger">{{ distanceMessage }}</p>
  
          <div class="shipping-options mt-4">
            <label class="form-label">Pilih Metode Pengiriman:</label>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="shippingMethod" id="ojekOnline" value="ojekOnline" v-model="selectedShippingMethod" />
              <label class="form-check-label" for="ojekOnline">Grab - Instant (1-4 Jam)</label>
            </div>
            <hr>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="shippingMethod" id="kurirApotikIST" value="kurirApotikIST" v-model="selectedShippingMethod" />
              <label class="form-check-label" for="kurirApotikIST">Kurir Apotik - Instant (1-3 Jam)</label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="shippingMethod" id="kurirApotikSMD" value="kurirApotikSMD" v-model="selectedShippingMethod" />
              <label class="form-check-label" for="kurirApotikSMD">Kurir Apotik - Sameday (4-8 Jam)</label>
            </div>
            <br>
          </div>
        </div>

          <!-- Column for cart items -->
          <div class="col-md-10">
            <div class="table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th><input type="checkbox" @change="toggleSelectAll($event)" /></th>
                    <th>Gambar</th>
                    <th>Nama Produk</th>
                    <th>Harga</th>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                    <th colspan="2">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in cartItems" :key="item._id">
                    <td><input type="checkbox" v-model="selectedItems" :value="item._id" /></td>
                    <td><img :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + item.image_product" alt="Product Image" class="img-thumbnail" style="width: 100px; height: auto;" draggable="false"></td>
                    <td>{{ item.name_product }}</td>
                    <td>
                    <span v-if="item.discount_product && item.discount_product > 0">
                      <del>Rp {{ item.price_product.toLocaleString() }}</del> <br>
                      Rp {{ (item.price_product - (item.price_product * item.discount_product / 100)).toLocaleString() }}
                      <small class="text-success">(-{{ item.discount_product }}%)</small>
                    </span>
                    <span v-else>
                      Rp {{ item.price_product.toLocaleString() }}
                    </span>
                  </td>
                    <td>{{ item.quantity }}</td>
                    <td>Rp {{ item.total_price.toLocaleString() }}</td>
                    <td>
                      <button class="btn btn-danger btn-sm" @click="deleteItem(item._id)">Hapus</button>
                    </td>
                    <td>
                      <button class="btn btn-warning btn-sm m-1" @click="updateQuantity(item._id, -1, 'decrease')">-</button>
                      <button class="btn btn-warning btn-sm m-1" @click="updateQuantity(item._id, 1, 'increase')">+</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="col-md-2">
            <div class="total-section text-left mt-4">
              <p><small>Total Harga: <br>Rp {{ selectedCartPrice.toLocaleString() }}</small></p>
              <p><small>Biaya Pengiriman: <br>Rp {{ shippingCost.toLocaleString() }}</small></p>
              <p class="text-right"><small><b>Total Tagihan: <br>Rp {{ (selectedCartPrice + shippingCost).toLocaleString() }}</b></small></p>
              <button class="btn btn-primary" 
                      :disabled="!updatedUser.address_user || selectedCartItems.length === 0 || !selectedShippingMethod"
                      @click="checkoutItems">
                Checkout
              </button>
            </div>
          </div>

          <div v-if="isGroupProductSelected" class="col-md-12 mt-4">
            <h4 class="text-primary">Upload Resep</h4>
            <p class="text-danger"><small><i>*Upload apapun hal yang relevan jika tidak ada resep.</i></small></p>

            <div v-if="!selectedFile" class="upload-box p-4 border border-primary rounded" 
                @dragover.prevent 
                @drop.prevent="handleFileDrop" 
                @click="triggerFileInput">
              <div class="text-center">
                <i class="bi bi-upload" style="font-size: 2rem;"></i>
                <p>Drag & drop your file here, or click to select</p>
              </div>
              <input type="file" @change="onFileChange" accept="image/*" class="d-none" ref="fileInput" />
            </div>

            <div v-else class="preview-box mt-3">
              <img :src="imagePreview" class="img-fluid rounded" alt="Preview Image">
              <p class="mt-2">{{ selectedFile.name }}</p>
              <button class="btn btn-danger" @click="removeImage">Hapus Gambar</button>
            </div>
          </div>

        </div>
        <div v-else>
          <p>Keranjang Anda kosong.</p>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>


<script>
import axios from 'axios';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Swal from 'sweetalert2';

export default {
  name: 'ShoppingCart',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      cartItems: [],
      selectedItems: [],
      totalAmount: 0,
      userData: {},
      updatedUser: {},
      distanceMessage: '',
      map: null,
      marker: null,
      geocoder: null,
      googleMapsLoaded: false,
      referencePoint: { lat: -6.155282, lng: 106.807991 },
      selectedShippingMethod: '',
      shippingCost: 0,
      selectedFile: null,
      imagePreview: ''
    };
  },
  watch: {
  selectedShippingMethod() {
    this.calculateShippingCost();
  }
  },
  computed: {
    selectedCartItems() {
    return this.cartItems.filter(item => this.selectedItems.includes(item._id));
    },
    selectedCartPrice() {
      return this.selectedCartItems.reduce((total, item) => {
        const discount = item.discount_product || 0;
        const discountedPrice = item.price_product - (item.price_product * discount / 100);
        return total + (discountedPrice * item.quantity);
      }, 0);
    },
    isGroupProductSelected() {
      return this.selectedCartItems.some(item => item.group_product === "1");
    }
    },
    async created() {
      await this.fetchCartItems();
      this.loadUserData();
    },
  mounted() {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const encodedKey = btoa(clientKey);
    const midtrans = document.createElement('script');
    midtrans.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
    midtrans.setAttribute('data-client-key', encodedKey);
    document.head.appendChild(midtrans);
    if (!this.googleMapsLoaded) {
      this.loadGoogleMapsAPI().then(() => {
        this.googleMapsLoaded = true;
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          this.userData = JSON.parse(storedUserData);
          this.updatedUser = { ...this.userData };
          if (!this.updatedUser.dob_user) {
            this.updatedUser.dob_user = new Date().toISOString().split('T')[0];
          }
        }
        this.updateDistanceMessage();
      }).catch(error => {
        console.error('Error loading Google Maps API:', error);
      });
    } else {
        this.updateDistanceMessage();
    }
  },
  methods: {
    loadGoogleMapsAPI() {
      return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=geometry,places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
      });
    },
    async refreshData() {
      await this.fetchCartItems();
      await this.fetchPendingTransactions();
    },
    toggleSelectAll(event) {
      this.selectedItems = event.target.checked ? this.cartItems.map(item => item._id) : [];
    },
    triggerFileInput() {
    this.$refs.fileInput.click();
    },
    handleFileDrop(event) {
      const file = event.dataTransfer.files[0];
      this.onFileChange({ target: { files: [file] } });
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.imagePreview = URL.createObjectURL(file);
      }
    },
    removeImage() {
      this.selectedFile = null;
      this.imagePreview = null;

      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) {
        fileInput.value = '';
      }
    },
    /*uploadImage() {
      console.log('Uploading:', this.selectedFile);
    },*/
    async fetchCartItems() {
      const authToken = localStorage.getItem('authToken');
      try {
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/cart/cart-items', {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        this.cartItems = response.data.filter(item => item.status === false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    },
    async updateQuantity(cartItemId, quantityChange, operation) {
      const authToken = localStorage.getItem('authToken');
      try {
        await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/cart/edit-cart-item', {
          cartItemId,
          quantityChange,
          operation
        }, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        await this.fetchCartItems();
      } catch (error) {
        console.error('Error updating quantity:', error);
      }
    },
    async deleteItem(itemId) {
      const authToken = localStorage.getItem('authToken');
      try {
        await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/cart/cart-items/${itemId}`, {
          headers: {
            Authorization: `Bearer ${authToken}`
          }
        });
        this.cartItems = this.cartItems.filter(item => item._id !== itemId);
        this.selectedItems = this.selectedItems.filter(id => id !== itemId);
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    },
    async loadUserData() {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        this.userData = JSON.parse(storedUserData);
        this.updatedUser = { ...this.userData };
      }
    },
    createBoundsAroundLocation(lat, lng, radiusKm) {
      const earthRadiusKm = 6371;
      const latLng = new google.maps.LatLng(lat, lng);
      const latLngBounds = new google.maps.LatLngBounds();
      const deltaLat = radiusKm / earthRadiusKm;
      const deltaLng = radiusKm / (earthRadiusKm * Math.cos(Math.PI * lat / 180));

      const northEast = new google.maps.LatLng(lat + deltaLat, lng + deltaLng);
      const southWest = new google.maps.LatLng(lat - deltaLat, lng - deltaLng);

      latLngBounds.extend(northEast);
      latLngBounds.extend(southWest);

      return latLngBounds;
    },
    async updateDistanceMessage() {
      const userLatLng = new google.maps.LatLng(this.updatedUser.lat_user, this.updatedUser.lng_user);
      const referenceLatLng = new google.maps.LatLng(this.referencePoint.lat, this.referencePoint.lng);

      try {
        const distance = await this.getRoadDistance(userLatLng, referenceLatLng);
        if (distance <= 40) {
          this.distanceMessage = `Alamat Anda masih mencangkup pengiriman Instan. Jarak dari Toko : ${distance.toFixed(2)} km`;
        } else {
          this.distanceMessage = `Alamat Anda tidak mencangkup pengiriman Instan. Jarak dari Toko : ${distance.toFixed(2)} km`;
        }
      } catch (error) {
        console.error('Error fetching road distance:', error);
      }
    },
    getRoadDistance(origin, destination) {
      return new Promise((resolve, reject) => {
        const service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: google.maps.TravelMode.DRIVING,
        }, (response, status) => {
          if (status === google.maps.DistanceMatrixStatus.OK) {
            const distance = response.rows[0].elements[0].distance.value / 1000;
            resolve(distance);
          } else {
            reject(status);
          }
        });
      });
    },
    async calculateShippingCost() {
      try {
        const distance = await this.getRoadDistance(
          new google.maps.LatLng(this.updatedUser.lat_user, this.updatedUser.lng_user),
          this.referencePoint
        );

        if (this.selectedShippingMethod === 'ojekOnline') {
          if (distance <= 5) {
            this.shippingCost = 20000;
          } else {
            this.shippingCost = 20000 + Math.round((distance - 1) * 500);
          }
        } else if (this.selectedShippingMethod === 'kurirApotikIST') {
          if (distance <= 1) {
            this.shippingCost = 8000;
          } else {
            this.shippingCost = 8000 + Math.round((distance - 1) * 1500);
          }
        } else if (this.selectedShippingMethod === 'kurirApotikSMD') {
          if (distance <= 1) {
            this.shippingCost = 5000;
          } else {
            this.shippingCost = 5000 + Math.round((distance - 1) * 1500);
          }
        }

        this.updateTotalBill();
      } catch (error) {
        console.error('Error calculating shipping cost:', error);
      }
  },
  updateTotalBill() {
    this.totalAmount = this.selectedCartPrice + this.shippingCost;
    },
  async checkoutItems() {
        if (!this.updatedUser.address_user) {
            Swal.fire({
                icon: 'error',
                title: 'Alamat tidak lengkap',
                text: 'Silakan lengkapi alamat sebelum melanjutkan.'
            });
            return;
        }
        if (this.selectedCartItems.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Tidak ada item yang dipilih',
                text: 'Silakan pilih item sebelum melanjutkan.'
            });
            return;
        }
        if (!this.selectedShippingMethod) {
            Swal.fire({
                icon: 'error',
                title: 'Metode pengiriman belum dipilih',
                text: 'Silakan pilih metode pengiriman sebelum melanjutkan.'
            });
            return;
        }

        const totalBill = this.selectedCartPrice + this.shippingCost;

        const result = await Swal.fire({
            title: 'Konfirmasi Pesanan',
            html: `<p>Total Tagihan: <strong>Rp ${totalBill.toLocaleString()}</strong></p><p>Periksa Kembali, sebelum melanjutkan.</p>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Lanjutkan',
            cancelButtonText: 'Tidak, Kembali'
        });

        if (!result.isConfirmed) {
            return;
        }

        const deselectedDiscountedItems = this.cartItems.filter(item => 
        !this.selectedItems.includes(item._id) && item.discount_product > 0
        );

        const formData = new FormData();
        formData.append('image_receipt', this.selectedFile);

        this.selectedItems.forEach(item => {
            formData.append('cartItemIds[]', item);
        });

        formData.append('shipping_cost', this.shippingCost);
        formData.append('shipping_method', this.selectedShippingMethod);
        formData.append('shipping_address', this.userData.address_user);
        formData.append('name_user', this.userData.name_user);
        formData.append('phone_user', this.userData.phone_user);
        if (deselectedDiscountedItems.length > 0) {
        formData.append('status_code', 4);
        } 
        const authToken = localStorage.getItem('authToken');
        
        try {
            const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction/checkout', formData, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            const { transaction_code, id_transaction } = response.data;

            const paymentResponse = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/midtrans/pay', {
                orderId: transaction_code,
                grossAmount: Math.round(this.selectedCartPrice + this.shippingCost),
                firstName: this.userData.name_user,
                lastName: this.userData.username_user,
                email: this.userData.email_user,
                phone: this.userData.phone_user
            });

            const transactionToken = paymentResponse.data.transactionToken;
            if (transactionToken) {
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

                await fetch('https://apiampv1-cnumhi5y6a-et.a.run.app/api/transaction-token/save-token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`
                    },
                    body: JSON.stringify({
                        id_transaction: id_transaction,
                        transaction_code: transaction_code,
                        transaction_token: transactionToken
                    })
                });
                this.$router.push('/cart');
            } else {
                throw new Error('Token pembayaran tidak tersedia');
            }
        } catch (error) {
            console.error('Error during checkout or payment:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Checkout',
                text: 'Terjadi kesalahan saat memproses pesanan Anda.',
            });
        }
    },

    }
  }
  const originalConsoleWarn = console.warn;
  console.warn = function (message) {
    if (typeof message === 'string' && message.includes('Google Maps JavaScript API') ) {
      return;
    }
    originalConsoleWarn.apply(console, arguments);
  };
</script>
<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.btn-primary {
  background-color: #50b1f9 !important;
  border: 1px solid #50b1f9 !important;
} 
.btn-primary:hover{
  background-color: #fff !important;
  border: 1px solid #50b1f9 !important;
  color: #50b1f9 !important;
}
.upload-box {
  height: 200px;
  background-color: #f8f9fa;
  border: 2px dashed #50b1f9;
  cursor: pointer;
}
.upload-box:hover {
  background-color: #e3f2fd;
}
.preview-box img {
  max-width: 50%;
  height: auto;
  border: 1px solid #50b1f9 !important;
  text-align: center;
}


main {
  flex: 1;
  padding: 25px;
  margin-top: 70px;
}
</style>
