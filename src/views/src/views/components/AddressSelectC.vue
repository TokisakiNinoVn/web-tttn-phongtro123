<template>
  <div class="fixed top-0 left-0 w-100 h-100 bg-black-50 flex items-center justify-center z-5">
    <div class="bg-white pa4 br3 shadow-1 w-50">
      <button @click="closeForm" class="absolute top-1 right-1 bg-transparent bn pointer">
        <ion-icon name="close-outline" class="f3 gray"></ion-icon>
      </button>
      <div class="mb4">
        <p class="f5 b mb2">Địa chỉ đã chọn</p>
        <p class="f6 gray">
          {{ selectedProvinceName }} - {{ selectedDistrictName }} - {{ selectedCommuneName }}
        </p>
      </div>
      <div>
        <div class="mb3">
          <label for="province" class="db mb1 f6 b">Tỉnh thành</label>
          <div class="relative">
            <select
              v-model="selectedProvince"
              @change="fetchDistricts"
              class="w-100 pa2 br2 ba b--light-gray"
            >
              <option value="">--Chọn tỉnh thành--</option>
              <option
                v-for="province in provinces"
                :key="province.idProvince"
                :value="province.idProvince"
              >
                {{ province.name }}
              </option>
            </select>
            <div v-if="loadingProvince" class="absolute top-1 right-1">
              <img src="../../assets/loading.svg" alt="Loading" class="w2 h2" />
            </div>
          </div>
        </div>

        <div class="mb3">
          <label for="district" class="db mb1 f6 b">Quận huyện</label>
          <div class="relative">
            <select
              v-model="selectedDistrict"
              @change="fetchCommunes"
              class="w-100 pa2 br2 ba b--light-gray"
            >
              <option value="">--Chọn quận huyện--</option>
              <option
                v-for="district in districts"
                :key="district.idDistrict"
                :value="district.idDistrict"
              >
                {{ district.name }}
              </option>
            </select>
            <div v-if="loadingDistrict" class="absolute top-1 right-1">
              <img src="../../assets/loading.svg" alt="Loading" class="w2 h2" />
            </div>
          </div>
        </div>

        <div class="mb3">
          <label for="commune" class="db mb1 f6 b">Phường xã</label>
          <div class="relative">
            <select
              v-model="selectedCommune"
              class="w-100 pa2 br2 ba b--light-gray"
            >
              <option value="">--Chọn phường xã--</option>
              <option
                v-for="commune in communes"
                :key="commune.idCommune"
                :value="commune.idCommune"
              >
                {{ commune.name }}
              </option>
            </select>
            <div v-if="loadingCommune" class="absolute top-1 right-1">
              <img src="../../assets/loading.svg" alt="Loading" class="w2 h2" />
            </div>
          </div>
        </div>
      </div>

      <button
        @click="completeSelection"
        class="w-100 bg-green white pa3 br2 b f6 pointer dim flex items-center justify-center"
      >
        <ion-icon class="mr2" name="checkmark-outline"></ion-icon>
        Xác nhận
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>

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

