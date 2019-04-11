<template>
  <v-card class="rounded-card elevation-2">
    <card-title title="Таблица брендов" />
    <v-divider />
    <v-card-text>
      <data-table endpoint="admin/brands" />
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
