import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
    const  navigate = useNavigate();
    const [form,setForm]= useState({
        name:"",
        email:"",
        phone:"",
        passord:"",
        confirmPassword:"",
        role:"Visitor"
    });

    const[error,setError] = useState('');
    const[success,setSuccess] = useState("");
    const[loading,setLoading]= useState(false);

    const handleChange= (e)=>{
        setFormData({
            ...FormData,
            [e.target.name] : e.target.value
        });
    };

    const handleSubmit = async(e)=>{
          e.preventDefault();

          setError("");

          setSuccess("");

          if(FormData.passord !==FormData.confirmPassword){
            setError("Password do not match");
            return;
          }


          if(FormData.passord.length<6){
            setError("Password must be at least 6 character");
            return;
          }

          setLoading(true);

          try {
              const response = await api.post("/auth/register",{
                name:FormData.name,
                email:FormData.email,
                phone:FormData.phone,
                passord:FormData.passord,
                role:FormData.role

              });

              setSuccess(response.data.message || "Register Successfully");

              setFormData({
                name:"",
                email:"",
                phone:"",
                passord:"",
                confirmPassword:"",
                role:"Visitor"
              });

              setTimeout(()=>{
                  navigate("/login") 
              },1500)
          } catch (error) {
            setError(
                error.response?.data?.message || 'Register failed please try again'
            );
          }finally{
            setLoading(false);
          }

    };
  return (
    <div className='min-h-screen flex-item-center justify-center bg-grey-100 px-4 py-8'>
        <div className='w-full max-w-lg bg-white rounded-2xl shadow-lg p-8'>

            <div className='text-center mb-8'>

                <div className='inline-flex item-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl text-xl font-bold mb-4'>
                    VP
                </div>

                <h1 className='text-3xl font-bold text-grey-800'>
                       "Visitor Pass"
                </h1>

                <p className='text-grey-500 mb-2'>
                        Management System
                </p>

            </div>

            <h2 className='text-2xl font-semibold text-grey-800 mb-2'>
                   Create Account
            </h2>

            <p className='text-grey-500 mb-6'>
                 Register  a new accont
            </p>

            {error&&(
                <div className='bg-red-50 border border-red-200 text-red-600 px-3 py-4 rounded-lg mb-5'>
                    {error}
                </div>
            )}

            {success&&(
                <div className='bg-green-50 border border-green-200 text-green-600 px-3 py-4 rounded-lg mb-5'>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-5'>

                <div>
                    <label htmlFor='name' className='block text-sm font-medium text-grey-700 mb-2'>
                        Full Name
                    </label>
                    <input
                    id='name'
                    type='text' name='name' value={FormData.name} onChange={handleChange} placeholder='enter your full name' required
                    className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'/>

                </div>

                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-grey-700 mb-2'>
                             Email Address
                    </label>
                    <input
                    id='email' type='email' name='email' value={FormData.email} onChange={handleChange} placeholder='enter your email' required  className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'/>

                </div>


                <div>
                    <label htmlFor='phone' className='block text-sm font-medium text-grey-700 mb-2'>
                            Phone Number
                    </label>
                    <input
                    id='phone' type='tel' name='phone' value={FormData.phone} onChange={handleChange} placeholder='enter your phone number' required className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'/>

                </div>


                <div>
                    <label htmlFor='role' className='block text-sm font-medium text-grey-700 mb-2'>
                           Role
                    </label>
                    <select id='role' name='role' value={FormData.role} onChange={handleChange} className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'>
                        <option value="Visitor">Visitor</option>
                        <Option value="Employee">Employee</Option>
                        <option value="Security">Security</option>
                     </select>   
                </div>


                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-grey-700 mb-2'>
                          Password
                    </label>
                    <input id='password' type='password' name='password' value={FormData.passord} onChange={handleChange} placeholder='enter your password' required className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'/>
                </div>


                <div>
                    <label htmlFor='confirmPassword' className='block text-sm font-medium text-grey-700 mb-2'>
                          Confirm Password  
                    </label>
                    <input id='confirmPassword'type="confirmPassword" name='confirmPassword' value={FormData.confirmPassword} onChange={handleChange} placeholder='confirm password' required className='w-full border border-grey-300 rounded-lg px-3 py-4 outline-none focus:ring-2 focus:ring-blue-500'/>
                </div>

                <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg trasition' >
                   {loading? "Creating Account..." : "Create Account"}
                </button>

            </form>

            <div className='text-center mb-6'>
                <p className='text-grey-500 text-sm'>
                     Already have a account?{""}
                     <Link to="/login" className='text-blue-600 font-semibold hover:underline'>
                        Login
                     </Link>
                </p>

            </div>

        </div>

    </div>
  )
}

export default Register;