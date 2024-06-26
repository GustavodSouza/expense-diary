<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2">
    <q-page-container>
      <q-page class="q-pa-md">
        <h5>Register New Payment</h5>
        <div class="row q-pb-md">
          <q-input
            filled
            label="Total"
            v-model="total"
            disable
            bg-color="grey-4"
          />
        </div>
        <div class="row items-center q-gutter-md">
          <q-input filled v-model="description" label="Description" />
          <q-input filled type="date" v-model="date" label="Date" />
          <q-input filled v-model="price" label="Price" />
          <q-input
            v-if="isObservationShow"
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
          <q-btn
            @click="registerPayment"
            label="Register Payment"
            color="primary"
          />
        </div>
        <div class="row q-pt-lg">
          <q-input
            class="q-pb-md"
            filled
            type="month"
            v-model="monthYearFilter"
            label="Filter Month and Year"
            @update:model-value="changeFilterDate"
          />
          <q-table class="full-width" :rows="rows" :columns="columns" />
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { PaymentModel, PaymentsModel } from 'src/models/Payment';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { getUsers } from 'src/services/StorageService';
import Calculation from 'src/utils/Calculation';
import DateHelpers from 'src/helpers/date-helpers';

export default defineComponent({
  name: 'PaymentsComponent',
  data() {
    return {
      description: ref<string>(),
      date: ref<string>(),
      price: ref<string>(),
      observation: ref<string>(),
      isObservationShow: ref<boolean>(false),
      rows: ref<PaymentsModel>([]),
      columns: [
        {
          name: 'description',
          required: true,
          label: 'Description',
          field: 'description',
          align: 'left',
          sortable: true,
        },
        {
          name: 'date',
          align: 'left',
          label: 'Date',
          field: 'date',
          sortable: true,
        },
        {
          name: 'price',
          align: 'left',
          label: 'Price',
          field: 'price',
          sortable: true,
        },
      ],
      total: ref<number>(0),
      monthYearFilter: ref(),
    };
  },

  mounted() {
    this.getPaymentsPerUser();
    this.setCurrentDate();
  },

  methods: {
    async registerPayment(): Promise<void> {
      const user = getUsers();

      const newPayment: PaymentModel = {
        description: this.description ?? '',
        date: this.date ?? '',
        price: this.price ?? '',
        userId: user.userId,
        observation: this.observation ?? '',
      };

      const paymentsRef = collection(db, 'Payments');

      addDoc(paymentsRef, newPayment).then((callback) => {
        console.log('New Payment Add', callback);
        this.getPaymentsPerUser();
        this.clearFields();
      });
    },

    async getPaymentsPerUser(): Promise<void> {
      const { year, month } = DateHelpers.getCurrentDateSplit();
      this.getPaymentsRequest(month, year);
    },

    async getPaymentsRequest(
      month: string,
      year: string | number
    ): Promise<void> {
      this.rows = [];
      const user = getUsers();
      const payments = collection(db, 'Payments');
      const q = query(
        payments,
        where('userId', '==', user.userId),
        where('date', '>=', `${year}-${month}-01`),
        where('date', '<', `${year}-${month}-30`)
      );

      getDocs(q).then((query) => {
        query.forEach((user) => {
          const responsePayment: PaymentModel = {
            description: user.data().description,
            date: DateHelpers.maskDate(
              user.data().date,
              DateHelpers.IFormatDate.BACK_SLASH_FORMAT
            ),
            price: user.data().price,
          };
          this.rows.push(responsePayment);
          this.getTotal();
          console.log('Payload', user.data());
        });
      });
    },

    clearFields(): void {
      this.description = '';
      this.date = '';
      this.price = '';
      this.observation = '';
    },

    getTotal(): void {
      this.total = Calculation.getTotalPrice(this.rows);
    },

    setCurrentDate(): void {
      const { year, month } = DateHelpers.getCurrentDateSplit();
      this.monthYearFilter = `${year}-${month}`;
    },

    changeFilterDate(): void {
      const { year, month } = DateHelpers.splitDateFromParameter(
        this.monthYearFilter
      );
      this.getPaymentsRequest(month, year);
    },
  },
});
</script>
