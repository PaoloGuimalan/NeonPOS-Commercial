import { AuthenticationInterface, SettingsInterface } from "../../helpers/variables/interfaces";

export const authenticationstate : AuthenticationInterface = {
    auth: null,
    user: {
        accountID: "",
        accountType: "",
        accountName: {
            firstname: "",
            middlename: "",
            lastname: ""
        },
        permissions: [],
        dateCreated: "",
        createdBy: {
            accountID: "",
            deviceID: ""
        }
    }
}

export const settingsstate : SettingsInterface = {
    userID: "",
    deviceID: "",
    setup: "",
    posType: "",
    connectionToken: ""
}