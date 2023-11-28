import React,{createContext,useState,useEffect} from 'react';
import Authentication from '../Services/Authentication';
import LoaderModal from '../component/common/Loader';


export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
  const [user,setUser] = useState(null);
  const [isAuthenticated,setIsAuthenticated] = useState(false);
  const [isLoaded,setIsLoaded] = useState(false);

  useEffect(()=>{
    Authentication.isAuthenticated().then(data=>{
      setUser(data.user);
      setIsAuthenticated(data.isAuthenticated);
      setIsLoaded(true);
    });
  },[]);
  return(
    <div>
      {!isLoaded ? <LoaderModal/>:
      <AuthContext.Provider value={{user,setUser,isAuthenticated,setIsAuthenticated}}>
        { children}
        </AuthContext.Provider>}
    </div>
  )
}