import { useEffect, useState } from "react"
import logoImage from "../../assets/images/logo.svg"
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const [show, setShow] = useState(false)
    const [scroll, setScroll] = useState(false)
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('tanimaster-token');

    const scrollToSection = (sectionId) => {
        navigate("/");
        setTimeout(() => {
            const section = document.getElementById(sectionId);
            if (section) section.scrollIntoView({ behavior: "smooth" });
        }, 0);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 5) {
                setScroll(true);
                setShow(false);
            } else {
                setScroll(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`fixed w-full transition-all backdrop-blur-md bg-transparent px-4 md:px-10 top-0 left-0 right-0 z-50 ${scroll ? "py-2 shadow" : "py-3"}`}>
            <div className="container mx-auto">
                <div className="flex items-center justify-between">
                    <div className="logo">
                        <img src={logoImage} alt="logo" className="w-[80px] h-[50px] md:w-[100px] md:h-[60px]" />
                    </div>

                    {/* Desktop nav */}
                    <ul className="hidden md:flex gap-8 items-center font-bold">
                        <li><a href="#home" className="font-medium opacity-75 px-2 py-0.5 rounded-full hover:bg-green-400 transition duration-200">Beranda</a></li>
                        <li onClick={() => scrollToSection("fitur")} className="cursor-pointer"><a className="font-medium opacity-75 px-2 py-0.5 rounded-full hover:bg-green-400 transition duration-200">Fitur</a></li>
                        <li onClick={() => scrollToSection("rekomendasi")} className="cursor-pointer"><a className="font-medium opacity-75 px-2 py-0.5 rounded-full hover:bg-green-400 transition duration-200">Rekomendasi</a></li>
                        <li onClick={() => scrollToSection("contact")} className="cursor-pointer"><a className="font-medium opacity-75 px-2 py-0.5 rounded-full hover:bg-green-400 transition duration-200">Kontak</a></li>
                    </ul>

                    <div className="flex items-center gap-2">
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="bg-green-400 px-4 py-2 rounded-full font-bold hover:bg-green-600 transition duration-300 text-sm md:text-base"
                            >
                                Dashboard
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate("/auth")}
                                className="bg-green-400 px-4 py-2 rounded-full font-bold hover:bg-green-600 transition duration-300 text-sm md:text-base"
                            >
                                Masuk | Daftar
                            </button>
                        )}
                        {/* Mobile hamburger */}
                        <button className="md:hidden text-2xl" onClick={() => setShow(!show)}>
                            <i className={show ? "ri-close-line" : "ri-menu-3-line"}></i>
                        </button>
                    </div>
                </div>

                {/* Mobile dropdown */}
                {show && (
                    <div className="md:hidden mt-3 bg-green-400 rounded-lg shadow-lg px-4 py-4 space-y-3 font-bold">
                        <div className="flex items-center gap-3" onClick={() => { setShow(false); navigate("/"); }}>
                            <i className="ri-home-4-line text-xl"></i>
                            <span className="font-medium opacity-75">Beranda</span>
                        </div>
                        <div className="flex items-center gap-3" onClick={() => { setShow(false); scrollToSection("fitur"); }}>
                            <i className="ri-stack-line text-xl"></i>
                            <span className="font-medium opacity-75">Fitur</span>
                        </div>
                        <div className="flex items-center gap-3" onClick={() => { setShow(false); scrollToSection("rekomendasi"); }}>
                            <i className="ri-contacts-line text-xl"></i>
                            <span className="font-medium opacity-75">Rekomendasi</span>
                        </div>
                        <div className="flex items-center gap-3" onClick={() => { setShow(false); scrollToSection("contact"); }}>
                            <i className="ri-phone-line text-xl"></i>
                            <span className="font-medium opacity-75">Kontak</span>
                        </div>
                        {isLoggedIn && (
                            <div className="flex items-center gap-3" onClick={() => { setShow(false); navigate("/dashboard"); }}>
                                <i className="ri-dashboard-line text-xl"></i>
                                <span className="font-medium opacity-75">Dashboard</span>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Navbar
