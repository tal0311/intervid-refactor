import { createRouter, createWebHistory } from 'vue-router'

import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

// GENERAL
import Login from '@/views/general/Login.vue'
import VerifyEmail from '@/views/general/VerifyEmail.vue'
import NotFound from '@/views/general/NotFound.vue'
import NotSupported from '@/views/general/NotSupported.vue'
import UserMgmt from '@/views/general/UserMgmt.vue'
import Signup from '@/views/general/Signup.vue'
import ForgotPassword from '@/views/general/ForgotPassword.vue'
import EmbededPreview from '@/cmps/common/EmbededPreview.vue'

// INTERVIEW
// import JobEdit from '@/views/backoffice/JobEdit.vue'
import JobEdit from '@/views/backoffice/JobEdit.vue'

// BACKOFFICE
import BackOffice from '@/views/backoffice/BackOffice.vue'

import JobOverview from '@/views/backoffice/job/JobOverview.vue'

import ApplicantOverview from '@/views/backoffice/applicant/ApplicantOverview.vue'
import ApplicantDetails from '@/views/backoffice/applicant/ApplicantDetails.vue'

import TemplateOverview from '@/views/backoffice/template/TemplateOverview.vue'
import TemplateDetails from '@/views/backoffice/template/TemplateDetails.vue'
import TemplateEdit from '@/views/backoffice/template/TemplateEdit.vue'

import AdminApp from '@/views/backoffice/admin/AdminApp.vue'

import AccountOverview from '@/views/backoffice/admin/account/AccountOverview.vue'
import RecordOverview from '@/views/backoffice/admin/record/RecordOverview.vue'
import ActivityOverview from '@/views/backoffice/admin/activity/ActivityOverview.vue'

import OnBoarding from '@/cmps/interview/onboarding/Onboarding.vue'
import Interview from '@/cmps/interview/interview-app/Interview.vue'
import InterviewEnd from '@/cmps/interview/interview-end/InterviewEnd.vue'
import config from './config'
import { advancedPermsMap } from './services/constData'
import { userService } from './services/userService'





const routes = [
  {
    path: '/interview/:jobId',
    component: () => import(/* webpackChunkName: "interview-app" */ './views/interview/InterviewApp.vue'),
    meta: {
      public: true,
    },
    children: [
      {
        path: '/',
        name: 'OnBoarding',
        component: OnBoarding,
      },
      {
        path: 'inprogress',
        name: 'Interview',
        component: Interview,
      },
      {
        path: 'end',
        name: 'InterviewEnd',
        component: InterviewEnd,
      },
    ],
  },

  {
    path: '/',
    component: () => import(/* webpackChunkName: "back-office" */ './views/MainApp.vue'),
    children: [
      {
        name: 'Login',
        path: '/login',
        component: Login,
        meta: {
          public: true,
          onlyWhenLoggedOut: true,
        },
      },
      {
        name: 'Signup',
        path: '/signup',
        component: Signup,
        meta: {
          public: true,
          onlyWhenLoggedOut: true,
        },
      },
      {
        name: 'ForgotPassword',
        path: '/forgot-password',
        component: ForgotPassword,
        props: true,
        meta: {
          public: true,
        },
      },
      {
        name: 'UserMgmt',
        path: '/user',
        component: UserMgmt,
      },
      {
        path: '/backoffice',
        name: 'BackOffice',
        component: BackOffice,
        children: [
          {
            path: 'applicant/:jobId?',
            name: 'ApplicantOverview',
            component: ApplicantOverview,
            meta: { title: 'Applications' }
          },
          {
            path: 'job',
            name: 'JobOverview',
            component: JobOverview,
            meta: { title: 'Jobs' }

          },
          {
            path: 'template', // TODO V2: Do Not Remove!!!!!!!!!!!!!!!!!!!!!!!!!!
            name: 'TemplateOverview',
            component: TemplateOverview,
            meta: {
              title: 'Templates',
              requiredPerm: advancedPermsMap.TEMPLATES
            },
          },
          {
            path: 'template/edit/:templateId?',
            name: 'TemplateEdit',
            component: TemplateEdit,
            meta: {
              requiredPerm: advancedPermsMap.TEMPLATES
            },
          },
          {
            path: 'template/:templateId',
            name: 'TemplateDetails',
            component: TemplateDetails,
            meta: {
              requiredPerm: advancedPermsMap.TEMPLATES
            },
          },
          {
            path: 'details/:jobId/:applicantId',
            name: 'ApplicantDetails',
            component: ApplicantDetails,
          },
          {
            path: 'admin',
            name: 'AdminApp',
            component: AdminApp,
            meta: {
              admin: true,
            },
            children: [
              {
                path: 'account',
                name: 'AccountOverview',
                component: AccountOverview,
              },
              {
                path: 'record',
                name: 'RecordOverview',
                component: RecordOverview,
              },
              {
                path: 'activity',
                name: 'ActivityOverview',
                component: ActivityOverview,
              },
            ],
          },
        ],
      },
      {
        path: 'create/:jobId?',
        name: 'JobEdit',
        component: JobEdit,
      },
      {
        path: '/not-found',
        component: NotFound,
        meta: {
          public: true,
        },
      },
      {
        path: '/verify-email',
        name: 'VerifyEmail',
        component: VerifyEmail,
        meta: {
          public: true,
        },
      },
    ],
  },
  {
    path: '/not-supported',
    component: NotSupported,
    meta: {
      public: true,
    },
  },
  {
    path: '/embed/:jobId',
    name: 'embeded',
    component: EmbededPreview,
  },
]

