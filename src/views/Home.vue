<template>
  <v-container grid-list-xs>
    <v-card class="ma-auto transparent mt-6 pa-0" flat width="400">
      <v-text-field
        v-model="searchEmploye"
        append-icon="mdi-magnify"
        label="Chercher un employé"
        placeholder="Nom ou Prénom..."
        class="rounded-pill"
        background-color="white"
        filled
        rounded
        hide-details
      ></v-text-field>
    </v-card>

    <!-- Tableau -->
    <v-data-table
      :headers="headersEmployeTable"
      :items="searchingEmploye"
      class="elevation-5 rounded-lg my-6"
      :item-class="customRowClass"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="font-weight-bold">Liste des tous les employés</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-switch
            v-model="switchModelInactive"
            label="Afficher les employés inactives"
            class="mt-2"
          ></v-switch>
        </v-toolbar>
      </template>
      <template v-slot:[`item.avatar`]="{ item }">
        <v-avatar class="my-1">
          <img :src="item.avatar" alt="avatar" />
        </v-avatar>
      </template>
      <template v-slot:[`item.name`]="{ item }">
        {{ item.name.toUpperCase() + " " + item.lastname }}
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn plain icon @click="editEmployeSelected(item)">
          <v-icon color="green darken-3">mdi-pencil</v-icon>
        </v-btn>

        <v-btn plain icon @click="deleteEmploye(item)">
          <v-icon :color="item.status ? 'red accent-2' : 'grey darken-3'">{{
            item.status ? "mdi-delete" : "mdi-delete-restore"
          }}</v-icon>
        </v-btn>

        <v-btn plain icon>
          <v-icon color="primary darken-3">mdi-information</v-icon>
        </v-btn>
      </template>

      <template v-slot:[`item.status`]="{ item }">
        <v-chip v-if="item.status" color="green" dark>
          {{ item.role }}
        </v-chip>
        <v-chip v-else color="grey lighten-1" dark>
          Inactive
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  data: () => ({
    listOfEmploye: [],
    switchModelInactive: false,
    headersEmployeTable: [
      {
        text: "Photo",
        align: "start",
        sortable: false,
        value: "avatar",
      },
      { text: "Nom complet", value: "name", sortable: true },
      { text: "Mobile", value: "phoneNumber", sortable: false },
      { text: "Email", value: "email", sortable: false },
      { text: "Status", value: "status", sortable: true, align: "center" },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    searchEmploye: "",
  }),
  computed: {
    ...mapState([
      "adminIsLogin",
      "userInformations",
      "alert",
      "editCardModel",
      "cardInactive",
    ]),
    searchingEmploye() {
      let listEmploye = this.listOfEmploye.filter((item) => {
        const status = this.switchModelInactive ? true : !!item.status;
        return status;
      });
      if (!this.searchEmploye) return listEmploye;

      const search = this.searchEmploye.toLowerCase();
      return listEmploye.filter((item) => {
        const name = (item.name.toLowerCase() + ' ' + item.lastname.toLowerCase()).indexOf(search) > -1
        const lastname = (item.lastname.toLowerCase() + ' ' + item.name.toLowerCase()).indexOf(search) > -1
        const role = item.role.toLowerCase().indexOf(search) > -1
        return name || lastname || role;
      });
    },
  },
  methods: {
    ...mapActions(["setEditCardModel", "setCardInactive"]),
    showAllEmploye() {
      ipcRenderer.send("show-all-user-event", {
        token: this.userInformations.token,
      });
    },
    editEmployeSelected(employe) {
      console.log(employe);
      this.setEditCardModel({
        model: true,
        validation: null,
        loading: false,
        avatarIndex: employe.avatar,
        idEmploye: employe.idEmploye,
        name: employe.name,
        lastname: employe.lastname,
        email: employe.email,
        phoneNumber: employe.phoneNumber,
        address: employe.address,
        yearBirth: employe.yearBirth,
        role: employe.role,
      });
    },
    deleteEmploye(employe) {
      this.setCardInactive({
        model: true,
        idCard: employe.idEmploye,
        name: employe.name,
        lastname: employe.lastname,
        status: employe.status ? 0 : 1,
      });
      console.log(this.cardInactive);
    },
    customRowClass(item) {
      const color = item.status ? "" : "grey lighten-3 grey--text";
      return color;
    },
  },
  mounted() {
    ipcRenderer.on("add-new-user-replay", (event, args) => {
      console.log(args);
    });
    this.showAllEmploye();
    ipcRenderer.on("show-all-user-replay", (event, args) => {
      console.log(args);
      if (args.status) this.listOfEmploye = args.employees;
    });
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners("add-new-user-replay");
    ipcRenderer.removeAllListeners("show-all-user-replay");
  },
};
</script>

<style scoped lang="css">
.smooth-transition {
  transition: all 1s ease;
}

.style1 {
  background-color: rgb(215, 215, 44) !important;
}
.style-2 {
  background-color: rgb(114, 114, 67) !important;
}
</style>
