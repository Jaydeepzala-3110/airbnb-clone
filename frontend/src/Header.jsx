import {Link} from "react-router-dom";
import React, {useContext} from "react";
import {UserContext} from "./UserContextProvider.jsx";

export default function Header() {
    const {user} = useContext(UserContext)
    return (
        <header className="flex justify-between p-4">
            <Link to={'/'} className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor"
                     className="w-6 h-6 -rotate-90">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
                </svg>
                <span className="font-bold text-xl">Airbnb</span>
            </Link>
            <div
                className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 shadow-md shadow-gray-300">
                <div>Anywhere</div>
                <div className="border-l border-gray-300 "></div>
                <div>Any week</div>
                <div className="border-l border-gray-300 "></div>
                <div>Add guests</div>
                <button className="bg-primary text-white p-2 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                         stroke="currentColor" className="w-4 h-4 rounded-lg">
                        <path stroke-linecap="round" stroke-linejoin="round"
                              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"></path>
                    </svg>
                </button>
            </div>
            <Link to={user?'account':'/login'} className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 ">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                </svg>
                <div
                    className="flex items-center bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="w-6 h-7 relative top-1" style={{width: '100%'}}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </div>
                {!!user && (
                 <div>
                     {user.name}
                 </div>
                )}
            </Link>
        </header>
    )
}