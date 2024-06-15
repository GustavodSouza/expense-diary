<template>
  <div>
    <q-layout
      view="lHh lpr lFf"
      container
      style="height: 100vh"
      class="shadow-2"
    >
      <q-header elevated>
        <nav-bar />
      </q-header>

      <q-page-container>
        <q-page class="q-pa-md">
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from 'src/components/NavBar.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    NavBar,
  },
});
</script>
