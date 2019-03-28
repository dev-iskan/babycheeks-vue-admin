<template>
  <p>Hello Single age</p>
</template>

<script>
export default {
  props: {
    routeKey: {
      required: true,
      type: Number
    }
  },

  created () {
    console.log(this.routeKey)
  }
}
</script>

<style scoped>

</style>
