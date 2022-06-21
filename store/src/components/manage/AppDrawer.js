import React, { forwardRef, useState, useImperativeHandle } from 'react';
import { View, Dimensions } from 'react-native';
import Modal from 'react-native-modal';

const iWidth = Dimensions.get('window').width;
const iHeight = Dimensions.get('window').height;

const AppDrawer = forwardRef((oProps, oRef) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [fCallBack, setFCallBack] = useState(null);
    const [state, setState] = useState({
        showModal: false,
        viewComp: <View />,
        sTemplate: 'alert'
    })

    useImperativeHandle( oRef, () => ({
        _refShowDrawer(bBoolean, ViewComponent, sTemplate, sTimeoutSec) {
            let iDefaultSec = 999999999999999999999999999999999999999;
            if (sTimeoutSec !== undefined && sTimeoutSec !== null) {
               iDefaultSec = sTimeoutSec;
            }

            let sDefaultTemplate = 'alert';
            if (sTemplate != undefined && sTemplate != '') {
                sDefaultTemplate = sTemplate;
            }
            setState({ viewComp: ViewComponent, sTemplate: sDefaultTemplate });
            setModalVisible(bBoolean);

            setTimeout(() => {
                setState({ viewComp: ViewComponent, sTemplate: sDefaultTemplate });
                setModalVisible(false);
            }, iDefaultSec);
        },

        _refHideDrawer(fCb) {
            if (fCb != undefined) {
                setFCallBack(fCb);
            }
            setModalVisible(false);
        },

    }))

    const _hideSideMenu = () => {
        setModalVisible(false);
    }

    return (
        <>
            {state.sTemplate == 'drawer' &&
                <Modal isVisible={modalVisible} animationIn={'fadeIn'} animationOut={'fadeOut'} backdropTransitionOutTiming={0} animationInTiming={350} animationOutTiming={100} useNativeDriver={true} onRequestClose={() => _hideSideMenu()} onBackdropPress={() => setModalVisible(false)}>
                    {state.viewComp}
                </Modal>
            }
        </>
    );
})

export default AppDrawer;