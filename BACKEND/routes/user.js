const userRouter = require('express').Router();
const JWT = require('jsonwebtoken');
const passport = require('passport');
const passportConfig = require('../passport');
const User = require('../models/User');
const Customer = require('../models/Customer')
const bcrypt = require('bcrypt');
const { commonResponse } = require('./commonResponse');
const Staff = require('../models/Staff');

const signToken = userID => {
  return JWT.sign({
    iss: "FoodieHub",
    sub: userID
    //token expires in 1hour, after 1h user have to relogin 
  }, "FoodieHub", { expiresIn: "1h" });
}


//customer register(add)
userRouter.route('/customerRegistration').post((req, res) => {
  const { fname, lname, mobile, email, username, password, address, image } = req.body;
  const role = "user"
  const name = fname + " " + lname

  User.findOne({ username }, (err, user) => {
    if (err)
      res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    if (user)
      res.status(400).json({ message: { msgBody: "Username is already taken", msgError: true } });
    else {
      const newUser = new User({ name, email, username, password, role });

      newUser.save((err, result) => {
        if (err)
          res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
        else {
          const userID = result.id
          const newCustomer = new Customer({ userID, fname, lname, address, mobile, email, image });
          newCustomer.save(err => {
            if (err) {
              User.findByIdAndRemove(userID)
              res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });

            }
            else {
              res.status(200).json({ message: { msgBody: "Account Successfully created", msgError: false } });
            }
          })
        }

      });
    }

  });
});

//Staff register(add)
userRouter.route('/staffRegistration').post((req, res) => {
  const { fname, lname, mobile, email, username, password, address, nic, designation, age, image} = req.body;
  const role = "staff"
  const name = fname + " " + lname

  User.findOne({ username }, (err, user) => {
    if (err)
      res.status(500).json({ message: { msgBody: "Error has occured", msgError: true } });
    if (user)
      res.status(400).json({ message: { msgBody: "Username is already taken", msgError: true } });
    else {
      const newUser = new User({ name, email, username, password, role });

      newUser.save((err, result) => {
        if (err)
          res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });
        else {
          const userID = result.id
          const newStaff = new Staff({ userID, fname, lname, address, nic, designation, age, mobile, email, image });
          newStaff.save(err => {
            if (err) {
              User.findByIdAndRemove(userID)
              res.status(500).json({ message: { msgBody: "Error has occured ", msgError: true } });

            }
            else {
              res.status(201).json({ message: { msgBody: "Account Successfully created", msgError: false } });
            }
          })
        }

      });
    }

  });
});

//logout

userRouter.get('/logout', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.clearCookie('access_token');
  res.json({ user: { username: "", role: "" }, success: true });
});



//use passport locatstrategy for login

userRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  if (req.isAuthenticated()) {
    //get request user from passport compare password
    const { _id, username, role } = req.user;
    //create json token
    const token = signToken(_id);
    //set cookie
    //use http only for prevent client edit cookie using java scripts
    //same site use for cross site scripting prevention
    try {
      res.cookie('access_token', token, { httpOnly: false, sameSite: 'lax', secure: true, domain: "localhost", path: '/' });
      res.status(200).json({ isAuthenticated: true, user: { username, role, _id } });
    } catch (error) {
      console.log(error)
    }
  }

});

userRouter.get('/userauthenticated', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { username, role } = req.user;
  res.status(200).json({ isAuthenticated: true, user: { username, role } });
});



//user update
userRouter.put('/userupdate/:id', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const userID = req.params.id;
    const { fname, lname, mobile, email, address, nic, designation, age, image } = req.body;
    const { _id, role } = req.user;

    if (role === "user") {
      const newCustomer = { userID, fname, lname, address, mobile, email, image };
      const result = await Customer.findOneAndUpdate({ userID: userID }, newCustomer, { upsert: true });
      if (result) {
        res.status(200).send({ status: "User updated" });
      } else {
        res.status(500).send({ status: "Error with updating data" });
      }
    } else if (role === "staff") {
      const newStaff = { userID, fname, lname, address, nic, designation, age, mobile, email, image };
      const result = await Staff.findOneAndUpdate({ userID: userID }, newStaff, { upsert: true });
      if (result) {
        res.status(200).send({ status: "User updated" });
      } else {
        res.status(500).send({ status: "Error with updating data" });
      }
    } else {
      res.status(400).send({ status: "Invalid role" });
    }
  } catch (error) {
    res.status(500).send({ status: "Error with updating data", error: error.message });
  }
});

//delete
userRouter.delete('/delete/:id/:role', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const id = req.params.id;
    const userID = req.params.id;
    const role = req.params.role;

    // Remove the User document
    await User.findByIdAndRemove(id);

    // Depending on the role, remove the associated Customer or Staff document
    if (role === 'user') {
      await Customer.findOneAndRemove({ userID: userID });
    }
    if (role === 'staff') {
      await Staff.findOneAndRemove({ userID: userID });
    }

    res.status(200).send({ status: "User deleted" });
  } catch (err) {
    res.status(500).send({ status: "Error with delete", error: err.message });
  }
});



//customer can view user Profile 

userRouter.get('/userprofile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let userProfile = { ...user._doc }; // Copy user data to userProfile object

    if (req.user.role === "user") {
      const customer = await Customer.findOne({ userID: req.user._id });
      if (customer) {
        userProfile = { ...userProfile, ...customer._doc }; // Merge customer data
      }
    }

    if (req.user.role === "staff") {
      const staff = await Staff.findOne({ userID: req.user._id });
      if (staff) {
        userProfile = { ...userProfile, ...staff._doc }; // Merge staff data
      }
    }

    if (!user) {
      return res.status(200).json(commonResponse("Error", "No profile found for this user", []));
    }

    // Return the merged user profile
    res.json(commonResponse("Success", "User profile found", userProfile));
  } catch (err) {
    // Handle any errors that occur during the database query
    res.status(500).json(commonResponse("Error", "An error occurred while fetching the user profile", []));
  }
});


userRouter.get("/isUserAvailable", async (req, res) => {
  try {
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(200).json(commonResponse("Error", "No profile found for this user", []));
      }
      res.json(commonResponse("Success", "User found", user));
    } else {
      return res.status(200).json(commonResponse("Error", "Unauthorized", []));
    }
  } catch (err) {
    return res.status(500).json(commonResponse("Error", "An error occurred while fetching the user profile", []));
  }
});





//admin can view customer list

userRouter.get('/alluser', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role === 'admin') {
    User.find().then((user) => {
      res.json(user)
    }).catch((err) => {
      console.log(err);
    })
  }
  else
    res.status(403).json({ message: { msgBody: "You'r not an admin", msgError: true } });
});

userRouter.get('/customers', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user.role === 'staff') {
    Customer.find().then((user) => {
      res.json(user)
    }).catch((err) => {
      console.log(err);
    })
  }
  else
    res.status(403).json({ message: { msgBody: "You'r not an admin", msgError: true } });
});


module.exports = userRouter;