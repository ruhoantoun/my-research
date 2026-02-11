export const adminMenu = [
    {
        // Quản lý người dùng
        name: "Người dùng",
        menus: [
            {
                name: "menu.admin.user-create",
                link: "/system/user-redux",
            },
            {
                name: "Mô tả người dùng",
                link: "/system/user-description",
            },
            {
                name: "menu.admin.user-display",
                link: "/system/user-display",
                // subMenus: [
                //     {
                //         name: "menu.system.system-administrator.user-manage",
                //         link: "",
                //     },
                //     {
                //         name: "menu.system.system-administrator.user-redux",
                //         link: "/system/user-redux",
                //     },
                // ],
            },
        ],
    },
    {
        name: "Sự kiện",
        menus: [
            {
                name: "Tạo mới sự kiện",
                link: "/system/event-manage",
            },
            {
                name: "Mô tả sự kiện",
                link: "/system/event-description",
            },
            {
                name: "Danh sách sự kiện",
                link: "/system/event-display",
                // subMenus: [
                //     {
                //         name: "menu.system.system-administrator.user-manage",
                //         link: "",
                //     },
                //     {
                //         name: "menu.system.system-administrator.user-redux",
                //         link: "/system/user-redux",
                //     },
                // ],
            },
              {
                name: "Đăng ký sự kiện",
                link: "/system/event-registration/:id",
            },
        ],
    },
];

export const doctorMenu = [
    {
        name: "menu.doctor.manage-patient",
        menus: [
            {
                name: "menu.doctor.manage-schedule",
                link: "/doctor/manage-schedule",
            },
        ],
    },
];
