import Router from 'vue-router'
import Views from './views'
import * as appConstants from './appConstants'

export default new Router({
  routes: [
    {
      path: appConstants.routes.home.path,
      name: appConstants.routes.home.name,
      component: Views.Home
    },
    {
      path: appConstants.routes.about.path,
      name: appConstants.routes.about.name,
      component: Views.About
    },
    {
      path: appConstants.routes.app.path,
      name: appConstants.routes.app.name,
      component: Views.App
    }
  ]
})
