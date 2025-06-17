import React, { useState } from "react";
import "./VerifyEmail.css";

const VerifyEmailModal = ({ onClose }) => {
    const [email, setEmail] = useState("");
    const [result, setResult] = useState(null);

    const handleVerify = async () => {
        try {
            const res = await fetch("/api/auth/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            setResult(data.exists ? "가입된 이메일입니다." : "가입되지 않은 이메일입니다.");
        } catch (err) {
            alert("확인 중 오류 발생");
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-box">
                <h3>이메일 확인</h3>
                <input
                    type="text"
                    placeholder="이메일 입력"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button onClick={handleVerify}>확인</button>
                {result && <p className="result">{result}</p>}
                <button onClick={onClose} className="close-btn">닫기</button>
            </div>
        </div>
    );
};

export default VerifyEmailModal;