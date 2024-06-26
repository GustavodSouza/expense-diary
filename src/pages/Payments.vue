<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2">
    <q-page-container>
      <q-page class="q-pa-md">
        <h5>Register New Payment</h5>
        <div class="row q-pb-md">
          <q-input label="Total" v-model="total" readonly bg-color="grey-4" />
        </div>
        <div class="row q-gutter-md">
          <q-input filled v-model="description" label="Description" />
          <q-input filled type="date" v-model="date" label="Date" />
          <q-input filled v-model="price" label="Price" />
          <q-btn
            @click="registerPayment"
            label="Register Payment"
            color="primary"
          />
        </div>
        <div class="row q-pt-lg">
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

export default defineComponent({
  name: 'PaymentsComponent',

  data() {
    return {
      description: ref<string>(),
      date: ref<string>(),
      price: ref<string>(),
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
    };
  },

  mounted() {
    this.getPaymentsPerUser();
  },

  methods: {
    async registerPayment(): Promise<void> {
      const user = getUsers();

      const newPayment: PaymentModel = {
        description: this.description ?? '',
        date: this.date ?? '',
        price: this.price ?? '',
        userId: user.userId,
      };

      const paymentsRef = collection(db, 'Payments');

      addDoc(paymentsRef, newPayment).then((callback) => {
        console.log('New Payment Add', callback);
        this.getPaymentsPerUser();
        this.clearFields();
      });
    },

    async getPaymentsPerUser(): Promise<void> {
      this.rows = [];
      const user = getUsers();
      const payments = collection(db, 'Payments');
      const q = query(payments, where('userId', '==', user.userId));

      getDocs(q).then((query) => {
        query.forEach((user) => {
          const responsePayment: PaymentModel = {
            description: user.data().description,
            date: user.data().date,
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
      this.price = null;
    },

    getTotal(): void {
      this.total = Calculation.getTotalPrice(this.rows);
    },
  },
});
</script>
