<template>
  <div class="generate-idea-layout">
    <!-- Dice statistics -->
    <div class="die-combinations-stats" v-if="totalNumberOfDice > 0">
      <div>A total of </div>
      <h1>{{ totalCombinations }} {{ (totalCombinations > 1) ? 'combinations' : 'combination'}}</h1>
      <div>with</div>
      <h1>{{ totalNumberOfDice }} {{ (totalNumberOfDice > 1) ? 'dice' : 'die' }}</h1>
      <h2 v-if="totalNumberOfEmptyDice > 0">(and {{ totalNumberOfEmptyDice }} empty {{ (totalNumberOfEmptyDice > 1) ? 'dice' : 'die' }})</h2>
    </div>
    <div class="die-combinations-stats" v-else-if="dice.length > 0 && dice.length === totalNumberOfAllEmptyDice">
      <h1>Seems like all of the dice is empty.</h1>
      <div>Add some items on all of the dice. Then press the 'Generate Idea' button and let your imagination free. 🙂</div>
    </div>
    <div v-else-if="dice.length <= 0" class="die-combinations-stats">
      <h1>No die. No try. 😁</h1>
      <div v-if="dice.length <= 0">
        <p>You don't have any dice yet. Add a die and name the items that you want to be included.</p>
        <p>Otherwise, you could see a <a @click="$emit('set-sample-set')">sample dice set straight from Atomic Shrimp's Invention Dice</a> (look up this <a href="https://www.youtube.com/watch?v=NBdVpiWUKhU">video</a> for reference).</p>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="action-buttons">
      <button v-tooltip="'Add an empty die'" @click="$emit('add-die')">
        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 51 51">
          <polygon points="45,0.5 0,0.5 0,43.5 5,43.5 5,6.5 45,6.5"/>
          <path d="M7,8.5v42h44v-42H7z M40,30.5H30v10c0,0.553-0.447,1-1,1s-1-0.447-1-1v-10H18c-0.553,0-1-0.447-1-1s0.447-1,1-1h10v-10
          c0-0.553,0.447-1,1-1s1,0.447,1,1v10h10c0.553,0,1,0.447,1,1S40.553,30.5,40,30.5z"/>
        </svg>
      </button>
      <button v-tooltip="'Generate an idea set'" :disabled="totalCombinations <= 1" @click="$emit('generate-idea')">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
        viewBox="0 0 455 455" style="enable-background:new 0 0 455 455;" xml:space="preserve">
        <path d="M0,0v455h455V0H0z M103.75,386.25c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S123.08,386.25,103.75,386.25z
        M103.75,138.75c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S123.08,138.75,103.75,138.75z M227.5,262.5
        c-19.33,0-35-15.67-35-35s15.67-35,35-35s35,15.67,35,35S246.83,262.5,227.5,262.5z M351.25,386.25c-19.33,0-35-15.67-35-35
        s15.67-35,35-35s35,15.67,35,35S370.58,386.25,351.25,386.25z M351.25,138.75c-19.33,0-35-15.67-35-35s15.67-35,35-35
        s35,15.67,35,35S370.58,138.75,351.25,138.75z"/></svg>
      </button>
      <Popover popoverInnerClass="dice-popover-content">
        <button v-tooltip="'Group lock options'">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-5 7.723v2.277h-2v-2.277c-.595-.347-1-.984-1-1.723 0-1.104.896-2 2-2s2 .896 2 2c0 .738-.404 1.376-1 1.723zm-5-7.723v-4c0-2.206 1.794-4 4-4 2.205 0 4 1.794 4 4v4h-8z"/></svg>
        </button>

        <template slot="popover">
          <button :disabled="dice.length <= 0" v-tooltip="'Lock all dice'" @click.left="$emit('lock-dice', 'lock')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z"/></svg>
          </button>
          <button :disabled="dice.length <= 0" v-tooltip="'Unlock all dice'" @click.left="$emit('lock-dice', 'unlock')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-4v14h18v-14h-12z"/></svg>
          </button>
          <button :disabled="dice.length <= 0" v-tooltip="'Toggle all die locks'" @click.left="$emit('lock-dice', 'toggle')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21 21v3h-18v-3h18zm-13-15c0-2.206 1.795-4 4-4s4 1.794 4 4v3h2v-3c0-3.313-2.687-6-6-6s-6 2.687-6 6v3h2v-3zm13 8v-3h-18v3h18zm0 5v-3h-18v3h18z"/></svg>
          </button>
        </template>
      </Popover>

      <Popover popoverInnerClass="dice-popover-content">
        <button v-tooltip="'File options'">
          <svg viewBox="0 0 24 24">
            <path d="M 2 0 L 2 24 L 22 24 L 22 8 L 14 8 L 14 0 L 2 0 z M 16 0 L 16 6 L 22 6 L 16 0 z M 10.708984 9.046875 L 12.195312 9.046875 C 12.464091 9.8195937 12.540697 10.312932 13.125 10.560547 C 13.71125 10.808826 14.112685 10.51063 14.830078 10.162109 L 15.880859 11.236328 C 15.536774 11.975191 15.248073 12.381053 15.490234 12.978516 C 15.732395 13.574651 16.21111 13.652864 16.970703 13.929688 L 16.970703 15.449219 C 16.220199 15.72206 15.733044 15.801638 15.490234 16.398438 C 15.248073 16.997228 15.540016 17.405746 15.880859 18.140625 L 14.830078 19.216797 C 14.104244 18.864291 13.709313 18.569454 13.128906 18.816406 C 12.540059 19.066676 12.462793 19.563295 12.195312 20.332031 L 10.708984 20.332031 C 10.440854 19.56064 10.365553 19.065974 9.78125 18.818359 L 9.7792969 18.818359 C 9.1943447 18.57008 8.7948639 18.868277 8.0761719 19.216797 L 7.0253906 18.140625 C 7.3623356 17.416367 7.6581715 17.001212 7.4140625 16.398438 C 7.1719015 15.800974 6.6834478 15.722724 5.9335938 15.449219 L 5.9335938 13.929688 C 6.6853958 13.656183 7.1725566 13.576643 7.4160156 12.978516 C 7.6581766 12.380389 7.3675316 11.973199 7.0253906 11.236328 L 8.0761719 10.162109 C 8.8000579 10.513948 9.1949937 10.808826 9.7792969 10.560547 L 9.78125 10.560547 C 10.366202 10.312932 10.441503 9.8156107 10.708984 9.046875 z M 11.453125 12.808594 C 10.437737 12.808594 9.6132812 13.650531 9.6132812 14.689453 C 9.6132812 15.728375 10.437737 16.570312 11.453125 16.570312 C 12.468512 16.570312 13.292969 15.728375 13.292969 14.689453 C 13.292969 13.650531 12.468512 12.808594 11.453125 12.808594 z M 18.570312 16.349609 L 19.267578 16.349609 C 19.394177 16.713398 19.429807 16.946326 19.705078 17.0625 C 19.98035 17.178673 20.170216 17.037681 20.507812 16.873047 L 21.001953 17.378906 C 20.840292 17.727426 20.704095 17.9197 20.818359 18.201172 C 20.932622 18.481316 21.158551 18.51637 21.515625 18.646484 L 21.515625 19.361328 C 21.162447 19.489451 20.932622 19.527786 20.818359 19.808594 C 20.704095 20.089401 20.841595 20.283041 21.001953 20.628906 L 20.507812 21.134766 C 20.166321 20.968803 19.980355 20.831093 19.707031 20.947266 C 19.430461 21.064767 19.393527 21.298359 19.267578 21.660156 L 18.570312 21.660156 C 18.443713 21.297031 18.408085 21.063439 18.132812 20.947266 C 17.858191 20.831093 17.668324 20.970132 17.330078 21.134766 L 16.835938 20.628906 C 16.994349 20.287688 17.134444 20.092057 17.019531 19.808594 C 16.905267 19.527786 16.675444 19.489451 16.322266 19.361328 L 16.322266 18.646484 C 16.676093 18.517698 16.905267 18.482643 17.019531 18.201172 C 17.133794 17.9197 16.996945 17.726098 16.835938 17.378906 L 17.330078 16.873047 C 17.670271 17.039006 17.857541 17.179337 18.132812 17.0625 C 18.408085 16.945663 18.444363 16.711406 18.570312 16.349609 z M 18.919922 18.119141 C 18.442092 18.119141 18.052734 18.515314 18.052734 19.003906 C 18.052734 19.492498 18.442092 19.888672 18.919922 19.888672 C 19.397751 19.888672 19.785156 19.492498 19.785156 19.003906 C 19.785156 18.515314 19.397751 18.119141 18.919922 18.119141 z M 14.111328 19.667969 L 14.636719 19.667969 C 14.732155 19.940811 14.757742 20.115495 14.964844 20.203125 C 15.171947 20.290753 15.313857 20.185976 15.566406 20.0625 L 15.9375 20.441406 C 15.815445 20.702962 15.713128 20.846201 15.798828 21.056641 C 15.884525 21.267081 16.054785 21.293035 16.322266 21.390625 L 16.322266 21.927734 C 16.057382 22.023992 15.884528 22.052569 15.798828 22.263672 C 15.71313 22.474776 15.816744 22.619342 15.9375 22.878906 L 15.566406 23.257812 C 15.309962 23.133013 15.171303 23.030227 14.966797 23.117188 L 14.964844 23.117188 C 14.757741 23.204815 14.731509 23.378877 14.636719 23.650391 L 14.111328 23.650391 C 14.015892 23.378213 13.989656 23.204818 13.783203 23.117188 C 13.576749 23.029559 13.434839 23.134338 13.181641 23.257812 L 12.810547 22.878906 C 12.930002 22.623325 13.035569 22.476104 12.949219 22.263672 C 12.863522 22.053233 12.690665 22.023994 12.425781 21.927734 L 12.425781 21.390625 C 12.691314 21.293703 12.863519 21.267745 12.949219 21.056641 C 13.034917 20.845537 12.931952 20.702298 12.810547 20.441406 L 13.181641 20.0625 C 13.436787 20.187306 13.577398 20.290755 13.783203 20.203125 C 13.989656 20.115497 14.016538 19.939483 14.111328 19.667969 z M 14.375 20.996094 C 14.016628 20.996094 13.724609 21.293048 13.724609 21.660156 C 13.724609 22.027263 14.016628 22.324219 14.375 22.324219 C 14.733372 22.324219 15.023438 22.027263 15.023438 21.660156 C 15.023438 21.293048 14.733372 20.996094 14.375 20.996094 z "/>
          </svg>
        </button>

        <template slot="popover">
          <button v-tooltip="'Import dice (file)'" @click="openFilePrompt">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8 10h-5l9-10 9 10h-5v10h-8v-10zm11 9v3h-14v-3h-2v5h18v-5h-2z"/></svg>
          </button>
          <button v-tooltip="'Export dice'" :disabled="dice.length <= 0" @click="$emit('export-file')">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 11h5l-9 10-9-10h5v-11h8v11zm3 8v3h-14v-3h-2v5h18v-5h-2z"/></svg>
          </button>
          <!-- Input element for file prompt -->
          <input ref="importDiceFilePrompt" type="file" accept="application/json" @change="$emit('import-file')" hidden>
        </template>
      </Popover>
    </div>

    <!-- Idea set result -->
    <Draggable :noTransitionOnDrag="true" class="idea-result" :options="ideaDragOptions" :class="{ hidden: results.length <= 0 }">
      <span
      v-for="idea in results"
      :key="idea.id"
      v-text="idea.shardName"
      v-tooltip="{ content: `${idea.dieName}`, trigger: 'click hover', autoHide: false }"
      class="idea"
      ></span>
    </Draggable>

    <!-- Save idea layout -->
    <div class="idea-set-layout" v-if="results.length >= 1">
      <div class="idea-set-action">
        <button v-tooltip="'Save idea set'" v-if="results.length > 1 && !isIdeaSaved" class="save-idea" @click.left="$emit('save-idea')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z"/></svg>
        </button>
        <button v-tooltip="'Clear idea set'" class="clear-idea" @click.left="$emit('clear-idea')">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900.5 900.5" >
          <path d="M176.415,880.5c0,11.046,8.954,20,20,20h507.67c11.046,0,20-8.954,20-20V232.487h-547.67V880.5L176.415,880.5z
            M562.75,342.766h75v436.029h-75V342.766z M412.75,342.766h75v436.029h-75V342.766z M262.75,342.766h75v436.029h-75V342.766z"/>
          <path d="M618.825,91.911V20c0-11.046-8.954-20-20-20h-297.15c-11.046,0-20,8.954-20,20v71.911v12.5v12.5H141.874
            c-11.046,0-20,8.954-20,20v50.576c0,11.045,8.954,20,20,20h34.541h547.67h34.541c11.046,0,20-8.955,20-20v-50.576
            c0-11.046-8.954-20-20-20H618.825v-12.5V91.911z M543.825,112.799h-187.15v-8.389v-12.5V75h187.15v16.911v12.5V112.799z"/>
          </svg>
        </button>
      </div>

      <div class="idea-set-status">
        <div v-if="isIdeaSaved">Your randomly generated idea setpieces has been saved! Head on over to the <router-link :to="appConstants.routes.ideas.path">ideas page</router-link> to see your idea sets that you've saved.</div>
        <div v-else-if="results.length === 1">You only have one setpiece which is not really suitable for saving. Add another die and fill up some items.</div>
      </div>
    </div>
  </div>
