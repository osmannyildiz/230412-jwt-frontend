import { useRef, useState } from "react";

function App() {
	const [token, setToken] = useState(null);
	const [lastResponse, setLastResponse] = useState(null);
	const registerFormEmailInputRef = useRef();
	const registerFormPasswordInputRef = useRef();
	const loginFormEmailInputRef = useRef();
	const loginFormPasswordInputRef = useRef();

	const onRegisterFormSubmit = async (event) => {
		event.preventDefault();

		const resp = await fetch("http://localhost:5005/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: registerFormEmailInputRef.current?.value,
				password: registerFormPasswordInputRef.current?.value
			})
		});
		const respBody = await resp.json();

		setLastResponse(respBody);
	};
	
	const onLoginFormSubmit = async (event) => {
		event.preventDefault();

		const resp = await fetch("http://localhost:5005/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: loginFormEmailInputRef.current?.value,
				password: loginFormPasswordInputRef.current?.value
			})
		});
		const respBody = await resp.json();

		if (respBody.ok) {
			setToken(respBody.data.token);
		}
		setLastResponse(respBody);
	};

	const logout = () => {
		setToken(null);
	};

	const requestPublicContent = async () => {
		const resp = await fetch("http://localhost:5005/publicContent");
		const respBody = await resp.json();

		setLastResponse(respBody);
	}
	
	const requestPrivateContent = async () => {
		const resp = await fetch("http://localhost:5005/privateContent", {
			headers: {
				"Authorization": `Bearer ${token}` // İstek atarken tokeni bu şekilde yolluyoruz
			}
		});
		const respBody = await resp.json();
		
		setLastResponse(respBody);
	}

	return (
		<div className="container">
			<form className="card register-form" onSubmit={onRegisterFormSubmit}>
				<h2>Kayıt Olma Formu</h2>
				<input type="email" placeholder="E-posta" ref={registerFormEmailInputRef} />
				<input type="password" placeholder="Şifre" ref={registerFormPasswordInputRef} />
				<button type="submit">Kayıt Ol</button>
			</form>

			<form className="card login-form" onSubmit={onLoginFormSubmit}>
				<h2>Giriş Yapma Formu</h2>
				<input type="email" placeholder="E-posta" ref={loginFormEmailInputRef} />
				<input type="password" placeholder="Şifre" ref={loginFormPasswordInputRef} />
				<button type="submit">Giriş Yap</button>
			</form>

			<div className="card frontend-data-panel">
				<h2>Frontend Veri Paneli</h2>
				<div>Şu an frontend'de kayıtlı olan token: {token}</div>
				{token && <button type="button" onClick={logout}>Çıkış Yap</button>}
			</div>

			<div className="card requests-panel">
				<h2>İstek Atma Paneli</h2>
				<div>
					<button type="button" onClick={requestPublicContent}>Herkese Açık İçerik</button>
					<button type="button" onClick={requestPrivateContent}>Gizli İçerik</button>
				</div>
				<br />
				<div>
					Son atılan istekten dönen mesaj:
					{lastResponse && (
						<div style={{
							padding: "8px",
							backgroundColor: lastResponse.ok ? "lightgreen" : "lightsalmon"
						}}>
							{lastResponse.message}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}

export default App;
