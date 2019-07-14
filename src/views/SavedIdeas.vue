<template>
  <div class="previous-ideas">
    <SavedIdeasLayout
    :savedIdeas="savedIdeas"
    :editingIdeaSet="editingideaSet"
    :state="state"
    @remove-idea="removeIdea"
    ></SavedIdeasLayout>
  </div>
</template>

<script>
import layouts from '../layouts'
import * as appConstants from '../constants'

export default {
  name: 'Ideas',
  components: {
    SavedIdeasLayout: layouts.SavedIdeasLayout
  },
  data: function () {
    return {
      savedIdeas: []
    }
  },
  watch: {
    savedIdeas: {
      handler: function (ideas) {
        appConstants.ideaStorage.save(ideas)
      },
      deep: true
    }
  },
  methods: {
    removeIdea: function (ideaObject) {
      this.savedIdeas.splice(this.savedIdeas.indexOf(ideaObject), 1)
    }
  },
  created: function () {
    appConstants.ideaStorage.fetch().then(function (ideasObject) {
      this.savedIdeas = ideasObject
    }.bind(this))
  }
}
</script>
