import LayoutConfigTypes from "@/core/config/LayoutConfigTypes";

const config: LayoutConfigTypes = {
  general: {
    mode: "dark",
    primaryColor: "#50CD89",
    pageWidth: "default",
    layout: "light-sidebar",
  },
  header: {
    display: true,
    default: {
      container: "fluid",
      fixed: {
        desktop: true,
        mobile: false,
      },
      menu: {
        display: true,
        iconType: "font", //change this to svg if you want svg
      },
    },
  },
  sidebar: {
    display: true,
    default: {
      minimize: {
        desktop: {
          enabled: true,
          default: true,
          hoverable: true,
        },
      },
      menu: {
        iconType: "font", //change this to svg if you want svg
      },
    },
  },
  toolbar: {
    display: true,
    container: "fluid",
    fixed: {
      desktop: false,
      mobile: false,
    },
  },
  pageTitle: {
    display: true,
    breadcrumb: true,
    direction: "column",
  },
  content: {
    container: "fluid",
  },
  footer: {
    display: true,
    container: "fluid",
    fixed: {
      desktop: false,
      mobile: false,
    },
  },
  illustrations: {
    set: "sketchy-1",
  },
  scrolltop: {
    display: true,
  },
};

export default config;
