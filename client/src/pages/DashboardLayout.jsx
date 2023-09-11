import { Outlet, redirect, useLoaderData, useNavigate, useNavigation } from "react-router-dom"
import Wrapper from '../assets/wrappers/Dashboard'
import { BigSidebar, SmallSidebar, Navbar, Loading } from "../components"
import { createContext, useState, useContext, useEffect } from "react"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"
import { useQuery } from "@tanstack/react-query"

const userQuery = {
    queryKey: ['user'],
    queryFn: async () => {
        const { data } = await customFetch.get('/users/current-user')
        return data
    }
}

export const loader = (queryClient) => async () => {
    try {
        return await queryClient.ensureQueryData(userQuery)
    } catch (error) {
        return redirect('/')
    }
}


const DashboardContext = createContext()



const DashboardLayout = ({ isDarkThemeEnabled, queryClient }) => {
    const { user }  = useQuery(userQuery).data
    const navigate = useNavigate()
    const navigation = useNavigation()
    const isPageLoading = navigation.state === 'loading'
    const [showSidebar, setShowSidebar] = useState(false);
    const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);
    const [isAuthError, setIsAuthError] = useState(false);
    
    const toggleDarkTheme = () => {
        const newDarkTheme = !isDarkTheme
        setIsDarkTheme(newDarkTheme)

        document.body.classList.toggle('dark-theme', newDarkTheme)
        localStorage.setItem('dark-theme', newDarkTheme)
    };

    const toggleSidebar = () => {
        setShowSidebar(!showSidebar)
    };

    const logOutUser = async () => {
        navigate('/')
        await customFetch.get('/users/logout')
        queryClient.invalidateQueries()
        toast.success('Logged out successfully')
    };

    customFetch.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            if (error?.response.status === 401) {
                setIsAuthError(true)
                navigate('/')
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        if (!isAuthError) {
            return
        }
        logOutUser();
    }, [isAuthError])


    return (
        <DashboardContext.Provider value={{
            user,
            showSidebar,
            isDarkTheme,
            toggleDarkTheme,
            toggleSidebar,
            logOutUser
        }}>
            <Wrapper>
                <main className="dashboard">
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className="dashboard-page">
                            {
                                isPageLoading && <Loading />
                            }
                            <Outlet context={{ user }}/>
                        </div>
                    </div>
                </main>
            </Wrapper>
        </DashboardContext.Provider>
    )
};

export const useDashboardContext = () => {
    return useContext(DashboardContext)
}
export default DashboardLayout