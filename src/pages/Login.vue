<template>
  <div class="row full-height">
    <q-card
      class="col-md-4 col-sm-12 col-xs-12 q-mt-md"
      style="height: 50% !important"
    >
      <q-card-section>
        <span class="text-subtitle2">Login</span>
      </q-card-section>
      <q-card-section>
        <div class="row column q-gutter-md">
          <q-input filled v-model="mail" label="Mail" />
          <q-input filled v-model="password" label="Password" />
          <q-btn @click="login" label="Login" color="primary" />
          <router-link to="/register"
            ><q-btn class="full-width" label="Cadastre-se" color="secondary"
          /></router-link>
          <q-btn
            label="Login with Google"
            color="primary"
            @click="loginGoogle"
          />
          <q-btn label="Link Account" color="primary" @click="vincularConta" />
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { db } from 'src/boot/firebase';
import { setUsers } from 'src/services/StorageService';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { UserModel } from 'src/models/User';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  linkWithCredential,
} from 'firebase/auth';

export default defineComponent({
  name: 'LoginComponent',

  data() {
    return {
      mail: ref<string>(''),
      password: ref<string>(''),
    };
  },

  methods: {
    async login(): Promise<void> {
      this.$q.loading.show();
      const auth = getAuth();
      await signInWithEmailAndPassword(auth, this.mail, this.password)
        .then((response) => {
          this.getUserInfo(response.user?.uid ?? '');
          if (response) {
            this.$router.push('/payments');
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(this.$q.loading.hide);
    },

    async getUserInfo(userId: string): Promise<void> {
      const users = collection(db, 'Users');
      const q = query(users, where('userId', '==', userId));

      getDocs(q).then((query) => {
        query.forEach((user) => {
          const userResponse: UserModel = {
            name: user.data().name,
            mail: user.data().mail,
            userId: user.data().userId,
          };

          this.setUserInfoInStorage(userResponse);
        });
      });
    },

    setUserInfoInStorage(user: UserModel): void {
      setUsers(user);
    },

    async loginGoogle() {
      this.$q.loading.show();
      const googleAuthProvider = new GoogleAuthProvider();
      const auth = getAuth();

      await signInWithPopup(auth, googleAuthProvider)
        .then((response: any) => {
          const userResponse: UserModel = {
            name: response.user.displayName,
            mail: response.user.email,
            userId: response.user.uid,
          };

          this.setUserInfoInStorage(userResponse);
          this.$router.push('/payments');
        })
        .finally(this.$q.loading.hide);
    },

    async vincularConta() {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        const credential = EmailAuthProvider.credential(
          this.mail,
          this.password
        );
        try {
          await linkWithCredential(user, credential);
        } catch (error) {
          throw error;
        }
      } else {
        throw new Error('Usuário não autenticado');
      }
    },
  },
});
</script>
