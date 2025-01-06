<template>
  <div class="main-form bg-white pa4 br3 shadow-3 fixed top-50 left-50 translate--50">
    <div class="relative">
      <!-- Close Button -->
      <button @click="closeForm" class="absolute top-0 right-0 bg-transparent bn pointer">
        <ion-icon name="close-outline" class="f3 gray"></ion-icon>
      </button>

      <div class="tc mb4">
        <p class="f5 b">Địa chỉ đã chọn</p>
        <p class="f6">{{ selectedProvinceName }} - {{ selectedDistrictName }}</p>
      </div>

      <div>
        <!-- Province Selector -->
        <div class="mb3">
          <label for="province" class="f6 b db mb2">Tỉnh thành</label>
          <div class="relative">
            <select 
              v-model="selectedProvince" 
              @change="fetchDistricts" 
              class="w-100 pa2 ba b--gray br2 bg-light-gray">
              <option value="">Chọn tỉnh thành</option>
              <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
                {{ province.name }}
              </option>
            </select>
            <div v-if="loadingProvince" class="absolute top-0 right-0">
              <img src="../../assets/loading.svg" alt="Loading" class="h2 w2" />
            </div>
          </div>
        </div>

        <!-- District Selector -->
        <div class="mb3">
          <label for="district" class="f6 b db mb2">Quận huyện</label>
          <div class="relative">
            <select 
              v-model="selectedDistrict" 
              @change="fetchCommunes" 
              class="w-100 pa2 ba b--gray br2 bg-light-gray">
              <option value="">Chọn quận huyện</option>
              <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
                {{ district.name }}
              </option>
            </select>
            <div v-if="loadingDistrict" class="absolute top-0 right-0">
              <img src="../../assets/loading.svg" alt="Loading" class="h2 w2" />
            </div>
          </div>
        </div>
      </div>

      <!-- Complete Button -->
      <button @click="completeSelection" class="w-100 pa3 bg-green white bn br2 pointer flex items-center justify-center">
        <ion-icon class="mr2" name="checkmark-outline"></ion-icon>
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
      selectedProvince: '',
      selectedDistrict: '',
      loadingProvince: true,
      loadingDistrict: false,
    };
  },
  computed: {
    selectedProvinceName() {
      return this.provinces.find(p => p.idProvince === this.selectedProvince)?.name || '';
    },
    selectedDistrictName() {
      return this.districts.find(d => d.idDistrict === this.selectedDistrict)?.name || '';
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
    closeForm() {
      this.$emit('close');
    },
    completeSelection() {
      const selectedAddress = {
        province: this.selectedProvinceName,
        district: this.selectedDistrictName,
      };
      this.$emit('complete', selectedAddress);
      this.closeForm(); 
    }
  },
  mounted() {
    this.fetchProvinces();
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
    script.type = "module";
    document.head.appendChild(script);

    const noModuleScript = document.createElement('script');
    noModuleScript.src = "https://cdn.jsdelivr.net/npm/ionicons@5.5.2/dist/ionicons/ionicons.js";
    noModuleScript.setAttribute("nomodule", "");
    document.head.appendChild(noModuleScript);
  },
};
</script>

<style scoped>
.main-form {
  max-width: 30rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
}
</style>
