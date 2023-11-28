<template>
  <div class="overlay">
    <div class="progress-container">
      <v-progress-circular
          :size="70"
          :width="7"
          color="teal"
          indeterminate
      />
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed; /* o absolute */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5); /* fondo ligeramente opaco */
  z-index: 1000;
}

v-progress-circular {
  margin: 1rem;
}
</style>
