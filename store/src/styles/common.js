import { Platform } from 'react-native';

var sNotoSansRegular = 'NotoSansKR-Regular-Hestia';
var sNotoSansBold = 'NotoSansKR-Bold-Hestia';
var sNotoSansMedium = 'NotoSansKR-Medium-Hestia';
var sNotoSansLight = 'NotoSansKR-Light-Hestia';
var sNotoSansThin = 'NotoSansKR-Thin-Hestia';

if (Platform.OS === 'ios') {
   sNotoSansRegular = 'NotoSansKR-Regular';
   sNotoSansBold = 'NotoSansKR-Bold';
   sNotoSansMedium = 'NotoSansKR-Medium';
   sNotoSansLight = 'NotoSansKR-Light';
   sNotoSansThin = 'NotoSansKR-Thin';
}

export default {
   /*
   * BRAND COLORS
   */
   PRIMARY_BRAND_MAIN_CLR: '#1e22aa',
   PRIMARY_BRAND_SPECIAL_CLR: '#002e85',
   PRIMARY_BRAND_SPACE_CLR: '#f2f7fb',

   /*
   * BRAND SECONDARY COLORS
   */
   SECONDARY_BRAND_MAIN_CLR: '#191f28',
   SECONDARY_BRAND_SPECIAL_CLR: '#959ba3',
   SECONDARY_BRAND_SPACE_CLR: '#f2f3f4',

   /*
   * LINE COLORS
   */
   ICON_COLOR: '#3ba4b9',

   /*
   * LINE COLORS
   */
   COMMON_LINE_CLR_ON: '#dfdfdf',
   COMMON_LINE_CLR_OFF: '#f6f6f6',

   /*
   * TEXT COLORS
   */
   PRIMARY_TEXT_CLR: '#333d4b',
   PRIMARY_TEXT_CLR_BIG: '#191f28',
   PRIMARY_TEXT_CLR_ON: '#6b7684',
   PRIMARY_TEXT_CLR_OFF: '#adb3bb',

   PRIMARY_TEXT_ERROR_CLR: '#cc2431',
   PRIMARY_TEXT_SUCCESS_CLR: '#1e22aa',

   PRIMARY_TEXT_INPT_PLCHOLDER: '#adb3bb',

   /*
   * TEXT SIZE
   */
   TXT_TITLE_SIZE: 12,
   TXT_INPUT_SIZE: 16,

   TXT_INPUT_ERR_SIZE: 12,
   TXT_INPUT_ERR_LH: 18,

   TXT_INPUT_BTN_SIZE: 16,
   TXT_INPUT_BTN_LH: 22,

   TXT_NORMAL_SIZE: 12,
   TXT_NORMAL_LH: 18,

   TXT_LABEL_SIZE: 14,
   TXT_LABEL_LH: 22,

   TXT_NAV_SIZE_SMALL: 12,
   TXT_NAV_SIZE: 16,
   TXT_NAV_LH: 24,

   /*
   * FONTS
   */
   KR_FONT_R: sNotoSansRegular,
   KR_FONT_B: sNotoSansBold,
   KR_FONT_M: sNotoSansMedium,
   KR_FONT_L: sNotoSansLight,
   KR_FONT_T: sNotoSansThin,
   //EN_FONT_B: 'TitilliumWeb-Bold',
   //EN_FONT_SB: 'TitilliumWeb-SemiBold',
   //EN_FONT_BI: 'TitilliumWeb-BoldItalic',
   //EN_FONT_R: 'TitilliumWeb-Regular',
   //EN_FONT_L: 'TitilliumWeb-Light',   

   /*
   * COMMON
   */
   PRIMARY_BLACK: '#000000',
   PRIMARY_WHITE: '#ffffff',

   modalFsWrapper: { flex: 1, backgroundColor: '#ffffff' },
   modalFsLogoWrapper: { position: 'absolute', top: 16, width: '100%' },
   modalFsLogo: { flex: 1, justifyContent: 'center', alignItems: 'center' },
   modalFsContentWrapper: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: -120 },
   modalFsTitleTxt: { fontSize: 25, fontFamily: sNotoSansBold, color: '#191f28' },
   modalFsDescTxt: { fontSize: 12, fontFamily: sNotoSansRegular, color: '#6b7684', lineHeight: 18, textAlign: 'center', paddingTop: 12 },
   modalFsBtnWrapper: { flexDirection: 'row', paddingTop: 40 },
   modalFsBtnLeft: { marginLeft: 20, height: 40, flex: 1, borderWidth: 1, borderColor: '#1e22aa', backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderTopLeftRadius: 6, borderBottomLeftRadius: 6 },
   modalFsBtnLeftTxt: { fontFamily: sNotoSansMedium, fontSize: 15, color: '#1e22aa' },
   modalFsBtnRight: { marginRight: 20, height: 40, flex: 1, borderWidth: 1, borderColor: '#1e22aa', backgroundColor: '#1e22aa', justifyContent: 'center', alignItems: 'center', borderTopRightRadius: 6, borderBottomRightRadius: 6 },
   modalFsBtnRightTxt: { fontFamily: sNotoSansMedium, fontSize: 15, color: '#ffffff' },
   modalFsBtnOne: { marginHorizontal: 20, height: 40, flex: 1, borderWidth: 1, borderColor: '#1e22aa', backgroundColor: '#1e22aa', justifyContent: 'center', alignItems: 'center', borderRadius: 6 },

   modalWrapperBtn: { flexDirection: 'row', alignItems: 'flex-end', zIndex: 80 },
   modalWrapperTxtTitle: {
      fontFamily: sNotoSansMedium,
      fontSize: 16,
      color: '#000000',
      paddingBottom: 12
   },
   modalWrapperTxtSubTitle: {
      fontFamily: sNotoSansRegular,
      fontSize: 12,
      color: '#000000'
   },
   modalWrapperBtnLeft: {
      alignItems: 'flex-end', flex: 2, justifyContent: 'center', paddingHorizontal: 14, paddingTop: 20, minHeight: 30
   },
   modalWrapperBtnLeftTxt: {
      fontSize: 16, fontFamily: sNotoSansRegular,
   },
   modalWrapperBtnRight: {
      alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 14, paddingTop: 20, minHeight: 30
   },
   modalWrapperBtnRightTxt: {
      fontSize: 16, fontFamily: sNotoSansRegular, color: '#1e22aa'
   },
   modalWrapperBtnCenter: {
      alignItems: 'center', justifyContent: 'center', paddingTop: 20, minHeight: 30, flex: 1, width: '100%', alignContents: 'center'
   },
   modalWrapperBtnCenterTxt: {
      textAlign: 'center'
   },
   notiWrapper: {

   },
   notiWrapperTxt: {
      fontSize: 14, fontFamily: sNotoSansRegular, color: '#ffffff', textAlign: 'center'
   },
   shadowView: {
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 0 }
   },
   safeAreaWhite: { flex: 1, backgroundColor: '#ffffff' },
   safeAreaBlack: { flex: 1, backgroundColor: '#000000' }
};