router.beforeEach(async (to, from, next) => {

  historyRoutes.push(from)
  const isPublic = to.matched.some((record) => record.meta.public)
  const isAdmin = to.matched.some((record) => record.meta.admin)
  const requiredPerm = to.meta.requiredPerm
  const onlyWhenLoggedOut = to.matched.some((record) => record.meta.onlyWhenLoggedOut)

  let loggedInUser = store.getters['user/loggedInUser']
  const loggedInPrm = store.getters['user/loggedInUserPrm']
  const applicant = store.getters['applicant/applicant']

  if (to.path === '/' && process.env.NODE_ENV === 'development') {
    window.location.href = `${config.backendUrl}`
    return
  }

  if (!to.matched.length) next({ path: '/backoffice/applicant' })

  // If no route match found
  if (!to.matched.length && to.path !== '/home') {

    if (!loggedInUser && !loggedInPrm) {
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
      })
    } else if (loggedInUser && loggedInPrm) {
      return next({ path: '/backoffice/applicant' })
    }
  }

  // Happens on landing when user is already signed in
  if (!loggedInUser && loggedInPrm) {
    await loggedInPrm
    loggedInUser = store.getters['user/loggedInUser']
  }

  // If user not logged in trying to get private route: redirect to login page
  if (!isPublic && !loggedInUser && to.path !== '/home') {
    return next({
      name: 'Login',
      query: { redirect: to.fullPath }, // Store the full path to redirect the user to after login
    })
  }

  // If user didn't verify email yet and trying to reach page in backoffice
  if (!isPublic && to.path !== '/verify-email' && !loggedInUser.emailVerified) {
    return next({ path: '/verify-email' })
  }

  // If user go to verify email but already verified
  if (to.path === '/verify-email' && loggedInUser && loggedInUser.emailVerified) {
    return next({ path: '/backoffice/applicant' })
  }

  // If permission required and there's no logged in user or no rellevant permission
  if (!!requiredPerm && !userService.verifyPerm(requiredPerm)) {
    return next({ name: 'ApplicantOverview' })
  }

  // If only for admin and there's no logged in user or user not admin
  if (isAdmin && (!loggedInUser || loggedInUser.role !== 'admin')) {
    return next({ name: 'ApplicantOverview' })
  }

  // If logged in user trying to navigate to login/signup page
  // Do not allow user to visit login page or signup page if they are logged in
  // TODO: navigate back to 'from' route
  if (loggedInUser && onlyWhenLoggedOut) {

    return next({ name: 'ApplicantOverview' })
  }

  // Prevent navigation back from interview end to the interview
  const isToMidInterview = to.matched.some(
    (match) => match.path === '/interview/:jobId/inprogress' || match.path === '/interview/:jobId/end',
  )
  const isFromEnd = from.matched.some((match) => match.path === '/interview/:jobId/end')
  const isToInterview = to.matched.some((match) => match.path === '/interview/:jobId/inprogress')
  if ((isToMidInterview && (!applicant || !applicant.info)) || (isFromEnd && isToInterview)) {
    return next(`/interview/${to.params.jobId}`)
  }

  // Open confirmation modal on navigation from interview and interview End
  const isFromMidInterview = from.matched.some(
    (match) => match.path === '/interview/:jobId/inprogress' || match.path === '/interview/:jobId/end',
  )
  if (isFromMidInterview && to.name === 'OnBoarding') {
    if (confirm('Are you sure?')) return next()
    return
  }

  // If routing to path '/backoffice' alone, navigate to applicant overview
  if (to.path === '/backoffice/' || to.path === '/backoffice') {
    return next({ name: 'ApplicantOverview' })
  }

  next()
})

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
