export const companyService = {
  getMiniCompany,
}

function getMiniCompany(user) {
  // TODO: // if(user)
  return {
    name: user.companyName || '',
    logoUrl: user.logoUrl || '',
  }
}
