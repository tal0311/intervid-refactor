<template>
  <section class="activity-preview">
    <div class="preview-item">
      {{startTime}}
    </div>

    <div class="preview-item">
      {{activity.user ? activity.user.email : 'Guest'}}
    </div>

    <div class="preview-item">
      {{action}}
    </div>
  </section>
</template>

<script>
import { formatDate } from '@/services/utilService'

export default {
  props: ['activity'],

  computed: {
    startTime() {
      return formatDate(new Date(this.activity.date), {
        includeSeconds: true,
        getFullDate: true,
        includeTime: true,
      })
    },

    action() {
      let { type, target, desc } = this.activity
      if (type && !['login', 'logout', 'signup'].includes(type))
        type = type[type.length - 1] === 'e' ? type + 'd' : type + 'ed'
      return `${type && type[0].toUpperCase() + type.substr(1)} ${target} ${desc}`
    },
  },
}
</script>
