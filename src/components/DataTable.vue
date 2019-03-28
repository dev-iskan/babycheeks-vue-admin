<template>
  <v-layout wrap>
    <v-flex
      xs12
      sm3
      class="text-xs-center text-sm-left"
    >
      <v-btn
        v-if="table"
        dark
        outline
        :to="{name: `${table}-create`}"
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
        :loading="loading"
        hide-actions
        class="elevation-1"
      >
        <!-- no-results-text="Такие данные не найдены" -->
        <template v-slot:items="props">
          <tr
            class="pointer"
            @click="showRecord(props.item)"
          >
            <td
              v-for="header in headers"
              :key="header.value"
            >
              {{ props.item[header.value] }}
            </td>
          </tr>
        </template>
      </v-data-table>
      <pagination
        v-if="meta.current_page"
        :meta="meta"
        @pagination:switched="switchPage"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/services/api.service.js'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  props: {
    endpoint: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      meta: {},
      search: '',
      headers: [],
      records: [],
      routeKey: '',
      table: '',
      loading: false
    }
  },
  watch: {
    '$route.query' (query) {
      this.getRecords(query.page)
    }
  },
  created () {
    this.getRecords()
  },
  methods: {
    async getRecords (page = this.$route.query.page) {
      this.loading = true
      const requestConfig = {
        method: 'get',
        url: `${this.endpoint}`,
        params: {
          page
        }
      }
      try {
        const response = await api.customRequest(requestConfig)
        this.records = response.data.data
        this.meta = response.data.meta
        this.headers = response.data.datatable.displayableColumns
        this.routeKey = response.data.datatable.routeKey
        this.table = response.data.datatable.table
        this.loading = false
      } catch (e) {
        // handle error
        alert(e)
      }
    },

    showRecord (record) {
      this.$router.push({ name: `${this.table}-single`, params: { routeKey: record[this.routeKey] } })
    },

    switchPage (page) {
      this.$router.replace({
        name: `${this.table}-list`,
        query: {
          page
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
