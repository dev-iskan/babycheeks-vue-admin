<template>
  <p>{{ order.name }}</p>
</template>

<script>
export default {
  props: {
    order: {
      required: true,
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
