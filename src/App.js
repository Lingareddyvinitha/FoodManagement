import React from 'react'
import { Provider } from 'mobx-react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import HomePage from './components/HomePage'
import AuthStore from './Authentication/stores'
import FoodManagementDashBoardStore from './FoodManagement/stores'
import AdminStore from './Admin/stores'
import { signInPageRoute } from './Authentication/routes'
import { ProtectedRouteForDashBoard } from './FoodManagement/routes/ProtectedRouteForDashBoard'
import { FoodManagementDashBoardRoute } from './FoodManagement/routes/FoodManagementDashBoardRoute'
import { PreferencePageRoute } from './FoodManagement/routes/PreferencePageRoute'
import { ReviewPageRoute } from './FoodManagement/routes/ReviewPageRoute'
import { Toastify } from './Common/components/Toastify'
import { adminRoutes } from './Admin/routes'
import './App.css'

const App = () => {
   return (
      <Provider
         {...AuthStore}
         {...FoodManagementDashBoardStore}
         {...AdminStore}
      >
         <Router basename={process.env.PUBLIC_URL}>
            <Switch>
               {signInPageRoute}
               <ProtectedRouteForDashBoard
                  key='food-management-dashboard'
                  exact
                  path='/food-management-dashboard'
                  component={FoodManagementDashBoardRoute}
               />
               <ProtectedRouteForDashBoard
                  key='set-meal-preference'
                  exact
                  path='/set-meal-preference'
                  // exact
                  // path = '/food-management-dashboard/:mealType'
                  component={PreferencePageRoute}
               />
               <ProtectedRouteForDashBoard
                  key='/food-management-dashboard/review/:mealType'
                  exact
                  path={`/food-management-dashboard/review/:mealType`}
                  component={ReviewPageRoute}
               />
               <Route path='/'>
                  <HomePage />
               </Route>
            </Switch>
         </Router>
         <Toastify />
      </Provider>
   )
}

export default App
/*
{adminRoutes}
               <ProtectedRouteForDashBoard
               key='food-management-dashboard'
                  exact
                  path='/food-management-dashboard'
                  component={FoodManagementDashBoardRoute}
               />
               <ProtectedRouteForDashBoard
               key='set-meal-preference'
                  exact
                  path='/set-meal-preference'
                  // exact
                  // path = '/food-management-dashboard/:mealType'
                  component={PreferencePageRoute}
               />
               <ProtectedRouteForDashBoard
               key='/food-management-dashboard/review/:mealType'
                  exact
                  path={`/food-management-dashboard/review/:mealType`}
                  component={ReviewPageRoute}
               />*/
