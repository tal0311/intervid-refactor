import { getTrans } from "./i18nService";

export const companyService = {
  getMiniCompany,
};

function getMiniCompany(user) {
  // TODO: // if(user)
  return {
    name: user.companyName || getTrans("company"),
    logoUrl: user.logoUrl || "",
  };
}
