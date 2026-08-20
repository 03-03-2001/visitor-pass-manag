import React from 'react'
import { useState } from 'react'
import api from '../services/api'

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);

      localStorage.setItem("user", JSON.stringify(user));

      navigate("/dashboard")
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Invalid user and Password"
      )
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen bg-green-100 flex-item-center justify-center px-4 '>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <div className='inline-flex item-center justify-center w-16 h-16 bg-blue'>
            VP
          </div>
          <h1 className='text-3xl font-bold text-grey-700'>Visitor Pass</h1>

          <p className='text-grey-500 mb-3'>Management System</p>

        </div>

        <div className='bg-white rounded-2xl shadow-lg p-8'>
          <h2 className='text-2xl font-semibold text-grey-800 mb-2'>Welcome Back</h2>

          <p className='text-grey-500 mb-6'>Login in your account</p>

          {error && (
            <div className='mb-5 rounded-lg bg-red-500 border border-red-200 text-red'>
              {error}
            </div>
          )}


          <form onSubmit={handleSubmit} className='space-y-5'>

            <div>
              <label htmlFor='email' className='block text-sm font-medium text-grey-700 mb-2'>
                Email Address
              </label>
              <input id='email' type='email' name='email' value={formData.email} onChange={handleChange} placeholder='enter your email' required
                className='w-full px-4 py-3 borser border-grey-300 rounded-lg outline-none ' />

            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-grey-700 mb-2'>
                Password
              </label>
              <input id='password' type='password' name='password' value={formData.password} onChange={handleChange} placeholder='enter your password' required
                className='w-full px-4 py-3 borser border-grey-300 rounded-lg outline-none' />
            </div>

            <button type='submit' disabled={loading} className='w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400'>
              {loading ? "Loggin in ..." : "Login"}
            </button>
          </form>


          <div className='text-center mb-6'>
            <p className='text-grey-500 text-sm'>
              Don't have a account?{" "}
              <link to="/register"
                className='text-blue-600 font-semibold hover:underline'>
                Register
              </link>
            </p>

          </div>

        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          © 2026 Visitor Pass Management System
        </p>

      </div>

    </div>
  )
}

export default Login