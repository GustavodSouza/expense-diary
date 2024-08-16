<template>
  <q-dialog v-model="isOpenDialog">
    <q-card class="q-pa-md" style="width: 700px">
      <q-card-section>
        <div class="text-h6">Edit Payment</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div class="row items-center q-gutter-md">
          <q-input class="col-12" filled v-model="description" label="Description" />
          <q-input class="col-12" filled type="date" v-model="date" label="Date" />
          <q-input class="col-12" filled type="number" v-model="price" label="Price" />
          <q-input
            v-if="isObservationShow"
            class="col-md-12"
            filled
            v-model="observation"
            label="Observation"
          />
          <q-btn
            style="width: 2%; height: 2%"
            round
            color="primary"
            :icon="!isObservationShow ? 'add' : 'remove'"
            @click="isObservationShow = !isObservationShow"
          />
        </div>
      </q-card-section>

      <q-card-actions class="row justify-evenly bg-white text-teal">
        <q-btn class="col-5" @click="isOpenDialog = false" label="Cancel" color="negative" no-caps unelevated />
        <q-btn class="col-5" @click="confirmEdit" label="Confirm" color="positive" no-caps unelevated />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { PaymentModel } from 'src/models/Payment';
import { defineComponent, ref } from 'vue';
import DateHelpers from 'src/helpers/date-helpers';

export default defineComponent({
  name: 'ModalEdit',
  data() {
    return {
      isOpenDialog: ref<boolean>(false),
      description: ref<string>(),
      date: ref<string>(),
      price: ref<string>(),
      observation: ref<string>(),
      isObservationShow: ref<boolean>(false),
      paymentId: ref<string>(''),
      callback: null,
    };
  },

  methods: {
    openDialog(rowEdit: PaymentModel) {
      this.toogleModal(true);
      this.fillForm(rowEdit);

      return new Promise((resolve) => (this.callback = resolve));
    },

    toogleModal(value: boolean): void {
      this.isOpenDialog = value;
    },

    fillForm(rowEdit: PaymentModel): void {
      this.description = rowEdit.description;
      this.date = this.formatDateToFill(rowEdit.date);
      this.price = rowEdit.price;
      this.observation = rowEdit.observation;
      this.paymentId = rowEdit.paymentId ?? '';
    },

    formatDateToFill(date: string): string {
      const { day, month, year } = DateHelpers.splitDateFromParameter(
        date,
        DateHelpers.IFormatDate.BACK_SLASH_FORMAT
      );
      return `${day}-${month}-${year}`;
    },

    confirmEdit(): void {
      const payload: PaymentModel = {
        description: this.description ?? '',
        date: this.date ?? '',
        price: this.price ?? '',
        observation: this.observation ?? '',
        paymentId: this.paymentId,
      };
      this.toogleModal(false);
      this.callback(payload);
    },
  },
});
</script>
