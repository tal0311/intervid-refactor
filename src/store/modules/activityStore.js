import { activityService } from "@/services/activityService.js";
import { loggerService } from "@/services/loggerService";
import { userService } from "@/services/userService";

export const activity = {
  namespaced: true,
  state: {
    activities: [],
    totalActivityCount: 0,
    isFetching: false,
  },

  getters: {
    activities(state) {
      return state.activities;
    },

    totalActivityCount(state) {
      return state.totalActivityCount;
    },

    isFetching(state) {
      return state.isFetching;
    },
  },

  mutations: {
    setActivities(state, { activities }) {
      state.activities = activities;
    },

    setTotalActivityCount(state, { totalActivityCount }) {
      state.totalActivityCount = totalActivityCount;
    },

    setIsFetching(state, isFetching) {
      state.isFetching = isFetching;
    },
  },

  actions: {
    async loadActivities({ commit }, { filterBy }) {
      commit("setIsFetching", true);
      try {
        const { activities, totalActivityCount } = await activityService.query({
          ...filterBy,
        });
        commit("setActivities", { activities });
        commit("setTotalActivityCount", { totalActivityCount });
      } catch (err) {
        loggerService.error(
          "[activityStore] [loadActivities] Failed to load activities",
          err
        );
      } finally {
        commit("setIsFetching", false);
      }
    },

    async addActivity({ rootGetters }, { activity }) {
      const user =
        rootGetters["user/loggedInUser"] ||
        rootGetters["applicant/applicant"]?.info;
      const activityToAdd = {
        ...activity,
        user: userService.getMiniUser(user),
      };
      try {
        activityService.addActivity(activityToAdd);
      } catch (err) {
        loggerService.error(
          "[activityStore] [addActivity] Failed to add activity",
          activityToAdd,
          err
        );
      }
    },
  },
};
