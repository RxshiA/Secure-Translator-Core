/* eslint-disable no-unused-vars */
import React, { Component } from "react";
import { emailLogin, oauthLogin } from "../../api/api";
import BrowserStorage from "../../helper/BrowserStorage";
import {
  doSignInWithEmailAndPassword,
  doSignInWithGoogle,
} from "../../firebase/auth";
import { useAuth } from "../../contexts/authContext";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onGoogleSignIn = this.onGoogleSignIn.bind(this);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = this.state;

    emailLogin(email, password)
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if (data.status === "ok") {
          this.handleSuccessfulLogin(data);
        }
      });
  };

  handleSuccessfulLogin = (data) => {
    alert("Login Successful");
    BrowserStorage.setLocalStorage("token", data.data);
    localStorage.setItem("loggedIn", true);
    window.location.href = "./";
  };

  onGoogleSignIn = (e) => {
    e.preventDefault();

    doSignInWithGoogle()
      .then((response) => {
        const googleUserData = {
          status: "ok",
          data: response.tokenId,
        }.then(
          oauthLogin(
            response._tokenResponse.email,
            response._tokenResponse.localId
          )
            .then((res) => res.data)
            .then((data) => {
              console.log(data);
              if (data.status === "ok") {
                this.handleSuccessfulLogin(data);
              }
            })
        );
        this.handleSuccessfulLogin(googleUserData);
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
            "url('https://images.unsplash.com/photo-1486520299386-6d106b22014b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80')",
        }}
      >
        <div className="flex justify-end">
          <div className="bg-white min-h-screen w-1/2 flex justify-center items-center">
            <div>
              <form onSubmit={this.handleSubmit}>
                <div>
                  <span className="text-sm text-gray-900">Welcome back</span>
                  <h1 className="text-2xl font-bold">Login to your account</h1>
                </div>
                <div className="my-3">
                  <label className="block text-md mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="px-4 w-full border-2 py-2 rounded-md text-sm outline-none"
                    type="email"
                    name="password"
                    placeholder="email"
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
                    placeholder="password"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-between">
                  <div>
                    <input
                      className="cursor-pointer"
                      type="radio"
                      name="rememberme"
                    />
                    <span className="text-sm">Remember Me</span>
                  </div>
                  <span className="text-sm text-blue-700 hover:underline cursor-pointer">
                    Forgot password?
                  </span>
                </div>
                <div className="">
                  <button
                    type="submit"
                    className="mt-4 mb-3 w-full bg-green-500 hover:bg-green-400 text-white py-2 rounded-md transition duration-100"
                  >
                    Login now
                  </button>
                  <button
                    onClick={(e) => {
                      this.onGoogleSignIn(e);
                    }}
                    className="w-full flex items-center justify-center gap-x-3 py-2.5 border rounded-lg text-sm font-medium hover:bg-gray-100 transition duration-300 active:bg-gray-100"
                  >
                    <svg
                      className="w-5 h-5"
                      viewBox="0 0 48 48"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_17_40)">
                        <path
                          d="M47.532 24.5528C47.532 22.9214 47.3997 21.2811 47.1175 19.6761H24.48V28.9181H37.4434C36.9055 31.8988 35.177 34.5356 32.6461 36.2111V42.2078H40.3801C44.9217 38.0278 47.532 31.8547 47.532 24.5528Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M24.48 48.0016C30.9529 48.0016 36.4116 45.8764 40.3888 42.2078L32.6549 36.2111C30.5031 37.675 27.7252 38.5039 24.4888 38.5039C18.2275 38.5039 12.9187 34.2798 11.0139 28.6006H3.03296V34.7825C7.10718 42.8868 15.4056 48.0016 24.48 48.0016Z"
                          fill="#34A853"
                        />
                        <path
                          d="M11.0051 28.6006C9.99973 25.6199 9.99973 22.3922 11.0051 19.4115V13.2296H3.03298C-0.371021 20.0112 -0.371021 28.0009 3.03298 34.7825L11.0051 28.6006Z"
                          fill="#FBBC04"
                        />
                        <path
                          d="M24.48 9.49932C27.9016 9.44641 31.2086 10.7339 33.6866 13.0973L40.5387 6.24523C36.2 2.17101 30.4414 -0.068932 24.48 0.00161733C15.4055 0.00161733 7.10718 5.11644 3.03296 13.2296L11.005 19.4115C12.901 13.7235 18.2187 9.49932 24.48 9.49932Z"
                          fill="#EA4335"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_17_40">
                          <rect width="48" height="48" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </button>
                </div>
              </form>
              <p className="mt-8">
                {" "}
                Dont have an account?{" "}
                <span className="cursor-pointer text-sm text-blue-600">
                  {" "}
                  <a href="/register">Join free today</a>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
