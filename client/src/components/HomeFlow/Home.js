import React, { Component } from "react";
import axios from "axios";
import "../../Styles/style.css";
import Sidebar from "../../views/Sidebar";
import Navbar from "../../views/NavBar";
import { Link } from "react-router-dom";
import {
  dlManelToUnicode,
  singlishToUnicode,
  unicodeToDlManel,
} from "sinhala-unicode-coverter";

let singlishMain = "";

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      languages: {
        "en-GB": "English",
        "si-LK": "Sinhala",
      },
      fromText: "",
      toText: "",
      selectedLanguageFrom: "en-GB",
      selectedLanguageTo: "si-LK",
    };
  }

  componentDidMount() {
    const languages = {
      "en-GB": "English",
      "si-LK": "Sinhala",
    };

    const icons = document.querySelectorAll(".icons i");

    // Add the utterance and event listener code here
    icons.forEach((icon) => {
      let utterance = new SpeechSynthesisUtterance();

      icon.addEventListener("click", ({ target }) => {
        if (!this.state.fromText || !this.state.toText) return;

        if (target.classList.contains("fa-copy")) {
          if (target.id === "from") {
            navigator.clipboard.writeText(this.state.fromText);
          } else {
            navigator.clipboard.writeText(this.state.toText);
          }
        } else {
          if (target.id === "from") {
            utterance.text = this.state.fromText;
            utterance.lang = this.state.selectedLanguageFrom; // Set the language for the source text
          } else {
            utterance.text = this.state.toText;
            utterance.lang = this.state.selectedLanguageTo; // Set the language for the translated text
          }
          speechSynthesis.speak(utterance); // Trigger the speech synthesis
        }
      });
    });

    const selectTag = document.querySelectorAll("select");

    selectTag.forEach((tag, id) => {
      for (let language_code in languages) {
        let selected =
          id === 0
            ? language_code === "en-GB"
              ? "selected"
              : ""
            : language_code === "hi-IN"
            ? "selected"
            : "";
        let option = `<option ${selected} value="${language_code}">${languages[language_code]}</option>`;
        // tag.insertAdjacentHTML('beforeend', option); //doubles the selcetcion
      }
    });
  }

  handleInputChange = (event, inputType) => {
    const { selectedLanguageFrom, selectedLanguageTo } = this.state;
    const inputValue = event.target.value;

    this.setState({ [inputType]: inputValue });

    if (!inputValue) {
      this.setState({ toText: "" });
      return;
    }

    if (selectedLanguageFrom === "si-LK") {
      // If input language is Sinhala, convert Singlish to Sinhala
      const sinhalaText = singlishToUnicode(inputValue);
      this.setState({ toText: sinhalaText });
      singlishMain = this.state.toText;
      //this.setState({fromText:singlishMain})
      return;
    }

    // Otherwise, use the original text
    this.setState({ fromText: inputValue });
  };

  handleExchangeClick = () => {
    const { fromText, toText, selectedLanguageFrom, selectedLanguageTo } =
      this.state;

    const tempText = fromText;
    const tempLang = selectedLanguageFrom;

    this.setState({
      fromText: toText,
      toText: tempText,
      selectedLanguageFrom: selectedLanguageTo,
      selectedLanguageTo: tempLang,
    });
  };

  handleTranslateClick = () => {
    const { fromText, selectedLanguageFrom, selectedLanguageTo, toText } =
      this.state;

    if (!fromText) return;

    if (selectedLanguageFrom === "si-LK") {
      this.setState({ fromText: singlishMain });
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        this.state.toText
      )}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const translatedText =
            data.responseData.translatedText || data.responseData;

          this.setState({ toText: translatedText });
        });
      return;
    } else {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        fromText
      )}&langpair=${selectedLanguageFrom}|${selectedLanguageTo}`;

      fetch(apiUrl)
        .then((res) => res.json())
        .then((data) => {
          const translatedText =
            data.responseData.translatedText || data.responseData;

          this.setState({ toText: translatedText });
        });
    }
  };

  render() {
    const {
      languages,
      fromText,
      toText,
      selectedLanguageFrom,
      selectedLanguageTo,
    } = this.state;

    return (
      <>
        <div className="relative md:ml-64 bg-blueGray-100">
          <Navbar />
          <div className="relative bg-pink-600 md:pt-25 pb-5 pt-20"></div>
        </div>
        <div className="Home ml-5 mr-0">
          <div className="container">
            <div className="wrapper">
              <div className="text-input">
                <textarea
                  spellCheck="false"
                  className="from-text"
                  placeholder="Enter text"
                  value={fromText}
                  onChange={(e) => this.handleInputChange(e, "fromText")}
                ></textarea>
                <textarea
                  spellCheck="false"
                  readOnly
                  disabled
                  className="to-text"
                  placeholder="Translation"
                  value={toText}
                ></textarea>
              </div>
              <ul className="controls">
                <li className="row from">
                  <div className="icons">
                    <i id="from" className="fas fa-volume-up"></i>
                    <i className="fas fa-copy"></i>
                  </div>
                  <select
                    value={selectedLanguageFrom}
                    onChange={(e) =>
                      this.setState({ selectedLanguageFrom: e.target.value })
                    }
                  >
                    {Object.keys(languages).map((languageCode) => (
                      <option key={languageCode} value={languageCode}>
                        {languages[languageCode]}
                      </option>
                    ))}
                  </select>
                </li>
                <li className="exchange" onClick={this.handleExchangeClick}>
                  <i className="fas fa-exchange-alt"></i>
                </li>
                <li className="row to">
                  <select
                    value={selectedLanguageTo}
                    onChange={(e) =>
                      this.setState({ selectedLanguageTo: e.target.value })
                    }
                  >
                    {Object.keys(languages).map((languageCode) => (
                      <option key={languageCode} value={languageCode}>
                        {languages[languageCode]}
                      </option>
                    ))}
                  </select>
                  <div className="icons">
                    <i id="to" className="fas fa-volume-up"></i>
                    <i className="fas fa-copy"></i>
                  </div>
                </li>
              </ul>
            </div>
            <button onClick={this.handleTranslateClick}>Translate Text</button>

            <Link to={`/definition/${fromText}`}>
              <button>Dictionary</button>
            </Link>

            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white rounded-xl h-full mt-3">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                  >
                    Input Text
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase"
                  >
                    Output Text
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    Home
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    නිවසේ
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    අම්මා ගෙදර ගියා
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    Mom went home.
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    Dog
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    බල්ලා
                  </td>
                </tr>

                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    Went home
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                    ගෙදර ගියා
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <Sidebar />
        </div>
      </>
    );
  }
}
