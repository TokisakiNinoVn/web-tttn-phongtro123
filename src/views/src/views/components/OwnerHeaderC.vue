<!-- src/components/Header.vue -->
<template>
  <header class="header">
    <div class="link-contact">
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-github"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-facebook"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-linkedin"></ion-icon></a>
      <a href="https://nino.is-a.dev/" class="link-contact-item"><ion-icon name="logo-reddit"></ion-icon></a>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppOwnerHeader',
  data() {
    return {};
  },
  mounted() {},
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100vw;
  padding: 5px 10px;
}

.link-contact {
  display: flex;
  align-items: center;
  gap: 10px;
}

.link-contact-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}
</style>
