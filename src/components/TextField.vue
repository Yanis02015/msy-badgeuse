<template>
  <v-text-field
    class="rounded-lg"
    v-model="value"
    outlined
    :label="label"
    :type="type"
    :prepend-icon="startIcon"
    :rules="rules"
    :clearable="clearable"
  ></v-text-field>
</template>

<script>
export default {
  props: {
    startIcon: {
      type: String,
      required: true,
    },
    label: {
      type: String,
    },
    type: {
      type: String,
      default: "text",
    },
    clearable: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    value: "",
  }),

  methods: {
    emitValue() {
      this.$emit("send-value", { value: this.value });
    },
  },

  computed: {
    rules() {
      return [(v) => !!v || "Ce champ est obligatoire"];
    },
  },

  watch: {
    value() {
      this.emitValue();
    },
  },
};
</script>
