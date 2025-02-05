/* eslint-disable react/prop-types */
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, onSearch, openCreateDialog, resetInputs }) => {
    const location = useLocation();

    const handleSearchChange = (e) => {
        onSearch(e.target.value);
    };

    const isTodoPage = location.pathname === '/todo';
    const isNotesPage = location.pathname === '/notes';

    return (
        <>
            <div className="bg-base-300 flex flex-col min-h-screen">
                <div className="navbar bg-base-100 border-b-4 border-black fixed top-0 left-0 w-full z-10">
                    <div className="navbar-start hidden md:flex">
                        {location.pathname === '/notes' ? (
                            <a className="btn btn-ghost text-xl">Note List</a>
                        ) : location.pathname === '/todo' ? (
                            <a className="btn btn-ghost text-xl">To-Do List</a>
                        ) : null}
                    </div>
                    <div className="navbar-start flex md:hidden">
                        {location.pathname === '/notes' ? (
                            <a className="btn btn-ghost text-xl">
                                <i className="bi bi-journal-text"></i>
                            </a>
                        ) : location.pathname === '/todo' ? (
                            <a className="btn btn-ghost text-xl">
                                <i className="bi bi-journal-check"></i>
                            </a>
                        ) : null}
                    </div>
                    <div className="navbar-center">
                        {isTodoPage && (
                            <label className="input input-bordered flex items-center gap-2 border-2 border-black rounded-none input-sm text-xs w-full sm:w-56 md:w-96 bg-base-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <input
                                    type="text"
                                    className="grow"
                                    placeholder="Search Task ..."
                                    onChange={handleSearchChange}
                                />
                                <i className="bi bi-search"></i>
                            </label>
                        )}
                        {isNotesPage && (
                            <label className="input input-bordered flex items-center gap-2 border-2 border-black rounded-none input-sm text-xs w-full sm:w-56 md:w-96 bg-base-200 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                             <input
                type="text"
                className="grow"
                placeholder="Search Notes ..."
                onChange={handleSearchChange}
            />
                                <i className="bi bi-search"></i>
                            </label>
                        )}
                    </div>
                    <div className="navbar-end">
                        {isTodoPage && (
                            <button className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mr-3" onClick={openCreateDialog}>
                                <i className="bi bi-plus-circle-dotted text-lg"></i>
                            </button>
                        )}
                        {isNotesPage && (
                            <button className="btn btn-sm bg-base-300 border-2 border-black btn-square text-xs rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mr-3"  onClick={() => {
                                resetInputs(); 
                                document.getElementById('createNotes').showModal();
                            }}>
                                <i className="bi bi-plus-circle-dotted text-lg"></i>
                            </button>
                        )}
                    </div>
                </div>
                {children}
                <footer className="footer bg-base-200 p-4 mt-auto flex justify-between items-center mb-12">
                    <aside className="text-left ml-2">
                        <p className="font-bold text-lg">ReiivanTheOnlyOne .</p>
                    </aside>
                    <nav className="flex gap-4 mr-2">
                        <a href="https://www.instagram.com/m9nokuro" className="text-2xl">
                            <i className="bi bi-instagram"></i>
                        </a>
                        <a href="https://github.com/RevanSP" className="text-2xl">
                            <i className="bi bi-github"></i>
                        </a>
                        <a href="https://web.facebook.com/profile.php?id=100082958149027&_rdc=1&_rdr#" className="text-2xl">
                            <i className="bi bi-facebook"></i>
                        </a>
                    </nav>
                </footer>
                <div className="btm-nav btm-nav-sm">
                    <Link to="/notes" className={location.pathname === '/notes' ? 'active' : ''}>
                        <i className="bi bi-journal-text text-black"></i>
                    </Link>
                    <Link to="/todo" className={location.pathname === '/todo' ? 'active' : ''}>
                        <i className="bi bi-journal-check text-black"></i>
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Layout;