<template>
  <v-container fluid class="container-background">
    <v-card
      class="card-center rounded-lg text-center px-4"
      flat
      width="450"
      height="370"
    >
      <v-avatar class="avatar-login-top grey" size="90" color="red">
        <v-icon v-if="!adminIsLogin" color="black" size="45"
          >mdi-account</v-icon
        >
        <v-icon v-else color="black" size="45">mdi-account-check</v-icon>
      </v-avatar>
      <v-card-title class="text-center pb-2 mt-7" primary-title>
        <span v-if="adminIsLogin" class="mx-auto">Bienvenue</span>
        <span v-else class="mx-auto">Se connecter</span>
      </v-card-title>

      <v-form
        @submit.prevent="submitLoginForm"
        v-if="!adminIsLogin"
        ref="loginForm"
        class="mt-0 pt-0"
        v-model="loginInputValidation"
      >
        <v-card-text>
          <TextField
            required
            @send-value="(e) => (login = e.value)"
            type="text"
            label="Nom d'authentification"
            startIcon="mdi-account-outline"
            :loading="loading"
          />
          <TextField
            required
            @send-value="(e) => (password = e.value)"
            startIcon="mdi-lock-outline"
            label="Mot de passe"
            type="password"
            :loading="loading"
          />
          <v-card-text
            class="text-left error--text ma-0 pa-0"
            v-html="errorMessage"
          />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="rounded-lg pa-6 font-weight-bold"
              elevation="0"
              type="submit"
              color="primary"
              :loading="loading"
            >
              Se connecter
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>

      <v-card v-else-if="!beforeConnexion" flat class="mx-auto mt-12">
        <v-progress-circular
          :size="70"
          :width="4"
          color="primary"
          indeterminate
        ></v-progress-circular>
        <v-card-text class="subtitle-2 mt-3">
          Chargement...
        </v-card-text>
      </v-card>
    </v-card>
  </v-container>
</template>

<script>
import TextField from "../components/TextField";
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";

export default {
  data: () => ({
    login: "",
    password: "",
    loading: false,
    beforeConnexion: false,
    loginInputValidation: null,
    requiredRules: [(v) => !!v || "Name is required"],
    errorMessage: "&nbsp;",
  }),

  mounted() {
    if (this.adminIsLogin) {
      this.loginToDashboard();
    }
  },

  components: {
    TextField,
  },

  methods: {
    ...mapActions(["setUserInformations", "setUserLoginStatus"]),
    submitLoginForm() {
      this.$refs.loginForm.validate();
      if (this.loginInputValidation) {
        this.errorMessage = "&nbsp;";
        this.loading = true;
        ipcRenderer.send("form-login-submission-event", {
          login: this.login,
          password: this.password,
        });
        ipcRenderer.once("form-login-response", (event, arg) => {
          console.log(arg);
          if (arg.errorMessage) {
            this.errorMessage =
              "Erreur d'authentification, " + arg.errorMessage;
            this.loading = false;
          } else {
            this.errorMessage = "Connexion réussi";
            this.setUserInformations(arg);
            this.loginToDashboard();
          }
        });
      }
    },
    loginToDashboard() {
      this.beforeConnexion = false;
      this.loading = false;
      this.setUserLoginStatus(true);
      setTimeout(() => {
        this.$router.replace("/dashboard");
        this.beforeConnexion = true;
      }, 1000);
    },
  },
  computed: {
    ...mapState(["adminIsLogin", "userInformations"]),
  },
  destroyed() {},
};
</script>

<style scoped>
.container-background {
  height: 100%;
  background-image: url("/images/background-login.jpeg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  backdrop-filter: blur(100px);
}

.card-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.smooth-tansition {
  transition: all 3s ease;
}

.avatar-login-top {
  z-index: 99;
  position: absolute;
  background-color: white !important;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
