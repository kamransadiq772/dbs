export const listAllApplications = {
    offset: 0,
    limit: 10,
    stage:'Rejected by Evidence Checker',
    searchTerm: 'a',
    isPaid:false,
    from:100000,
    to:2670864726
}

export const getApplicationsOfAdmin = {
    offset: 0,
    limit: 10
}

export const getApplicationsOfAdminByStatus = {
    status:"Pending",
    offset: 0,
    limit: 10
}

export const getApplicationsOfSubusers = {
    UserID:"c28d00d5-8784-45dd-99ea-cb2e9134eb9c",
    offset: 0,
    limit: 10
}