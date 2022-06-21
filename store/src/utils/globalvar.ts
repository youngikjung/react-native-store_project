class GlobalVar {
   private aRouteHistory = [];
   private oPushData = {};

   public setRouteHistory(currentRouteName) {
      this.aRouteHistory.unshift(currentRouteName);
      if (this.aRouteHistory.length > 3) {
      this.aRouteHistory = this.aRouteHistory.slice(0, 3);
      }
   }

   public getRouteHistory() {
      return this.aRouteHistory;
   }

   public setPushData(oData) {
      this.oPushData = oData;
   }

   public getPushData() {
      return this.oPushData;
   }
}

export default new GlobalVar();
