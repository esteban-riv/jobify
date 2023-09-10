import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import { useDashboardContext } from '../pages/DashboardLayout'
import { useState } from 'react';
import Wrapper from '../assets/wrappers/ThemeToggle'

const ThemeToggle = () => {
    const { isDarkTheme, toggleDarkTheme } = useDashboardContext()


    return (
        <Wrapper
            onClick={toggleDarkTheme}
        >
            {isDarkTheme ? <BsFillSunFill className='toggle-icon' /> : <BsFillMoonFill />}
        </Wrapper>
    )
}
export default ThemeToggle