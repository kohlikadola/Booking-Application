import {Link} from "react-router-dom";
import {useAppContext} from "../contexts/AppContext";
import SignOutButton from "./SignOutButton.tsx";
const Header =()=>{
const {isLog} = useAppContext();
console.log(isLog);
return(
    <div className="bg-blue-800 py-6">
     <div className="container mx-auto flex justify-between"> 
    <span className="text-3xl text-white font-bold tracking-tight"><Link to="/">BookMyShow.com</Link></span>
    <span className="flex space-x-2">
    {isLog?(<><Link className="flex items-center text-white px-3 font-bold hover:bg-blue-600" to="/my-bookings">MyBookings</Link><Link className="flex items-center text-white  px-3 font-bold hover:bg-blue-600" to="/my-hotels">MyHotels</Link>
   <SignOutButton  /> 
    </>):( <Link to="/login" className="flex rounded bg-white items-center text-black-600 px-3 font-bold hover:bg-gray hover:text-green-600">Login</Link>)}
    </span>
    </div>
    </div>
  );
};
export default Header;
