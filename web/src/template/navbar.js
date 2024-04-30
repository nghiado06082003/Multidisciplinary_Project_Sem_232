import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const NavBar = () => {
    const token = cookies.get("access-token");
    let navItem = null

    if (token) {
        navItem = (
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/gardens">
                            Quản lý vườn
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }
    else {
        navItem = (
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link className="nav-link" to="/login">
                            Đăng nhập
                        </Link>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        Vườn thông minh
                    </Link>
                    <button
                        className="navbar-toggler"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#navbarNav"
                        aria-controls="navbarNav"
                        aria-expanded="false"
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon" />
                    </button>
                    {navItem}
                </div>
            </nav>
            <Outlet />
        </>

    )
}