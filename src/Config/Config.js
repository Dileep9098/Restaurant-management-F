import Restaurent from "../Pages/SuperAdmin/Restaurent/Restaurent";

const Config = {
    ADMIN_BASE_URL: "http://localhost:5173/",
    WEBSITE_IBASE_URL: "http://localhost:5173/",
    BASE_URL: "http://localhost:4000",


    END_POINT_LIST: {

        REGITER_USER: "/api/v1/register/",
        LOGIN_USER: "/api/v1/login/",
        VERIFY_OTP: "/api/v1/otp-verified/",
        GET_ALL_USER: "/api/v1/get-all-user/",
        UPDATE_USER: "/api/v1/update-user",
        DELETE_USER: "/api/v1/delete-user",
        LOAD_USER: "/api/v1/me",
        LOGOUT_USER: "/api/v1/logout",
        GET_SINGLE_USER: "/api/v1/admin/single-user",

        SUBMIT_KYC_REQUEST: "/api/v1/kyc/submit",
        ADMIN_UPDATE_KYC_STATUS: "/api/v1/admin/kyc-status",
        ADMIN_GET_ALL_PENDDING_KYCS: "/api/v1/admin/kyc-pending",



        FORGOTE_USER_PASSWORD: '/api/v1/forgote-password',
        RESET_USER_PASSWORD: '/api/v1/reset-password',
        UPDATE_USER_PASSWORD: '/api/v1/update-password',



        // Add Sim Package

        ADD_SIM_PACKAGE: "/api/v1/add-sim-package",
        DELETE_SIM_PACKAGE: "/api/v1/delete-sim-package",
        UPDATE_SIM_PACKAGE: "/api/v1/update-sim-package",
        GET_ALL_SIM_PACKAGE: "/api/v1/get-all-sim-packages",
        GET_SINGLE_SIM_PACKAGE: "/api/v1/get-single-sim-package",


        // Wallet Request Routes

        SEND_WALLET_ADD_REQUEST: "/api/v1/add-wallet-request",
        GET_ALL_WALLET_REQUEST: "/api/v1/admin/get-all-wallet-requests",
        ADMIN_APPROVE_WALLET_REQUEST: "/api/v1/admin/approve-wallet-request",
        ADMIN_REJECT_WALLET_REQUEST: "/api/v1/admin/reject-wallet-request",



        // Order Routes
        PLACE_ORDER: "/api/v1/create-order",
        ADMIN_GET_ALL_ORDER: "/api/v1/get-all-order",
        GET_MY_ORDER: "/api/v1/my-order-data",
        GET_SINGLE_ORDER_DEATAILS: "/api/v1/admin/get-single-order-details",
        MARK_ORDER_AS_SHIPPED: "/api/v1/admin/order/",
        UPDATE_ORDER_STATUS: "/api/v1/update-order-stauts",
        UPDATE_PREPARATION_TIME: "/api/v1/update-preparation-time",


        //Noitification
        GET_NOTIFICATION: "/api/v1/notification",
        READ_NOTIFICATION: "/api/v1/read-notification",


        // Add Payment Method
        ADD_PAYMENT_METHODE: '/api/v1/add-payment-method',
        GET_ALL_PAYMENT_METHODE: '/api/v1/all-payment-method',
        UPDATE_PAYMENT_METHODE: '/api/v1/update-payment-method',
        DELETE_PAYMENT_METHODE: '/api/v1/delete-payment-method',
        GET_SINGLE_PAYMENT_METHOD: '/api/v1/get-single-payment-method',


        // Sim data

        IMPORT_SIM_DATA: "/api/v1/import-simdata",
        GET_ALL_SIM_DATA: "/api/v1/get-all-simdata",
        GET_ALL_USER_SIM_ASSIGNED: "/api/v1/get-all-sim/my",
        REQUEST_FOR_SIM_ACTIVATION: "/api/v1/sim-activation",
        GET_ALL_SIM_ACTIVED: "/api/v1/get-all-sim-active-data",


        // Banners Details

        ADD_BANNER: "/api/v1/add-banner",
        GET_ALL_BANNERS: "/api/v1/get-all-banners",
        GET_SINGLE_BANNER: "/api/v1/single-banner",
        UPDATE_BANNER: "/api/v1/update-banner",
        DELETE_BANNER: "/api/v1/delete-banner",





        CREATE_PERMISSION: "/api/v1/create-permission",
        GET_ALL_PERMISSION: "/api/v1/get-all-permission",
        UPDATE_PERMISSION: "/api/v1/update-permission",
        DELETE_PERMISSION: "/api/v1/delete-permission",

        GET_ALL_ROLE_PERMISSION: "/api/v1/get-all-permission-assign",

        CREATE_ROLE: "/api/v1/create-role",
        GET_ALL_ROLES: "/api/v1/get-all-roles",
        UPDATE_ROLE: "/api/v1/update-role",
        DELETE_ROLE: "/api/v1/delete-role",

        CREATE_ADMIN_USER: "/api/v1/admin/create-user",
        UPDATE_ADMIN_USER: "/api/v1/admin/update-user-role",



        RESTAURENT_CREATE: "/api/v1/create-restaurent",
        RESTAURENT_GET_ALL: "/api/v1/get-all-restaurent",
        RESTAURENT_GET_SINGLE: "/api/v1/restaurent/",
        RESTAURENT_UPDATE: "/api/v1/update-restaurent",
        RESTAURENT_TOGGLE_STATUS: "/api/v1/restaurent/status",
        RESTAURENT_DELETE: "/api/v1/delete-restaurent",

        RESTAURENT_USER_CREATE: "/api/v1/create-restaurent-admin",
        RESTAURENT_USER_GET_ALL: "/api/v1/get-all-admin-restaurent",
        RESTAURENT_ADMIN_USER_UPDATE: "/api/v1/update-restaurent-admin",
        RESTAURENT_USER_DELETE: "/api/v1/delete-restaurent-admin",


        // Role Assign Permission
        ROLE_ASSIGN_PERMISSION: "/api/v1/role-assign",
        GET_ALL_ROLE_ASSIGN_PERMISSION: "/api/v1/get-all-role-assign",
        DELETE_ROLE_ASSIGN_PERMISSION: "/api/v1/delete-role-permission",
        GET_PERMISSIONS_BY_ROLE: "/api/v1/get-user-role",
        UPDATE_ROLE_PERMISSION: "/api/v1/update-role-permission",
        GET_SINGLE_ROLE_ASSIGN_PERMISSION: "/api/v1/get-single-role-permission-assign",


        GET_ALL_RESTAURENT_USER: "/api/v1/get-all-restaurent-user/",





        // Category Routes
        CREATE_CATEGORY: "/api/v1/create-category",
        GET_ALL_CATEGORIES: "/api/v1/get-all-categories",
        GET_SINGLE_CATEGORY: "/api/v1/get-single-category",
        UPDATE_CATEGORY: "/api/v1/update-category",
        DELETE_CATEGORY: "/api/v1/delete-category",

        // Tax Routes
        CREATE_TAX: "/api/v1/create-tax",
        GET_ALL_TAXES: "/api/v1/get-all-taxes",
        UPDATE_TAX: "/api/v1/update-tax",
        DELETE_TAX: "/api/v1/delete-tax",


        //Menu Item Routes
        CREATE_MENU_ITEM: "/api/v1/create-menu-item",
        GET_ALL_MENU_ITEMS: "/api/v1/get-all-menu-items",
        UPDATE_MENU_ITEM: "/api/v1/update-menu-item",
        DELETE_MENU_ITEM: "/api/v1/delete-menu-item",

        // Variant Routes will be here
        CREATE_VARIANT_GROUP: "/api/v1/create-variant-group",
        GET_VARIANT_GROUPS_BY_ITEM: "/api/v1/get-variant-groups/",
        UPDATE_VARIANT_GROUP: "/api/v1/update-variant-group/",
        DELETE_VARIANT_GROUP: "/api/v1/delete-variant-group/",

        CREATE_VARIANT: "/api/v1/create-variant",
        GET_VARIANTS_BY_GROUP: "/api/v1/get-variants/",
        UPDATE_VARIANT: "/api/v1/update-variant/",
        DELETE_VARIANT: "/api/v1/delete-variant/",

        // AddOn Routes will be here
        CREATE_ADDON_GROUP: "/api/v1/create-addon-group",
        GET_ADDON_GROUPS: "/api/v1/get-addon-groups/",
        UPDATE_ADDON_GROUP: "/api/v1/update-addon-group/",
        DELETE_ADDON_GROUP: "/api/v1/delete-addon-group/",

        CREATE_ADDON: "/api/v1/create-addon",
        GET_ADDONS_BY_GROUP: "/api/v1/get-addons/",
        UPDATE_ADDON: "/api/v1/update-addon/",
        DELETE_ADDON: "/api/v1/delete-addon/",


        // Table Routes will be here
        CREATE_TABLE: "/api/v1/create-table",
        GET_TABLES_BY_RESTAURANT: "/api/v1/get-tables",
        UPDATE_TABLE: "/api/v1/update-table",
        DELETE_TABLE: "/api/v1/delete-table",


        // Invoice Template Formate

        GET_ALL_INVOICE_TEMPLATES: "/api/v1/get-all-invoice-template",
        CREATE_INVOICE_TEMPLATE: "/api/v1/create-invoice-template",
        UPDATE_INVOICE_TEMPLATE: "/api/v1/update-invoice-template",
        DELETE_INVOICE_TEMPLATE: "/api/v1/delete-invoice-template",
        SET_RESTAURANT_INVOICE_TEMPLATE: "/api/v1/set-restaurant-invoice-template",



        // Inventory Data

        CREATE_ROW_MATERIAL_CATEGORY: '/api/v1/create-row-material-category',
        GET_ALL_ROW_MATERIAL_CATEGORY: '/api/v1/get-all-row-material-category',
        GET_SINGLE_ROW_MATERIAL_CATEGORY: '/api/v1/get-row-material-category',
        UPDATE_ROW_MATERIAL_CATEGORY: '/api/v1/update-row-material-category',
        DELETE_ROW_MATERIAL_CATEGORY: '/api/v1/delete-row-material-category',

        CREATE_ROW_MATERIAL: '/api/v1/create-row-material',
        GET_ALL_ROW_MATERIAL: '/api/v1/get-all-row-material',
        GET_SINGLE_ROW_MATERIAL: '/api/v1/get-row-material',
        UPDATE_ROW_MATERIAL: '/api/v1/update-row-material',
        DELETE_ROW_MATERIAL: '/api/v1/delete-row-material',
        GET_LOW_STOCK_MATERIAL: '/api/v1/low-stock',

        CREATE_SUPPLIER: '/api/v1/create-supplier',
        GET_ALL_SUPPLIER: '/api/v1/get-all-supplier',
        GET_SINGLE_SUPPLIER: '/api/v1/get-supplier',
        UPDATE_SUPPLIER: '/api/v1/update-supplier',
        DELETE_SUPPLIER: '/api/v1/delete-supplier',

        CREATE_SUPPLIER_ITEM: '/api/v1/create-supplier-item',
        GET_ALL_SUPPLIER_ITEMS: '/api/v1/get-all-supplier-items',
        GET_SINGLE_SUPPLIER_ITEM: '/api/v1/get-supplier-item',
        UPDATE_SUPPLIER_ITEM: '/api/v1/update-supplier-item',
        DELETE_SUPPLIER_ITEM: '/api/v1/delete-supplier-item',
        GET_SUPPLIER_ITEM_BY_SUPPLIER: '/api/v1/get-supplier-item-by-supplier',
        GET_SUPPLIERS_BY_RAW_MATERIAL: '/api/v1/get-supplier-by-row-material',

        CREATE_PURCHASE: '/api/v1/create-purchases',
        GET_ALL_PURCHASES: '/api/v1/get-all-purchases',
        GET_SINGLE_PURCHASE: '/api/v1/get-single-purchases',
        UPDATE_PURCHASE: '/api/v1/update-purchase',
        DELETE_PURCHASE: '/api/v1/delete-purchase',
        MARK_PURCHASE_ORDERED: '/api/v1/ordered',
        RECEIVE_PURCHASE: '/api/v1/receive',

        CREATE_RECIPE: '/api/v1/create-recipe',
        GET_ALL_RECIPES: '/api/v1/get-all-recipes',
        GET_SINGLE_RECIPE: '/api/v1/get-single-recipe',
        UPDATE_RECIPE: '/api/v1/update-recipe',
        DELETE_RECIPE: '/api/v1/delete-recipe',

        DEDUCT_STOCK_FOR_MENU_ITEM: '/api/v1/deduct-stock-for-menu-item',
        DEDUCT_STOCK_FOR_MENU_ITEM: '/api/v1/deduct-stock-for-menu-item',

        CREATE_INVENTORY_TRANSACTION: '/api/v1/create-inventory-transaction',
        GET_ALL_INVENTORY_TRANSACTIONS: '/api/v1/get-all-inventory-transactions',
        GET_CURRENT_STOCK: '/api/v1/get-current-stock',

        CREATE_INVENTORY_SETTING: '/api/v1/create-inventory-setting',
        GET_ALL_INVENTORY_SETTINGS: '/api/v1/get-all-inventory-settings',
        UPDATE_INVENTORY_SETTING: '/api/v1/update-inventory-setting',
        GET_STOCK_REPORT: '/api/v1/get-stock-report'

    },

    APP_SETTING: {
        DefaultCurrencyCode: "INR",
        DefaultCurrencySymbol: "₹"
    }
}

export default Config;