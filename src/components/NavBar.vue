<template>
  <q-toolbar>
    <q-btn flat round dense icon="menu" class="q-mr-sm" />
    <q-avatar>
      <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
    </q-avatar>

    <q-toolbar-title>Quasar Framework</q-toolbar-title>

    <q-btn flat round dense icon="whatshot" />
  </q-toolbar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'NavBarComponent',

  data() {
    return {
      displayName: ref<string>(''),
    };
  },
});
</script>
