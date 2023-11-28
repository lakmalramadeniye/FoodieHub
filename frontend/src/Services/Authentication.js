export default {
  login: async user => {
    const res = await fetch('/user/login', {
      method: "post",
      body: JSON.stringify(user),
      headers: {
        'Content-Type': 'application/json'
      }
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
    const res = await fetch('/user/logout');
    const data = await res.json();
    return data;
  },

  isAuthenticated: async () => {
    const res = await fetch('/user/userauthenticated');
    if (res.status === 200)
      return res.json().then(data => data);

    else
      return { isAuthenticated: false, user: { username: "", role: "" } };
  },
  customerRegistration: async user => {
    const res = await fetch('/user/customerRegistration', {
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
    const res = await fetch('/user/staffRegistration', {
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
  userUpdate: async (user, id) => {
    const res = await fetch(`/user/userupdate/${id}`, {
      method: "put",
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
}