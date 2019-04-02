import LocalizedStrings from 'react-localization';

let strings = new LocalizedStrings({
    en: {
        App: {
            Title: "DLT Gateway"
        },
        Dashboard: {
            Title: "Dashboard",
            WelcomeMessage: "Welcome to DLT Gateway"
        },
        DataStore: {
            Title: "Data Store",
            SubTitle: "List of all objects tracked in the system"
        },
        BusinessNetworkList: {
            Title: "Business Networks",
            SubTitle: "List of codechain networks to connect to"
        },
        BusinessNetwork: {
            Title: "Business Network",
            SubTitle: ""
        },
        BusinessNetworkNamespace: {
            Title: "Business Network Namespace",
            SubTitle: ""
        },
    },
});

export default strings;