<template>
  <v-card class="rounded-card elevation-2">
    <v-card-text>
      <template v-if="Object.keys(product).length">
        <div class="subheading">
          <span class="green--text">id</span>: <span>{{ product.id }}</span>
        </div>
        <div class="subheading">
          <span class="green--text">name</span>: <span>{{ product.name }}</span>
        </div>
        <div class="subheading">
          <span class="green--text">description</span>: <div v-html="product.description" />
        </div>
        <div class="subheading">
          <span class="green--text">brand</span>: <span>{{ product.brand }}</span>
        </div>
        <div class="subheading">
          <span class="green--text">price</span>: <span>{{ product.formatted_price }}</span>
        </div>
        <div class="subheading">
          <span class="green--text">gender</span>: <span>{{ product.formatted_gender }}</span>
        </div>
        <div class="subheading">
          <span class="green--text">categories</span>:
          <div
            v-for="key in Object.keys(product.categories)"
            :key="key"
          >
            <span>{{ product.categories[key] }}</span>
          </div>
        </div>
        <div class="subheading">
          <span class="green--text">ages</span>:
          <div
            v-for="key in Object.keys(product.ages)"
            :key="key"
          >
            <span>{{ product.ages[key] }}</span>
          </div>
        </div>
        <div class="subheading">
          <span class="green--text">created at</span>: <span>{{ product.created_at }}</span>
        </div>
        <template v-if="product.images.length">
          <span class="green--text">Images</span>
          <v-carousel
            max="500"
          >
            <v-carousel-item
              v-for="image in product.images"
              :key="image"
              :src="image"
            />
          </v-carousel>
        </template>
      </template>
    </v-card-text>
    <v-card-actions class="pa-3">
      <v-spacer />
      <v-btn
        :loading="telegramButtonLoading"
        dark
        color="blue"
        @click.prevent="sendToTelegram"
      >
        <v-icon left>
          send
        </v-icon>
        Send Telegram
      </v-btn>
      <v-btn
        outline
        color="blue"
        @click.prevent="edit"
      >
        Edit
      </v-btn>
      <v-btn
        outline
        :loading="buttonLoading"
        color="red"
        @click.prevent="destroy"
      >
        Delete
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import crud from '@/services/crud.service'
export default {
  props: {
    routeKey: {
      required: true,
      type: String
    }
  },
  data () {
    return {
      product: {},
      telegramButtonLoading: false,
      buttonLoading: false
    }
  },
  created () {
    crud.fetchSingle('admin/products', this.routeKey)
      .then(product => { this.product = product })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'products.index' }) }
      })
  },
  methods: {
    sendToTelegram () {
      this.telegramButtonLoading = true
      crud.sendToTelegram(this.routeKey)
        .finally(() => { this.telegramButtonLoading = false })
    },
    destroy () {
      if (confirm('Are you sure?')) {
        this.buttonLoading = true
        crud.destroy(`admin/products/${this.routeKey}`)
          .then(() => {
            this.$router.push({ name: 'products.index' })
          })
          .finally(() => { this.buttonLoading = false })
      }
    },
    edit () {
      this.$router.push({ name: 'products.edit', params: { routeKey: this.routeKey } })
    }
  }
}
</script>

<style scoped>

</style>
