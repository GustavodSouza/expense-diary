<template>
  <q-toolbar>
    <q-btn flat round dense icon="menu" class="q-mr-sm" />
    <q-toolbar-title>Expense Diary</q-toolbar-title>
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
