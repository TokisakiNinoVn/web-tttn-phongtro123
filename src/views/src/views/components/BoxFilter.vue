<template>
    <div class="box-filter">
    <button @click="closeForm">
        <span>Close</span>
    </button>
    <div>
        <label>Loại bài đăng</label>
        <div>
        <label v-for="type in types" :key="type.id">
            <input type="radio" v-model="filterOptions.type" :value="type.id" /> {{ type.name }}
        </label>
        </div>
    </div>

    <div>
        <label>Giá</label>
        <div>
        <label>
            <input type="radio" v-model="filterOptions.price" value="1" /> Dưới 1 triệu
        </label>
        <label>
            <input type="radio" v-model="filterOptions.price" value="2" /> 1 triệu - 2 triệu
        </label>
        <label>
            <input type="radio" v-model="filterOptions.price" value="3" /> 2 triệu - 3 triệu
        </label>
        <label>
            <input type="radio" v-model="filterOptions.price" value="4" /> 3 triệu - 4 triệu
        </label>
        <label>
            <input type="radio" v-model="filterOptions.price" value="5" /> 4 triệu - 5 triệu
        </label>
        <label>
            <input type="radio" v-model="filterOptions.price" value="6" /> Trên 5 triệu
        </label>
        </div>
    </div>

    <div>
        <label>Địa chỉ</label>
        <div>
        <p>Địa chỉ đã chọn</p>
        <p>{{ selectedProvinceName }} - {{ selectedDistrictName }}</p>
        </div>
        <div>
        <div>
            <label for="province">Tỉnh thành</label>
            <div>
            <select v-model="selectedProvince" @change="fetchDistricts">
                <option value="">Chọn tỉnh thành</option>
                <option v-for="province in provinces" :key="province.idProvince" :value="province.idProvince">
                {{ province.name }}
                </option>
            </select>
            <div v-if="loadingProvince">
                <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="Loading" />
            </div>
            </div>
        </div>

        <div>
            <label for="district">Quận huyện</label>
            <div>
            <select v-model="selectedDistrict">
                <option value="">Chọn quận huyện</option>
                <option v-for="district in districts" :key="district.idDistrict" :value="district.idDistrict">
                {{ district.name }}
                </option>
            </select>
            <div v-if="loadingDistrict">
                <img src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="Loading" />
            </div>
            </div>
        </div>
        </div>
    </div>

    <div>
        <label>Diện tích</label>
        <div>
        <label>
            <input type="radio" v-model="filterOptions.acreage" value="1" /> Dưới 20m2
        </label>
        <label>
            <input type="radio" v-model="filterOptions.acreage" value="2" /> 20m2 - 30m2
        </label>
        <label>
            <input type="radio" v-model="filterOptions.acreage" value="3" /> 30m2 - 40m2
        </label>
        <label>
            <input type="radio" v-model="filterOptions.acreage" value="4" /> 40m2 - 50m2
        </label>
        <label>
            <input type="radio" v-model="filterOptions.acreage" value="5" /> Trên 50m2
        </label>
        </div>
    </div>

    <div>
        <button @click="applyFilter">Lọc</button>
    </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, defineEmits } from "vue";
import { getAllTypesApi } from "@/api/modules/type.api";
const emit = defineEmits(['close']);

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
    province: "",
    district: "",
});

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
    filterOptions.province = selectedProvince.value;
    filterOptions.district = selectedDistrict.value;
    console.log(filterOptions);
};

const closeForm = () => {
    emit('close');
};

onMounted(async () => {
    try {
    const response = await getAllTypesApi();
    types.value = response.data;
    await fetchProvinces();
    } catch (error) {
    console.error("Error on mounted:", error);
    }
});
</script>


<style scoped>
.box-filter {
    display: flex;
    flex-direction: column;
}
label {
    margin-right: 10px;
}
</style>