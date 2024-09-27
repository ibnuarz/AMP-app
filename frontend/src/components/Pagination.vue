<template>
    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="emitPageChange(currentPage - 1)">
            <i class="bi bi-caret-left-fill"></i>
          </a>
        </li>
        <li v-for="page in pages" :key="page" class="page-item" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="emitPageChange(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="emitPageChange(currentPage + 1)">
            <i class="bi bi-caret-right-fill"></i>
          </a>
        </li>
      </ul>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'Pagination',
    props: {
      total: {
        type: Number,
        required: true
      },
      limit: {
        type: Number,
        required: true
      },
      modelValue: {
        type: Number,
        required: true
      },
      prevText: {
        type: String,
        default: 'Previous'
      },
      nextText: {
        type: String,
        default: 'Next'
      }
    },
    computed: {
      currentPage() {
        return this.modelValue;
      },
      totalPages() {
        return Math.ceil(this.total / this.limit);
      },
      pages() {
        const pages = [];
        for (let i = 1; i <= this.totalPages; i++) {
          pages.push(i);
        }
        return pages;
      }
    },
    methods: {
      emitPageChange(page) {
        if (page >= 1 && page <= this.totalPages) {
          this.$emit('update:modelValue', page);
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .pagination {
    display: flex;
    justify-content: center;
  }
  .page-item {
    margin: 0 2px;
  }
  .page-link {
    font-size: 15px;
    padding: 0.5rem 0.75rem;
  }
  .page-link i {
    font-size: 10px;
    vertical-align: middle;
  }
  .page-item.disabled .page-link {
    pointer-events: none;
    color: #6c757d;
  }
  .page-item.active .page-link {
    background-color: #007bff;
    border-color: #007bff;
    color: #fff;
  }
  </style>
  