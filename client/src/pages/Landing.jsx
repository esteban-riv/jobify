import styled from 'styled-components'
import Wrapper from '../assets/wrappers/LandingPage'
import main from '../assets/images/main.svg'
import { Link } from 'react-router-dom'
import { Logo } from '../components'

const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>job <span>Tracking</span> app</h1>
                    <p>
                        Vaporware hella godard, mumblecore master cleanse heirloom poutine offal hell of. Mixtape literally celiac, cray tattooed man braid hoodie. Occupy leggings yuccie DSA man bun jianbing. Gluten-free chillwave pabst iceland +1 mixtape pok pok ramps skateboard williamsburg occupy jean shorts. Flexitarian tumblr jianbing plaid. Man bun iceland cred schlitz.
                    </p>
                    <Link to='/register' className='btn register-link'>Register</Link>
                    <Link to='/login' className='btn login-link'>Login/Demo User</Link>
                </div>
                <img src={main} alt="job hunt" className='img main-img' />
            </div>
        </Wrapper>
    )
}


export default Landing