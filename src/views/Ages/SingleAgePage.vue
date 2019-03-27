<template>
  <p>Hello Single age</p>
</template>

<script>
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },

  created () {
    console.log(this.id)
  }
}
</script>

<style scoped>

</style>
