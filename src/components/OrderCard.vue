<template>
  <v-card class="rounded-card">
    <v-card-text>
      <div
        v-if="order.product"
        class="subheading pb-2"
      >
        <router-link

          :to="{name:'products.show',
                params: {routeKey: order.product.slug}}"
        >
          {{ order.product.name }}
        </router-link>
      </div>
      <div
        v-else
        class="subheading font-weight-light pb-2"
      >
        Нету продукта
      </div>
      <div class="subheading font-weight-light">
        <v-icon
          flat
          color="primary"
        >
          face
        </v-icon> {{ order.name }}
      </div>
      <div class="subheading font-weight-light">
        <v-icon
          flat
          color="secondary"
        >
          phone
        </v-icon> {{ order.phone }}
      </div>
      <div class="subheading font-weight-light">
        <v-icon
          flat
          color="blue"
        >
          schedule
        </v-icon> {{ order.created_at }}
      </div>
    </v-card-text>
    <v-card-actions>
      <v-btn
        v-if="!order.finished"
        icon
        flat
        color="secondary"
        @click="setRead"
      >
        <v-icon>done</v-icon>
      </v-btn>
      <div
        v-else
        class="subheading px-2"
      >
        <span>Принят</span>
      </div>
      <v-spacer />
      <v-btn
        icon
        color="red"
        flat
        @click="remove"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  props: {
    order: {
      required: true,
      type: Object
    }
  },
  methods: {
    setRead () {
      const bool = !this.order.finished
      this.$emit('update', this.order.id, bool)
    },
    remove () {
      if (!confirm('Вы уверены?')) return
      this.$emit('remove', this.order.id)
    }
  }
}
</script>

<style scoped>

</style>
