import React, { useState } from 'react'
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// const superAdminMenu = [
//   {
//     _id: "1",
//     module: "dashboards",
//     moduleLabel: "Dashboards",
//     icon: "feather-airplay",
//     submenus: [
//       { label: "CRM", name: "index.html" },
//       { label: "Analytics", name: "analytics.html" }
//     ]
//   },
//   {
//     _id: "2",
//     module: "reports",
//     moduleLabel: "Reports",
//     icon: "feather-cast",
//     submenus: [
//       { label: "Sales Report", name: "reports-sales.html" },
//       { label: "Leads Report", name: "reports-leads.html" },
//       { label: "Project Report", name: "reports-project.html" },
//       { label: "Timesheets Report", name: "reports-timesheets.html" }
//     ]
//   },
//   {
//     _id: "3",
//     module: "applications",
//     moduleLabel: "Applications",
//     icon: "feather-send",
//     submenus: [
//       { label: "Chat", name: "apps-chat.html" },
//       { label: "Email", name: "apps-email.html" },
//       { label: "Tasks", name: "apps-tasks.html" },
//       { label: "Notes", name: "apps-notes.html" },
//       { label: "Storage", name: "apps-storage.html" },
//       { label: "Calendar", name: "apps-calendar.html" }
//     ]
//   },
//   {
//     _id: "4",
//     module: "proposal",
//     moduleLabel: "Proposal",
//     icon: "feather-at-sign",
//     submenus: [
//       { name: "category", label: "Categories" },
//       { name: "item", label: "Items" }
//     ]
//   },
//   {
//     _id: "5",
//     module: "payment",
//     moduleLabel: "Payment",
//     icon: "feather-dollar-sign",
//     submenus: [
//       { name: "category", label: "Categories" },
//       { name: "item", label: "Items" }
//     ]
//   },
//   {
//     _id: "6",
//     module: "customers",
//     moduleLabel: "Customers",
//     icon: "feather-users",
//     submenus: [
//       { name: "category", label: "Categories" },
//       { name: "item", label: "Items" }
//     ]
//   },
//   {
//     _id: "7",
//     module: "leads",
//     moduleLabel: "Leads",
//     icon: "feather-alert-circle",
//     submenus: [
//       { label: "Leads", name: "leads.html" },
//       { label: "Leads View", name: "leads-view.html" },
//       { label: "Leads Create", name: "leads-create.html" }
//     ]
//   },
//   {
//     _id: "8",
//     module: "projects",
//     moduleLabel: "Projects",
//     icon: "feather-briefcase",
//     submenus: [
//       { label: "Projects", name: "projects.html" },
//       { label: "Projects View", name: "projects-view.html" },
//       { label: "Projects Create", name: "projects-create.html" }
//     ]
//   },
//   {
//     _id: "9",
//     module: "widgets",
//     moduleLabel: "Widgets",
//     icon: "feather-layout",
//     submenus: [
//       { label: "Lists", name: "widgets-lists.html" },
//       { label: "Tables", name: "widgets-tables.html" },
//       { label: "Charts", name: "widgets-charts.html" },
//       { label: "Statistics", name: "widgets-statistics.html" },
//       { label: "Miscellaneous", name: "widgets-miscellaneous.html" }
//     ]
//   },
//   {
//     _id: "10",
//     module: "settings",
//     moduleLabel: "Settings",
//     icon: "feather-settings",
//     submenus: [
//       { label: "General", name: "settings-general.html" },
//       { label: "SEO", name: "settings-seo.html" },
//       { label: "Tags", name: "settings-tags.html" },
//       { label: "Email", name: "settings-email.html" },
//       { label: "Tasks", name: "settings-tasks.html" },
//       { label: "Leads", name: "settings-leads.html" },
//       { label: "Support", name: "settings-support.html" },
//       { label: "Finance", name: "settings-finance.html" },
//       { label: "Gateways", name: "settings-gateways.html" },
//       { label: "Customers", name: "settings-customers.html" },
//       { label: "Localization", name: "settings-localization.html" },
//       { label: "reCAPTCHA", name: "settings-recaptcha.html" },
//       { label: "Miscellaneous", name: "settings-miscellaneous.html" }
//     ]
//   },
//   {
//     _id: "11",
//     module: "authentication",
//     moduleLabel: "Authentication",
//     icon: "feather-power",
//     submenus: [
//       {
//         label: "Login",
//         submenus: [
//           { label: "Cover", name: "auth-login-cover.html" },
//           { label: "Minimal", name: "auth-login-minimal.html" },
//           { label: "Creative", name: "auth-login-creative.html" }
//         ]
//       },
//       {
//         label: "Register",
//         submenus: [
//           { label: "Cover", name: "auth-register-cover.html" },
//           { label: "Minimal", name: "auth-register-minimal.html" },
//           { label: "Creative", name: "auth-register-creative.html" }
//         ]
//       },
//       {
//         label: "Error-404",
//         submenus: [
//           { label: "Cover", name: "auth-404-cover.html" },
//           { label: "Minimal", name: "auth-404-minimal.html" },
//           { label: "Creative", name: "auth-404-creative.html" }
//         ]
//       },
//       {
//         label: "Reset Pass",
//         submenus: [
//           { label: "Cover", name: "auth-reset-cover.html" },
//           { label: "Minimal", name: "auth-reset-minimal.html" },
//           { label: "Creative", name: "auth-reset-creative.html" }
//         ]
//       },
//       {
//         label: "Verify OTP",
//         submenus: [
//           { label: "Cover", name: "auth-verify-cover.html" },
//           { label: "Minimal", name: "auth-verify-minimal.html" },
//           { label: "Creative", name: "auth-verify-creative.html" }
//         ]
//       },
//       {
//         label: "Maintenance",
//         submenus: [
//           { label: "Cover", name: "auth-maintenance-cover.html" },
//           { label: "Minimal", name: "auth-maintenance-minimal.html" },
//           { label: "Creative", name: "auth-maintenance-creative.html" }
//         ]
//       }
//     ]
//   },
//   {
//     _id: "12",
//     module: "help",
//     moduleLabel: "Help Center",
//     icon: "feather-life-buoy",
//     submenus: [
//       { label: "Support", name: "#!" },
//       { label: "KnowledgeBase", name: "help-knowledgebase.html" },
//       { label: "Documentations", name: "/docs/documentations" }
//     ]
//   }
// ];

