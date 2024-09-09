import React, { Component } from 'react'
import Sidebar from '../../views/Sidebar';
import Navbar from '../../views/NavBar';

export default class Profile extends Component {
    constructor(props){
        super(props)
        this.state={
            userData: ''
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
            console.log(data, "userData");
            this.setState({userData:data.data})
            if(data.data=='token expired'){
                alert("Login Again");
                localStorage.clear();
                window.location.href="./login";
            }
        })
    }

    logOut=()=>{
        localStorage.clear();
        window.location.href="./login";
    }

    render(){
        return(
            <>
            <Sidebar/>
            <main className="profile-page">
                <section className="relative block" style={{ height: "500px" }}>
                    <div
                        className="absolute top-0 w-full h-full bg-center bg-cover"
                        style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1499336315816-097655dcfbda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2710&q=80')"
                        }}
                    >
                        <span
                        id="blackOverlay"
                        className="w-full h-full absolute opacity-50 bg-black"
                        ></span>
                    </div>
                    <div
                        className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden"
                        style={{ height: "70px" }}
                    >
                        <svg
                        className="absolute bottom-0 overflow-hidden"
                        xmlns="http://www.w3.org/2000/svg"
                        preserveAspectRatio="none"
                        version="1.1"
                        viewBox="0 0 2560 100"
                        x="0"
                        y="0"
                        >
                        <polygon
                            className="text-gray-300 fill-current"
                            points="2560 0 2560 100 0 100"
                        ></polygon>
                        </svg>
                    </div>
                </section>
                <section className="ml-10 relative py-16 bg-gray-300">
                    <div className="container mx-auto px-4">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                            <div className="px-6">
                                <div className="text-center mt-12">
                                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-gray-800 mb-2">
                                        {this.state.userData.first_name}
                                    </h3>
                                <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold uppercase">
                                    <i className="mr-2 text-lg text-gray-500"></i>{" "}
                                    {this.state.userData.last_name}
                                </div>
                                <div className="mb-2 text-gray-700 mt-10">
                                    <i className="mr-2 text-lg text-gray-500"></i>
                                    Email Address: {this.state.userData.email}
                                </div>
                                </div>
                                <div className="mt-10 py-10 border-t border-gray-300 text-center">
                                <div className="flex flex-wrap justify-center">
                                    <div className="w-full lg:w-9/12 px-4">
                                    <p className="mb-4 text-lg leading-relaxed text-gray-800">
                                        An artist of considerable range, Jenna the name taken by
                                        Melbourne-raised, Brooklyn-based Nick Murphy writes,
                                        performs and records all of his own music, giving it a
                                        warm, intimate feel with a solid groove structure. An
                                        artist of considerable range.
                                    </p>
                                    <a
                                        href="#pablo"
                                        className="font-normal text-pink-500"
                                        onClick={this.logOut}
                                    >
                                        Log Out
                                    </a>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="block py-4">
                    <div className="container mx-auto px-4">
                    <hr className="mb-4 border-b-1 border-blueGray-200" />
                    <div className="flex flex-wrap items-center md:justify-between justify-center">
                        <div className="w-full md:w-4/12 px-4">
                        <div className="text-sm text-blueGray-500 font-semibold py-1">
                            Copyright © {new Date().getFullYear()}{" "}
                            <a
                            href=""
                            className="text-blueGray-500 hover:text-blueGray-700 text-sm font-semibold py-1"
                            >
                            TranslateX Corp
                            </a>
                        </div>
                        </div>
                        <div className="w-full md:w-8/12 px-4">
                        <ul className="flex flex-wrap list-none md:justify-end  justify-center">
                            <li>
                            <a
                                href="https://www.creative-tim.com"
                                className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                            >
                                TranslateX
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://www.creative-tim.com/presentation"
                                className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                            >
                                About Us
                            </a>
                            </li>
                            <li>
                            <a
                                href="http://blog.creative-tim.com"
                                className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                            >
                                Blog
                            </a>
                            </li>
                            <li>
                            <a
                                href="https://github.com/creativetimofficial/tailwind-starter-kit/blob/main/LICENSE.md"
                                className="text-blueGray-600 hover:text-blueGray-800 text-sm font-semibold block py-1 px-3"
                            >
                                Social Media
                            </a>
                            </li>
                        </ul>
                        </div>
                    </div>
                    </div>
                </footer>
            </main>
            </>
        )
    }
}