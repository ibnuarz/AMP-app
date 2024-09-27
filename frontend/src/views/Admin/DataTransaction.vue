<template>
  <div class="transaction-data d-flex flex-column h-100">
    <Navbar />
    <main class="flex-grow-1">
      <div class="">
        <h1>Transaction Data</h1>
        <div class="table-responsive-lg">
          <DataTable
            :data="transactions"
            :columns="columns"
            class="table table-striped"
            :options="dataTableOptions"
          />
        </div>
      </div>
    </main>
    <Footer />
    <iframe id="print-frame" style="display: none;"></iframe>
  </div>
</template>

<script>
import Navbar from '@/components/Admin/Navbar.vue';
import Footer from '@/components/Admin/Footer.vue';
import DataTable from 'datatables.net-vue3';
import DataTablesCore from 'datatables.net-bs4';
import axios from 'axios';
import JsBarcode from 'jsbarcode';
import Swal from 'sweetalert2';

DataTable.use(DataTablesCore);

export default {
  components: {
    Navbar,
    Footer,
    DataTable,
  },
  data() {
    return {
      transactions: [],
      columns: [
        { title: 'Kode Transaksi', data: 'transaction_code' },
        { title: 'Nama Pemesan', data: 'name_user' },
        { title: 'Tanggal Transaksi', data: 'transaction_date' },
        { title: 'Jasa Kirim', data: 'shipping_method' },
        {
          title: 'Total',
          data: 'total_bill',
          render: (data) => {
            return this.formatCurrency(data);
          },
        },
        {
          title: 'Alamat Kirim',
          data: 'shipping_address',
          render: (data, type, row) => {
            return `
              <div class="address-container">
                <span class="${row.isAddressVisible ? 'full-address' : 'truncated-address'}">
                  ${row.isAddressVisible ? data : this.truncateAddress(data)}
                </span>
                <a class="text-primary text-decoration-none p-0" onclick="toggleAddress('${row._id}')">
                  ${row.isAddressVisible ? 'Tutup' : 'Detail'}
                </a>
              </div>
            `;
          },
        },
        {
          title: 'Resep',
          data: 'image_receipt',
          render: (data) => {
            if (!data) {
              return `<p>Tanpa Resep</p>`;
            }
            return `
              <div>
                <button class="btn btn-info btn-sm" id="view-receipt-${data}" data-image="${data}">Lihat</button>
              </div>
            `;
          },
        },
        {
          title: 'Aksi',
          data: null,
          render: (data, type, row) => {
            switch (row.status_code) {
              case 1:
                return `
                  <button class="btn btn-warning btn-sm ml-2" onclick="editTransaction('${row._id}')">Edit</button>`;
              case 2:
                return `
                  <p class="text-primary">Transaksi Terkonfirmasi</p>
                  <button class="btn btn-info btn-sm" onclick="viewOrderDetail('${row.transaction_code}')">Detail</button>
                  <button class="btn btn-warning btn-sm ml-2" onclick="editTransaction('${row._id}')">Edit</button>
                `;
              case 3:
                return '<p class="text-danger">Transaksi dibatalkan</p>';
              default:
                return '';
            }
          },
        },
        {
          title: 'Resi',
          data: null,
          render: (data, type, row) => {
            switch (row.status_code) {
              case 1:
                return '';
              case 2:
                return `<button class="btn btn-success btn-sm ml-2" onclick="printReceipt('${row._id}')">Cetak Resi</button>`;
              case 3:
                return '';
              default:
                return '';
            }
          },
        },
      ],
      dataTableOptions: {
        responsive: true,
        order: [[1, 'desc']],
      },
    };
  },
  created() {
    this.fetchTransactions();
    this.bindEventListeners();
    window.editTransaction = this.editTransaction;
    window.viewOrderDetail = this.viewOrderDetail;
    window.toggleAddress = this.toggleAddress;
    window.printReceipt = this.printReceipt;
  },
  methods: {
    async fetchTransactions() {
      try {
        const token = sessionStorage.getItem('authTokenAdmin');
        const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactions', {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (response.data.success) {
          this.transactions = response.data.data.map(transaction => ({
            ...transaction,
            isAddressVisible: false,
            brcode: this.generateBarcode(transaction.transaction_code),
            random_code: this.generateRandomCode(),
          }));
        } else {
          console.error('Failed to fetch transactions:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    },
    generateBarcode(transactionCode) {
      const canvas = document.createElement('canvas');
      JsBarcode(canvas, transactionCode, { format: 'CODE128', width: 2, height: 40 });
      return canvas.toDataURL();
    },
    generateRandomCode() {
      const today = new Date();
      const year = String(today.getFullYear()).padStart(2, '0');
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 100);
      return `${day}${month}${year}${String(randomNum).padStart(2, '0')}`;
    },
    async editTransaction(transactionId) {
      this.$router.push(`/admin/datatransaction/${transactionId}`);
    },
    async viewOrderDetail(transactionId) {
      this.$router.push(`/admin/datatransaction/detail/${transactionId}`);
    },
    async viewReceipt(imagePath) {
      if (!imagePath) {
        Swal.fire({
          title: 'Informasi',
          text: 'Tanpa Resep',
          icon: 'info',
          confirmButtonText: 'OK',
        });
        return;
      }
      const imageUrl = `https://apiampv1-cnumhi5y6a-et.a.run.app/public/img/receipt/${imagePath}`;
      Swal.fire({
        imageUrl: imageUrl,
        imageAlt: 'Gambar Resep',
        showCloseButton: true,
        showConfirmButton: false,
        imageWidth: '100%', 
        imageHeight: 'auto',
        backdrop: `
          rgba(0,0,0,0.8)
        `
      });
    },
    toggleAddress(transactionId) {
      const transaction = this.transactions.find(t => t._id === transactionId);
      if (transaction) {
        transaction.isAddressVisible = !transaction.isAddressVisible;
      }
    },
    printReceipt(transactionId) {
      const transaction = this.transactions.find(t => t._id === transactionId);
      if (transaction) {
        const shippingMethodText = this.getShippingMethodText(transaction.shipping_method);
        const receiptHTML = this.generateReceiptHTML(transaction, shippingMethodText);
        
        const printFrame = document.getElementById('print-frame');
        const printDocument = printFrame.contentDocument || printFrame.contentWindow.document;
        
        printDocument.open();
        printDocument.write(receiptHTML);
        printDocument.close();
        
        setTimeout(() => {
          printFrame.contentWindow.focus();
          printFrame.contentWindow.print();
        }, 500);
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
    generateReceiptHTML(transaction, shippingMethodText) {
    return `
      <html>
        <head>
          <style>
            @page {
              size: 10cm 15cm;
              margin: 0;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 10px;
              width: 10cm;
              height: 15cm;
            }
            .receipt {
              border: 1px solid #000;
              padding: 10px;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
            }
            .header {
              text-align: center;
              font-size: 18px;
              font-weight: bold;
              border-bottom: 1px solid #000;
              padding-bottom: 5px;
              margin-bottom: 10px;
            }
            .section {
              margin-top: 10px;
            }
            .detail {
              font-size: 14px;
              margin: 5px 0;
            }
            .footer {
              margin-top: 20px;
              text-align: center;
              font-size: 12px;
            }
            .address {
              margin-top: 10px;
            }
            .barcode {
              text-align: center;
              margin: 10px 0;
            }
            .row {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .column {
              flex: 1;
              margin: 0; /* No margin for columns */
            }
            .label {
              font-weight: bold;
            }
            .box {
              padding: 10px;
              border: 1px solid #333;
              margin: 5px 0; /* Margin for separation */
            }
            .double-box {
              display: flex;
              border: 1px solid #333;
              padding: 10px;
              margin: 5px 0; /* Margin for separation */
            }
            .double-box .column {
              margin: 0; /* No margin for columns inside double-box */
            }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div class="header">RESI PENGIRIMAN</div>
            <div class="barcode"><img src="${transaction.brcode}" /></div>
            <div class="section">
                <div class="detail row m-1" style="text-align: center;">
                  <div class="column text-center">${transaction.transaction_code}</div>
                </div>
              <div class="double-box">
                <div class="column">
                  <div class="label">Jasa Kirim:</div>
                  <div class="text-center">${shippingMethodText}</div>
                </div>
                <div class="column">
                  <div class="label">Kode Kirim:</div>
                  <div class="text-center">${transaction.random_code}</div>  
                </div>
              </div>
              
              <br>
              
              <div class="box">
                <div class="detail row m-1" style="text-align: center;">
                  <div class="column text-center">${transaction.transaction_date}</div>
                </div>
                <div class="detail row" style="justify-content: space-between;">
                  <div class="column label">Total:</div>
                  <div class="column text-center">${this.formatCurrency(transaction.total_bill)}</div>
                </div>
                <div class="detail row" style="justify-content: space-between;">
                  <div class="column label">Nama:</div>
                  <div class="column text-center">${transaction.name_user}</div>
                </div>
                <div class="detail address box">
                  <div class="label">Alamat:</div>
                  <div>${transaction.shipping_address}</div>
                </div>
              </div>
            </div>
            <br>
            <div class="footer box">Terima kasih atas kepercayaan Anda!</div>
          </div>
        </body>
      </html>
      `;
    },
    async editTransaction(transactionId) {
        this.$router.push(`/admin/datatransaction/${transactionId}`);
    },    
    async viewOrderDetail(transaction_code) {
        this.$router.push(`/admin/datatransaction/detail/${transaction_code}`);
    },
    toggleAddress(transactionId) {
    const transaction = this.transactions.find(t => t._id === transactionId);
    if (transaction) {
      transaction.isAddressVisible = !transaction.isAddressVisible;
    }
    },
    truncateAddress(address) {
    return address.length > 30 ? address.substring(0, 30) + '...' : address;
    },
    bindEventListeners() {
      document.addEventListener('click', (event) => {
        if (event.target.matches('[id^="view-receipt-"]')) {
          const imagePath = event.target.dataset.image;
          this.viewReceipt(imagePath);
        }
      });
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

.address-container {
  display: flex;
  flex-direction: column;
}

.full-address {
  white-space: normal;
}

.truncated-address {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
</style>
