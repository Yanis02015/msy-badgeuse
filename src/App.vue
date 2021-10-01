<template>
  <v-app>
    <v-app-bar v-if="false" app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-card
      id="live-card"
      flat
      :class="liveCardVisibility ? '' : 'transparent'"
      class="rounded-lg"
      max-width="270"
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

        <v-spacer v-if="true"></v-spacer>

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
          <span> {{ liveCardVisibility ? 'Réduire' : 'Agrandir' }} </span>
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
              <img :src="item.image" alt="John" />
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
export default {
  name: "App",
  data: () => ({
    liveCardVisibility: true,
    listLiveCard: [
      {
        name: "OULHACI",
        lastname: "Yanis",
        date: "25/10/2021 08:22",
        image:
          "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairDreads01&accessoriesType=Sunglasses&hairColor=Red&facialHairType=MoustacheFancy&facialHairColor=Black&clotheType=GraphicShirt&clotheColor=Heather&graphicType=Selena&eyeType=Dizzy&eyebrowType=UpDown&mouthType=Serious&skinColor=Light",
        status: true,
      },
      {
        name: "IBOUDGHACENE",
        lastname: "Salah",
        date: "25/10/2021 08:11",
        image:
          "https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Blank&facialHairType=BeardMedium&facialHairColor=Black&clotheType=BlazerSweater&eyeType=Side&eyebrowType=Default&mouthType=Serious&skinColor=DarkBrown",
        status: false,
      },
      {
        name: "OULHACI",
        lastname: "Yanis",
        date: "25/10/2021 14:35",
        image:
          "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairDreads01&accessoriesType=Sunglasses&hairColor=Red&facialHairType=MoustacheFancy&facialHairColor=Black&clotheType=GraphicShirt&clotheColor=Heather&graphicType=Selena&eyeType=Dizzy&eyebrowType=UpDown&mouthType=Serious&skinColor=Light",
        status: true,
      },
      {
        name: "IBOUDGHACENE",
        lastname: "Salah",
        date: "25/10/2021 16:02",
        image:
          "https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Blank&facialHairType=BeardMedium&facialHairColor=Black&clotheType=BlazerSweater&eyeType=Side&eyebrowType=Default&mouthType=Serious&skinColor=DarkBrown",
        status: false,
      },
    ],
  }),
  methods: {
    goToEnd() {
      var liveCardScroll = this.$el.querySelector("#list-live-card-scroll");
      liveCardScroll.scrollTop = liveCardScroll.scrollHeight;
    },
    addItem() {
      this.listLiveCard.push({
        name: "NEW",
        lastname: "ITEM",
        date: "24/02/2022",
        image:
          "https://avataaars.io/?avatarStyle=Circle&topType=Turban&accessoriesType=Round&hatColor=White&facialHairType=MoustacheMagnum&facialHairColor=BlondeGolden&clotheType=Hoodie&clotheColor=White&eyeType=Surprised&eyebrowType=FlatNatural&mouthType=Tongue&skinColor=Light",
        status: false,
      });
    },
  },
  mounted() {
    this.goToEnd();
  },
  watch: {
    listLiveCard() {
      setTimeout(() => {
        this.goToEnd();
      }, 50);
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
</style>
