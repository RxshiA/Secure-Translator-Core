import React, { Component } from 'react';
import '../../Styles/style.css';
import { dlManelToUnicode, singlishToUnicode, unicodeToDlManel } from "sinhala-unicode-coverter"

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      languages: {
        'en-GB': 'English',
        'si-LK': 'Sinhala',
      },
      fromText: '',
      toText: '',
      selectedLanguageFrom: 'en-GB',
      selectedLanguageTo: 'si-LK',
    };
  }

  componentDidMount() {
    const languages = {
      'en-GB': 'English',
      'si-LK': 'Sinhala',
    };

    const selectTag = document.querySelectorAll('select');

    selectTag.forEach((tag, id) => {
      for (let language_code in languages) {
        let selected =
          id === 0
            ? language_code === 'en-GB'
              ? 'selected'
              : ''
            : language_code === 'hi-IN'
            ? 'selected'
            : '';
        let option = `<option ${selected} value="${language_code}">${languages[language_code]}</option>`;
        tag.insertAdjacentHTML('beforeend', option);
      }
    });
  }

  handleInputChange = (event, inputType) => {
    const { selectedLanguageFrom, selectedLanguageTo } = this.state;
    const inputValue = event.target.value.trim();

    this.setState({ [inputType]: inputValue });

    if (!inputValue) {
      this.setState({ toText: '' });
      return;
    }

    if (selectedLanguageFrom === 'si-LK') {
      // If input language is Sinhala, convert Singlish to Sinhala
      const sinhalaText = singlishToUnicode(inputValue);
      this.setState({ toText: sinhalaText });
      return;
    }

    // Otherwise, use the original text
    this.setState({ toText: inputValue });
  };

  handleExchangeClick = () => {
    const {
      fromText,
      toText,
      selectedLanguageFrom,
      selectedLanguageTo,
    } = this.state;

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
    const { fromText, selectedLanguageFrom, selectedLanguageTo } = this.state;

    if (!fromText) return;

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
      <div className="Home">
        <div className="container">
          <div className="wrapper">
            <div className="text-input">
              <textarea
                spellCheck="false"
                className="from-text"
                placeholder="Enter text"
                value={fromText}
                onChange={(e) => this.handleInputChange(e, 'fromText')}
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


          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700 bg-white rounded-xl h-full mt-3">
                    <thead>
                        <tr>
                        <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase'>
                                    Input Text
                                    </th>

                                    <th
                                    scope='col'
                                    className='px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase'>
                                    Output Text
                                    </th>

                                 
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                                   Row 1
                                 </td>

                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-500">
                                    Row 1
                                 </td>


                    </tbody>
          </table>
        </div>
      </div>
    );
  }
}
