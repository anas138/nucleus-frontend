import Swal from "sweetalert2/dist/sweetalert2.js";
import { AxiosResponse } from "axios";
import CurdApiService from "../services/CurdApiService";
import router from "@/router";
import { ElNotification } from "element-plus";

export function AlertForCreate(response: AxiosResponse, resource: string) {
  if (response.status === 201) {
    ElNotification({
      title: "Success",
      message: `${response.data.message || "Resource Created"}`,
      type: "success",
    });
    router.push({ name: `${resource}-list` });
  }
}

export function AlertForEdit(
  response: AxiosResponse,
  resource: string,
  id?: string | number
) {
  if (response.status === 200) {
    ElNotification({
      title: "Success",
      message: `${response.data.message || "Resource Edited"}`,
      type: "success",
    });
    if (id) router.go(-1);
    else router.push({ name: `${resource}-list` });
  }
}

export async function AlertForDelete(resource: string, id: string | number) {
  const response = await Swal.fire({
    text: `Are You Sure You Want to Delete this ${resource}`,
    icon: "error",
    showCancelButton: true,
    buttonsStyling: false,
    confirmButtonText: "Ok",
    cancelButtonText: "Cancel",
    customClass: {
      confirmButton: "btn fw-semobold btn-light-danger",
      cancelButton: "btn fw-semobold btn-secondary",
    },
  });

  if (response.isConfirmed) {
    const response = await CurdApiService.deleteResource(resource, id);
    if (response.status === 200) {
      ElNotification({
        title: "Success",
        message: `${response.data.message || "Resource Deleted"}`,
        type: "success",
      });
    }
    return true;
  }
  return false;
}

export function SweetAlertForServerDown() {
  Swal.fire({
    text: "Either your network is not working or Server is down",
    icon: "info",
    buttonsStyling: false,
    confirmButtonText: "Ok",
    customClass: {
      confirmButton: "btn fw-semobold btn-light-primary",
    },
  });
  return Promise.reject();
}

export const swalConfirmation = (message: string, callback?: () => void) => {
  Swal.fire({
    title: `Confirmation`,
    text: message ? message : `Are you sure ?`,
    icon: "info",
    buttonsStyling: false,
    showCancelButton: true,
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-secondary",
    },
  })
    .then(async (confirmed) => {
      if (confirmed.isConfirmed && callback) {
        callback();
      }
    })
    .catch((error) => Promise.reject(error));
};

export const swalSuccessConfirmation = (
  title: string | null,
  message: string | null,
  confirmButtonText: string | null,
  cancelButtonText: string | null,
  callback?: () => void
) => {
  Swal.fire({
    title: title,
    text: message,
    icon: "success",
    buttonsStyling: false,
    showCancelButton: true,
    confirmButtonText: confirmButtonText || "Ok",
    cancelButtonText: cancelButtonText || "Cancel",
    customClass: {
      confirmButton: "btn btn-primary",
      cancelButton: "btn btn-secondary",
    },
  })
    .then(async (confirmed) => {
      if (confirmed.isConfirmed && callback) {
        callback();
      }
    })
    .catch((error) => Promise.reject(error));
};

export const swalSuccess = (
  title: string | null,
  message: string | null,
  confirmButtonText: string | null,
  callback?: () => void
) => {
  Swal.fire({
    icon: "success",
    title: title,
    text: message,
    confirmButtonText: confirmButtonText || "Ok",
    buttonsStyling: false,
    customClass: {
      confirmButton: "btn btn-primary",
    },
  }).then((confirmed) => {
    if (callback) {
      callback();
    }
  });
};
