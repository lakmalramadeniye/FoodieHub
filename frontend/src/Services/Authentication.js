import { HOST_URL } from "../Constants";

export default {
  login: async user => {
    const res = await fetch(HOST_URL +'/user/login', {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
  
    if (res.status === 200) {
      // Response status is 200, so the request was successful
      return res.json(); // This returns a Promise that resolves to the JSON data
    } else {
      // Response status is not 200, indicating an error
      return { isAuthenticated: false, user: { username: "", role: "" }};
    }
  },
  logout: async () => {
    const res = await fetch(HOST_URL +'/user/logout', {
      credentials: 'include', // Include credentials (cookies) in the request
    });
    const data = await res.json();
    return data;
  },

  isAuthenticated: async () => {
    const res = await fetch(HOST_URL +'/user/userauthenticated', {
      credentials: 'include', // Include credentials (cookies) in the request
    });
    if (res.status === 200)
      return res.json().then(data => data);

    else
      return { isAuthenticated: false, user: { username: "", role: "" } };
  },
  customerRegistration: async user => {
    const res = await fetch(HOST_URL +'/user/customerRegistration', {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (res.status === 200)
      return res.json();

    else
      return { isAuthenticated: false, user: { username: "", role: "" } };

  },
  staffRegistration: async user => {
    const res = await fetch(HOST_URL +'/user/staffRegistration', {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (res.status === 200)
      return res.json();

    else
      return { isAuthenticated: false, user: { username: "", role: "" } };

  },
  userUpdate: async (user, id) => {
    const res = await fetch(HOST_URL +`/user/userupdate/${id}`, {
      method: "put",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (res.status === 200)
      return res.json();

    else
      return { isAuthenticated: false, user: { username: "", role: "" } };

  },
}