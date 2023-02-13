<template>
  <div class="org-user-edit">
    <h2>Change Password</h2>
    <form novalidate @submit.prevent="onChangePassword">
      <main-input
        v-if="isChange"
        inputName="currPassword"
        label="Current Password"
        type="password"
        validate="required"
        v-model.trim="password.current"
        :onBlur="validateField"
        :errors="errors"
        styled="main"
      />
      <main-input
        v-if="isChange"
        inputName="newPassword"
        label="New Password"
        type="password"
        validate="required|password"
        v-model.trim="password.updated"
        :onBlur="validateField"
        :errors="errors"
        styled="main"
      />
      <main-input
        inputName="verifyPassword"
        label="Verify New Password"
        type="password"
        validate="required"
        v-model.trim="password.verifyUpdated"
        :onBlur="validateField"
        :errors="errors"
        styled="main"
      />
      <button class="blue">Save</button>
    </form>
  </div>
</template>

<script>
import { msgService } from "@/services/msgService";
import { validate, getValidateMsg } from "@/services/errorService";
import { loggerService } from "@/services/loggerService";

export default {
  props: ["userToEdit", "isChange"],

  data: () => ({
    password: {
      current: "",
      updated: "",
      verifyUpdated: "",
    },
    errors: null,
  }),

  methods: {
    async onChangePassword({ target }) {
      this.errors = validate(target);

      const { updated, verifyUpdated } = this.password;

      if (updated !== verifyUpdated) {
        this.errors.push(
          getValidateMsg("CONFIRM_PASSWORD", { name: "verifyPassword" })
        );
      }
      if (this.errors.length) return;
      try {
        if (this.userToEdit) {
          await this.$store.dispatch("user/changePassword", {
            passwordObj: this.password,
            userId: this.userToEdit._id,
          });
        } else {
          await this.$store.dispatch("auth/changePassword", {
            token: this.$route.query.token,
            password: this.password.updated,
          });
        }
        const msg = msgService.change("password");
        this.$store.commit("app/setAlertData", { alertData: msg });
      } catch (err) {
        loggerService.error("Couldn't reset password", err);
      }
      if (this.userToEdit) this.$emit("close");
      else this.$router.push({ name: "Login" });
    },

    validateField(ev) {
      if (!ev.target.form) return;
      if (!this.errors) return;
      this.errors = validate(ev.target.form);
    },
  },
};
</script>
