<template>
  <div class="container-fluid p-0">
    <Navbar />
    <main>
      <section class="profile-container">
        <h1>Profil Pengguna</h1>
        <form @submit.prevent="updateProfile" class="profile-form">
          <div class="form-group">
            <label for="profileName">Nama Lengkap:</label>
            <input type="text" id="profileName" v-model="updatedUser.name_user" required />
          </div>
          <div class="form-group">
            <label for="profileEmail">Email:</label>
            <input type="email" id="profileEmail" v-model="updatedUser.email_user" disabled />
          </div>
          <div class="form-group">
            <label for="profileDob">Tanggal Lahir:</label>
            <input type="date" id="profileDob" v-model="updatedUser.dob_user" required />
          </div>
          <div class="form-group">
            <label for="profilePhone">No Handphone:</label>
            <input type="text" id="profilePhone" v-model="updatedUser.phone_user" required />
          </div>
          <div class="form-group">
            <label for="profileGender">Gender:</label>
            <select id="profileGender" v-model="updatedUser.gender_user" required>
              <option value="">Pilih Gender</option>
              <option value="Pria">Pria</option>
              <option value="Wanita">Wanita</option>
            </select>
          </div>
          <div class="form-group">
            <label for="">Alamat Anda Sekarang : </label>
            <textarea id="address" v-model="userData.address_user" rows="4" disabled></textarea>
          </div>
          <div class="form-group">
            <label for="address">Jika Inging Update Alamat:</label>
            <input id="searchBox" type="text" placeholder="Cari alamat..." style="width: 50%; padding: 12px; margin-top: 10px;" />
            <div id="map" style="height: 400px; width: 100%; margin-top: 10px;"></div>
            <small class="text-primary">
            <i class="bi bi-info-circle"></i>
            Konfirmasi detail alamat anda jika alamat gmaps tidak lengkap (Apartemen, No. Rumah, No. Unit, dan Patokan)
            </small>
            <textarea id="address" v-model="updatedUser.address_user" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Update Profil</button>
        </form>

        <div v-if="!showPasswordUpdate" class="password-toggle">
          <button @click="togglePasswordUpdate" class="btn btn-secondary">
            Klik untuk Ubah Password
          </button>
        </div>

        <!-- Password Update Section -->
        <section v-if="showPasswordUpdate" class="password-update-section">
          <h2>Update Password</h2>
          <form @submit.prevent="updatePassword" class="password-update-form">
            <div class="form-group">
              <label for="oldPassword">Old Password:</label>
              <input type="password" id="oldPassword" v-model="oldPassword" required />
            </div>
            <div class="form-group">
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" v-model="newPassword" required />
            </div>
            <button type="submit" class="btn btn-primary">Update Password</button>
          </form>
        </section>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const userData = ref({});
const updatedUser = ref({});
const oldPassword = ref('');
const newPassword = ref('');
const showPasswordUpdate = ref(false);
const distanceMessage = ref('');
const map = ref(null);
const marker = ref(null);
const geocoder = ref(null);
const searchBox = ref(null);
const googleMapsLoaded = ref(false);
const referencePoint = { lat: -6.155282, lng: 106.807991 };

const router = useRouter();

onMounted(async () => {
  if (!googleMapsLoaded.value) {
    await loadGoogleMapsAPI();
    googleMapsLoaded.value = true;
  }
  const storedUserData = localStorage.getItem('userData');
  if (storedUserData) {
    userData.value = JSON.parse(storedUserData);
    updatedUser.value = { ...userData.value };
    if (!updatedUser.value.dob_user) {
      updatedUser.value.dob_user = new Date().toISOString().split('T')[0];
    }
  }
  initMap();
});

const loadGoogleMapsAPI = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=marker,geometry,places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
};

const createBoundsAroundLocation = (lat, lng, radiusKm) => {
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
};

const initMap = () => {
  const initialPosition = updatedUser.value.lat_user && updatedUser.value.lng_user
    ? { lat: parseFloat(updatedUser.value.lat_user), lng: parseFloat(updatedUser.value.lng_user) }
    : referencePoint;

  map.value = new google.maps.Map(document.getElementById('map'), {
    center: initialPosition,
    zoom: 15,
  });

  geocoder.value = new google.maps.Geocoder();

  marker.value = new google.maps.Marker({
    position: initialPosition,
    map: map.value,
    draggable: true,
  });
  marker.value.addListener('dragend', updateLocation);
  updateLocation();

  const dynamicBounds = createBoundsAroundLocation(initialPosition.lat, initialPosition.lng, 40);
  searchBox.value = new google.maps.places.SearchBox(document.getElementById('searchBox'), {
    bounds: dynamicBounds,
  });

  map.value.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('searchBox'));

  searchBox.value.addListener('places_changed', () => {
    const places = searchBox.value.getPlaces();
    if (places.length === 0) {
      return;
    }

    const filteredPlaces = places.filter(place => {
      const placeLatLng = place.geometry.location;
      const placeDistance = google.maps.geometry.spherical.computeDistanceBetween(
        placeLatLng,
        new google.maps.LatLng(referencePoint.lat, referencePoint.lng)
      ) / 1000;
      return placeDistance < 60;
    });

    if (filteredPlaces.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Lokasi Tidak Diizinkan',
        text: 'Lokasi Yang anda Input diluar jangkauan Toko Kami (maks 40Km)',
      });
      return;
    }

    if (marker.value) {
          marker.value.setMap(null);
        }

        const place = filteredPlaces[0];
        const bounds = new google.maps.LatLngBounds();
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
        map.value.fitBounds(bounds);

        marker.value = new google.maps.Marker({
          map: map.value,
          position: place.geometry.location,
          draggable: true,
        });
        marker.value.addListener('dragend', updateLocation);
        updateLocation();
  });
};


