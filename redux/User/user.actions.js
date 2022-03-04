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
        console.log("From Sign In action");
        var userName;
        var userAvatar
        await signInWithEmailAndPassword(auth, email, password)
          .then(async () => {
            var currentUserAuth = auth.currentUser.uid
            const qq = query(collection(db, "users"));
            const qquerySnapshot = await getDocs(qq);
            qquerySnapshot.forEach((doc) => {
              if (currentUserAuth === doc.data().id) {
                userName = doc.data().name;
                userAvatar = doc.data().avatar;
                console.log('hello there oussama king is back', currentUserAuth, " => ", doc.data().id);
              }
            });
            // const userName = ;
            // const userAvatar = ;
            dispatch({
              type: userTypes.USER_SIGN_IN_SUCCESS,
              payload: true,
              theUserName: userName,
              theUserAvatar: userAvatar,
            });
            const q = query(collection(db, "users"), where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
              console.log(doc.id, " => ", doc.data());
            });
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
export const signInUserPhone = () => async (dispatch) => {
  try {
    console.log("From Phone Sign In action");
    dispatch({
      type: userTypes.USER_PHONE_SIGN_IN_SUCCESS,
      payload: true,
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
export const savePhoneUserInfo =
  ({ firstName, email }) =>
    async (dispatch) => {
      let rule = 1;
      let createdAt = new Date();
      let updatedAt = null;
      let deletedAt = null;
      try {
        console.log("From Phone Phone Info Saved action");
        const phoneNumber = auth.currentUser.phoneNumber;
        await addDoc(collection(db, "users"), {
          rule: rule,
          fullname: firstName,
          email: email,
          phoneNumber: phoneNumber,
          createdAt: createdAt,
          updatedAt: updatedAt,
          deletedAt: deletedAt,
        });
        dispatch({
          type: userTypes.USER_PHONE_INFO_SAVED,
          payload: true,
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
const getFinalTab = (tab, user) => {
  let i = 0;
  while (i < tab.length) {
    if (tab[i].id === user.id) break;
    i++;
  }
  if (i == tab.length) {
    tab.push(user);
  }
  return tab;
};
const manageUsers = async (userDetails, firstName, email, password) => {
  const usersSearch = doc(collection(db, "searchUser"), "users");
  const getUsersSearch = doc(db, "searchUser", "users");
  const newUserRef = doc(collection(db, "users"));
  console.log("HERE LINE 152");
  setDoc(newUserRef, {
    id: userDetails.user.uid,
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
    friends: [],
    groups: [],
    followers: [],
    Following: [],
    chats: [],
  })
    .then(async () => {
      const docSnap = await getDoc(getUsersSearch);
      if (docSnap.exists()) {
        var tab = docSnap.data().users;
        let data1 = getFinalTab(tab, {
          id: userDetails.user.uid,
          name: firstName,
          avatar:
            userDetails.user.photoURL ||
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        });
        await setDoc(usersSearch, { users: data1 });
      } else {
        let data2 = {
          id: userDetails.user.uid,
          name: firstName,
          avatar:
            userDetails.user.photoURL ||
            "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
        };
        await setDoc(usersSearch, { users: [data2] });
      }
    })
    .catch((err) => console.error("error =>", err));
};
export const signUpUser =
  ({ firstName, email, password }) =>
    async (dispatch) => {
      try {
        await createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("Here LINE 164 =>", userCredential.user);
            manageUsers(userCredential, firstName, email, password);
            dispatch({
              type: userTypes.USER_SIGN_UP_SUCCESS,
              payload: true,
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

// PROPERTY
export const fetchUser = () => async (dispatch) => {
  try {
    console.log("From fetchContact Action");
    const { IDFound, currentID } = await isPropertyIdFound();
    console.log("HERE FROM isPropertyIdFound()........................");
    console.log({ IDFound, currentID });
    if (IDFound) {
      const contactsListRef = firestore().doc(`property/${currentID}`);
      const contactsList = await contactsListRef.get();
      const contactsArray = contactsList.data();
      dispatch({
        type: userTypes.FETCH_PROPERTY,
        payload: contactsArray,
      });
    } else {
      const error = "Something Went Wrong !!";
      dispatch({
        type: userTypes.SET_ERRORS,
        payload: error,
      });
    }
  } catch (err) {
    console.log("error from fetchPrperty catch !!");
    console.log(err);
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
