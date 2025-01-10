<template>
  <!--begin::sidebar menu-->
  <div class="app-sidebar-menu overflow-hidden flex-column-fluid">
    <!--begin::Menu wrapper-->
    <div
      id="kt_app_sidebar_menu_wrapper"
      class="app-sidebar-wrapper hover-scroll-overlay-y my-5"
      data-kt-scroll="true"
      data-kt-scroll-activate="true"
      data-kt-scroll-height="auto"
      data-kt-scroll-dependencies="#kt_app_sidebar_logo, #kt_app_sidebar_footer"
      data-kt-scroll-wrappers="#kt_app_sidebar_menu"
      data-kt-scroll-offset="5px"
      data-kt-scroll-save-state="true"
    >
      <!--begin::Menu-->
      <div
        id="#kt_app_sidebar_menu"
        class="menu menu-column menu-rounded menu-sub-indention px-3"
        data-kt-menu="true"
      >
        <template v-for="(item, i) in menuList" :key="i">
          <div
            v-if="item.heading && !item.list && $hasPermission(item.permission)"
            class="menu-item pt-5"
          >
            <div class="menu-content">
              <span class="menu-heading fw-bold text-uppercase fs-7">
                {{ translate(item.heading) }}
              </span>
            </div>
          </div>
          <template v-for="(menuItem, j) in item.pages" :key="j">
            <template
              v-if="
                menuItem.heading &&
                $hasPermission(menuItem.permission) &&
                $hasPermission(item.permission)
              "
            >
              <div class="menu-item">
                <router-link
                  class="menu-link"
                  active-class="active"
                  :to="menuItem.route"
                >
                  <span
                    v-if="menuItem.svgIcon || menuItem.fontIcon"
                    class="menu-icon"
                  >
                    <i
                      v-if="sidebarMenuIcons === 'font'"
                      :class="menuItem.fontIcon"
                    ></i>
                    <span
                      v-else-if="sidebarMenuIcons === 'svg'"
                      class="svg-icon svg-icon-2"
                    >
                      <inline-svg :src="menuItem.svgIcon" />
                    </span>
                  </span>
                  <span class="menu-title">{{
                    translate(menuItem.heading)
                  }}</span>
                </router-link>
              </div>
            </template>
            <div
              v-if="
                menuItem.sectionTitle && $hasPermission(menuItem.permission)
              "
              :class="{ show: hasActiveChildren(menuItem.route) }"
              class="menu-item menu-accordion"
              data-kt-menu-sub="accordion"
              data-kt-menu-trigger="click"
            >
              <span class="menu-link">
                <span
                  v-if="menuItem.svgIcon || menuItem.fontIcon"
                  class="menu-icon"
                >
                  <i
                    v-if="sidebarMenuIcons === 'font'"
                    :class="menuItem.fontIcon"
                  ></i>
                  <span
                    v-else-if="sidebarMenuIcons === 'svg'"
                    class="svg-icon svg-icon-2"
                  >
                    <inline-svg :src="menuItem.svgIcon" />
                  </span>
                </span>
                <span class="menu-title">{{
                  translate(menuItem.sectionTitle)
                }}</span>
                <span class="menu-arrow"></span>
              </span>
              <div
                :class="{ show: hasActiveChildren(menuItem.route) }"
                class="menu-sub menu-sub-accordion menu-sub-height"
              >
                <template v-for="(item2, k) in menuItem.sub" :key="k">
                  <div
                    v-if="item2.heading && $hasPermission(item2.permission)"
                    class="menu-item"
                  >
                    <router-link
                      class="menu-link menu-item-padding"
                      active-class="active"
                      :to="item2.route"
                    >
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(
                          item2.heading.length >
                            AppConstants.SIDE_MENU_ITEMS
                              .SIDE_MENU_SUB_ITEM_LENGTH
                            ? `${item2.heading.slice(
                                0,
                                AppConstants.SIDE_MENU_ITEMS
                                  .SIDE_MENU_SUB_ITEM_LENGTH
                              )} ....`
                            : item2.heading
                        )
                      }}</span>
                    </router-link>
                    <!-- <span
                      class="menu-link p-0 mt-3"
                      @click="() => (openAddDashboardDrawer = true)"
                      v-if="menuItem.sub.length - 1 == k"
                    >
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span> </span
                      ><span class="menu-title">Add New</span>
                    </span> -->
                  </div>
                  <div
                    v-if="
                      item2.sectionTitle && $hasPermission(item2.permission)
                    "
                    :class="{ show: hasActiveChildren(item2.route) }"
                    class="menu-item menu-accordion"
                    data-kt-menu-sub="accordion"
                    data-kt-menu-trigger="click"
                  >
                    <span class="menu-link">
                      <span class="menu-bullet">
                        <span class="bullet bullet-dot"></span>
                      </span>
                      <span class="menu-title">{{
                        translate(item2.sectionTitle)
                      }}</span>
                      <span class="menu-arrow"></span>
                    </span>
                    <div
                      :class="{ show: hasActiveChildren(item2.route) }"
                      class="menu-sub menu-sub-accordion"
                    >
                      <template v-for="(item3, k) in item2.sub" :key="k">
                        <div
                          v-if="
                            item3.heading && $hasPermission(item3.permission)
                          "
                          class="menu-item"
                        >
                          <router-link
                            class="menu-link"
                            active-class="active"
                            :to="item3.route"
                          >
                            <span class="menu-bullet">
                              <span class="bullet bullet-dot"></span>
                            </span>
                            <span class="menu-title">{{
                              translate(item3.heading)
                            }}</span>
                          </router-link>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <router-link
              class="add_more_button-text"
              :to="menuItem.customButtonRoute"
              v-if="menuItem.addButton"
              ><span class="menu-title"
                ><i class="fa-solid fa-plus text-gray me-3"></i> Add New</span
              >
            </router-link>
          </template>
        </template>
        <!--begin:Menu item-->
        <!--end:Menu item-->
      </div>
      <!--end::Menu-->
    </div>
    <!--end::Menu wrapper-->
  </div>
  <!--end::sidebar menu-->
