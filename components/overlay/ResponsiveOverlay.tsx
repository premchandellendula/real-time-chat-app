"use client"
import React, { useEffect, useState } from 'react'

const ResponsiveOverlay = () => {
    const [isLessWidth, setIsLessWidth] = useState<boolean>(false);

    useEffect(() => {
        const checkWidth = () => {
            if (window.innerWidth < 768) {
                setIsLessWidth(true);
            } else {
                setIsLessWidth(false);
            }
        };
    
        checkWidth();
    
        window.addEventListener("resize", checkWidth);

        return () => window.removeEventListener("resize", checkWidth);
    }, []);

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black/80 to-gray-900/80 backdrop-blur-sm transition-all duration-300 ${isLessWidth ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
            <div className="bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 max-w-md w-full mx-4 p-8 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 text-center space-y-4 animate-fadeIn">
                <h1 className="text-3xl md:text-4xl font-bold">
                    Optimize Your Experience
                </h1>
                <p className="text-base md:text-lg">
                    This website is designed for larger screens to give you the best
                    possible experience. Please switch to a bigger device or increase
                    your browser window size.
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    We appreciate your understanding!
                </p>
            </div>
        </div>
    )
}

export default ResponsiveOverlay