import React, { useState } from 'react';
import { Dimensions } from 'react-native';
import randomToken from 'random-token';
import DeviceInfo from 'react-native-device-info';

import { CompModalContent } from '../modal/ModalContents';

import {AppRoute} from '../../routes/AppRoutes';

import StepOne from '../../components/signUp/Step1';
import StepTwo from '../../components/signUp/Step2';
import LastStep from '../../components/signUp/Step4';
import StepThree from '../../components/signUp/Step3';
import Terms from '../../components/signUp/Terms';

const { width, height } = Dimensions.get('window');

const SignUpPage = ({ oProps, fnReturn }) => {
    const [state, setState] = useState("step0");

    const [step1, setStep1] = useState(true);
    const [step2, setStep2] = useState(true);

    const [terms, setTerms] = useState(false);
    const [sId, setId] = useState("");
    const [sPassword, setPassword] = useState("");
    const [sPwCheck, setPasswordCheck] = useState("");
    const [sEmail, setEmail] = useState("");
    const [sPhone, setPhone] = useState("");
    const [sNm, setNm] = useState("");
    const [businessType, setBusinessType] = useState("personal");

    const [smsToken, setSmsToken] = useState("");
    const [smsData, setSmsData] = useState({});

    const termAgree = async () => {
        setTerms(true);
        setState("step1");
    }

    const stepNext = (sIndex,aIndex,nIndex,kIndex) => {
        if(sIndex !== undefined && sIndex !== "" && aIndex !== undefined && aIndex !== "" && nIndex !== undefined && nIndex !== "" && kIndex !== undefined){
            setId(sIndex);
            setPassword(aIndex);
            setPasswordCheck(nIndex);
            setStep1(kIndex);
            setState("step2");
        }
    }

    const openModalContent = (sIndex) => {
        oProps.appManager.showModal(
            true,
            <CompModalContent 
                sText={sIndex}
            />, 
            "custom",
            2500
        );
    };

    const prevStep = async () => {
        if(fnReturn !== undefined && typeof fnReturn === "function"){
            await fnReturn();
        }
    }

    const sendSMS = async (aIndex) => {
        let token = randomToken(32);
        const oData = {
            token,
            userPhone: aIndex,
            userId: sId,
        }
        const oResponse = await oProps.appManager.accessAxios("/register/sendSMS/v2", "post", null, oData);
        if(oResponse !== undefined && oResponse !== null){
            if(oResponse.resultCd === "0000"){
                setSmsData(oData);
                setSmsToken(token);
                setState("step4");
            } else {
                openModalContent(oResponse.resultMsg);
            }
        }
    }

    const goLastStep = (sIndex,aIndex,kIndex,jIndex) => {
        if(sIndex !== undefined && sIndex !== "" && aIndex !== undefined && aIndex !== "" && kIndex !== undefined && kIndex !== "" && jIndex !== undefined){
            setEmail(sIndex);
            setPhone(aIndex);
            setNm(kIndex);
            setStep2(jIndex);
            sendSMS(aIndex);
        }
    }

    const goNextStep = (sIndex) => {
        if(sIndex !== undefined && sIndex !== ""){
            setBusinessType(sIndex);
            setState("step3");
        }
    }

    const insertAccount = async (sIndex) => {
        var uniqueId = DeviceInfo.getUniqueId();
        const oData = {
            smsToken,
            userId: sId,
            userPwd: sPassword,
            userPwdT: sPwCheck,
            userName: sNm,
            userEmail: sEmail,
            userPhone: sPhone,
            sCount: sIndex,
            businessType,
        }
        const oResponse = await oProps.appManager.accessAxios("/app/ceo/authenticate/addStore/v2", "post", null, oData);
        if(oResponse !== undefined && oResponse !== null){
            if(oResponse.resultId === "0000"){
                let oUserConfig = {};

                oUserConfig['activate'] = false;
                oUserConfig['AutoLogin'] = true;
                oUserConfig['LoginId'] = sId;
                oUserConfig['LoginPw'] = oResponse.loginPw;
                oUserConfig['Token'] = oResponse.token;
                oUserConfig['RefreshToken'] = oResponse.refresh_token;
                oUserConfig['uniqueId'] = uniqueId;

                oUserConfig['StoreID'] = oResponse.store_id;
                oUserConfig['BusinessType'] = businessType;
                oUserConfig['StoreOwner'] = sNm;
                
                oUserConfig['ORDERBASKET'] = [];

                oUserConfig['STOREINFOMATION'] = true;
                oUserConfig['OWNERACCOUNT'] = false;
                oUserConfig['STORETYPE'] = false;
                oUserConfig['STORENOTICE'] = false;
                oUserConfig['STOREALERT'] = false;
                oUserConfig['STOREORIGINNOTICE'] = false;
                oUserConfig['STORELOGO'] = false;
                oUserConfig['STOREIMAGES'] = false;
                oUserConfig['STOREHOLIDAY'] = false;
                oUserConfig['STOREPICKUPZONE'] = false;
                oUserConfig['STOREPICKUPIMAGE'] = false;
                oUserConfig['STOREPICKUPZONEDETAIL'] = false;
                oUserConfig['STOREORDERTIME'] = false;
                oUserConfig['STOREOPERATIONTIME'] = false;
                oUserConfig['MENU'] = false;
                oUserConfig['ACTIVATION'] = false;

                await oProps.reduxSetUserConfig(oUserConfig);
                openModalContent("계속해서 매장등록을 진행해주세요.");
                oProps.appManager.navGoTo('reset', AppRoute.STOREINFOMATION);

            } else {
                setState("step3");
                if(!oResponse.userId){
                    openModalContent("아이디를 다시 확인해주세요");
                }
                if(!oResponse.userPwd){
                    openModalContent("비밀번호를 다시 확인해주세요");
                }
                if(!oResponse.userName){
                    openModalContent("이름을 다시 확인해주세요");
                }
                if(!oResponse.userEmail){
                    openModalContent("이메일을 다시 확인해주세요");
                }
                if(!oResponse.userPhone){
                    openModalContent("전화번호를 다시 확인해주세요");
                }
            }
        } else {
            setState("step3");
        }
    }

    return (
        <>
            {state === "step0" &&
                <Terms 
                    sProps={oProps}
                    sTerms={terms}
                    fnNext={() => termAgree()}
                    fnPrev={() => prevStep()}
                />
            }
            {state === "step1" &&
                <StepOne 
                    iStep1={step1}
                    nId={sId}
                    nPassword={sPassword}
                    nPwCheck={sPwCheck}
                    sProps={oProps}
                    fnStepNext={(sIndex,aIndex,nIndex,kIndex) => stepNext(sIndex,aIndex,nIndex,kIndex)}
                    fnStepPrev={() => setState("step0")}
                    />
                }
            {state === "step2" &&
                <StepTwo 
                    iBusinessType={businessType}
                    fnStepPrev={() => setState("step1")}
                    fnStepNext={(sIndex) => goNextStep(sIndex)}
                />
            }
            {state === "step3" &&
                <StepThree 
                    iStep2={step2}
                    iEmail={sEmail}
                    iPhone={sPhone}
                    iNm={sNm}
                    iBusinessType={businessType}
                    fnStepPrev={() => setState("step2")}
                    fnInsert={(sIndex,aIndex,kIndex,jIndex) => goLastStep(sIndex,aIndex,kIndex,jIndex)}
                />
            }
            {state === "step4" &&
                <LastStep 
                    sProps={oProps}
                    iSmsData={smsData}
                    iSmsToken={smsToken}
                    fnStepPrev={() =>  setState("step3")}
                    fnInsert={(sIndex) => insertAccount(sIndex)}
                />
            }
        </>
    )
}
export default SignUpPage;