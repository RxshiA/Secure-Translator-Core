import React, { Component }  from "react";
import { generate, count } from "random-words";

class GameBox extends Component {

  constructor(props) {
    super(props);
    this.state = {
      englishWord: "",
      userTranslation: "",
      points: 0,
      feedback: "",
      email: '',
      level: 0,
      isLoading: false,
      hasGeneratedWord: false,
    };
  }

  componentDidMount(){
    fetch("http://localhost:4500/user/profile",{
        method:"POST",
        crossDomain:true,
        headers:{
            "Content-Type":"application/json",
            Accept:'application/json',
            "Access-Control-Allow-Origin":"*",
        },
        body:JSON.stringify({
            token:localStorage.getItem("token")
        })
    })
    .then((res)=>res.json())
    .then((data)=>{
        console.log(data);
        this.setState({email:data.data.email})
        if(data.data=='token expired'){
            alert("Login Again");
            localStorage.clear();
            window.location.href="./login";
        }else{
          this.fetchUserScore(data.data.email);
        }
    })
  }

  fetchUserScore(email) {
    this.setState({ isLoading: true });
    fetch("http://localhost:4500/game/" + email, {
      method: "GET",
      crossDomain: true,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const points = data[0].points;
        let level;
        if (points < 50) {
          level = 1;
        } else if (points < 100) {
          level = 2;
        } else if (points < 150) {
          level = 3;
        } else if (points < 200) {
          level = 4;
        } else if (points < 300) {
          level = 5;
        }

        if (level > this.state.level) {
          const dimmer = document.createElement('div');
          dimmer.style.position = 'fixed';
          dimmer.style.top = '0';
          dimmer.style.left = '0';
          dimmer.style.width = '100%';
          dimmer.style.height = '100%';
          dimmer.style.background = 'rgba(0, 0, 0, 0.5)'; 
          dimmer.style.zIndex = '9998'; 
      
          const alertContainer = document.createElement('div');
          alertContainer.style.position = 'fixed';
          alertContainer.style.top = '50%';
          alertContainer.style.left = '50%';
          alertContainer.style.transform = 'translate(-50%, -50%)';
          alertContainer.style.background = '#4CAF50';
          alertContainer.style.color = 'white';
          alertContainer.style.padding = '20px';
          alertContainer.style.borderRadius = '10px';
          alertContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
          alertContainer.style.zIndex = '9999';
      
          alertContainer.innerHTML = `<p>Congratulations! You've reached Level ${level}</p>`;
      
          document.body.appendChild(dimmer);
          document.body.appendChild(alertContainer);
      
          setTimeout(() => {
            document.body.removeChild(dimmer);
            document.body.removeChild(alertContainer);
          }, 1000);
        }

        this.setState({
          points: points,
          level: level,
          isLoading: false
        });

      console.log(data);
      })
      .catch((err) => {
        console.error("Error fetching user score:", err);
        this.setState({ isLoading: false });
      });
  }

  fetchRandomWord = () => {
    this.setState({ isLoading: true, hasGeneratedWord: true });
    const englishWord = generate();
    this.setState({ englishWord, userTranslation: "", feedback: "" });

    fetch("http://localhost:4500/game/"+this.state.email,{
      method:"GET",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:'application/json',
        "Access-Control-Allow-Origin":"*",
      },
    })
    .then((res)=>res.json())
    .then((data) => {
      this.setState({ isLoading: false });
    })
  };

  checkTranslation = () => {
    if (!this.state.hasGeneratedWord) {
      alert("Please generate a new word before checking translation.");
      return;
    }

    this.setState({ isLoading: true });
    const { userTranslation, englishWord, points } = this.state;

    fetch("http://localhost:4500/translate",{
      method:"POST",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:'application/json',
        "Access-Control-Allow-Origin":"*",
      },
      body:JSON.stringify({
        text:englishWord,
        language:'si'
      })
    })
    .then((res)=>res.json())
      .then((data) => {
        if (data.translation === userTranslation) {
          // Correct translation
          this.setState({
            points: points + 10,
            feedback: "Correct translation! You earned 10 points.",
            isLoading: false
          });
        } else {
          // Incorrect translation
          this.setState({
            points: points - 10,
            feedback: "Incorrect translation! You lost 10 points.",
            isLoading: false
          });
        }
      })
  };

  endGame = () => {
    const { points } = this.state;
    alert("Game ended! Your score is " + points);
    fetch("http://localhost:4500/game/"+this.state.email,{
      method:"PUT",
      crossDomain:true,
      headers:{
        "Content-Type":"application/json",
        Accept:'application/json',
        "Access-Control-Allow-Origin":"*",
      },
      body:JSON.stringify({
        points:points
      })
    })
  };

  render() {
    const { englishWord, userTranslation, feedback, points, level, isLoading, hasGeneratedWord } = this.state;

    return (
      <>
        <div className="w-full xl px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full max-w-full flex-grow flex-1">
                  <h6 className="uppercase text-blueGray-400 mb-1 text-xs font-semibold">
                    Current 
                  </h6>
                  <h2 className="text-blueGray-700 text-xl font-semibold">
                    Points : {points}
                  </h2>
                  <div className="text-center">
                    <h2 className="text-blueGray-700 text-2xl font-bold">
                      Game Level: {level}
                    </h2>
                    {isLoading && (
                      <div className="flex justify-center items-center">
                        <div className="text-center">
                          <p>Loading...</p>
                          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-7 flex-auto">
              <div className="">
                <div className="flex justify-between items-center mb-4">
                  <input
                    className="w-5/12 h-12 p-2 border rounded"
                    type="text"
                    value={englishWord}
                    readOnly
                    placeholder="English Word"
                  />
                  <input
                    className={`w-5/12 h-12 p-2 border rounded ${
                      !hasGeneratedWord ? 'border-red-500' : ''
                    }`}
                    type="text"
                    value={userTranslation}
                    onChange={(e) => this.setState({ userTranslation: e.target.value })}
                    placeholder="Your Translation"
                    style={{
                      cursor: !hasGeneratedWord ? 'not-allowed' : 'auto',
                    }}
                    disabled={!hasGeneratedWord}
                  />
                </div>
                <div className="flex justify-between items-center mb-4">
                  <button 
                    className="ml-20 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={this.checkTranslation}
                    disabled={!hasGeneratedWord}
                  >Check Translation</button>
                  <div>{feedback}</div>
                  <button 
                    className="mr-20 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    onClick={this.fetchRandomWord}>Generate New Word</button>
                </div><br/>
                <div className="text-center">
                  <button 
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block"
                    onClick={this.endGame}>End Game</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default GameBox;