const superAdminMenu = [
  {
    _id: "1",
    module: "dashboard",
    moduleLabel: "Dashboard",
    icon: "ri-dashboard-2-line",
    submenus: []
  },
  {
    _id: "2",
    module: "restaurants",
    moduleLabel: "Restaurants",
    icon: "ri-building-line",
    submenus: []
  },
  {
    _id: "3",
    module: "menu",
    moduleLabel: "Menu Management",
    icon: "ri-menu-line",
    submenus: [
      { name: "category", label: "Categories" },
      { name: "item", label: "Items" }
    ]
  },
  {
    _id: "4",
    module: "user",
    moduleLabel: "User",
    icon: "ri-user-line",
    submenus: [
      { name: "restaurant-admin", label: "Restaurant Admins" },
      { name: "staff", label: "Staff Users" }
    ]
  },

  // {
  //   _id: "5",
  //   module: "roles",
  //   moduleLabel: "Roles",
  //   icon: "ri-shield-user-line",
  //   submenus: [
  //     { name: "create-role", label: "Create Role" }
  //   ]
  // },

  {
    _id: "6",
    module: "permissions",
    moduleLabel: "Permissions",
    icon: "ri-lock-2-line",
    submenus: [
      { name: "permission", label: "Permission" },
      // { name: "role", label: "Assign to Role" }
    ]
  }
];

