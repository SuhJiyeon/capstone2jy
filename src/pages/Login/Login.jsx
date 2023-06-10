import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

const User = {
  id: 'test1234',
  pw: '12341234a!'
};

console.log(User.id); 

const Login = () => {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();

  const handleId = (e) => {
    setId(e.target.value);
  };

  const handlePw = (e) => {
    setPw(e.target.value);
  };

  const onClickConfirmButton = () => {

    axios.post(`https://www.assac.shop/api/user/sign-in`, 
        {
      username: id,
      password: pw,
        })
      .then(function (response) {
        alert("로그인 성공!");
        let originToken = response.data.originToken;
        let refreshToken = response.data.refreshToken;
        localStorage.setItem("SavedToken", 'Bearer ' + response.data.originToken);
        goToMain();

        
        // // //로그인 성공시
        if (response.code === 200) {
            alert("dd")
            localStorage.setItem('login-token', originToken);
        } else if (response.code === 404) {
            alert(response.result.message);
        }
        console.log(response);
    })
    .catch(function (error) {
        console.log(error);
        alert('로그인 실패.');
    });
  }

  const goToMain = () => {
    navigate('/');
  };

  const goToSign = () => {
    navigate('/sign-up');
  };

  const goToKakaoLogin = () => {
    navigate('/kakao-login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.titleWrap}>로그인</div>

      <div className={styles.contentWrap}>
        <div className={styles.inputTitle}>사용자 아이디</div>
        <div className={styles.inputWrap}>
          <input
            className={styles.input}
            type="text"
            placeholder="사용자 아이디를 입력하시오"
            value={id}
            onChange={handleId}
          />
        </div>
      </div>

      <div style={{ marginTop: '26px' }} className={styles.inputTitle}>
        비밀번호
      </div>
      <div className={styles.inputWrap}>
        <input
          className={styles.input}
          type="password"
          placeholder="영문, 숫자, 특수문자 포함 8자 이상 입력하시오"
          value={pw}
          onChange={handlePw}
        />
      </div>

      <div>
        <button
          onClick={onClickConfirmButton}
          className={styles.bottomButton}
        >
          확인
        </button>
      </div>

      <div>
        <button onClick={goToKakaoLogin} className={styles.kakaoButton}>
          카카오 로그인
        </button>
      </div>

      <div>
        <button onClick={goToSign} className={styles.signButton}>
          회원가입
        </button>
      </div>
    </div>
  );
};

export default Login;
