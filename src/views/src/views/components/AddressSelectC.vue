<template>
  <div class="main-form">
    <div class="relative">
      <!-- Close Button -->
      <button @click="closeForm" class="absolute top-2 right-2">
        <ion-icon name="close-outline"></ion-icon>
      </button>

      <!-- Address Display -->
      <div>
        <p>Địa chỉ đã chọn</p>
        <p>{{ selectedProvinceName }} - {{ selectedDistrictName }} - {{ selectedCommuneName }}</p>
      </div>

      <!-- Main Content -->
      <div>
        <!-- Province Selector -->
        <div>
          <label for="province">Tỉnh thành</label>
          <div>
            <select 
              v-model="selectedProvince" 
              @change="fetchDistricts"
            >
              <option value="">--Chọn tỉnh thành--</option>
              <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
                {{ province.name }}
              </option>
            </select>
            <div v-if="loadingProvince">
              <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="Loading" />
            </div>
          </div>
        </div>

        <!-- District Selector -->
        <div>
          <label for="district">Quận huyện</label>
          <div>
            <select v-model="selectedDistrict" @change="fetchCommunes">
              <option value="">--Chọn quận huyện--</option>
              <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
                {{ district.name }}
              </option>
            </select>
            <div v-if="loadingDistrict">
              <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="Loading" />
            </div>
          </div>
        </div>

        <!-- Commune Selector -->
        <div>
          <label for="commune">Phường xã</label>
          <div>
            <select v-model="selectedCommune">
              <option value="">--Chọn phường xã--</option>
              <option v-for="commune in communes" :key="commune.idCommune" :value="commune.idCommune">
                {{ commune.name }}
              </option>
            </select>
            <div v-if="loadingCommune">
              <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="Loading" />
            </div>
          </div>
        </div>
      </div>

      <!-- Complete Button -->
      <button @click="completeSelection" class="flex items-center justify-center">
        <ion-icon class="mr-4" name="checkmark-outline"></ion-icon>
        Xác nhận
      </button>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      provinces: [],
      districts: [],
      communes: [],
      selectedProvince: '',
      selectedDistrict: '',
      selectedCommune: '',
      loadingProvince: true,
      loadingDistrict: false,
      loadingCommune: false,
    };
  },
  computed: {
    selectedProvinceName() {
      return this.provinces.find(p => p.idProvince === this.selectedProvince)?.name || '';
    },
    selectedDistrictName() {
      return this.districts.find(d => d.idDistrict === this.selectedDistrict)?.name || '';
    },
    selectedCommuneName() {
      return this.communes.find(c => c.idCommune === this.selectedCommune)?.name || '';
    },
    
  },
  methods: {
    async fetchProvinces() {
      try {
        const response = await fetch("https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/province");
        const data = await response.json();
        this.provinces = data;
        this.loadingProvince = false;
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    },
    async fetchDistricts() {
      if (!this.selectedProvince) return;
      this.loadingDistrict = true;
      try {
        const response = await fetch(`https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/district/?idProvince=${this.selectedProvince}`);
        const data = await response.json();
        this.districts = data;
        this.loadingDistrict = false;
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    },
    async fetchCommunes() {
      if (!this.selectedDistrict) return;
      this.loadingCommune = true;
      try {
        const response = await fetch(`https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/commune/?idDistrict=${this.selectedDistrict}`);
        const data = await response.json();
        this.communes = data;
        this.loadingCommune = false;
      } catch (error) {
        console.error("Error fetching communes:", error);
      }
    },
    closeForm() {
      this.$emit('close');
    },
    completeSelection() {
      if (this.selectedProvince && this.selectedDistrict && this.selectedCommune) {
        const selectedAddress = {
          province: this.selectedProvinceName,
          district: this.selectedDistrictName,
          commune: this.selectedCommuneName,
        };
        this.$emit('complete', selectedAddress);
        this.closeForm(); 
      } else {
        alert("Vui lòng chọn đầy đủ Tỉnh thành, Quận huyện và Phường xã.");
      }
    }
  },
  mounted() {
    this.fetchProvinces();
  },
};
</script>

<style scoped>

.main-form {
  position: fixed;
  top: 0;
  left: 0;
}
.main {
  display: flex;
}
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 50;
}

.modal-content {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  color: gray;
  font-size: 20px;
  cursor: pointer;
}

.address-display {
  text-align: center;
  margin-bottom: 24px;
}

.address-display .title {
  font-weight: bold;
  font-size: 18px;
}

.input-group {
  margin-bottom: 16px;
}

.label {
  font-size: 14px;
  margin-bottom: 4px;
  display: block;
}

.input-container {
  position: relative;
}

.input-field {
  width: 100%;
  padding: 8px;
  border: 1px solid gray;
  border-radius: 4px;
}

.loading-icon {
  position: absolute;
  top: 12px;
  right: 8px;
}

.complete-btn {
  width: 100%;
  padding: 12px;
  background-color: green;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.complete-btn:hover {
  background-color: darkgreen;
}
</style>
