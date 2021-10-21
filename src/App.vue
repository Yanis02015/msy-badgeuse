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

    <v-main class="background-color-main pa-0">
      <v-dialog-transition>
        <router-view />
      </v-dialog-transition>
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
              @click="
                () => {
                  liveCardVisibility = !liveCardVisibility;
                  goToEnd();
                }
              "
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
        <v-card flat tile v-for="(item, index) in listLiveCard" :key="index">
          <v-list-item
            :class="item.starting ? 'green lighten-5' : 'red lighten-5'"
            dense
            @click="() => {}"
          >
            <v-list-item-avatar>
              <v-img :src="item.avatar" :alt="item.name" />
            </v-list-item-avatar>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.name + " " + item.lastname }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-icon size="19" class="mr-1">{{
                  item.starting ? "mdi-redo" : "mdi-exit-run"
                }}</v-icon>
                {{ item.date }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn color="" icon plain>
                <v-icon>mdi-information</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <v-divider></v-divider>
        </v-card>
      </v-list>
    </v-card>

    <!-- dialog & notification -->

    <v-card>
      <v-dialog v-model="newCard.dialogCard" persistent max-width="490">
        <v-card v-if="adminIsLogin">
          <v-card-title class="text-h5">
            <v-icon size="30" color="black" class="mr-2"
              >mdi-access-point-plus</v-icon
            >
            Nouvelle carte détectée !
          </v-card-title>
          <v-card-text>
            Une nouvelle carte a était detectée, voulais-vous la sauvegarder ?
            <br />
            code de la carte : {{ newCard.idCard }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error darken-1"
              text
              plain
              @click="newCard.dialogCard = false"
            >
              Non
            </v-btn>
            <v-btn
              color="primary darken-1"
              text
              @click="
                () => {
                  newCard.acceptAdding = true;
                  newCard.dialogCard = false;
                }
              "
            >
              Oui, ajouter cette carte
            </v-btn>
          </v-card-actions>
        </v-card>

        <v-card v-else>
          <v-card-title class="text-h5">
            <v-icon size="30" color="black" class="mr-2"
              >mdi-access-point-plus</v-icon
            >
            Nouvelle carte détectée !
          </v-card-title>
          <v-card-text>
            Veuillez vous connecter en tant qu’administrateur et réessayer pour
            pouvoir sauvegarder une nouvelle carte
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary darken-1"
              text
              @click="newCard.dialogCard = false"
            >
              Compris
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog
        v-model="cardInactive.model"
        persistent
        max-width="400px"
        transition="dialog-transition"
      >
        <v-card>
          <v-card-title class="text-h5">
            <v-icon size="30" color="black" class="mr-2">mdi-alert</v-icon>
            Supprimer la carte ?
          </v-card-title>
          <v-card-text>
            <span v-if="!cardInactive.status" class="error--text font-weight-medium">
              En acceptant, vous allez définir l'employé
              <span class="font-weight-black black--text">
                -
                {{
                  cardInactive.model
                    ? cardInactive.name + " " + cardInactive.lastname
                    : ""
                }}
                -
              </span>
              comme étant inactive, ne fais plus partie de l'entreprise.
            </span>
            <span v-else class="primary--text font-weight-medium">
              En continuant, vous allez réstorer l'employé
              <span class="font-weight-black black--text">
                -
                {{
                  cardInactive.model
                    ? cardInactive.name + " " + cardInactive.lastname
                    : ""
                }}
                -
              </span>
              et le définir comme étant active au saint l'entreprise.
            </span>
            <br />
            <br />
            Est-vous sûr de vouloir continuer ?
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error darken-1"
              plain
              text
              @click="
                () => {
                  setCardInactive({});
                }
              "
            >
              Annuler
            </v-btn>
            <v-btn color="primary darken-1" text @click="makeEmployeInactive">
              Continuer
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- New card -->

      <v-dialog v-model="newCard.acceptAdding" persistent max-width="750">
        <v-avatar size="90" color="red" class="avatar-new-employe-top">
          <v-icon size="45" color="black">mdi-account-plus</v-icon>
        </v-avatar>
        <v-card scrollable class="pa-3 rounded-lg">
          <v-form
            :disabled="newCard.loading"
            @submit.prevent="submitNewCardForm"
            v-model="newCard.validation"
            ref="newCardForm"
          >
            <v-card-title class="text-center mb-2 mt-5" primary-title>
              <span class="ma-auto text-h5 font-weight-bold">
                Profile du nouvelle employé
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      @send-value="(e) => (newCard.name = e.value)"
                      required
                      label="Nom*"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      @send-value="(e) => (newCard.lastname = e.value)"
                      required
                      label="Prénom*"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      @send-value="(e) => (newCard.email = e.value)"
                      label="E-Mail"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      @send-value="(e) => (newCard.phoneNumber = e.value)"
                      label="Numéro de téléphone"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12">
                    <v-slide-group
                      v-model="newCard.avatarIndex"
                      class="mb-5"
                      active-class="primary lighten-2"
                      show-arrows
                    >
                      <v-slide-item
                        v-for="item in randomAvatarList"
                        :key="item"
                        :ripple="false"
                        v-slot="{ active, toggle }"
                      >
                        <v-card
                          :color="active ? undefined : 'grey lighten-4'"
                          class="ma-3 rounded-circle"
                          height="90"
                          width="90"
                          @click="toggle"
                        >
                          <v-avatar size="100%">
                            <v-img contain :src="item" />
                          </v-avatar>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12">
                    <v-textarea
                      no-resize
                      v-model="newCard.address"
                      class="rounded-lg"
                      outlined
                      rows="3"
                      label="Adresse"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" sm="6">
                    <v-select
                      class="rounded-lg"
                      v-model="newCard.yearBirth"
                      outlined
                      :items="yearList"
                      label="Année de naissance"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" sm="6">
                    <v-autocomplete
                      class="rounded-lg"
                      v-model="newCard.role"
                      outlined
                      :items="['Chauffeur']"
                      label="Fonction"
                    ></v-autocomplete>
                  </v-col>
                  <v-scroll-x-transition>
                    <v-col
                      v-if="newCard.role === 'Chauffeur'"
                      class="my-0 py-0"
                      cols="12"
                      md="4"
                    >
                      <TextField
                        @send-value="
                          (e) => (newCard.vehicle.matricule = e.value)
                        "
                        label="Matricule du véhicule*"
                        :required="newCard.role === 'Chauffeur'"
                      ></TextField>
                    </v-col>
                  </v-scroll-x-transition>

                  <v-scroll-x-transition>
                    <v-col
                      v-if="newCard.role === 'Chauffeur'"
                      class="my-0 py-0"
                      cols="3"
                      md="3"
                    >
                      <v-select
                        class="rounded-lg"
                        v-model="newCard.vehicle.date"
                        outlined
                        :items="yearList"
                        label="Année du véhicule"
                        required
                      ></v-select>
                    </v-col>
                  </v-scroll-x-transition>

                  <v-scroll-x-transition>
                    <v-col
                      v-if="newCard.role === 'Chauffeur'"
                      class="my-0 py-0"
                      cols="9"
                      md="5"
                    >
                      <TextField
                        @send-value="
                          (e) => (newCard.vehicle.description = e.value)
                        "
                        label="Description du véhicule"
                      ></TextField>
                    </v-col>
                  </v-scroll-x-transition>
                </v-row>
              </v-container>
              <small>*indique un champ obligatoire</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                plain
                @click="resetNewCard"
                :disabled="newCard.loading"
              >
                Annuler
              </v-btn>
              <v-btn
                color="blue darken-1"
                :loading="newCard.loading"
                type="submit"
                text
              >
                Confirmer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>

      <!-- TO UPDATE -->

      <v-dialog v-model="editCard.model" :persistent="false" max-width="750">
        <v-avatar size="90" color="red" class="avatar-new-employe-top">
          <v-icon size="45" color="black">mdi-account-edit</v-icon>
        </v-avatar>
        <v-card scrollable class="pa-3 rounded-lg">
          <v-form
            :disabled="editCard.loading"
            @submit.prevent="submitEditCardForm"
            v-model="editCard.validation"
            ref="editCardForm"
          >
            <v-card-title class="text-center mb-2 mt-5" primary-title>
              <span class="ma-auto text-h5 font-weight-bold">
                Modifier les informations de :
                {{
                  editCard.model
                    ? editCard.lastname.charAt(0) + ". " + editCard.name
                    : ""
                }}
              </span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      ref="nameEmploye"
                      @send-value="(e) => (editCard.name = e.value)"
                      :content="editCard.name"
                      required
                      label="Nom*"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      ref="lastnameEmploye"
                      @send-value="(e) => (editCard.lastname = e.value)"
                      :content="editCard.lastname"
                      required
                      label="Prénom*"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      ref="emailEmploye"
                      @send-value="(e) => (editCard.email = e.value)"
                      :content="editCard.email"
                      label="E-Mail"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" md="6">
                    <TextField
                      ref="phoneNumberEmploye"
                      @send-value="(e) => (editCard.phoneNumber = e.value)"
                      :content="editCard.phoneNumber"
                      label="Numéro de téléphone"
                    ></TextField>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12">
                    <v-slide-group
                      v-model="editCard.avatarIndex"
                      class="mb-5"
                      active-class="primary lighten-2"
                      show-arrows
                    >
                      <v-slide-item
                        v-for="item in randomAvatarList"
                        :key="item"
                        :ripple="false"
                        v-slot="{ active, toggle }"
                      >
                        <v-card
                          :color="active ? undefined : 'grey lighten-4'"
                          class="ma-3 rounded-circle"
                          height="90"
                          width="90"
                          @click="toggle"
                        >
                          <v-avatar size="100%">
                            <v-img contain :src="item" />
                          </v-avatar>
                        </v-card>
                      </v-slide-item>
                    </v-slide-group>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12">
                    <v-textarea
                      no-resize
                      v-model="editCard.address"
                      class="rounded-lg"
                      outlined
                      rows="3"
                      label="Adresse"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" sm="6">
                    <v-select
                      class="rounded-lg"
                      v-model="editCard.yearBirth"
                      outlined
                      :items="yearList"
                      label="Année de naissance"
                      required
                    ></v-select>
                  </v-col>
                  <v-col class="my-0 py-0" cols="12" sm="6">
                    <v-autocomplete
                      class="rounded-lg"
                      v-model="editCard.role"
                      outlined
                      disabled
                      :items="['Chauffeur']"
                      label="Fonction"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
              <small>*indique un champ obligatoire</small>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="error"
                text
                plain
                @click="resetEditCard"
                :disabled="editCard.loading"
              >
                Annuler
              </v-btn>
              <v-btn
                color="blue darken-1"
                :loading="editCard.loading"
                type="submit"
                text
              >
                Confirmer
              </v-btn>
            </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
    </v-card>

    <v-alert
      max-width="320"
      border="left"
      dismissible
      v-model="snackbar"
      class="alert-top-right"
      :type="alert.type"
      transition="slide-x-reverse-transition"
    >
    </v-alert>

    <v-snackbar
      transition="slide-x-reverse-transition"
      v-model="alert.model"
      :color="alert.type"
    >
      {{ alert.text }}
      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
          text
          v-bind="attrs"
          @click="
            setAlert({ model: false, type: alert.type, text: alert.text })
          "
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import TextField from "./components/TextField";
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";

export default {
  name: "App",
  data: () => ({
    snackbar: false,
    navigationButtonSelected: 0,
    liveCardVisibility: true,
    listLiveCard: [],
    newCard: {
      dialogCard: false,
      acceptAdding: false,
      validation: null,
      loading: false,
      avatarIndex: 0,
      idCard: "",
      name: "",
      lastname: "",
      email: "",
      phoneNumber: "",
      address: "",
      yearBirth: null,
      role: "",
      vehicle: {
        matricule: "",
        date: null,
        description: "",
      },
    },
    editCard: {},
    randomAvatarList: [
      "./images/default-avatar.png",
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Wayfarers&hairColor=Auburn&facialHairType=BeardMedium&facialHairColor=Blonde&clotheType=GraphicShirt&clotheColor=Red&graphicType=Skull&eyeType=Surprised&eyebrowType=SadConcerned&mouthType=Serious&skinColor=Light",
      "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortWaved&accessoriesType=Prescription01&hairColor=Red&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=BlazerShirt&clotheColor=Gray02&graphicType=Pizza&eyeType=Side&eyebrowType=RaisedExcitedNatural&mouthType=Default&skinColor=Yellow",
      "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairFrizzle&accessoriesType=Round&hairColor=SilverGray&facialHairType=BeardMajestic&facialHairColor=Blonde&clotheType=BlazerShirt&eyeType=Default&eyebrowType=Angry&mouthType=Grimace&skinColor=Brown",
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairDreads&accessoriesType=Round&hairColor=Black&facialHairType=BeardMajestic&facialHairColor=BrownDark&clotheType=CollarSweater&clotheColor=PastelOrange&eyeType=Close&eyebrowType=RaisedExcited&mouthType=Grimace&skinColor=Tanned",
      "https://avataaars.io/?avatarStyle=Transparent&topType=Hat&accessoriesType=Prescription01&facialHairType=MoustacheFancy&facialHairColor=Blonde&clotheType=BlazerSweater&eyeType=Surprised&eyebrowType=DefaultNatural&mouthType=Sad&skinColor=Light",
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairNotTooLong&accessoriesType=Wayfarers&hairColor=Red&facialHairType=Blank&facialHairColor=Brown&clotheType=ShirtCrewNeck&clotheColor=PastelBlue&eyeType=Cry&eyebrowType=SadConcernedNatural&mouthType=ScreamOpen&skinColor=DarkBrown",
      "https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairTheCaesar&accessoriesType=Round&hairColor=PastelPink&facialHairType=BeardMajestic&facialHairColor=Platinum&clotheType=Hoodie&clotheColor=Pink&eyeType=Cry&eyebrowType=RaisedExcitedNatural&mouthType=Smile&skinColor=Light",
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairStraight&accessoriesType=Prescription02&hairColor=Platinum&facialHairType=MoustacheFancy&facialHairColor=Red&clotheType=ShirtScoopNeck&clotheColor=PastelGreen&eyeType=Close&eyebrowType=RaisedExcited&mouthType=Disbelief&skinColor=Black",
      "https://avataaars.io/?avatarStyle=Transparent&topType=LongHairFro&accessoriesType=Blank&hairColor=Red&facialHairType=BeardMajestic&facialHairColor=Blonde&clotheType=BlazerSweater&clotheColor=White&eyeType=Dizzy&eyebrowType=FlatNatural&mouthType=Twinkle&skinColor=Light",
    ],
    loadingToChangeView: false,
    dialogAddNewCard: true,
  }),
  methods: {
    ...mapActions([
      "clearUserInformations",
      "setAlert",
      "setEditCardModel",
      "setCardInactive",
    ]),
    goToEnd() {
      setTimeout(() => {
        var liveCardScroll = this.$el.querySelector("#list-live-card-scroll");
        if (this.liveCardVisibility)
          liveCardScroll.scrollTop = liveCardScroll.scrollHeight;
      }, 40);
    },
    logOut() {
      this.loadingToChangeView = true;
      setTimeout(() => {
        this.$router.replace("/");
        this.clearUserInformations();
      }, 200);
    },
    submitNewCardForm() {
      this.$refs.newCardForm.validate();
      if (this.newCard.validation) {
        this.newCard.loading = true;

        ipcRenderer.send("add-new-card-event", {
          token: this.userInformations.token,
          employe: this.cardInformationToAdd,
          vehicle: this.newCard.vehicle,
        });
        ipcRenderer.once("add-new-card-response", (event, args) => {
          this.newCard.loading = false;
          if (args.status) {
            this.resetNewCard();
            this.$refs.newCardForm.reset();

            // Actualiser le tableau dans le Dashboard
            ipcRenderer.send("show-all-user-event", {
              token: this.userInformations.token,
            });
          }
        });
      }
    },
    submitEditCardForm() {
      this.$refs.editCardForm.validate();
      if (this.editCard.validation) {
        this.editCard.loading = true;

        ipcRenderer.send("edit-employe-event", {
          token: this.userInformations.token,
          employe: this.cardInformationToEdit,
        });
        ipcRenderer.once("edit-employe-replay", (event, args) => {
          this.editCard.loading = false;
          if (args.status) {
            this.resetEditCard();
            this.$refs.editCardForm.reset();

            // Actualiser le tableau dans le Dashboard
            ipcRenderer.send("show-all-user-event", {
              token: this.userInformations.token,
            });
          }
        });
      }
    },
    makeEmployeInactive() {
      if (this.cardInactive) {
        ipcRenderer.send("set-employe-inactive-event", {
          token: this.userInformations.token,
          employe: this.cardInactive,
        });
        ipcRenderer.once("employe-inactive-replay", (event, args) => {
          if (args.status) {
            this.setCardInactive({});

            // Actualiser le tableau dans le Dashboard
            ipcRenderer.send("show-all-user-event", {
              token: this.userInformations.token,
            });
          }
        });
      }
    },
    resetNewCard() {
      this.$refs.newCardForm.reset();
      this.newCard = {
        dialogCard: false,
        acceptAdding: false,
        validation: null,
        loading: false,
        avatarIndex: 0,
        idCard: "",
        name: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        address: "",
        yearBirth: null,
        role: "",
        vehicle: {
          matricule: "",
          date: null,
          description: "",
        },
      };
    },
    resetEditCard() {
      this.$refs.editCardForm.reset();
      this.editCard = {};
    },
    capitalizeFirstLetter(string) {
      return string ? string.charAt(0).toUpperCase() + string.slice(1) : string;
    },
  },
  mounted() {
    this.goToEnd();
    if (!this.adminIsLogin && this.$route.fullPath !== "/") {
      this.$router.replace("/");
    }
    ipcRenderer.on("send-card-data", (event, args) => {
      this.listLiveCard.push(args);
    });
    ipcRenderer.on("new-card", (event, args) => {
      this.newCard.dialogCard = true;
      this.newCard.idCard = args;
    });
    ipcRenderer.on("alert-event", (event, args) => {
      this.setAlert(args);
      setTimeout(() => {
        this.setAlert({ model: false });
      }, 2000);
    });
  },
  watch: {
    listLiveCard() {
      this.goToEnd();
    },
    editCardModel() {
      this.editCard = this.editCardModel;
      this.editCard.avatarIndex = this.randomAvatarList.indexOf(
        this.editCard.avatarIndex
      );
      setTimeout(() => {
        this.$refs.nameEmploye.value = this.editCard.name;
        this.$refs.lastnameEmploye.value = this.editCard.lastname;
        this.$refs.emailEmploye.value = this.editCard.email;
        this.$refs.phoneNumberEmploye.value = this.editCard.phoneNumber;
      }, 50);
    },
  },
  computed: {
    ...mapState([
      "adminIsLogin",
      "userInformations",
      "alert",
      "editCardModel",
      "cardInactive",
    ]),
    router() {
      return this.$route.fullPath;
    },
    itLoginPage() {
      return this.$route.fullPath === "/";
    },
    yearList() {
      let date = new Date().getFullYear();
      let listDate = [];
      for (let i = date; i > 1900; i--) listDate.push(i);
      return listDate;
    },
    cardInformationToAdd() {
      return {
        idCard: this.newCard.idCard,
        name: this.newCard.name.toUpperCase(),
        lastname: this.capitalizeFirstLetter(this.newCard.lastname),
        phoneNumber: this.newCard.phoneNumber,
        address: this.capitalizeFirstLetter(this.newCard.address),
        yearBirth: this.newCard.yearBirth,
        email: this.newCard.email.toLowerCase(),
        role: this.newCard.role,
        avatar: this.randomAvatarList[this.newCard.avatarIndex],
      };
    },
    cardInformationToEdit() {
      return {
        idCard: this.editCard.idEmploye,
        name: this.editCard.name.toUpperCase(),
        lastname: this.capitalizeFirstLetter(this.editCard.lastname),
        phoneNumber: this.editCard.phoneNumber,
        address: this.capitalizeFirstLetter(this.editCard.address),
        yearBirth: this.editCard.yearBirth,
        email: this.editCard.email.toLowerCase(),
        role: this.capitalizeFirstLetter(this.editCard.role),
        avatar: this.randomAvatarList[this.editCard.avatarIndex],
      };
    },
  },
  components: {
    TextField,
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners("send-card-data");
    ipcRenderer.removeAllListeners("new-card");
    ipcRenderer.removeAllListeners("alert-event");
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

.alert-top-right {
  z-index: 99;
  position: fixed;
  bottom: 0;
  left: 40%;
}

.avatar-new-employe-top {
  z-index: 98;
  position: absolute;
  background-color: white !important;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
