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
          <a
            class="navbar-item"
          >
            Home
          </a>

          <a class="navbar-item">
            Documentation
          </a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              More
            </a>

            <div class="navbar-dropdown">
              <a class="navbar-item">
                About
              </a>
              <a class="navbar-item">
                Jobs
              </a>
              <a class="navbar-item">
                Contact
              </a>
              <hr class="navbar-divider">
              <a class="navbar-item">
                Report an issue
              </a>
            </div>
          </div>
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
.navbar-menu.is-active {
  -webkit-transition: all 0.4s;
  -moz-transition: all 0.4s;
  -ms-transition: all 0.4s;
  -o-transition: all 0.4s;
  transition: all 0.4s;

  z-index: 1;
  max-height: 100vh;
  opacity: 1;
}
.navbar-menu {
  display: block;

  -webkit-transition: all 0.1s;
  -moz-transition: all 0.1s;
  -ms-transition: all 0.1s;
  -o-transition: all 0.1s;
  transition: all 0.1s;

  max-height: 0;
  overflow: hidden;
  opacity: 0;
}
#navbar-base {
  height: 3.25rem;
}
</style>
