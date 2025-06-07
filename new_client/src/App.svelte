<nav class={mobileMenuEnabled ? 'active' : ''}>
  <div class="hamburger">
    <div onclick={() => mobileMenuEnabled = !mobileMenuEnabled}>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
  <ul class="menu">
    <li onclick={() => changeView(View.Calculator)}>CALCULATOR</li>
    <li onclick={() => changeView(View.Solutions)}>SOLUTIONS</li>
    <li onclick={() => changeView(View.Fertilizers)}>FERTILIZERS</li>
    <li onclick={() => changeView(View.Chat)}>CHAT</li>
    <li onclick={() => changeView(View.About)}>ABOUT</li>
  </ul>
</nav>
<main>
  {#if currentView === View.Calculator}
    <span>Calculator</span>
  {:else if currentView === View.Solutions}
    <Solutions />
  {:else if currentView === View.Fertilizers}
    <Fertilizers />
  {:else if currentView === View.Chat}
    <span>Chat</span>
  {:else if currentView === View.About}
    <span>About</span>
  {:else}
    <span>Error</span>
  {/if}
</main>

<style lang="scss">
  @import '@/styles/mixins';
  @import '@/styles/variables';

  main {
    span {
      font-size: 3rem;
      font-weight: 700;
    }
  }

  nav {
    ul {
      display: grid;
      flex-wrap: wrap;
      grid-auto-rows: 1fr;
      margin: 0;
      padding: 0;

      @include respond(medium) {
        grid-template-columns: repeat(5, 1fr);
      }

      gap: 1rem;
      list-style: none;

      li {
        background-color: #0bc2e7;
        padding: 1rem;
        cursor: pointer;
        text-align: center;
        border: none;
        a {
          color: #fff;
          text-decoration: none;
          font-size: 1rem;
        }
      }
      li:hover {
        background-color: #0b9fe7;
      }
    }

    .hamburger {
      display: none;
      width: 100%;
      background-color: rgb(126, 124, 124);
      div {
        display: inherit;
        flex-direction: column;
        cursor: pointer;
        padding: 10px;
        gap: 4px;
        span {
            background-color:#02141e;
            height: 3px;
            width: 25px;
          }
      }
    }

    @include respond(small) {
      ul {
        display: none;
        flex-direction: column;
        background-color: $primary-color;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        li {
          flex: 1;
          display: inherit; // vertically align text
          text-align: center;
          justify-content: center;
          align-items: center;
        }
      }

      .hamburger {
        display: flex;
      }

      &.active {
        ul {
          display: flex;
        }
      }
    }
  }
</style>

<script lang="ts">
  import Solutions from "./view/Solutions.svelte";
  import Fertilizers from "./view/Fertilizers.svelte";

  enum View {
    Calculator,
    Solutions,
    Fertilizers,
    Chat,
    About
  };

  let mobileMenuEnabled = $state(false);
  let currentView= $state(View.Calculator);

  const changeView = (view: View) => {
    mobileMenuEnabled = false;
    currentView = view;
  }
</script>