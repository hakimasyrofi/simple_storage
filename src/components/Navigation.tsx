import { useState } from "react";
// import Logo from "../logo.png";

interface UserData {
  isConnected: boolean;
  connect: any;
  disconnect: any;
  address: string;
  userBal: string;
}

const Navigation = (props: UserData) => {
  const [menu, setMenu] = useState(false);

  return (

<nav className="p-2 border-gray-200 bg-purple-700">
  <div className="container flex flex-wrap items-center justify-between mx-auto">
    <a className="flex">
        <img src='https://cdn.iconscout.com/icon/free/png-256/polygon-token-4086726-3379856.png' className="h-10 mr-3 sm:h-14" alt="Flowbite Logo" />
    </a>
    <button onClick={() => setMenu(!menu)} data-collapse-toggle="navbar-solid-bg" type="button" className="inline-flex items-center p-2 ml-3 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200" aria-controls="navbar-solid-bg" aria-expanded="false">
      <span className="sr-only">Open main menu</span>
      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
    </button>
    <div className={"w-full md:block md:w-auto " + (menu? "":"hidden")} id="navbar-solid-bg">
      {props.isConnected && (
      <ul className="flex flex-col mt-4 rounded-lg md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-transparent">
        <li>
          <a className="font-sora text-xl block py-2 pl-3 pr-4 text-white rounded md:bg-transparent md:p-0" aria-current="page">
          {props.address}
            </a>
        </li>
        <li>
          <a className="font-sora text-xl block py-2 pl-3 pr-4 text-white rounded md:hover:bg-transparent md:border-0 md:p-0">
          {props.userBal ? parseFloat(props.userBal).toFixed(4)+" MATIC" : "Loading ..." }
            </a>
        </li>
      </ul>)}
    </div>
    <div className={"w-full md:block md:w-auto "+ (menu? "":"hidden")}>
    {!props.isConnected?
    <button type="button" onClick={props.connect} className="text-purple-700 bg-white hover:ease-in duration-150 hover:scale-90 hover:ring-2 hover:ring-offset-4 hover:ring-green font-sora rounded-full text-lg px-9 py-2.5 text-center mr-3 md:mr-0">Connect Wallet</button>
    :<button type="button" onClick={props.disconnect}  className="text-purple-700 bg-white hover:ease-in duration-150 hover:scale-90 hover:ring-2 hover:ring-offset-4 hover:ring-green font-sora rounded-full text-lg px-9 py-2.5 text-center mr-3 md:mr-0">Disconnect Wallet</button>
    }
    </div>
  </div>
  </nav>
  );
};

export default Navigation;