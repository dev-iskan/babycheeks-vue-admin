<template>
  <p>Hello Single brand</p>
</template>

<script>
export default {
  props: {
    slug: {
      required: true,
      type: String
    }
  },

  created () {
    console.log(this.slug)
  }
}
</script>

<style scoped>

</style>
