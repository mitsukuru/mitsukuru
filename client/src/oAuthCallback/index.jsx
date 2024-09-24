import React, { useState } from "react";
import queryString from "query-string";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar } from 'react-circular-progressbar';

const BEFORE = "BEFORE";
const DOING = "DOING";

const ExternalAuth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { code = "" } = queryString.parse(location.search);
  const { provider = "" } = useParams();
  const [requestStatus, setRequestStatus] = useState(BEFORE);

  const sendExternalAuthRequest = async ({
    code,
    provider
  }) => {
    const requester = requestManager.get();
    return requester
      .post(
        "/auth/v1/callback",
        {
          code,
          provider
        },
      )
      .then(() => true)
      .catch(() => false);
  };
  

  const request = () => {
    setRequestStatus(DOING);
    sendExternalAuthRequest({ code, provider }).then(isSuccess => {
      if (isSuccess) {
        navigate("/home"); // login後ページ
      } else {
        console.log("認証失敗");
        navigate(PAGE_PATH.AUTH_SIGN_IN); //認証失敗した場合
      }
    });
  };
　   
  if (requestStatus === BEFORE) {
    request();
  }
  return (
    <div className={styles.container}>
      <CircularProgressbar />
    </div>
  );
};

export default ExternalAuth;

