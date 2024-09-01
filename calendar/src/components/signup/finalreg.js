import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Axios from 'axios';
import PasswordStrength from '../PasswordStrength';
import './test.css';
const Finalreg = () => {
  return (
    <div className="container-md signin">
      <form >
        <div className="test">
          <div className="col-12 header_text">
            Signup
          </div>
          {/* first name */}
          <div className="row input-box">

            <div className='col-3 offset-1 col-sm-2 col-md-2  col-lg-2 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label'>
              <span>First Name :&nbsp;</span>
            </div>
            <div className='col-7 col-sm-5   col-md-6 col-lg-4 col-xl-4  input'>
              <input type="text" placeholder="first" />
              <div className='error_msg'></div>
            </div>

          </div>



          <div className="row input-box password_container">
            {/* <div className='col-md-1  empty'></div> */}
            <div className='col-3 offset-1 col-sm-2 col-md-2  col-lg-2 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label'>
              <span>Password :&nbsp;</span>
            </div>
            <div className='col-7 col-sm-5   col-md-6 col-lg-4 col-xl-4  input'>

              <input type="text" placeholder="first" />
              <PasswordStrength password="password" />
            </div>

            {/* password_hints  */}
            <div className='col-sm-12 col-md-3 col-lg-4 col-xl-4'>
              <div className='row password'>
                {/* <div className='col-md-3 col-3 col-sm-3 col-md- display-none'> display none</div> */}
                <div className='password_hint col-7 offset-3 col-sm-5 offset-sm-3 col-md-12 offset-md-3   col-lg-12 col-xl-12  '>
                  be minimum 16 charactercontain a specail character and a number
                  contain at least one uppercase and one lowercase character


                </div>
              </div>
            </div>


            {/* confirmed password */}
            <div className='col-12'>
              <div className="row confirm-password">

                <div className='col-3 offset-1 col-sm-2 col-md-2  col-lg-2 offset-md-1 offset-lg-2 offset-sm-1 col-xl-2 offset-xl-2 label'>
                  <span>First Name :&nbsp;</span>
                </div>
                <div className='col-7 col-sm-5   col-md-6 col-lg-4 col-xl-4  input'>
                  <input type="text" placeholder="first" />
                  <div className='error_msg'></div>
                </div>

              </div>
            </div>
          </div>



          <div className="row">
            <div className='col-md-4 empty'></div>
            <div className='col-9 col-md-5 col-sm-4 col-lg-4 button-box'>
              <div className='signup'><input type="submit" value="Sign up" /></div>
              <div className='login' >Login</div>
            </div>
            <div className='col-md-3  empty'></div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default Finalreg; 