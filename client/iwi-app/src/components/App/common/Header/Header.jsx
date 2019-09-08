import React from 'react';
import Nav from './Nav';
import { Link } from 'react-router-dom';

function Header(props) {
    return (
        <header>
            <div className="logo">
                <Link to="/"><h1>iWi</h1></Link>
            </div>
            {
                localStorage.getItem('username') 
                ? <Nav />
                : null
            }
        </header>
    )
}

export default Header;