<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
    >
      <v-list>
        <v-list-tile
          v-for="item in menuItems"
          :key="item.name"
          :to="{name: item.name}"
        >
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>
            {{ item.title }}
          </v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar
      class="background"
      app
      dark
      flat
      height="50"
      :clipped-left="$vuetify.breakpoint.lgAndUp"
    >
      <v-toolbar-side-icon
        v-show="!$vuetify.breakpoint.lgAndUp"
        @click.stop="drawer=!drawer"
      />
      <v-toolbar-title class="headline text-uppercase">
        <span>Babycheeks</span>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          flat
          :icon="$vuetify.breakpoint.mdAndDown"
          :to="{name: 'logout'}"
        >
          <template v-if="$vuetify.breakpoint.mdAndDown">
            <v-icon>
              exit_to_app
            </v-icon>
          </template>
          <template v-else>
            Logout
          </template>
        </v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-content class="deep-purple lighten-5">
      <v-container>
        <v-layout>
          <v-flex
            xs12
            d-flex
          >
            <router-view />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <app-snackbar />
  </v-app>
</template>

<script>
import AppSnackbar from '@/components/AppSnackbar'
export default {
  components: {
    AppSnackbar
  },
  data () {
    return {
      drawer: this.$vuetify.breakpoint.lgAndUp,
      menuItems: [
        {
          name: 'home',
          icon: 'home',
          title: 'Home'
        },
        {
          name: 'ages-list',
          icon: 'child_friendly',
          title: 'Ages'
        },
        {
          name: 'brands-list',
          icon: 'label',
          title: 'Brands'
        },
        {
          name: 'categories-list',
          icon: 'storage',
          title: 'Categories'
        },

        {
          name: 'products-list',
          icon: 'business_center',
          title: 'Products'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
