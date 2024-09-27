<template>
    <div class="edit-product-container">
      <Navbar />
      <main class="flex-grow-1">
        <div class="container">
          <form @submit.prevent="submitForm" class="form">
            <div class="d-flex justify-content-between align-items-center mb-2">
                <h1>Edit Produk</h1>
                <a class="btn btn-danger" :href="'/admin/dataproduct'">Kembali</a>
            </div>
            <div class="form-group">
              <label for="name_product">Nama produk</label>
              <input
                type="text"
                id="name_product"
                v-model="form.name_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="discount_product">Discount produk</label>
              <input
                type="number"
                id="discount_product"
                v-model="form.discount_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="price_product">Harga produk</label>
              <input
                type="number"
                id="price_product"
                v-model="form.price_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="category_product">Kategori produk</label>
              <input
                type="text"
                id="category_product"
                v-model="form.category_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="description_product">Deskripsi produk</label>
              <textarea
                id="description_product"
                v-model="form.description_product"
                class="form-control"
                required
              ></textarea>
            </div>
            <div class="form-group">
              <label for="stock_product">Stok produk</label>
              <input
                type="number"
                id="stock_product"
                v-model="form.stock_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="expiry_date_product">Tanggal Kadaluarsa produk</label>
              <input
                type="date"
                id="expiry_date_product"
                v-model="form.expiry_date_product"
                class="form-control"
                required
              />
            </div>
            <div class="form-group">
              <label for="image_product">Gambar produk</label>
              <img v-if="form.image_product" :src="'https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/' + form.image_product" alt="Gambar Produk" width="250">
              <input
                type="file"
                id="image_product"
                @change="handleFileUpload"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="composition_product">Komposisi produk</label>
              <textarea
                id="composition_product"
                v-model="form.composition_product"
                class="form-control"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="sideeffects_product">Efek Samping produk</label>
              <textarea
                id="sideeffects_product"
                v-model="form.sideeffects_product"
                class="form-control"
              ></textarea>
            </div>
            <div class="form-group">
              <label for="manufacture_product">Manufaktur produk</label>
              <input
                type="text"
                id="manufacture_product"
                v-model="form.manufacture_product"
                class="form-control"
              />
            </div>
            <div class="form-group">
              <label for="dose_product">Dosis produk</label>
              <input
                type="text"
                id="dose_product"
                v-model="form.dose_product"
                class="form-control"
              />
            </div>
            <div class="form-group">
                <label for="group_product">Golongan produk</label>
                <select id="group_product" v-model="form.group_product" class="form-control">
                    <option value="1">Keras</option>
                    <option value="2">Bebas Keras</option>
                    <option value="3">Bebas Terbatas</option>
                    <option value="4">Narkotika</option>
                    <option value="5">Fitofarmaka</option>
                    <option value="6">OHT</option>
                    <option value="7">Herbal</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary">Update Produk</button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  </template>
  
  <script>
  import Navbar from '@/components/Admin/Navbar.vue';
  import Footer from '@/components/Admin/Footer.vue';
  import Swal from 'sweetalert2';
  import axios from 'axios';
  
  export default {
    components: {
      Navbar,
      Footer,
    },
    data() {
      return {
        form: {
          _id: '',
          name_product: '',
          price_product: '',
          category_product: '',
          description_product: '',
          stock_product: '',
          expiry_date_product: '',
          image_product: '',
          composition_product: '',
          sideeffects_product: '',
          manufacture_product: '',
          dose_product: '',
          group_product: ''
        },
        newImage: null
      };
    },
    async created() {
      this.fetchProduct();
    },
    methods: {
      async fetchProduct() {
        try {
          const productId = this.$route.params.id;
          const response = await axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product/${productId}`);
          this.form = response.data.data;
        } catch (error) {
          console.error('Terjadi kesalahan:', error.response.data);
        }
      },
      async submitForm() {
        try {
          if (this.newImage) {
            await this.deleteImage();
            this.form.image_product = await this.uploadImage(this.newImage);
            }
            const response = await axios.put(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product/${this.form._id}`, this.form);
            console.log(response);
            if (response && response.data) {
              await Swal.fire({
                title: 'Success!',
                text: 'Product has been updated successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            this.$router.push('/admin/dataproduct');
            } else {
            console.error('Unexpected response format:', response);
          }
        } catch (error) {
                console.error('Terjadi kesalahan:', error.response ? error.response.data : error.message);
                await Swal.fire({
                    title: 'Error!',
                    text: 'There was an issue updating the product. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
        }
      },
      handleFileUpload(event) {
        this.newImage = event.target.files[0];
      },
      async uploadImage(image) {
        const formData = new FormData();
        formData.append('image', image);
        const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/uploadNewImageProduct', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        return response.data.imageUrl;
      },
      async deleteImage() {
        const imageUrl = this.form.image_product;
        try {
          await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/deleteImage?url=${imageUrl}`);
          console.log('Gambar lama berhasil dihapus');
          this.form.image_product = '';
        } catch (error) {
          console.error('Gagal menghapus gambar lama:', error.response.data);
        }
      }
    }
  };
  </script>
  
  <style>
  .edit-product-container {
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
  