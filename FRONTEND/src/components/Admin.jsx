// import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControlLabel,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Admin.css';


const Admin = () => {
  var baseurl = import.meta.env.VITE_API_BASE_URL;
  var navigate = useNavigate();
  var location = useLocation()
  console.log("loc", location.state)
  const [input, setProductdata] = useState({
    fname: '',
    dname: '',
    lname: '',
    sname: '',
  });
  useEffect(() => {
    // var {pro} = location.state
    const { pro } = location.state || {};
    if (location.state !== null) {
      setProductdata({
        fname: pro.fname || "",
        dname: pro.dname || "",
        lname: pro.lname || "",
        sname: pro.sname || "",
      })
    }
  }, [])


  const inputHandler = (e) => {
    setProductdata({ ...input, [e.target.name]: e.target.value })
    console.log(input)
  };

  // const handleToggle = () => {
  //   setInput((prev) => ({ ...prev, available: !prev.available }));
  // };
  // test


  const submithandler = () => {
    //   const formData = new FormData();
    //   formData.append('fname', input.fname);
    //   formData.append('dname', input.dname);
    //   formData.append('lname', input.lname);
    //   formData.append('sname', input.sname);

    //  if (location.state!==null){
    //   var id =location.state.pro._id
    //   axios.put(`${baseurl}/e/${id}`,formData)
    //   .then((res)=>{
    //     alert(res.data.message)
    //     navigate("/ed")
    //   })
    //  }else{
    //   axios
    //     .post(`${baseurl}/e`, formData)
    //     .then((res) => {
    //       console.log(res.data);
    //       alert(res.data.message)
    //       navigate('/employee')
    //     })  
    //     .catch((err) => {
    //       console.log(err);  
    //     });
    const payload = {
      fname: input.fname,
      dname: input.dname,
      lname: input.lname,
      sname: input.sname
    };

    if (location.state !== null) {
      const id = location.state.pro._id;
      axios.put(`${baseurl}/e/${id}`, payload)
        .then((res) => {
          alert(res.data.message);
          navigate("/ed");
        });
    } else {
      axios.post(`${baseurl}/e`, payload)
        .then((res) => {
          alert(res.data.message);
          navigate('/employee');
        })
        .catch((err) => {
          console.log(err);
        });

    }

    // axios
    //   .post(`${baseurl}/p`, formData)
    //   .then((res) => {
    //     console.log(res.data);
    //     alert(res.data.message)
    //     navigate('/product')
    //   })  
    //   .catch((err) => {
    //     console.log(err);  
    //   });
  };
  return (



    <div className="signup-page">
      <Box className="signup-card" component="main" role="main" aria-labelledby="signup-heading">
        <div className="brand" aria-hidden>
          <div className="logo">
            <div>
              <div className="brand"><div className="logo-box"><div className="gradient-text"><i>W</i></div></div><div className="brand-text"><div className="brand-title">Washify</div> <br></br>
                <div className="brand-sub">Connect · Book · Track</div></div></div>
            </div>
          </div>
        </div>

        <Typography className="signup-sub" >Admin Signup Form</Typography>

        <form>
          <TextField
            fullWidth
            label='Name of the Owner'
            variant='outlined'
            margin='normal'
            name='fname'
            value={input.fname}
            onChange={inputHandler}
            required
          />

          <TextField
            fullWidth
            label='Contact Number'
            variant='outlined'
            margin='normal'
            name='nname'
            type="number"
            value={input.nname}
            onChange={inputHandler}
            required
          />


          <TextField
            fullWidth
            label='Email Address'
            variant='outlined'
            margin='normal'
            name='ename'
            value={input.ename}
            onChange={inputHandler}
            required
          />

          <TextField
            fullWidth
            label="Password"
            variant="outlined"
            margin="normal"
            name="password"
            type="password"
            onChange={inputHandler}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            variant="outlined"
            margin="normal"
            name="cpassword"
            type="password"
            // make sure your state has a cpassword field
            onChange={inputHandler}
            required
          />
          



        </form>
      </Box>
    </div>
  )
}

export default Admin
