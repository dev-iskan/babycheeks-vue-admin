<template>
  <v-card class="rounded-card elevation-2">
    <v-card-title>
      <span class="headline text-uppercase">Ages Table</span>
    </v-card-title>
    <v-divider />
    <v-card-text>
      <data-table endpoint="admin/ages" />
    </v-card-text>
  </v-card>
</template>

<script>
import DataTable from '@/components/DataTable'
export default {
  components: {
    DataTable
  }
}
</script>

<style scoped>

</style>
