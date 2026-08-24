import React from 'react'
import { Users, CalendarDays, Ticket, UserCheck, UserX, Clock, } from "lucide-react";

function Dashboard() {
      const stats = [
        {
            title:"Total Visitor",
            value:'120',
            icons:"Users"
        },
        {
           title:"Today's Appointment",
            value:'24',
            icons:"CalendarDays"  
        },
        {
            title:"Active Passes",
            value:'18',
            icons:"Ticket" 
        },
        {
             title:"Checked-In",
            value:'12',
            icons:"Usercheck" 
        },
         {
             title:"Checked-Out",
            value:'8',
            icons:"UserX" 
        },
        {
             title:"Pending Appointments",
            value:'6',
            icons:"Clock"
        }


      ];

      const recentVisitors = [
        {
            name:"Rahul Patil",
            company:'ABC Technology',
            purpose:"Meeting",
            status:"CheckedIn"
        },
         {
            name:"Amit Patil",
            company:'Infoses',
            purpose:"Interview",
            status:"Pending"
        },
         {
            name:"Priya Joshi",
            company:'TCS',
            purpose:"Business Meeting",
            status:"Cheked-Out"
        },
         {
            name:"Sneha More",
            company:'WIPRO',
            purpose:"Interview",
            status:"Cheked-In"
        }

      ];

  return (
    <div className='min-h-screen bg-grey-100 p-6'>
        <div className='mb-8'>
              <h1 className='text-3xl font-bold text-grey-800'>
                     Dashboard
              </h1>

              <p className='text-grey-500 mt-1'>
                    Welcome to Visitor Pass Management System
              </p>
        </div>

        <div className='grid grid-clos-1 sm-grid-cols-2 lg:grid-cols-3 gap-g mb-8'> 
               {stats.map((stat)=>{
                const Icon = stat.icon;

                  return(
                    <div key={stat.title} className='bg-white rounded-xl shadow-sm p-6 flex-item-center justify-center'>
                        <div>
                            <p className='text-grey-500 text-sm'>
                                  {stat.title}
                            </p>
                            <h2 className='text-3xl font-bold text-grey-800 mt-2'>
                                 {stat.value}
                            </h2>
                        </div>

                        <div className='bg-blue-100 p-4 rounded-xl'>
                            <Icon className="w-7 h-7 text-blue-600"/>

                        </div>

                    </div>
                  )
               })}
        </div>

        <div className='bg-white rounded-xl shadow-sm overflow-hidden'>
            <div className='p-6 border-6'>
                <h2 className='text-xl font-semibold text-grey-800'>
                      Recent Visitor
                </h2>

                <p className='text-sm text-grey-500 mt-1'>
                       Latest Visitor Activity
                </p>

            </div>

            <div className='overflow-x-auto'>
                <table className='w-full'>
                    <thead className='bg-grey-50'>
                         <tr>
                            <th className='text-left px-6 py-4 text-sm font-semibold text-grey-600'>
                                   Visitor
                            </th>

                             <th className='text-left px-6 py-4 text-sm font-semibold text-grey-600'>
                                   Company
                            </th>

                             <th className='text-left px-6 py-4 text-sm font-semibold text-grey-600'>
                                   Purpose
                            </th>


                             <th className='text-left px-6 py-4 text-sm font-semibold text-grey-600'>
                                   status
                            </th>
                            </tr>    
                    </thead>
                    <tbody>
                        {recentVisitors.map((visitor,index)=>
                        <tr key={index} className='border-t hover:bg-grey-50'>
                               <td className='px-6 py-4'>
                                     <div className='font-medium text-grey-800'>
                                          {visitor.name}
                                     </div>
                               </td>

                               <td className='px-6 py-4 text-grey-600'>
                                   {visitor.company}
                               </td>

                                <td className='px-6 py-4 text-grey-600'>
                                   {visitor.purpose}
                               </td>

                               <td className='px-6 py-4'>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        visitor.status=== "Checked-In"? "bg-green-100 text-green-700": visitor.status === "Checked-Out"?"bg-gray-100 text-gray-700":"bg-yellow-100 text-yellow-700"
                                        }`}>
                                               {visitor.status}
                                    </span>
                               </td>
                        </tr>
                        )}
                    </tbody>

                </table>
            </div>

        </div>

    </div>
  )
}

export default Dashboard;