<template>
  <div class="previous-ideas">
    <SavedIdeasLayout
    :savedIdeas="savedIdeas"
    :editingIdeaSet="editingideaSet"
    :state="state"
    @remove-idea="removeIdea"
    @edit-idea-set-name="editIdeaSetName"
    @done-edit-idea-set-name="doneEditIdeaSetName"
    ></SavedIdeasLayout>
  </div>
</template>

<script>
import layouts from '../layouts'
import * as appConstants from '../appConstants'

export default {
  name: 'Ideas',
  components: {
    SavedIdeasLayout: layouts.SavedIdeasLayout
  },
  data: function () {
    return {
      savedIdeas: [],
      editingideaSet: null,
      state: null
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
    editIdeaSetName: function (ideaSet) {
      this.editingideaSet = ideaSet
      this.state = appConstants.state.ideaSetRenaming
    },
    doneEditIdeaSetName: function () {
      this.editingideaSet = null
      this.state = null
    },
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
