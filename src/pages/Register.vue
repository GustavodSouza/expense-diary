<template>
  <div class="row full-height">
    <q-card
      class="my-card"
      style="width: 50% !important; height: 50% !important"
    >
      <q-card-section>
        <span class="text-subtitle2">Register</span>
      </q-card-section>
      <q-card-section>
        <div class="row column q-gutter-md">
          <q-input filled v-model="name" label="Name" />
          <q-input filled v-model="mail" label="Mail" />
          <q-input filled v-model="password" label="Password" />
          <q-btn @click="finalizeRegister" label="Registrar" color="primary" />
          <router-link to="/login"
            ><q-btn label="Voltar" color="secondary"
          /></router-link>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { db } from 'src/boot/firebase';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { UserModel } from 'src/models/User';

export default defineComponent({
  name: 'RegisterComponent',

  data() {
    return {
      name: ref<string>(''),
      mail: ref<string>(''),
      password: ref<string>(''),
    };
  },

  methods: {
    async finalizeRegister(): Promise<void> {
      const auth = getAuth();
      const response = await createUserWithEmailAndPassword(
        auth,
        this.mail,
        this.password
      );

      const newUser: UserModel = {
        userId: response.user?.uid,
        name: this.name,
        mail: response.user?.email ?? '',
      };

      this.saveUserInfo(newUser);
    },

    async saveUserInfo(newUser: UserModel): Promise<void> {
      const usersRef = db.collection('Users');
      const newDocument = usersRef.doc(newUser.userId);
      await newDocument.set(newUser);
    },
  },
});
</script>
