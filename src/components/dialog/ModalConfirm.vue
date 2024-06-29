<template>
  <q-dialog v-model="isOpenDialog">
    <q-card style="width: 500px">
      <q-card-section>
        <div class="text-h6">{{ title }}</div>
        <div class="text-h7">
          <span>{{ text }}</span>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn @click="cancel" label="No" color="negative" />
        <q-btn @click="confirm" label="Yes" color="positive" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'ModalConfirm',
  data() {
    return {
      callback: ref<unknown>(),
      isOpenDialog: ref<boolean>(false),
      title: ref<string>(''),
      text: ref<string>(''),
    };
  },

  methods: {
    openDialog(params: { title: string; text: string }) {
      this.setParams(params);
      this.toogleModal(true);
      return new Promise((resolve) => (this.callback = resolve));
    },

    setParams(params: { title: string; text: string }): void {
      this.title = params.title;
      this.text = params.text;
    },

    toogleModal(value: boolean): void {
      this.isOpenDialog = value;
    },

    cancel(): void {
      this.toogleModal(false);
    },

    confirm(): void {
      this.callback(true);
      this.toogleModal(false);
    },
  },
});
</script>
