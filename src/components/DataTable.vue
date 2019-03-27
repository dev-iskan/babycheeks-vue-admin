<template>
  <v-layout wrap>
    <v-flex
      xs12
      sm3
      class="text-xs-center text-sm-left"
    >
      <v-btn
        dark
        outline
        color="primary"
      >
        Create
        <v-icon
          dark
          right
        >
          add
        </v-icon>
      </v-btn>
    </v-flex>
    <v-spacer />
    <v-flex
      xs12
      sm3
    >
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Search"
        single-line
        hide-details
      />
    </v-flex>
    <v-flex
      xs12
      class="py-2"
    >
      <v-data-table
        :headers="headers"
        :items="records"
        :search="search"
        hide-actions
        class="elevation-1"
      >
        <!-- no-results-text="Такие данные не найдены" -->
        <template v-slot:items="props">
          <tr>
            <td
              v-for="header in headers"
              :key="header.value"
            >
              {{ props.item[header.value] }}
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/services/api.service.js'
export default {
  props: {
    endpoint: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      search: '',
      headers: [],
      records: []
    }
  },
  created () {
    this.getRecords()
  },
  methods: {
    async getRecords () {
      const response = await api.get(`${this.endpoint}`)
      this.records = response.data.data
      this.headers = response.data.meta.displayableColumns
    }
  }
}
</script>

<style scoped>

</style>
