const FILTER_KEY = "filterBy";

export const sessionService = {
  getFilter,
};

function getFilter() {
  const filterBy = sessionStorage.getItem(FILTER_KEY);
  return filterBy && JSON.parse(filterBy);
}
