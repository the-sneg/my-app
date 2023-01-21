import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/config";
import { authSlice, authLogout } from "./authReducer";

export const authSignUpUser =
  ({ email, password, nickname }) =>
  async (dispatch, getState) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: nickname,
      });
      const updatedUser = auth.currentUser;
      dispatch(
        authSlice.actions.updateUserProfile({
          userId: updatedUser.uid,
          nickname: updatedUser.displayName,
        })
      );

      // return updatedUser;
    } catch (error) {
      console.log(error.message);
    }
  };

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch, getState) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error.message);
    }
  };

export const authSignOutUser = () => async (dispatch, getState) => {
  try {
    await signOut(auth);
    dispatch(authSlice.actions.authLogout());
  } catch (error) {
    console.log(error.message);
  }
};

export const authStateChangeUser = () => async (dispatch, getState) => {
  try {
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(
          authSlice.actions.updateUserProfile({
            userId: user.uid,
            nickname: user.displayName,
            email: user.email,
            avatar: user.photoURL,
          })
        );
        dispatch(authSlice.actions.authStateChange({ state: true }));
      }
    });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateAvatar = (newAvatar) => async (dispatch, getState) => {
  try {
    await updateProfile(auth.currentUser, {
      photoURL: newAvatar,
    });
    const updatedUser = auth.currentUser;
    dispatch(
      authSlice.actions.updateAvatarAction({
        avatar: updatedUser.photoURL,
      })
    );
  } catch (error) {
    console.log(error.message);
  }
};
