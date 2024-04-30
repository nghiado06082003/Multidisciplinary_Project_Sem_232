import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useLoginMutation } from "../../api/apiSlice"
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const LogIn = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const onUsernameChange = e => setUsername(e.target.value)
    const onPasswordChange = e => setPassword(e.target.value)

    const [login] = useLoginMutation()

    const canSave = [username, password].every(Boolean)

    const handleSubmit = async () => {
        if (canSave) {
            try {
                const login_info = { username: username, password: password }
                let response = await login(login_info)
                cookies.set("access-token", response.data["access-token"], { path: '/' })
                setTimeout(() => window.location.reload(), 100)
                navigate('/')
            }
            catch (err) {
                alert(err)
            }
        }
    }

    return (
        <div className="container-md">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <h2>Đăng nhập</h2>
                    <form>
                        <div className="mb-3">
                            <label for="username" className="form-label">Tài khoản</label>
                            <input
                                type="text"
                                className='form-control'
                                id="username"
                                name="username"
                                value={username}
                                onChange={onUsernameChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label for="password" className="form-label">Mật khẩu</label>
                            <input
                                type="password"
                                className='form-control'
                                id="password"
                                name="password"
                                value={password}
                                onChange={onPasswordChange}
                            />
                        </div>
                    </form>
                    <button className='btn btn-primary' onClick={handleSubmit}>Đăng nhập</button>
                </div>
            </div>
        </div>
    )
}