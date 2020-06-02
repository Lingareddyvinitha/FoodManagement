/*global jest*/
/*global expect*/
/*global getByTestId */
import React from 'react'
import {
   render,
   fireEvent,
   waitFor,
}
from '@testing-library/react'
import { Router, Route, withRouter } from 'react-router-dom'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'

import {
   SIGN_IN_PATH,
   FOOD_MANAGEMENT_DASHBOARD
}
from '../../../constants/APIConstants'
import { AuthServices } from '../../services/AuthServices'
import { AuthStore } from '../../stores/AuthStore'
import '@testing-library/jest-dom/extend-expect'


import getUserSignInResponse from '../../fixtures/getUserSignInResponse.json'

import { SignInRoute } from '.'

const LocationDisplay = withRouter(({ location }) => (
   <div data-testid='location-display'>{location.pathname}</div>
))

describe('SignInRoute Tests', () => {
   let authServices
   let authStore

   beforeEach(() => {
      authServices = new AuthServices()
      authStore = new AuthStore(authServices)
   })

   afterEach(() => {
      jest.resetAllMocks()
   })

   it("should render username empty error message", () => {
      const { getByText, getByRole } = render(
         <Router history={createMemoryHistory()}>
                   <SignInRoute authStore={authStore} />
                  </Router>
      );
      const signInButton = getByRole("button", { name: "LOGIN" });
      fireEvent.click(signInButton);

      getByText(/Please enter username/i);
   });

   it("should render password empty error message", () => {
      const { getByText, getByPlaceholderText, getByRole } = render(
         <Router history={createMemoryHistory()}>
            <SignInRoute authStore={authStore} />
         </Router>
      );
      const username = "test-user";
      const usernameField = getByPlaceholderText("UserName");
      const signInButton = getByRole("button", { name: "LOGIN" });

      fireEvent.change(usernameField, { target: { value: username } });
      fireEvent.click(signInButton);

      getByText(/Please enter password/i);
   });
   it("should submit sign-in on press enter", async() => {
      const { getByLabelText, getByPlaceholderText, getByRole, debug } = render(
         <Router history={createMemoryHistory()}>
            <SignInRoute authStore={authStore} />
         </Router>
      );
      const username = "test-user";
      const password = "test-password";

      const usernameField = getByPlaceholderText("UserName");
      const passwordField = getByPlaceholderText("Password");
      const signInButton = getByRole("button", { name: "LOGIN" });

      fireEvent.change(usernameField, { target: { value: username } });
      fireEvent.change(passwordField, { target: { value: password } });
      fireEvent.click(signInButton);
      await waitFor(() => getByLabelText("audio-loading"));

   });

   it("should render signInRoute loading state", async() => {
      const { getByTestId, getByPlaceholderText, getByRole, getByLabelText } = render(
         <Router history={createMemoryHistory()}>
               <SignInRoute authStore={authStore} />
             </Router>
      );
      const username = "test-user";
      const password = "test-password";

      const usernameField = getByPlaceholderText("UserName");
      const passwordField = getByPlaceholderText("Password");
      const signInButton = getByRole("button", { name: "LOGIN" });

      const mockLoadingPromise = new Promise(function(resolve, reject) {});
      const mockSignInAPI = jest.fn();
      mockSignInAPI.mockReturnValue(mockLoadingPromise);
      authServices.signInAPI = mockSignInAPI;

      fireEvent.change(usernameField, { target: { value: username } });
      fireEvent.change(passwordField, { target: { value: password } });
      fireEvent.click(signInButton);
      expect(authStore.getUserSignInAPIStatus).toBe(100);
      getByLabelText("audio-loading");
      //getByRole("button", { disabled: true });
   });

   it("should render signInRoute failure state", async() => {
      const { getByText, getByPlaceholderText, getByRole, debug } = render(
         <Router history={createMemoryHistory()}>
            <SignInRoute authStore={authStore} />
         </Router>
      );

      const username = "test-user";
      const password = "test-password";

      const usernameField = getByPlaceholderText("UserName");
      const passwordField = getByPlaceholderText("Password");
      const signInButton = getByRole("button", { name: "LOGIN" });
      const mockFailurePromise = new Promise(function(resolve, reject) {
         reject();
      }).catch(() => {});
      const mockSignInAPI = jest.fn();
      mockSignInAPI.mockReturnValue(mockFailurePromise);
      authServices.getUserSignInAPI = mockSignInAPI;

      fireEvent.change(usernameField, { target: { value: username } });
      fireEvent.change(passwordField, { target: { value: password } });
      fireEvent.click(signInButton);
      await waitFor(() => expect(authStore.getUserSignInAPIStatus).toBe(400));
      //await waitFor(() => getByText(/server-error/i));
   });

   it('should render signInRoute success state', async() => {
      const history = createMemoryHistory()
      const route = SIGN_IN_PATH
      history.push(route)

      const {
         getByPlaceholderText,
         getByRole,
      } = render(
         <Provider authStore={authStore}>
            <Router history={history}>
               <Route path={SIGN_IN_PATH}>
                  <SignInRoute />
               </Route>
               <Route path={FOOD_MANAGEMENT_DASHBOARD}>
                  <LocationDisplay />
               </Route>
            </Router>
         </Provider>
      )
      const username = 'test-user'
      const password = 'test-password'
      const usernameField = getByPlaceholderText('UserName')
      const passwordField = getByPlaceholderText('Password')
      const mockSuccessPromise = new Promise(function(resolve, reject) {
         reject()
      })
      const mockSignInAPI = jest.fn()
      mockSignInAPI.mockReturnValue(mockSuccessPromise)
      authServices.getUserSignInAPI = mockSignInAPI

      const signInButton = getByRole('button', { name: 'LOGIN' })
      fireEvent.change(usernameField, { target: { value: username } })
      fireEvent.change(passwordField, { target: { value: password } })
      expect(mockSignInAPI).toHaveBeenCalledTimes(0)
      fireEvent.click(signInButton)
      expect(mockSignInAPI).toHaveBeenCalledTimes(1)
      //await authStore.userSignIn
      //expect(authStore.getUserSignInAPIStatus).toBe(200)
      //await expect(authStore.userSignIn).toHaveBeenCalledTimes(2)
      //waitFor(() => expect(authStore.getUserSignInAPIStatus).toBe(200));
      // await waitFor(() => {
      //     expect(authStore.getUserSignInAPIStatus).toBe(200);
      //     expect(
      //         queryByRole("button", { name: "LOGIN" })
      //     ).toBeInTheDocument();
      //     // expect(getByTestId("location-display")).toHaveTextContent(
      //     //     E_COMMERCE_PRODUCTS_PATH
      //     // );
      // });
   })
})