</template>

<script>
import { defineComponent, onMounted, onBeforeMount, ref, computed } from "vue";
import { useRoute } from "vue-router";
import MainMenuConfig from "@/core/config/MainMenuConfig";
import { sidebarMenuIcons } from "@/core/helpers/config";
import { useI18n } from "vue-i18n";
import { ModuleName } from "@/store/enums/module-enum";
import { useStore } from "vuex";
import { AppConstants } from "@/constants/app-constants";

export default defineComponent({
  name: "sidebar-menu",
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const scrollElRef = (ref < null) | (HTMLElement > null);
    const store = useStore();

    const menuList = computed(
      () => store.getters[`${ModuleName.Dashboard}/getDashboardlist`]
    );

    onMounted(() => {
      if (scrollElRef.value) {
        scrollElRef.value.scrollTop = 0;
      }
    });

    const translate = (text) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    const hasActiveChildren = (match) => {
      return route.path.indexOf(match) !== -1;
    };

    return {
      AppConstants,
      hasActiveChildren,
      MainMenuConfig,
      menuList,
      sidebarMenuIcons,
      translate,
    };
  },
});
</script>
<style scoped>
.menu-sub-height {
  min-height: 0px;
  max-height: 150px;
  overflow-y: auto;
}
.menu-item-padding {
  padding: 0.5rem 0.75rem;
}

.add_more_button-text {
  padding: 0.5rem 1.65rem;
  color: var(--kt-gray-700);
}
.add_more_button-text:hover {
  color: var(--kt-primary);
  cursor: pointer;
}

.add_more_button-text:hover .fa-solid {
  color: var(--kt-primary) !important;
}
</style>
