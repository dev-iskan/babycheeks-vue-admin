<template>
  <div class="text-xs-center">
    <v-pagination
      v-model="page"
      :length="meta.last_page"
      :total-visible="$vuetify.breakpoint.xsOnly ? 2 : 7"
      @input="switched"
    />
  </div>
</template>

<script>
export default {
  props: {
    meta: {
      required: true,
      type: Object
    }
  },
  data () {
    return {
      page: this.meta.current_page
    }
  },
  mounted () {
    if (this.meta.current_page > this.meta.last_page) {
      this.switched(this.meta.last_page)
    }
  },
  methods: {
    switched (page) {
      if (this.pageIsOutOfBound(page)) {
        return
      }
      this.page = page
      this.$emit('pagination:switched', page)
    },
    pageIsOutOfBound (page) {
      return page <= 0 || page > this.meta.last_page
    }
  }

}
</script>

<style scoped>

</style>
