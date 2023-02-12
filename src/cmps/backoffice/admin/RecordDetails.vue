<template>
  <section class="record-details">
    <article v-if="record.meta.applicant && record.meta.applicant.info" class="applicant-info">
      <img v-if="record.meta.applicant.info.imgUrl" :src="record.meta.applicant.info.imgUrl" alt="applicant-avatar" />
      <div class="user-info-item"><span>Applicant Id:</span> {{record.meta.applicant.id}}</div>
      <div class="user-info-item"><span>First Name:</span> {{record.meta.applicant.info.fName}}</div>
      <div class="user-info-item"><span>Last Name:</span> {{record.meta.applicant.info.lName}}</div>
      <div class="user-info-item"><span>Email:</span> {{record.meta.applicant.info.email}}</div>
    </article>

    <article v-else-if="record.meta.user" class="user-info">
      <img v-if="record.meta.user.imgUrl" :src="record.meta.user.imgUrl" alt="applicant-avatar" />
      <div class="user-info-item"><span>User Id:</span> {{userId}}</div>
      <div class="user-info-item"><span>First Name:</span> {{firstName}}</div>
      <div class="user-info-item"><span>Last Name:</span> {{lastName}}</div>
      <div class="user-info-item"><span>Company Name:</span> {{companyName}}</div>
      <div class="user-info-item"><span>Role:</span> {{role}}</div>
      <div class="user-info-item"><span>Permission:</span> {{permission}}</div>
    </article>

    <article class="error-info">
      <div class="error-info-item"><span>Error Id:</span> {{errorId}}</div>
      <div class="error-info-item"><span>Level:</span> {{level}}</div>
      <div class="error-info-item"><span>Timestamp:</span> {{timeStamp}}</div>
      <div :title="message" class="error-info-item"><span>Message:</span> {{message}}</div>
      <div class="error-info-item"><span>Environment:</span> {{env}}</div>
      <div class="error-info-item"><span>Referrer:</span> {{referrer}}</div>
      <div class="error-info-item"><span>Source:</span> {{src}}</div>
      <div class="error-info-item pre">
        <span>Stack:</span>
        <LongText :text="stack" v-if="stack" />
      </div>
    </article>
  </section>
</template>

<script>
import LongText from '@/cmps/common/LongText.vue'

export default {
  props: ['record'],

  computed: {
    userId() {
      return this.record?.meta?.user?._id || '--'
    },

    firstName() {
      return this.record?.meta?.user?.fName || '--'
    },

    lastName() {
      return this.record?.meta?.user?.lName || '--'
    },

    companyName() {
      return this.record?.meta?.user?.companyName || '--'
    },

    email() {
      return this.record?.meta?.user?.email || '--'
    },

    permission() {
      return this.record?.meta?.user?.perm || '--'
    },

    role() {
      return this.record?.meta?.user?.role || '--'
    },

    errorId() {
      return this.record?._id
    },

    timeStamp() {
      return this.record?.timestamp
    },

    message() {
      return this.record?.message
    },

    level() {
      return this.record?.level
    },

    env() {
      return this.record?.meta?.enviroment
    },

    referrer() {
      return this.record?.meta?.referrer
    },

    src() {
      return this.record?.meta?.source
    },

    stack() {
      return this.record?.meta?.stack
    },
  },

  components: { LongText },
}
</script>
