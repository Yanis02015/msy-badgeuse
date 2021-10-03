<template>
  <v-app>
    <v-app-bar
      v-if="!itLoginPage"
      app
      color="blue lighten-1"
      dark
      elevate-on-scroll
      height="55"
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="/images/yanis-indt-logo.png"
          transition="scale-transition"
          width="35"
        />

        <v-list-item-content transition="scale-transition">
          <v-list-item-title
            style="font-size: 15px !important;"
            class="text-button font-weight-black mb-0 pb-0"
          >
            MSY - Corporation
          </v-list-item-title>
          <v-list-item-subtitle
            style="margin-top: -12px ;"
            class="text-subtitle-2"
          >
            Messaoud - Salah - Yanis
          </v-list-item-subtitle>
        </v-list-item-content>
      </div>

      <v-spacer></v-spacer>

      <v-menu bottom min-width="200px" flat offset-y>
        <template v-slot:activator="{ on }">
          <v-btn class="mr-1" icon small v-on="on">
            <v-avatar size="48">
              <v-icon>mdi-account-cog</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-card class="rounded-lg pb-0 mb-0">
          <v-list-item-content class="justify-center pb-0">
            <div class="mx-auto text-center">
              <v-avatar color="black">
                <v-icon color="white">mdi-account-cog</v-icon>
              </v-avatar>
              <h3 class="mt-3">Yanis OULHACI</h3>
              <p class="text-caption mt-1">
                yaniscrab@gmail.com
              </p>
              <v-divider></v-divider>
              <v-btn depressed width="100%" class="py-7" text>
                Paramètres
              </v-btn>
              <v-divider></v-divider>
              <v-btn depressed width="100%" class="py-7" text @click="logOut">
                Se déconnecter
              </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
    </v-app-bar>

    <!-- Bottom Navigation -->

    <v-bottom-navigation
      v-if="!itLoginPage"
      v-model="navigationButtonSelected"
      horizontal
      flat
      input-value
      mandatory
      color="primary"
      style="margin-top: 55px"
    >
      <v-btn to="/home">
        <span>Tableau de bord</span>

        <v-icon>mdi-desktop-mac-dashboard</v-icon>
      </v-btn>

      <v-btn to="/about">
        <span>Favorites</span>

        <v-icon>mdi-heart</v-icon>
      </v-btn>

      <v-btn>
        <span>Nearby</span>

        <v-icon>mdi-map-marker</v-icon>
      </v-btn>
    </v-bottom-navigation>

    <!-- -->

    <v-main class="background-color-main">
      <transition name="slide-fade">
        <router-view />
      </transition>
    </v-main>

    <!-- Stream card online -->

    <v-card
      id="live-card"
      :elevation-3="liveCardVisibility"
      :flat="!liveCardVisibility"
      :class="liveCardVisibility ? '' : 'transparent'"
      class="rounded-lg"
      width="270"
    >
      <v-toolbar
        flat
        :class="liveCardVisibility ? 'primary' : 'transparent'"
        class="ma-0"
        dark
        dense
      >
        <v-toolbar-title v-if="liveCardVisibility" class="subtitle-2"
          >Affichage en temps réel</v-toolbar-title
        >

        <v-spacer></v-spacer>

        <v-tooltip transition="slide-x-transition" bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              @click="liveCardVisibility = !liveCardVisibility"
              icon
              plain
              class="primary smooth-transition"
              :class="liveCardVisibility ? '' : 'pa-9 mb-15 mr-1'"
            >
              <v-icon size="35">
                {{
                  liveCardVisibility
                    ? "mdi-chevron-down"
                    : "mdi-arrow-top-left-bottom-right"
                }}
              </v-icon>
            </v-btn>
          </template>
          <span> {{ liveCardVisibility ? "Réduire" : "Agrandir" }} </span>
        </v-tooltip>
      </v-toolbar>

      <v-list
        v-if="liveCardVisibility"
        id="list-live-card-scroll"
        height="350"
        class="overflow-y-auto transparent pt-0"
        two-line
      >
        <v-card flat tile v-for="item in listLiveCard" :key="item.date">
          <v-list-item
            :class="item.status ? 'green lighten-5' : 'red lighten-5'"
            dense
            @click="() => {}"
          >
            <v-list-item-avatar>
              <v-img :src="item.image" alt="John" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name + " " + item.lastname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ item.date }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider></v-divider>
        </v-card>
      </v-list>
    </v-card>
  </v-app>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  data: () => ({
    navigationButtonSelected: 0,
    liveCardVisibility: true,
    listLiveCard: [],
    test: "",
    loadingToChangeView: false,
  }),
  methods: {
    ...mapActions(["clearUserInformations"]),
    goToEnd() {
      var liveCardScroll = this.$el.querySelector("#list-live-card-scroll");
      liveCardScroll.scrollTop = liveCardScroll.scrollHeight;
    },
    logOut() {
      this.loadingToChangeView = true;
      setTimeout(() => {
        this.$router.replace("/");
        this.clearUserInformations();
      }, 1000);
    },
  },
  mounted() {
    this.goToEnd();
    ipcRenderer.on("send-card-data", (event, args) => {
      this.listLiveCard.push(args);
    });
  },
  watch: {
    listLiveCard() {
      setTimeout(() => {
        this.goToEnd();
      }, 50);
    },
  },
  computed: {
    ...mapState(["adminIsLogin", "userInformations"]),
    router() {
      return this.$route.fullPath;
    },
    itLoginPage() {
      return this.$route.fullPath === "/";
    },
  },
};
</script>

<style scoped>
#live-card {
  opacity: 0.6;
  z-index: 99;
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 16px;
  transition: opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

#live-card:hover {
  opacity: 0.9;
}

.smooth-transition {
  transition: all 1s ease;
}

.background-color-main {
  background-color: #edf1fa;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(115px);
  opacity: 0;
}
</style>
