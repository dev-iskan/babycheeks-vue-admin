<template>
  <p>Hello Single category</p>
</template>

<script>
export default {
  props: {
    routeKey: {
      required: true,
      type: String
    }
  },

  created () {
    console.log(this.routeKey)
  }
}
</script>

<style scoped>

</style>
