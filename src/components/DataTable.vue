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
        :to="{name: `${table}.create`}"
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
            @click="showRecord(props.item[routeKey])"
          >
            <td
              v-for="header in headers"
              :key="header.value"
              :class="{'justify-center align-center layout px-0' : header.value === ''}"
            >
              <template v-if="header.value=== ''">
                <v-btn
                  icon
                  flat
                  small
                  color="primary"
                  @click.stop.prevent="edit(props.item[routeKey])"
                >
                  <v-icon
                    small
                  >
                    edit
                  </v-icon>
                </v-btn>
                <v-btn
                  icon
                  flat
                  small
                  color="secondary"
                  @click.stop.prevent="destroy(props.item[routeKey])"
                >
                  <v-icon
                    small
                  >
                    delete
                  </v-icon>
                </v-btn>
              </template>
              <template v-else>
                {{ props.item[header.value] | nullValue }}
              </template>
            </td>
          </tr>
        </template>
      </v-data-table>
      <pagination
        v-if="meta.current_page"
        :meta="meta"
        class="pa-3"
        @pagination:switched="switchPage"
      />
    </v-flex>
  </v-layout>
</template>

<script>
import crud from '@/services/crud.service.js'
import Pagination from '@/components/Pagination'
export default {
  components: {
    Pagination
  },
  filters: {
    nullValue (value) {
      return value || 'No value'
    }
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
    getRecords (page = this.$route.query.page) {
      this.loading = true
      crud.fetchRecords(page, this.endpoint)
        .then(data => {
          this.records = data.data
          this.meta = data.meta
          this.headers = data.datatable.displayableColumns
          this.headers.push({ text: 'Actions', value: '', sortable: false })
          this.routeKey = data.datatable.routeKey
          this.table = data.datatable.table
          this.loading = false
        })
    },

    showRecord (key) {
      this.$router.push({ name: `${this.table}.show`, params: { routeKey: key } })
    },

    switchPage (page) {
      this.$router.replace({
        name: `${this.table}.index`,
        query: {
          page
        }
      })
    },

    destroy (key) {
      if (!confirm('Are you sure?')) return
      crud.destroy(`admin/${this.table}/${key}`)
        .then(() => {
          this.getRecords()
        })
    },

    edit (key) {
      this.$router.push({ name: `${this.table}.edit`, params: { routeKey: key } })
    }
  }
}
</script>

<style scoped>

</style>
