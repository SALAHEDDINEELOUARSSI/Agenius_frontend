'use client'

import { useState, useEffect } from 'react'
import { Chart2 } from "@/components/chart2"
import { Chart3 } from "@/components/chart3"
import { Chart4 } from "@/components/chart4"
interface Job {
  id: string;
  name: string;
  company: string;
  description: string;
}
import {jwtDecode} from "jwt-decode";

interface DecodedToken {
  sub: string;
  // Tu peux ajouter d'autres champs si ton token contient + d'infos
}

export default function DashboardContent() {

  

  
  return (

      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">

            <div className="px-4 lg:px-6">

              <div className="flex flex-col lg:flex-row">
                <div className="w-full lg:w-1/3 py-4 lg:pr-2">
admin         chart 1        </div>
                <div className="w-full lg:w-1/3 py-4 px-0 lg:px-2">
admin      chart 2           </div>
                <div className="w-full lg:w-1/3 py-4 lg:pl-2">
admin           chart 3      </div>
              </div>
            </div>
            <div className="px-4 lg:px-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="w-full lg:w-[60%] flex">
                  <div className="flex-1 h-full">

                  </div>
                </div>
                <div className="w-full lg:w-[40%] flex">
                  <div className="flex-1 h-full">
                  </div>
                </div>
              </div>
            </div>

            

          </div>
        </div>
      </div>
  )
}