const updateLocation = () => {
  const position = marker.value.getPosition();
  updatedUser.value.lat_user = position.lat();
  updatedUser.value.lng_user = position.lng();
  geocoder.value.geocode({ location: position }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      updatedUser.value.address_user = results[0].formatted_address;
    } else {
      console.error('Geocode was not successful for the following reason: ' + status);
    }
  });
};

const updateProfile = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found.');
      return;
    }

    const storedUserData = JSON.parse(localStorage.getItem('userData'));

    const addressUpdated = storedUserData.lat_user !== updatedUser.value.lat_user ||
      storedUserData.lng_user !== updatedUser.value.lng_user ||
      storedUserData.address_user !== updatedUser.value.address_user;

    if (addressUpdated) {
      const result = await Swal.fire({
        title: 'Konfirmasi Update Alamat',
        text: "Anda akan memperbarui alamat Anda, apakah Anda yakin?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Update!',
        cancelButtonText: 'Batal'
      });

      if (result.isConfirmed) {
        await saveProfileData(authToken);
        Swal.fire('Berhasil', 'Alamat Anda telah diperbarui.', 'success');
        router.go(0);
      } else {
        Swal.fire('Batal', 'Proses pembaruan alamat dibatalkan.', 'error');
        Swal.fire({
          title: 'Memuat...',
          text: 'Data sedang dimuat ulang...',
          timer: 500,
          didClose: () => {
            router.go(0);
          }
        });
      }
    } else {
      await saveProfileData(authToken);
      Swal.fire('Berhasil', 'Profil Anda telah diperbarui.', 'success');
    }

  } catch (error) {
    console.error('Profile update error:', error);
    Swal.fire('Update gagal', 'Terjadi kesalahan saat memperbarui profil', 'error');
  }
};

const saveProfileData = async (authToken) => {
  const response = await axios.put('https://apiampv1-cnumhi5y6a-et.a.run.app/api/auth/update-profile', updatedUser.value, {
    headers: {
      Authorization: `Bearer ${authToken}`
    }
  });

  if (response.data.success) {
    localStorage.setItem('userData', JSON.stringify(updatedUser.value));
  } else {
    console.error('Profile update failed');
    throw new Error('Profile update failed');
  }
};


const togglePasswordUpdate = () => {
  showPasswordUpdate.value = !showPasswordUpdate.value;
};

const updatePassword = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      console.error('Auth token not found.');
      return;
    }
    const response = await axios.put('https://apiampv1-cnumhi5y6a-et.a.run.app/api/auth/update-password', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`
      }
    });

    if (response.data.success) {
      if (response.data.newToken) {
        localStorage.setItem('authToken', response.data.newToken);
      }
      oldPassword.value = '';
      newPassword.value = '';
      showPasswordUpdate.value = false;
      Swal.fire({
        title: 'Kata sandi diperbarui',
        text: 'Anda akan diarahkan ke halaman login dalam 5 detik.',
        icon: 'success',
        timer: 5000,
        timerProgressBar: true,
        didClose: () => {
          router.push({ name: 'Login' });
        }
      });
    } else {
      console.error('Password update failed');
      Swal.fire('Update gagal', 'Kata sandi lama anda salah', 'error');
    }
  } catch (error) {
    console.error('Update password error:', error);
    Swal.fire('Update gagal', 'Kata sandi lama anda salah', 'error');
  }
};

const originalConsoleWarn = console.warn;
console.warn = function (message) {
  if (typeof message === 'string' && message.includes('Google Maps JavaScript API') ) {
    return;
  }
  originalConsoleWarn.apply(console, arguments);
};

</script>

<style scoped>
main {
  padding: 25px;
  margin-top: 70px;
  display: flex;
  justify-content: center;
}

.profile-container {
  max-width: 600px;
  width: 100%;
}

.profile-form,
.password-update-form {
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
select,
textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ced4da;
  border-radius: 4px;
}

textarea {
  resize: vertical;
}

button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #50b1f9;
  color: white;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background-color: #4091d8;
}

@media (max-width: 768px) {
  .profile-main {
    padding: 15px;
  }

  .profile-container {
    padding: 15px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

</style>