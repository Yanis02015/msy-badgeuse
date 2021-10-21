<template>
  <v-text-field
    class="rounded-lg"
    v-model="value"
    outlined
    :label="label"
    :type="type"
    :prepend-icon="startIcon"
    :rules="required ? rules : []"
    :clearable="clearable"
    :loading="loading ? 'primary' : 'false'"
    :disabled="loading"
  >
  </v-text-field>
</template>

<script>
export default {
  props: {
    startIcon: {
      type: String,
      required: false,
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
    loading: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      default: '',
    }
  },

  data: () => ({
    value: '',
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

  mounted() {
    this.value = this.content || "";
  }
};
</script>
