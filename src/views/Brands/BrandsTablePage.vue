<template>
  <v-card class="rounded-card elevation-2">
    <card-title title="Brands Table" />
    <v-divider />
    <v-card-text>
      <data-table endpoint="admin/brands" />
    </v-card-text>
  </v-card>
</template>

<script>
import DataTable from '@/components/DataTable'
import CardTitle from '@/components/CardTitle'
export default {
  components: {
    DataTable,
    CardTitle
  }
}
</script>

<style scoped>

</style>
