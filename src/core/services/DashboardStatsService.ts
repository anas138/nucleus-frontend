import { getCSSVariableValue } from "@/assets/ts/_utils";
import { ApexOptions } from "apexcharts";
import ApiService from "./ApiService";
import { AppConstants } from "@/constants/app-constants";

export const getTxDashboardStatsGraphsData = async (query) => {
  console.log({ query });

  const queryParams = new URLSearchParams(query).toString();
  const resp = await ApiService.get(
    "dashboard-stats",
    `trends/transmission?${queryParams}`
  );
  return resp.data.data;
};
export const getIpDashboardStatsGraphsData = async (query) => {
  const queryParams = new URLSearchParams(query).toString();
  const resp = await ApiService.get(
    "dashboard-stats",
    `trends/ip?${queryParams}`
  );
  return resp.data.data;
};

export const getGponDashboardStatsGraphsData = async (query) => {
  const queryParams = new URLSearchParams(query).toString();
  const resp = await ApiService.get(
    "dashboard-stats",
    `trends/gpon?${queryParams}`
  );
  return resp.data.data;
};

export const getNokiaTXNDashboardStatsGraphsData = async (query) => {
  const queryParams = new URLSearchParams(query).toString();
  const resp = await ApiService.get(
    "dashboard-stats",
    `trends/nokia-txn?${queryParams}`
  );
  return resp.data.data;
};

export const getLDISoftswitchEMSDashboardStatsGraphsData = async (query) => {
  const queryParams = new URLSearchParams(query).toString();
  const resp = await ApiService.get(
    "dashboard-stats",
    `trends/ldi-softswitch?${queryParams}`
  );
  return resp.data.data;
};

export const getDashboardStatsCounts = async (
  networkType,
  query,
  appType?: string
) => {
  const queryParams = new URLSearchParams(query).toString();
  let slug: string;
  switch (networkType) {
    case AppConstants.NETWORK_TYPE.TRANSMISSION:
      if (appType === AppConstants.APP_TYPE.NCE) {
        slug = `counts/transmission?${queryParams}`;
      } else {
        slug = `counts/nokia-txn?${queryParams}`;
      }
      break;
    case AppConstants.NETWORK_TYPE.IP:
      slug = `counts/ip?${queryParams}`;
      break;
    case AppConstants.NETWORK_TYPE.GPON:
      slug = `counts/gpon?${queryParams}`;
      break;
    case AppConstants.NETWORK_TYPE.LDI_SOFTSWITCH:
      slug = `counts/ldi-softswitch?${queryParams}`;
      break;
    default:
      slug = "";
      break;
  }
  const resp = await ApiService.get("dashboard-stats", slug);
  return resp.data.data;
};

export const chartOptions = (
  xaxisCategories,
  showXAxisLabels = false,
  customSeriesName = "",
  showDataLabels = false
): ApexOptions => {
  const labelColor = getCSSVariableValue("--kt-gray-500");
  const borderColor = getCSSVariableValue("--kt-gray-200");
  const baseColor = getCSSVariableValue("--kt-primary");
  const secondaryColor = getCSSVariableValue("--kt-gray-300");
  const dataLabelColor = getCSSVariableValue("--kt-gray-700");

  return {
    chart: {
      fontFamily: "inherit",
      type: "bar",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "15%",
        borderRadius: 5,
        dataLabels: {
          position: "top", // top, center, bottom
        },
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: showDataLabels,
      offsetY: -20,
      style: {
        colors: [dataLabelColor],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: xaxisCategories || ["Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "10px",
        },
        show: showXAxisLabels,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        // title: {
        //   formatter: (seriesName) =>
        //     customSeriesName ? customSeriesName : seriesName,
        // },
        formatter: function (val) {
          // return "$" + val + " thousands";
          return val.toString();
        },
      },
    },
    colors: [baseColor, secondaryColor],
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
  };
};
