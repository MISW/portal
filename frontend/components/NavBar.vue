<template>
  <div id="navbar-base">
    <nav
      class="navbar"
      role="navigation"
      aria-label="main navigation">
      <div class="navbar-brand">
        <div
          id="navbar-icon"
          class="navbar-item"
          style="font-size: 1.5rem"
        >
          <img
            src="~/static/icon.png"
            alt="MIS.W (Management Information Society of Waseda University)"
            style="max-height:3.25rem"
          >
          MIS.W Portal
        </div>

        <a
          role="button"
          class="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          @click="isMenuActive = !isMenuActive">
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
          <span aria-hidden="true"/>
        </a>
      </div>
      <div
        :class="{'is-active': isMenuActive}"
        class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link
            v-for="item in links"
            :to="item.link"
            :key="item.name"
            class="navbar-item"
          >
            {{ item.name }}
          </nuxt-link>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a class="button is-light">
                Log in
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  props: {
    links: {
      type: Array,
      default: () => []
    }
  },
  data: () => {
    return {
      isMenuActive: false
    }
  },
  watch: {
    $route() {
      this.isMenuActive = false
    }
  }
}
</script>


<style>
#navbar-icon {
  padding-top: 0;
  padding-bottom: 0;
}

@media screen and (max-width: 1087px) {
  .navbar-menu.is-active {
    transition: all 0.4s;

    z-index: 1;
    max-height: 100vh;
    opacity: 1;
  }
  .navbar-menu {
    display: block;

    transition: none;

    max-height: 0;
    overflow: hidden;
    opacity: 0;
  }
}
#navbar-base {
  height: 3.25rem;
}
</style>
