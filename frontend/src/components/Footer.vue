<template>
  <footer class="bg-light text-center py-3">
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h5>Hubungi Kami</h5>
          <div class="social-media-icons">
            <i class="bi bi-facebook"></i>
            <i class="bi bi-twitter"></i>
            <i class="bi bi-instagram"></i>
          </div>
        </div>
        <div class="col-md-4">
          <h5>Tentang Kami</h5>
          <a href="#">Tentang Kami</a><br>
          <a href="#">Apotek Care</a>
        </div>
        <div class="col-md-4">
          <h5>Temukan Promo Menarik Lainnya</h5>
          <form>
            <div class="form-group">
              <input type="email" class="form-control" id="email" placeholder="Enter your email">
            </div>
            <button type="submit" class="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.social-media-icons i {
  font-size: 24px;
  margin: 0 10px;
}
</style>
