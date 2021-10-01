<template>
  <v-container fluid class="container-background">
    <v-img src=""/>
    <v-card class="login-card-center rounded-lg text-center" flat width="400">
      <v-form ref="form" v-model="valid">
        <v-avatar class="avatar-login-top grey" size="90" color="red">
          <v-icon color="black" size="45">mdi-account-check</v-icon>
        </v-avatar>

        <v-card-title class="text-center" primary-title>
          <span class="mx-auto mt-7">Se Connecter</span>
        </v-card-title>

        <v-card-text>
          <TextField
            @send-value="(e) => (login = e.value)"
            type="text"
            label="Nom d'authentification"
            startIcon="mdi-account-outline"
          />
          <TextField
            @send-value="(e) => (password = e.value)"
            startIcon="mdi-lock-outline"
            label="Mot de passe"
            type="password"
          />
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="rounded-lg"
              elevation="0"
              color="primary"
              @click="submitForm"
            >
              Se connecter
            </v-btn>
          </v-card-actions>
        </v-card-text>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
import TextField from "../components/TextField";
import { ipcRenderer } from "electron";


export default {
  name: "Home",
  data: () => ({
    login: "",
    password: "",
    valid: null,
    requiredRules: [(v) => !!v || "Name is required"],
  }),

  components: {
    TextField,
  },

  methods: {
    loginAction() {
      this.$refs.form.validate();
    },
    submitForm() {
      ipcRenderer.send("form-submission-event", {login: this.login, password: this.password});
      ipcRenderer.once('form-response', (event, arg) => {
        console.log(arg);
      })
    },
  },
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

.login-card-center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}

.avatar-login-top {
  z-index: 99;
  position: absolute;
  background-color: white !important;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