export default function SideBar({ user }) {
  const sidebar = useSelector(state => state.sidebar.list);
  const menuToRender = user?.role?.name === "Super Admin" ? superAdminMenu : sidebar;
  const [openMenus, setOpenMenus] = useState({});

  // Sort menu to show dashboard at the top if it exists
  const sortedMenu = [...menuToRender].sort((a, b) => {
    if (a.module === "dashboard") return -1;
    if (b.module === "dashboard") return 1;
    return 0;
  });

  console.log("Sidebar me kya kya hai bhai mere",sidebar)

  return (
    <>
      <nav className="nxl-navigation">
        <div className="navbar-wrapper">
          <div className="m-header">
            <a href="index.html" className="b-brand">
              <img
                src="assets/images/logo-full.png"
                alt=""
                className="logo logo-lg"
              />
              <img
                src="assets/images/logo-abbr.png"
                alt=""
                className="logo logo-sm"
              />
            </a>
          </div>
          <div className="navbar-content">
            <ul className="nxl-navbar">
              <li className="nxl-item nxl-caption">
                <label>Navigation</label>
              </li>
              {sortedMenu.map((menu) => {
                const hasSub = menu.submenus?.length > 0;
                if (hasSub) {
                  return (
                    <li className="nxl-item nxl-hasmenu" key={menu._id}>
                      <a href="#" className="nxl-link" onClick={(e) => {   e.preventDefault();   setOpenMenus(prev => ({...prev, [menu._id]: !prev[menu._id]   })); }}>

                        <span className="nxl-micon">
                          <i className={menu.icon} />
                        </span>
                        <span className="nxl-mtext">{menu.moduleLabel}</span>
                        <span className="nxl-arrow">
                          <i className="feather-chevron-right" />
                        </span>
                      </a>
                      <ul className="nxl-submenu" style={{ display: openMenus[menu._id] ? 'block' : 'none' }}>
                        {menu.submenus.map((sub, sIndex) => {
                          if (sub.submenus) {
                            return (
                              <li className="nxl-item nxl-hasmenu" key={sIndex}>
                                <a
                                  href="#"
                                  className="nxl-link"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setOpenMenus(prev => ({
                                      ...prev,
                                      [`${menu._id}-${sIndex}`]: !prev[`${menu._id}-${sIndex}`]
                                    }));
                                  }}
                                >

                                  <span className="nxl-mtext">{sub.label}</span>
                                  <span className="nxl-arrow">
                                    <i className="feather-chevron-right" />
                                  </span>
                                </a>
                                <ul className="nxl-submenu" style={{ display: openMenus[`${menu._id}-${sIndex}`] ? 'block' : 'none' }}>
                                  {sub.submenus.map((subsub, ssIndex) => (
                                    <li className="nxl-item" key={ssIndex}>
                                      <Link className="nxl-link" to={`/${subsub.module}/${subsub.name}`}>
                                        {subsub.label}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </li>
                            );
                          } else {
                            return (
                              <li className="nxl-item" key={sIndex}>
                                <Link className="nxl-link" to={`${sub.name}`}>
                                  {sub.label}
                                </Link>
                              </li>
                            );
                          }
                        })}
                      </ul>
                    </li>
                  );
                } else {
                  return (
                    <li className="nxl-item" key={menu._id}>
                      <Link to={`/${menu.module}`} className="nxl-link">
                        <span className="nxl-micon">
                          <i className={menu.icon} />
                        </span>
                        <span className="nxl-mtext">{menu.moduleLabel}</span>
                      </Link>
                    </li>
                  );
                }
              })}


              {/*********************  For Testing  *************************/}

              {/* 
              <li className="nxl-item nxl-caption">
                <label><Link to="/user">User</Link></label>

              </li>
              <li className="nxl-item nxl-caption">

                <label><Link to="/create-role">Role</Link></label>
              </li>
              <li className="nxl-item nxl-caption">

                <label><Link to="/permission">Permission</Link></label>
              </li> */}



            </ul>
            {/* <div className="card text-center">
              <div className="card-body">
                <i className="feather-sunrise fs-4 text-dark" />
                <h6 className="mt-4 text-dark fw-bolder">Downloading Center</h6>
                <p className="fs-11 my-3 text-dark">
                  Duralux is a production ready CRM to get started up and running
                  easily.
                </p>
                <a
                  href="https://www.themewagon.com/themes/Duralux-admin"
                  target="_blank"
                  className="btn btn-primary text-dark w-100"
                >
                  Download Now
                </a>
              </div>
            </div> */}
          </div>
        </div>
      </nav>
    </>
  );
}