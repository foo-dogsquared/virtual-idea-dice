import Router from 'vue-router'
import Views from './views'
import * as constants from './constants'

export default new Router({
  routes: [
    {
      path: constants.routes.home.path,
      name: constants.routes.home.name,
      component: Views.Home
    },
    {
      path: constants.routes.gettingStarted.path,
      name: constants.routes.gettingStarted.name,
      component: Views.About
    },
    {
      path: constants.routes.app.path,
      name: constants.routes.app.name,
      component: Views.App
    },
    {
      path: constants.routes.ideas.path,
      name: constants.routes.ideas.name,
      component: Views.SavedIdeas
    }
  ]
})
