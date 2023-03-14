export const signin_company = {
    shortCompanyName: "ORCL",
    email: "soban.taimoor@ceative.co.uk",
    password: "TEMP_pw1234"
}


export const getSubUsers = {
    offset: 0,
    limit: 10,
    searchTerm: 'a',
    sortby: 'username',
    sort: -1
}

export const getApplicants = {
    offset: 0,
    limit: 10,
    searchTerm: 'a',
    sortby: 'username',
    sort: -1
}

export const assignApplicant = {
    AssignedTo: "b8151648-127f-4987-b19d-9e89578b9d4c",
    ApplicantID: "6030635f-326e-4030-92c6-06d7ab3eff8d"
}

export const getUserHistory = {
    userId:"6030635f-326e-4030-92c6-06d7ab3eff8d",
    offset: 0,
    limit: 10,
    searchTerm: 'a',
}

export const UnAssignApplicant = {
    ApplicantID: "6030635f-326e-4030-92c6-06d7ab3eff8d"
}

export const deActivateUser = {
    ApplicantID: "6030635f-326e-4030-92c6-06d7ab3eff8d"
}