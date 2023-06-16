import React, { useState } from "react";
import HeaderStyles from "./header.module.scss";
import Link from "next/link";
const Header = (props) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState();

    return (
        <>
            <header
                id={HeaderStyles.header}
                className={mobileMenuOpen && HeaderStyles.open}
                style={
                    props.isMobileDevice
                        ? {
                              width: "100vw",
                              padding: "0",
                              margin: "0",
                              borderRadius: "0 0 30px 30px",
                          }
                        : {}
                }
            >
                <div
                    className={HeaderStyles.logo}
                    style={props.isMobileDevice ? { width: "50%" } : {}}
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <Link href={"/"}>RoadMaster</Link>
                </div>
                <div className={HeaderStyles.mainMenu}>
                    {props.isMobileDevice && (
                        <div
                            className={`${HeaderStyles.mobileMenuButton} ${
                                mobileMenuOpen ? HeaderStyles.open : ""
                            }`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            <div className={HeaderStyles.lines}>
                                <div
                                    className={`${HeaderStyles.line}`}
                                    id={HeaderStyles.line1}
                                ></div>
                                <div
                                    className={`${HeaderStyles.line}`}
                                    id={HeaderStyles.line2}
                                ></div>
                                <div
                                    className={`${HeaderStyles.line}`}
                                    id={HeaderStyles.line3}
                                ></div>
                            </div>
                        </div>
                    )}
                    {!props.isMobileDevice && (
                        <ul>
                            <li>
                                <Link href="/">עמוד ראשי</Link>
                            </li>
                            <li>
                                <Link href="/my-drives">הנסיעות שלי</Link>
                            </li>
                        </ul>
                    )}
                </div>
                {!props.isMobileDevice && (
                    <div className={HeaderStyles.userComp}>
                        {props?.isLoggedIn ? (
                            <>
                                <button>
                                    <Link href={"/my-account"}>החשבון שלי</Link>
                                </button>
                                <button
                                    onClick={() => props.logout()}
                                    className={HeaderStyles.logout}
                                >
                                    התנתקות
                                </button>
                            </>
                        ) : (
                            <>
                                <button>
                                    <Link href={"/login"}>התחברות</Link>
                                </button>
                                <button>
                                    <Link href={"/register"}>הרשמה</Link>
                                </button>
                            </>
                        )}
                    </div>
                )}
            </header>
            {props.isMobileDevice && (
                <div className={HeaderStyles.mobileMenuModal}>
                    {mobileMenuOpen && (
                        <>
                            <h4>תפריט האתר</h4>
                            <ul>
                                <li onClick={() => {
                                                setMobileMenuOpen(false);
                                            }}>
                                    <Link href={"/"}>עמוד ראשי</Link>
                                </li>
                                <li onClick={() => {
                                                setMobileMenuOpen(false);
                                            }}>
                                    <Link  href={"/"}>הנסיעות שלי</Link>
                                </li>
                            </ul>
                            <div className={HeaderStyles.userComp}>
                                {props?.isLoggedIn ? (
                                    <>
                                        <button
                                            onClick={() => {
                                                setMobileMenuOpen(false);
                                            }}
                                        >
                                            <Link href={"/my-account"}>
                                                החשבון שלי
                                            </Link>
                                        </button>
                                        <button
                                            onClick={() => {
                                                props.logout();
                                                setMobileMenuOpen(false);
                                            }}
                                            className={HeaderStyles.logout}
                                        >
                                            התנתקות
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button>
                                            <Link href={"/login"}>התחברות</Link>
                                        </button>
                                        <button>
                                            <Link href={"/register"}>
                                                הרשמה
                                            </Link>
                                        </button>
                                    </>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default Header;
