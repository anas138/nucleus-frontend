import ApiService from "./ApiService";

export const getDashboardListData = async () => {
  const res = await ApiService.get("/app-dashboard");
  return res.data.data;
};

export const createCustomDashboard = async (body) => {
  const res = await ApiService.post("/app-dashboard", body);
  return res.data;
};

export const addWidgetCustomDashboard = async (param, body) => {
  const res = await ApiService.post(`/app-dashboard/${param}/widget`, body);
  return res.data;
};

export const getWidgetByDashboard = async (id) => {
  const res = await ApiService.get("/app-dashboard", id);
  return res.data.data;
};

export const updateDashboard = async (id, body) => {
  const res = await ApiService.updateByPatch("/app-dashboard", id, body);
  return res.data;
};

export const deleteWiget = async (id) => {
  const res = await ApiService.delete(`/app-dashboard-widget/${id}`);
  return res.data;
};

export const updateWidgetName = async (id, body) => {
  const res = await ApiService.update("/app-dashboard-widget", id, body);
  return res.data;
};

export const deleteDashboard = async (id) => {
  const res = await ApiService.delete(`/app-dashboard/${id}`);
  return res.data;
};
