/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import {
  registerEmailUser,
  initializeGame,
  registerOauthUser,
} from "../../api/api";
import styles from "../../style";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fname: "",
      lname: "",
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { fname, lname, email, password } = this.state;
    console.log(fname, lname, email, password);

    registerEmailUser(fname, lname, email, password)
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          return initializeGame(email);
        }
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res.data);
          alert("Successfully Registered");
        }
      })
      .catch((error) => {
        console.error("Error during registration:", error);
      });
  };

  handleSuccessfulLogin = (data) => {
    alert("Login Successful");
  };

  onGoogleSignIn = (e) => {
    e.preventDefault();

    doSignInWithGoogle()
      .then((response) => {
        registerOauthUser(
          response._tokenResponse.firstName,
          response._tokenResponse.lastName,
          response._tokenResponse.email,
          response._tokenResponse.localId
        ).then((res) => {
          if (res.status === 200) {
            console.log(res.data);
            alert("Successfully Registered");
            window.location.href = "./login";
            return initializeGame(response._tokenResponse.email);
          }
        });
      })
      .catch((error) => {
        console.error("Google Sign-In Error:", error);
      });
  };

  render() {
    return (
      <div
        className="min-h-screen bg-no-repeat bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://www.bkacontent.com/wp-content/uploads/2016/06/Depositphotos_31146757_l-2015.webp')",
        }}
      >
        <div className="flex justify-end">
          <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
            <div>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <span className="text-sm text-gray-900">Sign Up</span>
                  <h1 className="text-2xl font-bold">
                    Create your account for free
                  </h1>
                </div>
                <div className="my-3">
                  <label className="block text-md mb-2" htmlFor="fname">
                    First Name
                  </label>
                  <input
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                    type="text"
                    name="fname"
                    placeholder="First Name"
                    onChange={(e) => this.setState({ fname: e.target.value })}
                  />
                </div>
                <div className="my-3">
                  <label className="block text-md mb-2" htmlFor="email">
                    Last Name
                  </label>
                  <input
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                    type="text"
                    name="fname"
                    placeholder="Last Name"
                    onChange={(e) => this.setState({ lname: e.target.value })}
                  />
                </div>
                <div className="my-3">
                  <label className="block text-md mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={(e) => this.setState({ email: e.target.value })}
                  />
                </div>
                <div className="mt-5">
                  <label className="block text-md mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
                  >
                    Sign Up now
                  </button>
                  <div className="flex  space-x-2 justify-center items-end bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-md transition duration-100">
                    <img
                      className=" h-5 cursor-pointer"
                      src="https://i.imgur.com/arC60SB.png"
                      alt=""
                    />
                    <button
                      onClick={(e) => {
                        this.onGoogleSignIn(e);
                      }}
                    >
                      Or sign-in with google
                    </button>
                  </div>
                </div>
              </form>
              <p className="mt-8">
                {" "}
                Already have an account?{" "}
                <span className="cursor-pointer text-sm text-blue-600">
                  {" "}
                  <a href="/login">Log In</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
