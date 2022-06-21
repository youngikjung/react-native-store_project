import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/ko';

const __DEBUG__ = true;

const acceptedTypes: string[] = [
   'image/png',
   'image/jpg',
   'image/jpeg',
];

class CommonUtil {

   public isValidFileType = (fileType: string): boolean => {
      return acceptedTypes.includes(fileType);
   }

   public currencyFormatter(value) {
      return new Intl.NumberFormat('ko-KR', {
         //style: 'currency',
         //currency: 'KRW'
      }).format(value);
   }

   public numberFormatThousand(value, sSeparator) {
      let sSepa = '.';
      if(sSeparator != undefined){
         sSepa = sSeparator;
      }
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, sSepa);
   }

   public makeTimer(oEndtime) {

      let oDeadline = oEndtime;
      let iCalcTimeLeft = Date.parse(oDeadline) - Date.parse(new Date().toString());

      let iCalcDays = Math.floor(iCalcTimeLeft / (1000 * 60 * 60 * 24));
      let iCalcHours = Math.floor((iCalcTimeLeft / (1000 * 60 * 60)) % 24);
      let iCalcMinutes = Math.floor((iCalcTimeLeft / 1000 / 60) % 60);
      let iCalcSeconds = Math.floor((iCalcTimeLeft / 1000) % 60);

      let sCalcDays = "" + iCalcDays;
      let sCalcHours = "" + iCalcHours;
      let sCalcMinutes = "" + iCalcMinutes;
      let sCalcSeconds = "" + iCalcSeconds;

      if (iCalcHours < 10) { sCalcHours = "0" + sCalcHours; }
      if (iCalcMinutes < 10) { sCalcMinutes = "0" + sCalcMinutes; }
      if (iCalcSeconds < 10) { sCalcSeconds = "0" + sCalcSeconds; }

      let oRes = {
         'total': iCalcTimeLeft,
         'days': sCalcDays,
         'hours': sCalcHours,
         'minutes': sCalcMinutes,
         'seconds': sCalcSeconds
      }

      return oRes;
   }

   public shuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

         // Pick a remaining element...
         randomIndex = Math.floor(Math.random() * currentIndex);
         currentIndex -= 1;

         // And swap it with the current element.
         temporaryValue = array[currentIndex];
         array[currentIndex] = array[randomIndex];
         array[randomIndex] = temporaryValue;
      }

      return array;
   }

   public padString(n, width, z) {
      z = z || '0';
      n = n + '';
      return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
   }

   public jsonParser(sString) {
      let bParsedContent = false;
      try {
         if (sString != undefined && sString.length > 0) {
            bParsedContent = JSON.parse(sString);
         }
      } catch (ex) {

      }
      return bParsedContent;
   }

   public getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2, bNumOnly) {
      var R = 6371; // Radius of the earth in km
      var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
      var dLon = this.deg2rad(lon2 - lon1);
      var a =
         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
         Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
         Math.sin(dLon / 2) * Math.sin(dLon / 2)
         ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km

      if (bNumOnly == true) {
         return d.toFixed(2);
      }

      var sReturn = d.toFixed(2) + 'KM';

      if (d < 1) {
         d = d;
         sReturn = d.toFixed(2) + 'M';
      }

      return sReturn;
   }

   public deg2rad(deg) {
      return deg * (Math.PI / 180)
   }

   public distanceCalculation(rssiValue) {
      var txPowerValue = -59 // Normal ranges between -59 to -65
      if (rssiValue == 0) {
         return -1.0;
      }

      var ratio = rssiValue * 1.0 / txPowerValue;
      if (ratio < 1.0) {
         return Math.pow(ratio, 10);
      } else {
         var distance = (0.89976) * Math.pow(ratio, 7.7095) + 0.111;
         return distance;
      }
   }

   public isValidCarLicense(sNumber) {
      const validationFirst = `^\\d{2}[가|나|다|라|마|거|너|더|러|머|버|서|어|저|고|노|도|로|모|보|소|오|조|구|누|두|루|무|부|수|우|주|바|사|아|자|허|배|호|하\\x20]\\d{4}/*$`;
      const validationSecond = `^\\d{3}[가|나|다|라|마|거|너|더|러|머|버|서|어|저|고|노|도|로|모|보|소|오|조|구|누|두|루|무|부|수|우|주|바|사|아|자|허|배|호|하\\x20]\\d{4}/*$`;
      const validationThird = `^[서울|부산|대구|인천|대전|광|울산|제주|경기|강원|충남|전남|전북|경남|경북|세종]{2}\\d{2}[가|나|다|라|마|거|너|더|러|머|버|서|어|저|고|노|도|로|모|보|소|오|조|구|누|두|루|무|부|수|우|주|바|사|아|자|허|배|호|하\\x20]\\d{4}$`;
      const validationFourth = `^[서울|부산|대구|인천|대전|광주|울산|제주|경기|강원|충남|전남|전북|경남|경북|세종]{2}\\d{3}[가|나|다|라|마|거|너|더|러|머|버|서|어|저|고|노|도|로|모|보|소|오|조|구|누|두|루|무|부|수|우|주|바|사|아|자|허|배|호|하\\x20]\\d{4}$`;

      if (sNumber.match(validationFirst) !== null) {
         return true;
      } else if (sNumber.match(validationSecond) !== null) {
         return true;
      } else if (sNumber.match(validationThird) !== null) {
         return true;
      } else if (sNumber.match(validationFourth) !== null) {
         return true;
      } else {
         return false;
      }
   }

   public getQueryVar(sSearch, varName) {
      // Grab and unescape the query string - appending an '&' keeps the RegExp simple
      // for the sake of this example.
      var queryStr = unescape(sSearch);

      // Dynamic replacement RegExp
      var regex = new RegExp('.*?[;]' + varName + '=(.*?);.*');

      // Apply RegExp to the query string
      var val = queryStr.replace(regex, "$1");

      // If the string is the same, we didn't find a match - return false
      return val == queryStr ? false : val;
   }

   private toRad(iVal) {
      return iVal * Math.PI / 180;
   }

   private toDeg(iVal) {
      return iVal * 180 / Math.PI;
   }

   public destinationPoint(fLat, fLng, mBearing, mDistance) {
      mDistance = mDistance / 6371;
      mBearing = this.toRad(mBearing);

      var lat1 = this.toRad(fLat), lon1 = this.toRad(fLng);

      var lat2 = Math.asin(Math.sin(lat1) * Math.cos(mDistance) +
         Math.cos(lat1) * Math.sin(mDistance) * Math.cos(mBearing));

      var lon2 = lon1 + Math.atan2(Math.sin(mBearing) * Math.sin(mDistance) *
         Math.cos(lat1),
         Math.cos(mDistance) - Math.sin(lat1) *
         Math.sin(lat2));

      if (isNaN(lat2) || isNaN(lon2)) return null;

      return {
         latitude: this.toDeg(lat2), longitude: this.toDeg(lon2)
      };
   }

   public resizeArray(arr: Array<object>, size: number) {
      while (arr.length > size) { arr.pop(); }

      return arr;
   }

   public sumArray(ary: Array<number>) {
      return ary.reduce(function (sum, value) {
         return sum + value;
      }, 0);
   }

}

export default new CommonUtil()