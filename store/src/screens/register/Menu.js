import React, {useState,useEffect} from 'react';
import { View } from 'react-native';

import { CompMainMenuInsertFunction } from '../../components/modal/ModalContents';

import MenuList from '../../components/menu/list/List';
import MenuGroupInsert from '../../components/menu/insert/MenuGroupInsert';
import MenuInsert from '../../components/menu/insert/MenuInsert';
import MenuOptionInsert from '../../components/menu/insert/MenuOptionInsert';

const MenuPage = oProps => {
    const [sType, setType] = useState("category");
    const [itemList, setItemList] = useState([])
    const [hasList, setHasList] = useState("none");
    const [categoryId, setCategoryId] = useState(0);

    const [pageState, setPageState] = useState("list");
    const [commercialInitParam, setCommercialInitParam] = useState("");

    const [sLocation, setLocation] = useState("");
    const [nLocation, setNLocation] = useState({});

    const closePopUp = () => {
        oProps.appManager.hideModal();
        setType("main");
        setPageState("list");
    }

    const changeGroupNm = async (sIndex,aIndex,xIndex,nIndex) => {
        if(nIndex !== undefined && nIndex !== null){
            setCategoryId(nIndex);
        }
        
        if(xIndex === "main"){
            setPageState(xIndex);

            oProps.appManager.showModal(
                true,
                <CompMainMenuInsertFunction 
                    iTotalList={sIndex}
                    iMainList={aIndex}
                    sProps={oProps}
                    fnClose={() => closePopUp()}
                />, 
                "custom"
            );
        } else {
            setItemList(sIndex);
            setHasList(aIndex);
            setPageState(xIndex);
        }
    }

    const changeCategory = async () => {
        setType("category");
        setPageState("list");
    }

    const changeMenu = async () => {
        setType("menu");
        setPageState("list");
    }

    const changeOption = async () => {
        setType("option");
        setPageState("list");
    }

    useEffect(() => {
        oProps.appManager.hideModal();
        oProps.appManager.hideDrawer();
        if(oProps.initialProps !== undefined && oProps.initialProps !== null){
            if(oProps.initialProps.route !== undefined && oProps.initialProps.route !== null){
                if(oProps.initialProps.route.params !== undefined && oProps.initialProps.route.params !== null){
                    const initital = oProps.initialProps.route.params;
                    setType(initital.iParam);
                    setLocation(initital.sParam);
                    if(initital.nParam !== undefined && initital.nParam !== null){
                        setNLocation(initital.nParam);
                        setCommercialInitParam(initital.aParam);
                    }
                }
            }
        }
    }, []);

    return (
        <View style={{flex:1, backgroundColor: "#fff"}}>
            {pageState === "list" &&
                <MenuList 
                    sProps={oProps}
                    iType={sType}
                    sRoute={sLocation}
                    sPath={nLocation}
                    initData={commercialInitParam}
                    fnMenuGroupInsert={(sIndex,aIndex,xIndex,nIndex) => changeGroupNm(sIndex,aIndex,xIndex,nIndex)}
                />
            }
            {pageState === "group" &&
                <MenuGroupInsert 
                    sProps={oProps}
                    cList={itemList}
                    sHasList={hasList}
                    fnBackGroupList={() => changeCategory()}
                />
            }
            {pageState === "menu" &&
                <MenuInsert 
                    sCategoryId={categoryId}
                    sProps={oProps}
                    fnBackGroupList={() => changeMenu()}
                />
            }
            {pageState === "option" &&
                <MenuOptionInsert 
                    sProps={oProps}
                    fnBackGroupList={() => changeOption()}
                />
            }
        </View>
    )
}

export default MenuPage;