</template>

<script>
import * as Draggable from 'vuedraggable'
import * as appConstants from '../constants'
import { VTooltip, VPopover } from 'v-tooltip'

export default {
  name: 'GenerateIdeaLayout',
  props: {
    dice: {
      type: Array,
      required: true
    },
    isIdeaSaved: {
      type: Boolean,
      required: true
    },
    results: {
      type: Array,
      required: true
    }
  },
  computed: {
    ideaDragOptions: function () {
      return {
        animation: 500,
        group: 'ideas'
      }
    },
    appConstants: function () {
      return appConstants
    },
    totalCombinations: function () {
      let total = 1
      for (const die of this.dice) {
        if (!die.enabled) continue
        total *= die.items.length || 1
      }

      return total
    },
    totalNumberOfDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (!die.enabled) continue
        if (die.items.length <= 0) continue
        total++
      }

      return total
    },
    // disabled dice does not count
    totalNumberOfEmptyDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (!die.enabled) continue
        if (die.items.length > 0) continue

        total++
      }
      return total
    },
    // all dice count to this one
    totalNumberOfAllEmptyDice: function () {
      let total = 0
      for (const die of this.dice) {
        if (die.items.length > 0) continue

        total++
      }
      return total
    }
  },
  methods: {
    openFilePrompt: function () {
      this.$refs.importDiceFilePrompt.click()
    }
  },
  components: {
    Draggable,
    'Popover': VPopover
  },
  directives: {
    'tooltip': VTooltip
  }
}
</script>

