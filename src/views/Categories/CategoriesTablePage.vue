<template>
  <v-card class="rounded-card elevation-2">
    <card-title title="Categories Table" />
    <v-divider />
    <v-card-text>
      <data-table endpoint="admin/categories" />
    </v-card-text>
  </v-card>
</template>

<script>
import DataTable from '@/components/DataTable'
import CardTitle from '@/components/CardTitle'
export default {
  components: {
    CardTitle,
    DataTable
  }
}
</script>

<style scoped>

</style>
