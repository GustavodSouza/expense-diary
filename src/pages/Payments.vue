<template>
  <q-page-container style="padding: 0px !important">
    <span class="text-h5">Register New Payment</span>
    <div class="row q-pb-md q-pt-md">
      <!-- <q-input class="col-md-2 col-xs-11" filled label="Total" v-model="total" disable bg-color="grey-4" /> -->
      <div class="card-total">
        {{ total }}
      </div>
    </div>
    <div class="row items-center q-gutter-md q-pr-md">
      <q-input
        class="col-md-2 col-xs-12"
        v-model="description"
        :rules="[
          (val) => val !== '' || 'Please insert the description of payment',
        ]"
        filled
        label="Description"
      />
      <q-input
        class="col-md-2 col-xs-12"
        v-model="date"
        :rules="[(val) => val !== '' || 'Please insert the date of payment']"
        filled
        type="date"
        label="Date"
      />
      <q-input
        class="col-md-2 col-xs-12"
        v-model.lazy="price"
        :rules="[(val) => val !== '' || 'Please insert the price of payment']"
        filled
        label="Price"
      />
      <q-input
        v-if="isObservationShow"
        class="col-md-2 col-xs-12"
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
        label="Register Payment"
        :color="formDisabled ? 'grey-7' : 'primary'"
        :disable="formDisabled"
        no-caps
        unelevated
        @click="registerPayment"
      >
        <q-tooltip v-if="formDisabled">
          <span>Fill the required form!</span>
        </q-tooltip>
      </q-btn>
    </div>
    <div class="row q-pt-lg">
      <q-input
        class="q-pb-md col-md-1 col-xs-12 col-sm-12"
        filled
        type="month"
        v-model="monthYearFilter"
        label="Filter Month and Year"
        @update:model-value="changeFilterDate"
      />
      <q-input
        class="q-pb-md q-md-ml-md col-md-3 col-xs-12 col-sm-12"
        filled
        type="text"
        v-model="searchTable"
        label="Search in the table"
      />
      <q-table
        class="full-width"
        :rows="rows"
        :columns="columns"
        table-header-style="background-color: #3988d6; color: #fff"
        separator="cell"
        :filter="searchTable"
      >
        <template #body="props">
          <q-tr>
            <q-td>
              {{ props.row.description }}
              <q-icon v-if="props.row.observation" name="warning">
                <q-tooltip>
                  <span>{{ props.row.observation }}</span>
                </q-tooltip>
              </q-icon>
            </q-td>
            <q-td>
              {{ props.row.date }}
            </q-td>
            <q-td>
              {{ formatPrice(props.row.price) }}
            </q-td>
            <q-td>
              <q-icon
                class="q-mr-md"
                name="menu"
                size="20px"
              />
              <q-menu fit>
                <q-list style="min-width: 100px">
                  <q-item class="items-center" clickable>
                    <q-icon
                      color="positive"
                      class="q-pr-sm"
                      size="18px"
                      name="edit"
                    />
                    <q-item-section @click="openModalEdit(props.row)"
                      >Edit</q-item-section
                    >
                  </q-item>
                  <q-separator />
                  <q-item class="items-center" clickable>
                    <q-icon
                      color="negative"
                      class="q-pr-sm"
                      size="18px"
                      name="delete"
                    />
                    <q-item-section @click="removePayment(props.row)"
                      >Remove</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </q-td>
          </q-tr>
        </template>
      </q-table>
      <ModalEdit ref="modalEdit" />
      <ModalConfirm ref="modalConfirm" />
    </div>
  </q-page-container>
</template>