<style lang="scss">
.generate-idea-layout {
  @apply mt-4 mb-4;
  & > * {@apply ml-auto mr-auto mb-4 mt-4;}
}

.dice-popover-content {
  @apply bg-black-transparent shadow-lg rounded-lg;
  @apply p-3;

  & > div > * {@apply mb-2; }

  & > div {
    @apply flex flex-col flex-wrap;
  }
}

.action-buttons {
  @apply flex flex-row flex-wrap justify-around;
  @apply mb-4;
  & button {@apply m-4 p-4;}

  &::after {
    @apply h-8;
    @apply mb-4;
    @apply border-t-2 border-gray-300;
  }
}

.die-combinations-stats {@apply text-center;}

.idea-result {
  @apply bg-brand-color-dark;
  @apply flex flex-row flex-wrap items-center justify-center;
  @apply mt-4 mb-4 p-3 rounded-xl;
}

.idea {
  @apply m-3 p-3 border-dashed border-gray-700 bg-brand-color-light cursor-pointer break-words rounded-lg;

  &:hover {@apply bg-gray-300;}
}

.idea-set-layout {
  @apply flex flex-col flex-wrap;

  & .idea-set-action {
    @apply w-full;
    @apply flex flex-row flex-wrap justify-around;
    @apply mb-4;

    & button {@apply p-4;}
  }

  & > * {@apply m-auto;}
}

.save-idea {@apply p-4;}

</style>
