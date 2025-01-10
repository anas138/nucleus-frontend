<template>
  <!--begin::Menu-->
  <div
    class="menu menu-sub menu-sub-dropdown menu-column w-325px w-sm-450px"
    data-kt-menu="true"
  >
    <!--begin::Heading-->
    <div class="d-flex flex-column bgi-no-repeat rounded-top">
      <!--begin::Title-->
      <h3 class="fw-semobold px-7 mt-10 mb-6">
        Notifications
        <!-- <span class="fs-8 opacity-75 ps-3">24 reports</span> -->
      </h3>
      <!--end::Title-->

      <!--begin::Tabs-->
      <ul
        class="nav nav-line-tabs nav-line-tabs-2x nav-stretch fw-semobold px-7"
      >
        <li class="nav-item">
          <a
            class="nav-link text-active-primary fw-bold opacity-75 opacity-state-100 pb-4 active"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_1"
            >Trouble Ticket</a
          >
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-active-primary fw-bold opacity-75 opacity-state-100 pb-4"
            data-bs-toggle="tab"
            href="#kt_topbar_notifications_2"
            >Others</a
          >
        </li>
      </ul>
      <!--end::Tabs-->
    </div>
    <!--end::Heading-->

    <!--begin::Tab content-->
    <div class="tab-content">
      <!--begin::Tab panel-->
      <div
        class="tab-pane fade show active"
        id="kt_topbar_notifications_1"
        role="tabpanel"
      >
        <!--begin::Items-->
        <TroubleticketNotificationsSubmenu />
        <!--end::Items-->
      </div>
      <!--end::Tab panel-->

      <!--begin::Tab panel-->
      <div class="tab-pane fade" id="kt_topbar_notifications_2" role="tabpanel">
        <!--begin::Items-->
        <OtherNotificationsSubmenu />
        <!--end::Items-->
      </div>
      <!--end::Tab panel-->
    </div>
    <!--end::Tab content-->
  </div>
  <!--end::Menu-->
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TroubleticketNotificationsSubmenu from "./TroubleticketNotificationsSubmenu.vue";
import OtherNotificationsSubmenu from "./OtherNotificationsSubmenu.vue";

export default defineComponent({
  name: "notifications-menu",
  components: { TroubleticketNotificationsSubmenu, OtherNotificationsSubmenu },
  setup() {
    return {};
  },
});
</script>
