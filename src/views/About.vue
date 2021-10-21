<template>
  <div class="about">
    <v-container>
      <v-data-table
        :headers="headersTimerTable"
        :items="listTimer"
        class="elevation-5 rounded-lg my-6"
      >
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
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import { mapState } from "vuex";
export default {
  data: () => ({
    listTimer: [],
    headersTimerTable: [
      {
        text: "Photo",
        value: "avatar",
        align: "start",
        sortable: false,
      },
      {
        text: "Nom complet",
        value: "name",
        sortable: true,
        align: "start",
      },
      {
        text: "Jour",
        value: "day",
        sortable: false,
        align: "center",
      },
      {
        text: "Début de service",
        value: "startAt",
        sortable: false,
        align: "center",
      },
      {
        text: "Fin de service",
        value: "endAt",
        sortable: true,
        align: "center",
      },
    ],
  }),
  computed: {
    ...mapState(["userInformations"]),
  },
  mounted() {
    ipcRenderer.send("show-all-timer", {
      token: this.userInformations.token,
    });
    ipcRenderer.on("show-all-timer-replay", (event, args) => {
      this.listTimer = args;
    });
  },
};
</script>
