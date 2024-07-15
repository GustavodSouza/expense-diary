<template>
  <div>
    <q-layout view="hHh Lpr lff" container style="height: 100vh">
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-btn flat @click="drawer = !drawer" round dense icon="menu" />
          <q-toolbar-title>Expense Diary</q-toolbar-title>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        :width="200"
        :breakpoint="500"
        bordered
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <q-scroll-area class="fit full-height" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <q-item
              v-for="(menu, index) in Menu"
              :key="index"
              :active="currentPath === menu.to"
              clickable
              v-ripple
              @click="navigateTo(menu.to)"
            >
              <q-item-section avatar>
                <q-icon :name="menu.icon" />
              </q-item-section>

              <q-item-section>
                {{ menu.label }}
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              @click="exitSystem"
            >
              <q-item-section avatar>
                <q-icon :name="fasArrowRightFromBracket" />
              </q-item-section>

              <q-item-section>
                Exit System
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <router-view />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from 'vue';
import Menu from 'src/models/Menu'
import { useRoute, useRouter } from 'vue-router';
import { fasArrowRightFromBracket } from '@quasar/extras/fontawesome-v6'

export default defineComponent({
  name: 'MainLayout',

  setup () {
    const router = useRouter();
    const route = useRoute();
    const currentPath = ref(route.path);

    watch(() => route.path, (newPath) => {
      currentPath.value = newPath;
    });

    const navigateTo = (path: string) => {
      router.push(path);
    };

    onMounted(() => {
      currentPath.value = route.path;
    });

    const exitSystem = () => {
      localStorage.removeItem('user')
      router.push('/login')
    };

    return {
      drawer: ref(false),
      miniState: ref(true),
      currentPath,
      navigateTo,
      Menu,
      exitSystem,
      fasArrowRightFromBracket
    };
  },
});
</script>
