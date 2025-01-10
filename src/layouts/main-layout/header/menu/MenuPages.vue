<template>
  <template v-for="(item, i) in menuList" :key="i">
    <template v-if="!item.heading">
      <template v-for="(menuItem, j) in item.pages" :key="j">
        <div
          v-if="menuItem.heading && $hasPermission(menuItem.permission)"
          class="menu-item me-lg-1"
        >
          <router-link
            class="menu-link"
            :to="menuItem.route"
            active-class="active"
          >
            <span class="menu-title">{{ translate(menuItem.heading) }}</span>
          </router-link>
        </div>
      </template>
    </template>
    <div
      v-if="item.heading && $hasPermission(item.permission)"
      data-kt-menu-trigger="click"
      data-kt-menu-placement="bottom-start"
      class="menu-item menu-lg-down-accordion me-lg-1"
    >
      <span
        class="menu-link py-3"
        :class="{ active: hasActiveChildren(item.route) }"
      >
        <span class="menu-title">{{ translate(item.heading) }}</span>
        <span class="menu-arrow d-lg-none"></span>
      </span>
      <div
        class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-rounded-0 py-lg-4 w-lg-225px"
      >
        <template v-for="(menuItem, j) in item.pages" :key="j">
          <div
            v-if="menuItem.sectionTitle && $hasPermission(menuItem.permission)"
            data-kt-menu-trigger="{default:'click', lg: 'hover'}"
            data-kt-menu-placement="right-start"
            class="menu-item menu-lg-down-accordion"
          >
            <span
              class="menu-link py-3"
              :class="{ active: hasActiveChildren(menuItem.route) }"
            >
              <span class="menu-icon">
                <i
                  v-if="headerMenuIcons === 'font'"
                  :class="menuItem.fontIcon"
                ></i>
                <span
                  v-if="headerMenuIcons === 'svg'"
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
              class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
            >
              <template v-for="(menuItem1, k) in menuItem.sub" :key="k">
                <div
                  v-if="
                    menuItem1.sectionTitle &&
                    $hasPermission(menuItem1.permission)
                  "
                  data-kt-menu-trigger="{default:'click', lg: 'hover'}"
                  data-kt-menu-placement="right-start"
                  class="menu-item menu-lg-down-accordion"
                >
                  <span
                    class="menu-link py-3"
                    :class="{ active: hasActiveChildren(menuItem1.route) }"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(menuItem1.sectionTitle)
                    }}</span>
                    <span class="menu-arrow"></span>
                  </span>
                  <div
                    class="menu-sub menu-sub-lg-down-accordion menu-sub-lg-dropdown menu-active-bg py-lg-4 w-lg-225px"
                  >
                    <template v-for="(menuItem2, l) in menuItem1.sub" :key="l">
                      <div class="menu-item">
                        <router-link
                          class="menu-link py-3"
                          active-class="active"
                          :to="menuItem2.route"
                        >
                          <span class="menu-bullet">
                            <span class="bullet bullet-dot"></span>
                          </span>
                          <span class="menu-title">{{
                            translate(menuItem2.heading)
                          }}</span>
                        </router-link>
                      </div>
                    </template>
                  </div>
                </div>
                <div
                  v-if="
                    menuItem1.heading && $hasPermission(menuItem1.permission)
                  "
                  class="menu-item"
                >
                  <router-link
                    class="menu-link"
                    active-class="active"
                    :to="menuItem1.route"
                  >
                    <span class="menu-bullet">
                      <span class="bullet bullet-dot"></span>
                    </span>
                    <span class="menu-title">{{
                      translate(menuItem1.heading)
                    }}</span>
                  </router-link>
                </div>
              </template>
            </div>
          </div>
          <div v-if="menuItem.heading" class="menu-item">
            <router-link
              v-if="$hasPermission(menuItem.permission)"
              class="menu-link"
              active-class="active"
              :to="menuItem.route"
            >
              <span class="menu-icon">
                <!-- <span class="svg-icon svg-icon-2">
                  <inline-svg src="/media/icons/duotune/layouts/lay009.svg" />
                </span> -->
                <i :class="menuItem.fontIcon"></i>
              </span>
              <span class="menu-title">{{ translate(menuItem.heading) }}</span>
            </router-link>
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
      </div>
    </div>
  </template>
</template>

<script lang="ts">
import { defineComponent, computed, watch } from "vue";
import { useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import MainMenuConfig from "@/core/config/MainMenuConfig";
import { headerMenuIcons } from "@/core/helpers/config";
import { useStore } from "vuex";
import { ModuleName } from "@/store/enums/module-enum";

export default defineComponent({
  name: "KTMenu",
  components: {},
  setup() {
    const { t, te } = useI18n();
    const route = useRoute();
    const store = useStore();

    const menuList = computed(
      () => store.getters[`${ModuleName.Dashboard}/getDashboardlist`]
    );

    const hasActiveChildren = (match) => {
      return route.path.indexOf(match) !== -1;
    };

    const translate = (text) => {
      if (te(text)) {
        return t(text);
      } else {
        return text;
      }
    };

    return {
      hasActiveChildren,
      headerMenuIcons,
      menuList,
      MainMenuConfig,
      translate,
    };
  },
});
</script>

<style scoped>
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