<script lang="ts">
import { defineComponent, ref, shallowRef } from 'vue';
import { PaymentModel, PaymentsModel } from 'src/models/Payment';
import {
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from 'src/boot/firebase';
import { getUsers } from 'src/services/StorageService';
import Calculation from 'src/utils/Calculation';
import DateHelpers from 'src/helpers/date-helpers';
import formatMoneyHelpers from 'src/helpers/format-money-helpers';
import ModalEdit from 'src/components/dialog/ModalEdit.vue';
import ModalConfirm from 'src/components/dialog/ModalConfirm.vue';

export default defineComponent({
  name: 'PaymentsComponent',
  components: {
    ModalEdit,
    ModalConfirm,
  },
  data() {
    return {
      description: ref<string>(''),
      date: ref<string>(''),
      price: ref<string>(''),
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
        {
          name: 'acoes',
          align: 'left',
          label: 'Ações',
          field: 'acoes',
          sortable: false,
        },
      ],
      total: ref<string>('0'),
      monthYearFilter: ref(),
      searchTable: shallowRef<string>('')
    };
  },

  mounted() {
    this.getPaymentsPerUser();
    this.setCurrentDate();
  },

  computed: {
    formDisabled(): boolean {
      return this.description === '' || this.price === '' || this.date === '';
    },
  },

  methods: {
    async registerPayment(): Promise<void> {
      if (this.formDisabled) {
        return;
      } else {
        const user = getUsers();

        const newPayment: PaymentModel = {
          description: this.description ?? '',
          date: this.date ?? '',
          price: this.price ?? '',
          userId: user.userId,
          observation: this.observation ?? '',
        };

        const paymentsRef = collection(db, 'Payments');

        addDoc(paymentsRef, newPayment).then(() => {
          this.getPaymentsPerUser();
          this.clearFields();
        });
      }
    },

    async getPaymentsPerUser(): Promise<void> {
      const { year, month } = DateHelpers.getCurrentDateSplit();
      this.getPaymentsRequest(month, year);
    },

    async getPaymentsRequest(
      month: string,
      year: string | number
    ): Promise<void> {
      this.$q.loading.show();
      this.rows = [];
      this.total = 'R$ 0';
      const user = getUsers();
      const payments = collection(db, 'Payments');
      const q = query(
        payments,
        where('userId', '==', user.userId),
        where('date', '>=', `${year}-${month}-01`),
        where('date', '<', `${year}-${month}-30`)
      );

      getDocs(q)
        .then((query) => {
          query.forEach((payment) => {
            const responsePayment: PaymentModel = {
              description: payment.data().description,
              date: DateHelpers.maskDate(
                payment.data().date,
                DateHelpers.IFormatDate.BACK_SLASH_FORMAT
              ),
              price: payment.data().price,
              observation: payment.data().observation,
              paymentId: payment.id,
            };
            this.rows.push(responsePayment);
            this.getTotal();
          });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(this.$q.loading.hide);
    },

    clearFields(): void {
      this.description = '';
      this.date = '';
      this.price = '';
      this.observation = '';
      this.isObservationShow = false;
    },

    getTotal(): void {
      this.total = formatMoneyHelpers.formatBRMoney(
        Calculation.getTotalPrice(this.rows)
      );
    },

    setCurrentDate(): void {
      const { year, month } = DateHelpers.getCurrentDateSplit();
      this.monthYearFilter = `${year}-${month}`;
    },

    changeFilterDate(): void {
      const { year, month } = DateHelpers.splitDateFromParameter(
        this.monthYearFilter,
        DateHelpers.IFormatDate.TRACES_FORMAT
      );
      this.getPaymentsRequest(month, year);
    },

    openModalEdit(row: PaymentModel): void {
      this.$refs.modalEdit.openDialog(row).then((callback: PaymentModel) => {
        if (callback) {
          this.$q.loading.show();
          db.collection('Payments')
            .doc(callback.paymentId)
            .update(callback)
            .then(() => {
              this.getPaymentsPerUser();
            })
            .finally(this.$q.loading.hide);
        }
      });
    },

    formatPrice(value: number): string {
      return formatMoneyHelpers.formatBRMoney(value);
    },

    async removePayment(payment: PaymentModel): Promise<void> {
      const options = {
        title: 'Remove Payment',
        text: `Confirm '${payment.description}' payment removal?`,
      };

      this.$refs.modalConfirm
        .openDialog(options)
        .then(async (callback: boolean) => {
          if (callback) {
            this.$q.loading.show();
            const docRef = doc(db, 'Payments', payment.paymentId);
            await deleteDoc(docRef)
              .then(() => {
                this.getPaymentsPerUser();
              })
              .finally(this.$q.loading.hide);
          }
        });
    }
  },
});
</script>

<style lang="scss" scoped>
.card-total {
  background: rgb(194, 193, 193);
  width: 100px;
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
