import { Link, Form, redirect, useNavigate } from "react-router-dom"
import Wrapper from "../assets/wrappers/RegisterAndLoginPage"
import { Logo, FormRow, SubmitBtn } from "../components"
import customFetch from "../utils/customFetch"
import { toast } from "react-toastify"

// This is the action function that will be called when the form is submitted
export const action = (queryClient) => async ({ request }) => {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)
    const errors = {}

    if (data.password.length < 8) {
        errors.message = 'Password must be at least 8 characters long'
        return errors
    }

    try {
        await customFetch.post('/auth/login', data)
        queryClient.invalidateQuerys();
        toast.success('Logged in successfully')
        return redirect('/dashboard')
    } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong")
        return error;
    }
}

const Login = () => {
    const navigate = useNavigate()
    const data = {
        email: 'test@test.com',
        password: 'secret123'
    }

    const loginDemoUser = async () => {

        try {
            await customFetch.post('/auth/login', data)
            toast.success('Logged in successfully');
            navigate('/dashboard')
        } catch (error) {
            toast.error(error?.response?.data?.message || "Something went wrong")
        }
    }

    return (
        <Wrapper>
            <Form method="post" className='form'>
                <Logo />
                <h4>Login</h4>
                <FormRow
                    type='email'
                    name='email'
                />
                <FormRow
                    type='password'
                    name='password'
                />
                <SubmitBtn />
                <button
                    type="button"
                    className="btn btn-block"
                    onClick={loginDemoUser}
                >Demo</button>
                <p>
                    Not a member?
                    <Link
                        to='/register'
                        className="member-btn">
                        Register
                    </Link>
                </p>
            </Form>

        </Wrapper>
    )
}
export default Login