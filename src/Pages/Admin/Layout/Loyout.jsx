import React from 'react'
import TopBar from '../../../Componants/Admin/Loyout/TopBar'
import SideBar from '../../../Componants/Admin/Loyout/SideBar'
import Footer from '../../../Componants/Admin/Loyout/Footer'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux';

export default function Loyout() {
    const { user } = useSelector(state => state.auth);

    return (
        <>
            <SideBar user={user} />
            <TopBar user={user} />

            <main className="nxl-container">

                <Outlet />
                <Footer />
            </main >


        </>
    )
}
