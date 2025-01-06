<template>
    <div class="modal fixed top-0 left-0 right-0 bottom-0 bg-black-40 flex justify-center items-center z-9999">
        <div class="content bg-white pa4 br3 shadow-5 w-50">
            <h3 class="tc f4 b">Bộ lọc</h3>
            <div class="filter-section">
                <div class="filter-option mb4">
                    <label class="label f5 b">Loại bài đăng</label>
                    <div class="options mt3">
                        <label class="option">
                            <input type="radio" v-model="filterOptions.type" value="" /> Tất cả
                        </label>
                        <label v-for="type in types" :key="type.id" class="option">
                            <input type="radio" v-model="filterOptions.type" :value="type.id" /> {{ type.name }}
                        </label>
                    </div>
                </div>

                <div class="filter-option mb4">
                    <label class="label f5 b ">Giá</label>
                    <div class="options mt3">
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="" /> Tất cả
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="1" /> Dưới 1 triệu
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="2" /> 1 triệu - 2 triệu
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="3" /> 2 triệu - 3 triệu
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="4" /> 3 triệu - 4 triệu
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="5" /> 4 triệu - 5 triệu
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.price" value="6" /> Trên 5 triệu
                        </label>
                    </div>
                </div>

                <div class="filter-option mb4">
                    <label class="label f5 b">Diện tích</label>
                    <div class="options mt3">
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="" /> Tất cả
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="1" /> Dưới 20m2
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="2" /> 20m2 - 30m2
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="3" /> 30m2 - 40m2
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="4" /> 40m2 - 50m2
                        </label>
                        <label class="option">
                            <input type="radio" v-model="filterOptions.acreage" value="5" /> Trên 50m2
                        </label>
                    </div>
                </div>
            </div>

            <div class="address-section mb4">
                <label class="label f5 b ">Địa chỉ</label>
                <div class="selects flex">
                    <div class="select mr3 mt3">
                        <select v-model="selectedProvince" @change="fetchDistricts" class="select-input pa3 ba br2 shadow-2">
                            <option value="">Chọn tỉnh thành</option>
                            <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
                                {{ province.name }}
                            </option>
                        </select>
                        <div v-if="loadingProvince" class="loading absolute top-0 right-0 mt2 mr2">
                            <img src="../../assets/loading.svg" alt="Loading" />
                        </div>
                    </div>

                    <div class="select mt3">
                        <select v-model="selectedDistrict" class="select-input pa3 ba br2 shadow-2">
                            <option value="">Chọn quận huyện</option>
                            <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
                                {{ district.name }}
                            </option>
                        </select>
                        <div v-if="loadingDistrict" class="loading absolute top-0 right-0 mt2 mr2">
                            <img src="../../assets/loading.svg" alt="Loading" />
                        </div>
                    </div>
                </div>

                <div class="selected-address mt2">
                    <p class="f6 black">Địa chỉ đang lọc: {{ selectedProvinceName }} - {{ selectedDistrictName }}</p>
                </div>
            </div>

            <div class="buttons flex justify-between">
                <button @click="closeForm" class="close-button f6 link dim br3 ph4 pv3 mb3 dib white bg-dark-red hover-bg-red flex items-center"><ion-icon name="close-circle-outline" class="mr2"></ion-icon>Đóng</button>
                <button @click="applyFilter" class="filter-button f6 link dim br3 ph4 pv3 mb3 dib white bg-dark-green hover-bg-green flex items-center"><ion-icon name="checkmark-circle-outline" class="mr2"></ion-icon>Lọc</button>
            </div>
        </div>
    </div>
</template>

<style scoped>
button {
    outline: none;
    border: none;
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
}

.content {
    max-width: 800px;
    width: 100%;
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

h3 {
    color: #333;
    margin-bottom: 20px;
}

.filter-option {
    margin-bottom: 1.5rem;
}

.filter-option .options {
    display: flex;
    flex-wrap: wrap;
}

.filter-option .option {
    margin-right: 1.5rem;
    color: #333;
}

.selected-address {
    margin-top: 10px;
    font-size: 14px;
    color: #888;
}

.select-input {
    font-size: 14px;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ddd;
    width: 100%;
    box-sizing: border-box;
}

.select {
    width: 48%;
}

.loading {
    display: flex;
    justify-content: center;
    align-items: center;
}

.buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.filter-button,
.close-button {
    cursor: pointer;
}

.filter-button:hover,
.close-button:hover {
    opacity: 0.9;
}

.close-button {
    background-color: #d9534f;
}

.filter-button {
    background-color: #5bc0de;
}

.close-button:hover {
    background-color: #c9302c;
}

.filter-button:hover {
    background-color: #31b0d5;
}
</style>

  
<script setup>
import { ref, reactive, onMounted, computed, defineEmits } from "vue";
import { getAllTypesApi } from "@/api/modules/type.api";
import { useRouter } from "vue-router";

const emit = defineEmits(['close']);
const router = useRouter();
const types = ref([]);
const provinces = ref([]);
const districts = ref([]);
const selectedProvince = ref("");
const selectedDistrict = ref("");
const loadingProvince = ref(false);
const loadingDistrict = ref(false);

const filterOptions = reactive({
    type: "",
    price: "",
    acreage: "",
    address: "",
});

const selectedProvinceName = computed(() =>
    provinces.value.find(p => p.idProvince === selectedProvince.value)?.name || ""
);
const selectedDistrictName = computed(() =>
    districts.value.find(d => d.idDistrict === selectedDistrict.value)?.name || ""
);

const fetchProvinces = async () => {
    loadingProvince.value = true;
    try {
        const response = await fetch("https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/province");
        provinces.value = await response.json();
    } catch (error) {
        console.error("Error fetching provinces:", error);
    } finally {
        loadingProvince.value = false;
    }
};

const fetchDistricts = async () => {
    if (!selectedProvince.value) return;
    loadingDistrict.value = true;
    try {
        const response = await fetch(
            `https://api-tinh-thanh-git-main-toiyours-projects.vercel.app/district/?idProvince=${selectedProvince.value}`
        );
        districts.value = await response.json();
    } catch (error) {
        console.error("Error fetching districts:", error);
    } finally {
        loadingDistrict.value = false;
    }
};

const applyFilter = () => {
    filterOptions.address = `${selectedProvinceName.value} - ${selectedDistrictName.value}`;
    router.push({
        name: 'ResultFilterPage',
        query: { ...filterOptions },
    });
};

const closeForm = () => {
    emit('close');
};

onMounted(async () => {
    try {
        const response = await getAllTypesApi();
        types.value = response.data.data;
        await fetchProvinces();
    } catch (error) {
        console.error("Error on mounted:", error);
    }
});
</script>

<!-- <style scoped>
.box-filter {
    display: flex;
    flex-direction: column;
}
label {
    margin-right: 10px;
}
</style> -->
