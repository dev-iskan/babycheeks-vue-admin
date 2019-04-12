<template>
  <v-flex
    xs12
    d-flex
  >
    <v-card class="rounded-card elevation-2">
      <v-card-text>
        <template v-if="Object.keys(product).length">
          <template v-if="product.images.length">
            <v-carousel
              max="500"
              height="400"
            >
              <v-carousel-item
                v-for="image in product.images"
                :key="image"
                :src="image"
              />
            </v-carousel>
          </template>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">id</span><span>{{ product.id }}</span>
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">name</span> <span>{{ product.name }}</span>
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">description</span> <div v-html="product.description" />
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">brand</span> <span>{{ product.brand }}</span>
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">price</span> <span>{{ product.formatted_price }}</span>
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">gender</span> <span>{{ product.formatted_gender }}</span>
          </div>
          <div class="subheading  d-flex table">
            <span class="width-50 text-uppercase">categories</span>
            <div
              v-for="key in Object.keys(product.categories)"
              :key="key"
            >
              <span>{{ product.categories[key] }}</span>
            </div>
          </div>
          <div class="subheading d-flex table">
            <span class="width-50 text-uppercase">ages</span>
            <div
              v-for="key in Object.keys(product.ages)"
              :key="key"
            >
              <span>{{ product.ages[key] }}</span>
            </div>
          </div>
          <div class="subheading d-flex table">
            <span class="width-50 text-uppercase">created at</span> <span>{{ product.created_at }}</span>
          </div>
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
          Отправить в канал
        </v-btn>
        <v-btn
          outline
          color="primary"
          @click.prevent="edit"
        >
          Изменить
        </v-btn>
        <v-btn
          outline
          :loading="buttonLoading"
          color="secondary"
          @click.prevent="destroy"
        >
          Удалить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
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
    this.setPageLoading()
    crud.fetchSingle('admin/products', this.routeKey)
      .then(product => { this.product = product })
      .catch(err => {
        if (err.response.status === 404) { this.$router.push({ name: 'products.index' }) }
      })
      .finally(() => { this.setPageReady() })
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
