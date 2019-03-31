<template>
  <v-card class="rounded-card elevation-2">
    <card-title title="Products Table" />
    <v-divider />
    <v-card-text>
      <data-table endpoint="admin/products" />
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
