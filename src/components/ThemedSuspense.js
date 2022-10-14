import React from 'react'
import {PuffLoader} from "react-spinners";

function ThemedSuspense() {
  return (
    <div className="w-full h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
        <PuffLoader size="300" color="#7e3af2" className="my-56 mx-auto"/>
    </div>
  )
}

export default ThemedSuspense
