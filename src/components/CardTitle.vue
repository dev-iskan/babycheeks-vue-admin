<template>
  <v-card-title>
    <span class="headline text-uppercase">{{ title }}</span>
  </v-card-title>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      type: String
    }
  }
}
</script>

<style scoped>

</style>
