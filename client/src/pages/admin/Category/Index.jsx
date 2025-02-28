import React from 'react'
import { Outlet } from 'react-router-dom';


const Index = () =>{
  return (
    <div>
      <h1 className="text-xl font-bold">Category Management</h1>
      <Outlet /> 
    </div>
  );
};

export default Index
