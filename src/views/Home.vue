<template>
  <v-container
    grid-list-xl
    class="pa-0"
  >
    <v-layout
      v-if="loading"
      justify-center
      fill-height
      allign-center
    >
      <v-progress-circular
        indeterminate
        size="100"
        color="secondary"
      />
    </v-layout>
    <v-layout
      v-else
      row
      wrap
    >
      <v-flex
        v-for="order in orders"
        :key="order.id"
        xs12
        sm4
      >
        <order-card
          :order="order"
          @remove="removeOrder"
          @update="updateOrder"
        />
      </v-flex>
    </v-layout>
    <pagination
      v-if="!loading && meta.current_page"
      :meta="meta"
      @pagination:switched="switchPage"
    />
  </v-container>
</template>

<script>
import OrderCard from '@/components/OrderCard'
import crud from '@/services/crud.service'
import Pagination from '@/components/Pagination'
export default {
  components: {
    OrderCard,
    Pagination
  },
  data () {
    return {
      meta: {},
      orders: [],
      loading: false
    }
  },
  watch: {
    '$route.query' (query) {
      this.getOrders(query.page)
    }
  },
  created () {
    this.getOrders()
  },
  methods: {
    getOrders (page = this.$route.query.page) {
      this.loading = true
      crud.fetchRecords(page, 'admin/orders')
        .then(data => {
          this.meta = data.meta
          this.orders = data.data
        }).finally(() => { this.loading = false })
    },
    switchPage (page) {
      this.$router.replace({
        name: 'home',
        query: {
          page
        }
      })
    },
    updateOrder (id, val) {
      crud.update(`admin/orders/${id}`, { finished: val })
        .then(() => {
          this.getOrders()
        })
    },
    removeOrder (id) {
      crud.destroy(`admin/orders/${id}`)
        .then(() => {
          this.getOrders()
        })
    }
  }
}
</script>
