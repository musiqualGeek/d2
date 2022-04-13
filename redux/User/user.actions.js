import userTypes from "./user.types";
import { auth, db, storage } from "../../firebase/utils";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import uuid from "react-native-uuid";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  getDoc,
} from "firebase/firestore";

// AUTHENTICATION
// in progress
export const recoveryUser =
  ({ email }) =>
  async (dispatch) => {
    try {
      await sendPasswordResetEmail(auth, email)
        .then(() => {
          dispatch({
            type: userTypes.USER_RECOVERY_SUCCESS,
            payload: true,
          });
        })
        .catch(() => {
          const err = ["Email Not Found! Please Enter A Valid Email"];
          dispatch({
            type: userTypes.SET_ERRORS,
            payload: err,
          });
        });
    } catch (err) {
      console.log(err);
    }
  };
// done
export const signOutUser = () => async (dispatch) => {
  try {
    signOut(auth).then(() => {
      console.log("User signed out!");
      dispatch({
        type: userTypes.OUT_CURRENT_USER,
      });
      console.log("User Signed out From Action ::");
    });
  } catch (err) {
    console.log("Error from Sign out action !!");
    console.log(err);
  }
};
// done
export const signInUser =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          const qq = query(
            collection(db, "users"),
            where("email", "==", email)
          );
          const qquerySnapshot = await getDocs(qq);
          qquerySnapshot.forEach((doc) => {
            dispatch({
              type: userTypes.USER_SIGN_IN_SUCCESS,
              payload: doc.data(),
            });
          });
          // dispatch({
          //   type: userTypes.USER_SIGN_IN_SUCCESS,
          //   payload: true,
          // });
        })
        .catch((err) => {
          console.log(err);
          const error = ["These credientials dosn't much !!"];
          dispatch({
            type: userTypes.SET_ERRORS,
            payload: error,
          });
        });
    } catch (err) {
      console.log("from catch in login redux actions");
      const error = ["Login problem"];
      dispatch({
        type: userTypes.SET_ERRORS,
        payload: error,
      });
    }
  };
// done
const manageUsers = async (userDetails, firstName, email, password, type) => {
  if (type === "0") {
    const newUserRef = doc(collection(db, "users"));
    await setDoc(newUserRef, {
      id: userDetails.user.uid,
      type: type,
      name: firstName,
      avatar:
        userDetails.user.photoURL ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      email: email,
      phone: null,
      password: password,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      chats: [],
    });
  } else {
    const newUserRef = doc(collection(db, "users"));
    await setDoc(newUserRef, {
      id: userDetails.user.uid,
      type: type,
      name: firstName,
      avatar:
        userDetails.user.photoURL ||
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      email: email,
      phone: null,
      password: password,
      createdAt: new Date(),
      updatedAt: null,
      deletedAt: null,
      chats: [],
      driverPhoto: "",
      driverLicense: "",
      carLicensePlate: "",
    });
  }
};
export const signUpUser =
  ({ firstName, email, password, type }) =>
  async (dispatch) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          console.log("Here LINE 164 =>", userCredential.user);
          manageUsers(userCredential, firstName, email, password, type);
          dispatch({
            type: userTypes.USER_SIGN_UP_SUCCESS,
            payload: true,
          });
          dispatch({
            type: userTypes.SET_TYPE,
            payload: type,
          });
        })
        .catch((err) => {
          if (err.code === "auth/email-already-in-use") {
            const error = "This email address is already in use!";
            dispatch({
              type: userTypes.SET_ERRORS,
              payload: error,
            });
          }
          if (err.code === "auth/invalid-email") {
            const error = "This email address is invalid!";
            dispatch({
              type: userTypes.SET_ERRORS,
              payload: error,
            });
          }
          console.log(err);
        });
    } catch (err) {
      const error = "Please check your information again";
      dispatch({
        type: userTypes.SET_ERRORS,
        payload: error,
      });
    }
  };

// User
export const setUserD = (user, userDocId) => async (dispatch) => {
  try {
    dispatch({
      type: userTypes.SET_USER,
      payload: user,
    });
    dispatch({
      type: userTypes.SET_USER_DOC_ID,
      payload: userDocId,
    });
  } catch (err) {
    console.log("setUser action catch: ", err);
  }
};

// OTHERS
export const resetAllAuthForms = () => ({
  type: userTypes.RESET_AUTH_FORMS,
});
export const ResetErrorsState = () => ({
  type: userTypes.RESET_ERRORSSTATE_FORMS,
});
export const ResetStates = () => ({
  type: userTypes.RESET_STATES,
});
