import React from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'

import { router } from '@/routes/root'

import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

import '@/main.css'

const root = createRoot(document.getElementById('root')!)
root.render(
  <React.StrictMode>
    <div className='pb-12 scroll-smooth'>
      <Navbar />
      <RouterProvider router={router} />
      <Footer />
    </div>
  </React.StrictMode>
)
