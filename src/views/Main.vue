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
      color="primary"
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

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>

export default {

  data () {
    return {
      drawer: this.$vuetify.breakpoint.lgAndUp,
      menuItems: [
        {
          name: 'home',
          icon: 'home',
          title: 'Home'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>
