<template>
  <div class="user-data d-flex flex-column h-100">
    <Navbar />
    <main class="flex-grow-1">
      <div class="container">
        <h1>Produk</h1>
        <button class="btn btn-primary mb-3" @click="toggleForm">
          {{ showForm ? 'Tutup' : 'Tambah Produk' }}
        </button>
        <div v-if="showForm" class="form-container">
          <h2>Tambah Produk</h2>
          <form @submit.prevent="submitForm" class="needs-validation">
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="name_product">Nama produk:</label>
                <input type="text" id="name_product" class="form-control" v-model="form.name_product" required>
              </div>
              <div class="form-group col-md-6">
                <label for="price_product">Harga produk:</label>
                <input type="number" id="price_product" class="form-control" v-model="form.price_product" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="category_product">Kategori produk:</label>
                <input type="text" id="category_product" class="form-control" v-model="form.category_product" required>
              </div>
              <div class="form-group col-md-6">
                <label for="stock_product">Stok produk:</label>
                <input type="number" id="stock_product" class="form-control" v-model="form.stock_product" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="description_product">Deskripsi produk:</label>
                <textarea id="description_product" class="form-control" v-model="form.description_product" required></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="expiry_date_product">Tanggal Kadaluarsa produk:</label>
                <input type="date" id="expiry_date_product" class="form-control" v-model="form.expiry_date_product" required>
              </div>
              <div class="form-group col-md-6">
                <label for="image_product">Gambar produk:</label>
                <input type="file" id="image_product" class="form-control-file" @change="handleFileUpload" required>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="composition_product">Komposisi produk:</label>
                <textarea id="composition_product" class="form-control" v-model="form.composition_product"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-12">
                <label for="sideeffects_product">Efek Samping produk:</label>
                <textarea id="sideeffects_product" class="form-control" v-model="form.sideeffects_product"></textarea>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="manufacture_product">Manufaktur produk:</label>
                <input type="text" id="manufacture_product" class="form-control" v-model="form.manufacture_product">
              </div>
              <div class="form-group col-md-6">
                <label for="dose_product">Dosis produk:</label>
                <input type="text" id="dose_product" class="form-control" v-model="form.dose_product">
              </div>
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
            <button type="submit" class="btn btn-success">Tambahkan</button>
          </form>
        </div>

        <div class="table-responsive mt-4">
          <DataTable
            :data="productList"
            :columns="columns"
            class="table table-striped"
            :options="dataTableOptions"
          />
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

  
  <script>
  import Navbar from '@/components/Admin/Navbar.vue';
  import Footer from '@/components/Admin/Footer.vue';
  import DataTable from 'datatables.net-vue3';
  import DataTablesCore from 'datatables.net-bs4';
  import Swal from 'sweetalert2';
  import axios from 'axios';
  
  DataTable.use(DataTablesCore);
  
  export default {
    components: {
      Navbar,
      Footer,
      DataTable
    },
    data() {
      return {
        showForm: false,
        form: {
          name_product: '',
          price_product: '',
          category_product: '',
          description_product: '',
          stock_product: '',
          expiry_date_product: '',
          image_product: null,
          composition_product: '',
          sideeffects_product: '',
          manufacture_product: '',
          dose_product: '',
          group_product: ''
        },
        productList: [],
        columns: [
          { title: 'Nama Produk', data: 'name_product' },
          { title: 'Harga Produk', data: 'price_product' },
          { title: 'Kategori Produk', data: 'category_product' },
          { title: 'Deskripsi Produk', data: 'description_product', className: 'description-column' },
          { title: 'Stok Produk', data: 'stock_product' },
          { title: 'Tanggal Kadaluarsa Produk', data: 'expiry_date_product' },
          {
            title: 'Gambar Produk',
            data: 'image_product',
            render: (data) => `<img src='https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/product/${data}' alt='Gambar Produk' width='150'>`
          },
          {
            title: 'Aksi',
            data: null,
            render: (data, type, row) => `
              <button class="btn btn-warning btn-sm m-1" onclick="editProduct('${row._id}')">Edit</button>
              <button class="btn btn-danger btn-sm m-1" onclick="deleteProduct('${row._id}')">Hapus</button>
            `,
          }
        ],
        dataTableOptions: {
          responsive: true,
        }
      };
    },
    async created() {
      this.fetchProducts();
      window.editProduct = this.editProduct;
      window.deleteProduct = this.deleteProduct;
    },
    methods: {
      toggleForm() {
        this.showForm = !this.showForm;
      },
      handleFileUpload(event) {
        this.form.image_product = event.target.files[0];
      },
      async submitForm() {
        const formData = new FormData();
        Object.keys(this.form).forEach(key => {
            formData.append(key, this.form[key]);
        });

        try {
            const response = await axios.post('https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
            });

            if (response && response.data) {
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Produk berhasil ditambahkan.',
            });
            this.fetchProducts();
            this.showForm = false;
            } else {
            console.error('Unexpected response format:', response);
            }
        } catch (error) {
            console.error('Terjadi kesalahan:', error.response ? error.response.data : error.message);
        }
        },
      async fetchProducts() {
        try {
          const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product');
          this.productList = response.data.data;
        } catch (error) {
          console.error('Terjadi kesalahan:', error.response.data);
        }
      },
      async deleteProduct(productId) {
        const result = await Swal.fire({
            title: "Anda Yakin?",
            text: "Data Yang Terhapus Tidak Bisa Dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Ya, Hapus"
        });
        if (result.isConfirmed) {
            try {
            await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/product/product/${productId}`);
            Swal.fire({ title: "Deleted!", text: "The product has been deleted.", icon: "success"});
            this.fetchProducts();
            } catch (error) {
            console.error('Failed to delete product:', error.response ? error.response.data : error.message);
            }
        }
      },
      editProduct(productId) {        
        this.$router.push(`/admin/editproduct/${productId}`);
      }
    }
  };
  </script>
  
  <style>
  .product-data {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding: 25px;
    margin-top: 70px;
  }
  
  .form-container {
    margin-bottom: 20px;
  }
  
  .table-responsive table {
    table-layout: auto;
  }
  
  .table-responsive .description-column {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  </style>
  