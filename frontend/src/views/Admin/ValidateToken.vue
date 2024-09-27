<template>
    <div class="validate-token-container">
      <Navbar />
      <main class="flex-grow-1">
        <div class="container">
          <button @click="validateTokens" class="btn btn-primary mb-3">Klik untuk Validasi Token</button>
          <div v-if="tokens.length > 0">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Transaction Code</th>
                  <th>Transaction Token</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="token in tokens" :key="token.transaction_token">
                  <td>{{ token.id_transaction }}</td>
                  <td>{{ token.transaction_code }}</td>
                  <td>{{ token.transaction_token }}</td>
                  <td>{{ token.status }}</td>
                  <td>
                    <button @click="deleteToken(token.transaction_code)" class="btn btn-danger btn-sm">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else>
            <p>No tokens to display.</p>
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
      Footer
    },
    data() {
      return {
        tokens: []
      };
    },
    methods: {
      async validateTokens() {
        const authToken = sessionStorage.getItem('authTokenAdmin');
        if (!authToken) {
          console.error('No authentication token found.');
          return;
        }
  
        try {
          const response = await axios.get('https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataTransactionTokens', {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json'
            }
          });
  
          if (!response.data.success) {
            console.error('Failed to fetch tokens:', response.data.message);
            return;
          }
  
          const tokens = response.data.data || [];
          console.log('Fetched tokens:', tokens);
  
          const statusChecks = tokens.map(token => 
            axios.get(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/transactionStatus/${token.transaction_code}`, {
              headers: {
                'Authorization': `Bearer ${authToken}`,
                'Accept': 'application/json'
              }
            })
            .then(statusResponse => {
              if (statusResponse.status === 200) {
                return {
                  ...token,
                  status: statusResponse.data.transaction_status
                };
              } else {
                console.error(`Failed to fetch status for transaction_code ${token.transaction_code}:`, statusResponse.statusText);
                return null;
              }
            })
            .catch(statusError => {
              console.error(`Error fetching status for transaction_code ${token.transaction_code}:`, statusError);
              return null;
            })
          );
          const results = await Promise.all(statusChecks);
          console.log('Status check results:', results);
  
          this.tokens = results.filter(token => token && ['cancel', 'settlement', 'expire'].includes(token.status));
          console.log('Filtered tokens to be set:', this.tokens);
  
        } catch (error) {
          console.error('Error validating tokens:', error);
        }
      },
  
      async deleteToken(transaction_code) {
        const authToken = sessionStorage.getItem('authTokenAdmin');
        if (!authToken) {
          console.error('No authentication token found.');
          return;
        }
  
        try {
          const response = await axios.delete(`https://apiampv1-cnumhi5y6a-et.a.run.app/api/admin/dataTransactionTokens/${transaction_code}`, {
            headers: {
              'Authorization': `Bearer ${authToken}`,
              'Accept': 'application/json'
            }
          });
  
          if (response.data.success) {
            this.tokens = this.tokens.filter(token => token.transaction_code !== transaction_code);
          } else {
            console.error('Failed to delete token:', response.data.message);
          }
        } catch (error) {
          console.error('Error deleting token:', error);
        }
      }
    }
  }
  </script>
  
  <style>
  .validate-token-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  main {
    flex: 1;
    padding: 25px;
  }
  </style>
  