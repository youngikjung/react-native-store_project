export const Types = {
    SETTOKEN: 'user/SETTOKEN',
    SETLOGGEDINSTATUS: 'user/SETLOGGEDINSTATUS',
    SETUSERCONFIG: 'user/SETUSERCONFIG',
};

// Initial State
const initialState = {
    inititalPage: true,
    homeButton: true,
    orderButton: true,
    inventoryButton: true,
    quickButton: true,
    orderlistButton: true,
    confirmButton: true,
    prepareButton: true,
    pickupCompleteButton: true,

    activate: false,
    AutoLogin: false,
    LoginId: '',
    LoginPw: '',
    Token: "",
    RefreshToken: "",
    UserPushToken: "",
    uniqueId: "",
    AppPushStatus: true,
    PickupType: 1,

    StoreID: 0,
    BusinessType: '',
    StoreName: '',
    StoreOwner: '',

    Commercial: false,

    APPROUTE: '',

    PRINTERTYPE: "",
    USB_PRINTER_VENDERID: "",
    USB_PRINTER_DEVICENAME: "",
    USB_PRINTER_PRODUCTID: "",

    ACTIVATION: false,
    MENU: false,
    STOREOPERATIONTIME: false,
    STOREPICKUPZONEDETAIL: false,
    STOREPICKUPIMAGE: false,
    STOREPICKUPZONE: false,
    STOREHOLIDAY: false,
    STORELOGO: false,
    STOREIMAGES: false,
    STOREORDERTIME: false,
    STOREORIGINNOTICE: false,
    STOREINFOMATION: false,
    OWNERACCOUNT: false,
    STORETYPE: false,
    STORENOTICE: false,
    STOREALERT: false,

    SOUNDVOLUME: 1,
    QUITSOUND: false,

    BOOKMARKONE: "",
    BOOKMARKTWO: "",
    BOOKMARKTHREE: "",
    BOOKMARKCOUNTONE: 0,
    BOOKMARKCOUNTTWO: 0,
    BOOKMARKCOUNTTHREE: 0,
    BOOKMARKROUTEONE: "",
    BOOKMARKROUTETWO: "",
    BOOKMARKROUTETHREE: "",
};

export function setUserToken(oResult) {
    return {
        type: Types.SETTOKEN,
        payload: {
            result: oResult,
        },
    };
}

export function setUserConfig(oResult) {
    return {
        type: Types.SETUSERCONFIG,
        payload: {
            result: oResult,
        },
    };
}

const UserConfigReducer = (state = initialState, action) => {
    switch (action.type) {
        case Types.SETLOGGEDINSTATUS: {
            let oMerged = {...state, ...action.payload.result};
            return oMerged;
        }
        case Types.SETUSERCONFIG: {
            let oMerged = {...state, ...action.payload.result};
            return oMerged;
        }
        default: {
            return state;
        }
    }
};

// Exports
export default UserConfigReducer;