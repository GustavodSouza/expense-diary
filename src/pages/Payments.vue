<template>
  <q-layout view="lHh lpr lFf" container style="height: 100vh" class="shadow-2">
    <q-page-container>
      <q-page class="q-pa-md">
        <h5>Register New Payment</h5>
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

export default defineComponent({
  name: 'PaymentsComponent',

  data() {
    return {
      description: ref<string>(),
      date: ref<string>(),
      price: ref<number>(),
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
        price: this.price ?? 0,
        userId: user.userId,
      };

      const paymentsRef = collection(db, 'Payments');

      addDoc(paymentsRef, newPayment)
        .then((callback) => {
          console.log('New Payment Add', callback);
        })
        .then(() => this.getPaymentsPerUser());
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
          console.log('Payload', user.data());
        });
      });
    },
  },
});
</script>
