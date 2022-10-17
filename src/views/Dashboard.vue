<template>
  <v-container>
    <v-card class="ma-auto transparent mt-6 pa-0" flat width="400">
      <v-menu
        v-model="datePickerMenuVisibility"
        :close-on-content-click="false"
        :nudge-right="40"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-text-field
            v-model="searchTimerModel"
            label="Chercher par date"
            prepend-icon="mdi-calendar"
            readonly
            v-bind="attrs"
            v-on="on"
            class="rounded-pill"
            background-color="white"
            filled
            rounded
            hide-details
          ></v-text-field>
        </template>
        <v-date-picker
          @change="dateChanged"
          v-model="searchTimerModel"
          @input="datePickerMenuVisibility = false"
        ></v-date-picker>
      </v-menu>
    </v-card>

    <v-data-table
      :headers="headersHistoryTimerTable"
      :items="searchingTimer"
      :sort-by="['startAt']"
      :sort-desc="['startAt']"
      class="elevation-5 rounded-lg my-6"
      :footer-props="{'items-per-page-options':[5,15, 30, 50, 100, -1]}"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title class="font-weight-bold">
            Les horaires de pointage journalier
          </v-toolbar-title>
          <v-spacer></v-spacer>
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
    </v-data-table>
  </v-container>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";

export default {
  data: () => ({
    searchTimerModel: new Date(
      Date.now() - new Date().getTimezoneOffset() * 60000
    )
      .toISOString()
      .substr(0, 10),
    datePickerMenuVisibility: false,
    headersHistoryTimerTable: [
      {
        text: "Photo",
        align: "start",
        value: "avatar",
        sortable: false,
      },
      {
        text: "Nom complet",
        align: "start",
        value: "name",
        sortable: false,
      },
      {
        text: "Jour",
        align: "center",
        value: "day",
        sortable: false,
      },
      {
        text: "Début de service",
        align: "center",
        value: "startAt",
        sortable: true,
      },
      {
        text: "Fin de service",
        align: "center",
        value: "endAt",
        sortable: true,
      },
      {
        text: "Action",
        align: "center",
        value: "action",
        sortable: false,
      },
    ],
    listHistoryTimer: [],
  }),
  computed: {
    ...mapState(["userInformations"]),
    searchingTimer() {
      return this.listHistoryTimer;
    },
  },
  mounted() {
    ipcRenderer.send("show-history-day-event", {
      token: this.userInformations.token,
    });
    ipcRenderer.on("history-day-replay", (event, args) => {
      if (!args.status) {
        console.log(args);
        this.listHistoryTimer = args;
      }
    });
    ipcRenderer.on("update-table-timer-replay", () => {
      this.dateChanged();
    });
  },
  beforeDestroy() {
    ipcRenderer.removeAllListeners("history-day-replay");
    ipcRenderer.removeAllListeners("update-table-timer-replay");
  },
  methods: {
    dateChanged() {
      ipcRenderer.send("show-history-day-event", {
        token: this.userInformations.token,
        day: this.searchTimerModel || false,
      });
    },
  },
};
</script>
